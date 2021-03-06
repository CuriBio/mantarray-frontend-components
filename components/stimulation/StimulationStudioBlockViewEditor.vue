<template>
  <div :class="show_confirmation ? 'modal_overlay' : null">
    <div class="div__BlockViewEditor-background">
      <div class="div__Tabs-panel">
        <span
          :id="'Basic'"
          :class="active_tab === 'Advanced' ? 'span__Inactive-Tab-labels' : 'span__Active-Tab-label'"
          @click="toggle_tab($event.target.id)"
          >Basic</span
        >
        <span
          :id="'Advanced'"
          :class="active_tab === 'Basic' ? 'span__Inactive-Tab-labels' : 'span__Active-Tab-label'"
          @click="toggle_tab($event.target.id)"
          >Advanced</span
        >
      </div>
      <div class="div__Editor-background">
        <div class="div__setting-panel-container">
          <span class="span__protocol-letter" :style="'color:' + current_color">{{ current_letter }}</span>
          <input
            v-model="protocol_name"
            class="protocol_input"
            placeholder="Protocol Name"
            :disabled="disabled === true"
            :style="name_validity"
            @change="check_name_validity($event.target.value)"
          />
          <span class="error-message">{{ error_message }}</span>
          <img class="img__pencil-icon" src="/pencil-icon.png" @click="disabled = !disabled" />
          <div class="div__right-settings-panel">
            <SmallDropDown
              :input_height="25"
              :input_width="190"
              :options_text="stimulation_types_array"
              :options_idx="stimulation_type_idx"
              @selection-changed="handle_stimulation_type"
            />
            <SmallDropDown
              :style="'margin-left: 5%;'"
              :input_height="25"
              :input_width="155"
              :options_text="until_options_array"
              @selection-changed="handle_stop_requirement"
            />
            <span class="span__settings-label">every</span>
            <input
              v-model="end_delay_duration"
              class="number_input"
              placeholder=""
              @change="handle_repeat_frequency($event.target.value)"
            />

            <!-- <canvas class="canvas__separator" /> -->
            <img id="trash_icon" class="img__trash-icon" src="/trash-icon.png" @click="handle_trash()" />
            <BPopover
              target="trash_icon"
              trigger="click"
              :show.sync="show_confirmation"
              custom-class="popover_class"
            >
              <div class="popover_label">Are you sure?</div>
              <div class="popover_button_container">
                <button class="delete_button_container" @click="handle_delete()">Delete</button>
                <button class="cancel_button_container" @click="show_confirmation = false">Cancel</button>
              </div>
            </BPopover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SmallDropDown from "@/components/basic_widgets/SmallDropDown.vue";
import Vue from "vue";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { BPopover } from "bootstrap-vue";
Vue.component("BPopover", BPopover);

/**
 * @vue-data {String} active_tab - Shows current selected tab
 * @vue-data {Boolean} disabled - Disables the name input field
 * @vue-data {Boolean} show_confirmation - Determines if delete popover is visible
 * @vue-data {String} current_letter - Next available letter in alphabet
 * @vue-data {String} current_color -  Next available color in alphabet
 * @vue-data {Array} stimulation_types_array - Availble options in dropdown
 * @vue-data {Array} until_options_array - Available options in dropdown
 * @vue-data {String} protocol_name - Inputted new protocol name
 * @vue-data {String} stop_requirement - Selected requirement from dropdown
 * @vue-data {String} end_delay_duration - Inputted delay to be set at the end of the protocol between repeats
 * @vue-data {String} name_validity - Corresponding border style after name validity check
 * @vue-data {String} error_message - Error message that appears under name input field after validity check
 * @vue-data {Array} protocol_list - All available protocols from Vuex
 * @vue-event {Event} update_protocols - Gets called when a change to the available protocol list occurs to update next available color/letter assignment and dropdown options
 * @vue-event {Event} handle_trash - Toggle view of delete popover on trash icon
 * @vue-event {Event} toggle_tab - Toggles which tab is active
 * @vue-event {Event} handle_delete - Confirms and commits the deletion of protocol to state
 * @vue-event {Event} handle_stimulation_type - Commits the new selected stimulation type to state
 * @vue-event {Event} handle_stop_requirement - Currently just assigns the new stop requirement to local state
 * @vue-event {Event} handle_repeat_frequency - Commits the new delay input to state
 * @vue-event {Event} check_name_validity - Checks if the inputted name has already been used
 */

export default {
  name: "ProtocolBlockViewEditor",
  components: {
    SmallDropDown,
    BPopover,
  },
  data() {
    return {
      active_tab: "Basic",
      disabled: true,
      show_confirmation: false,
      current_letter: "",
      current_color: "",
      stimulation_types_array: ["Voltage Controlled Stimulation", "Current Controlled Stimulation"],
      until_options_array: ["Stimulate Until Stopped", "Repeat"],
      protocol_name: "",
      stop_requirement: "Stimulate Until Stopped",
      end_delay_duration: "",
      name_validity: "null",
      error_message: "",
      protocol_list: [],
      stimulation_type_idx: 0,
    };
  },
  computed: {
    ...mapState("stimulation", {
      stimulation_type: (state) => state.protocol_editor.stimulation_type,
    }),
    ...mapGetters("stimulation", [
      "get_protocol_name",
      "get_end_delay_duration",
      "get_protocols",
      "get_next_protocol",
    ]),
  },
  created() {
    this.update_protocols();
    this.unsubscribe = this.$store.subscribe(async (mutation) => {
      if (
        mutation.type === "stimulation/reset_state" ||
        mutation.type === "stimulation/reset_protocol_editor"
      ) {
        this.update_protocols();
        this.show_confirmation = false;
        this.protocol_name = "";
        this.end_delay_duration = "";
        this.name_validity = "";
      }
      if (
        mutation.type === "stimulation/set_imported_protocol" ||
        mutation.type === "stimulation/add_saved_protocol"
      ) {
        this.update_protocols();
      }
      if (mutation.type === "stimulation/set_edit_mode") {
        this.update_protocols();
        this.protocol_name = this.get_protocol_name;
        this.end_delay_duration = this.get_end_delay_duration;
        this.stimulation_type == "C" ? (this.stimulation_type_idx = 1) : (this.stimulation_type_idx = 0);
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  methods: {
    ...mapActions("stimulation", ["handle_protocol_editor_reset", "handle_new_repeat_frequency"]),
    ...mapMutations("stimulation", ["set_stimulation_type", "set_protocol_name"]),
    update_protocols: function () {
      this.protocol_list = this.get_protocols;
      const { letter, color } = this.get_next_protocol;
      this.current_letter = letter;
      this.current_color = color;
    },
    toggle_tab(tab) {
      tab === "Basic" ? (this.active_tab = "Basic") : (this.active_tab = "Advanced");
    },
    handle_trash() {
      this.show_confirmation = !this.show_confirmation;
    },
    handle_delete() {
      this.handle_protocol_editor_reset();
    },
    handle_stimulation_type(idx) {
      const type = this.stimulation_types_array[idx];
      this.stimulation_type_idx = idx;
      this.set_stimulation_type(type);
    },
    handle_stop_requirement(idx) {
      const requirement = this.until_options_array[idx];
      this.stop_requirement = requirement;
    },
    handle_repeat_frequency(time) {
      this.end_delay_duration = time;
      this.handle_new_repeat_frequency(time);
    },
    check_name_validity(input) {
      const matched_names = this.protocol_list.filter((protocol) => {
        return protocol.label === input;
      });
      if (matched_names.length === 0) {
        this.name_validity = "border: 1px solid #19ac8a";
        this.error_message = "";
        this.set_protocol_name(input);
      }
      if (matched_names.length > 0) {
        this.name_validity = "border: 1px solid #bd3532";
        this.error_message = "*Protocol name already exists";
      }
    },
  },
};
</script>
<style scoped>
.div__BlockViewEditor-background {
  background: rgb(0, 0, 0);
  position: absolute;
  border-radius: 10px;
  width: 60%;
  height: 24%;
  top: 41%;
  left: 20%;
  font-family: muli;
}

.modal_overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  background: rgb(0, 0, 0);
  z-index: 5;
  opacity: 0.5;
}
.error-message {
  color: #bd3532;
  position: absolute;
  left: 53px;
  top: 36px;
  font-size: 13px;
  font-style: italic;
}

.popover_class {
  height: 85px;
  width: 170px;
  font-family: Muli;
  padding: 4px;
  display: flex;
  justify-content: center;
  background: rgb(17, 17, 17);
  border: 1px solid #b7b7b7;
}

.popover_label {
  font-weight: bold;
  padding: 2px 0 10px 37px;
  color: #b7b7b7;
}

.popover_button_container {
  display: flex;
  justify-content: space-evenly;
}

.delete_button_container {
  border-bottom-left-radius: 4px;
}

.cancel_button_container {
  border-bottom-right-radius: 4px;
}

button {
  width: 84px;
  height: 35px;
  background: rgb(17, 17, 17);
  border-color: #3f3f3f;
  color: #b7b7b7;
  padding-top: 4px;
}

button:hover {
  cursor: pointer;
  color: #fffefe;
  background: rgba(0, 0, 0, 0.849);
}

.span__settings-label {
  color: rgb(255, 255, 255);
  height: 8px;
  padding: 10px;
  font-size: 12px;
  margin-bottom: 2%;
  margin-left: 3%;
}
.div__setting-panel-container {
  position: absolute;
  width: 100%;
  height: 40px;
  display: flex;
  top: 2%;
  align-items: center;
}

.span__protocol-letter {
  position: relative;
  left: 2%;
  font-weight: bold;
  font-size: 22px;
}
.img__pencil-icon {
  left: 4%;
  position: relative;
}
img:hover {
  cursor: pointer;
  opacity: 0.6;
}
.img__trash-icon {
  margin-left: 16%;
  padding-top: 4px;
}
.div__right-settings-panel {
  width: 80%;
  display: flex;
  justify-self: flex-end;
  justify-content: flex-end;
  align-items: center;
  margin: 5px;
}
.number_input {
  background: #1c1c1c;
  height: 26px;
  width: 40px;
  border: none;
  color: #b7b7b7;
  font-size: 12px;
  margin-right: 1%;
  text-align: center;
}
.protocol_input {
  background: rgb(0, 0, 0);
  height: 30px;
  width: 250px;
  left: 3%;
  position: relative;
  border: none;
  padding: 0 10px 0 10px;
  color: rgb(255, 255, 255);
}
.span__Inactive-Tab-labels {
  background: rgb(8, 8, 8);
  border: 2px solid rgb(17, 17, 17);
  width: 50%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b7b7b7b7;
}
.span__Active-Tab-label {
  width: 50%;
  height: 90%;
  background: rgb(17, 17, 17);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b7b7b7;
}
.div__Editor-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  background: rgb(17, 17, 17);
  width: 100%;
  height: 82%;
}
.div__Tabs-panel {
  background: rgb(17, 17, 17);
  width: 20%;
  height: 13%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
}
.trash_confirmation_modal {
  position: absolute;
  background: #b7b7b7;
  opacity: 0.5;
  height: 100px;
  width: 250px;
  right: -26%;
}
</style>
