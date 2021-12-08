<template>
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
          class="protocol_name_nput"
          placeholder="Protocol Name"
          :disabled="disabled_name"
          :style="name_validity"
          @change="check_name_validity($event.target.value)"
        />
        <span class="error-message">{{ error_message }}</span>
        <FontAwesomeIcon
          class="pencil-icon"
          :icon="['fa', 'pencil-alt']"
          @click="disabled_name = !disabled_name"
        />
        <div class="div__right-settings-panel">
          <SmallDropDown
            :input_height="25"
            :input_width="200"
            :options_text="stimulation_types_array"
            :options_idx="stimulation_type_idx"
            :dom_id_suffix="'stimulation_type'"
            @selection-changed="handle_stimulation_type"
          />
          <SmallDropDown
            :style="'margin-left: 5%;'"
            :input_height="25"
            :input_width="176"
            :options_text="stop_options_array"
            :options_idx="stop_option_idx"
            :dom_id_suffix="'stop_options'"
            @selection-changed="handle_stop_setting"
          />
          <span class="span__settings-label">every</span>
          <input
            v-model="rest_duration"
            class="number_input"
            placeholder="0"
            :disabled="disabled_time"
            @change="handle_rest_duration($event.target.value)"
          />
          <FontAwesomeIcon
            id="trash_icon"
            class="trash-icon"
            :icon="['fa', 'trash-alt']"
            @click="handle_trash_modal"
          />
          <div v-show="show_confirmation" class="delete_popover_class">
            <div class="delete_popover_label">Are you sure?</div>
            <div class="popover_button_container">
              <button class="delete_button_container" @click="handle_delete">Delete</button>
              <button class="cancel_button_container" @click="show_confirmation = false">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import SmallDropDown from "@/components/basic_widgets/SmallDropDown.vue";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPencilAlt, faTrashAlt);

/**
 * @vue-data {String} active_tab - Shows current selected tab
 * @vue-data {Boolean} disabled - Disables the name and time input fields
 * @vue-data {Boolean} show_confirmation - Determines if delete popover is visible
 * @vue-data {String} current_letter - Next available letter in alphabet
 * @vue-data {String} current_color -  Next available color in alphabet
 * @vue-data {Array} stimulation_types_array - Availble options in dropdown
 * @vue-data {Array} stop_options_array - Available options in dropdown
 * @vue-data {String} protocol_name - Inputted new protocol name
 * @vue-data {String} stop_setting - Selected setting from dropdown
 * @vue-data {String} rest_duration - Inputted delay to be set at the end of the protocol between repeats
 * @vue-data {String} name_validity - Corresponding border style after name validity check
 * @vue-data {String} error_message - Error message that appears under name input field after validity check
 * @vue-data {Array} protocol_list - All available protocols from Vuex
 * @vue-data {Int} stimulation_type_idx - Used to change preselected index in the dropdown when user wants to edit existing protocols
 * @vue-event {Event} update_protocols - Gets called when a change to the available protocol list occurs to update next available color/letter assignment and dropdown options
 * @vue-event {Event} handle_trash_modal - Toggle view of delete popover on trash icon
 * @vue-event {Event} toggle_tab - Toggles which tab is active
 * @vue-event {Event} handle_delete - Confirms and commits the deletion of protocol to state
 * @vue-event {Event} handle_stimulation_type - Commits the new selected stimulation type to state
 * @vue-event {Event} handle_stop_setting - Currently just assigns the new stop setting to local state
 * @vue-event {Event} handle_rest_duration - Commits the new delay input to state
 * @vue-event {Event} check_name_validity - Checks if the inputted name has already been used
 */

export default {
  name: "StimulationStudioProtocolBlockViewEditor",
  components: {
    SmallDropDown,
    FontAwesomeIcon,
  },
  data() {
    return {
      active_tab: "Basic",
      disabled_name: true,
      disabled_time: false,
      show_confirmation: false,
      current_letter: "",
      current_color: "",
      stimulation_types_array: ["Current Controlled Stimulation", "Voltage Controlled Stimulation"],
      stop_options_array: ["Stimulate Until Stopped", "Stimulate Until Complete"],
      protocol_name: "",
      stop_option_idx: 0,
      stimulation_type_idx: 0,
      rest_duration: "",
      name_validity: "null",
      error_message: "",
      protocol_list: [],
    };
  },
  computed: {
    ...mapState("stimulation", ["stimulation_type", "stop_setting"]),
    ...mapGetters("stimulation", [
      "get_protocol_name",
      "get_rest_duration",
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
        this.rest_duration = "";
        this.name_validity = "";
      }
      if (
        mutation.type === "stimulation/set_imported_protocol" ||
        mutation.type === "stimulation/set_new_protocol"
      ) {
        this.update_protocols();
      }
      if (mutation.type === "stimulation/set_edit_mode") {
        this.update_protocols();
        this.protocol_name = this.get_protocol_name;
        this.rest_duration = this.get_rest_duration;
        this.stimulation_type_idx = (this.stimulation_type === "V") | 0;
        if (this.stop_setting === "Stimulate Until Complete") {
          this.stop_option_idx = 1;
          this.disabled_time = true;
        } else this.stop_option_idx = 0;
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  methods: {
    ...mapActions("stimulation", ["handle_protocol_editor_reset", "handle_new_rest_duration"]),
    ...mapMutations("stimulation", ["set_stimulation_type", "set_protocol_name", "set_stop_setting"]),
    update_protocols() {
      this.protocol_list = this.get_protocols;
      const { letter, color } = this.get_next_protocol;
      this.current_letter = letter;
      this.current_color = color;
    },
    toggle_tab(tab) {
      tab === "Basic" ? (this.active_tab = "Basic") : (this.active_tab = "Advanced");
    },
    handle_trash_modal() {
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
    handle_stop_setting(idx) {
      const setting = this.stop_options_array[idx];
      this.stop_option_idx = idx;

      if (idx === 0) this.disabled_time = false;
      else if (idx === 1) {
        this.disabled_time = true;
        this.handle_rest_duration(0);
      }

      this.set_stop_setting(setting);
    },
    handle_rest_duration(time) {
      this.rest_duration = time;
      this.handle_new_rest_duration(time);
    },
    check_name_validity(input) {
      const matched_names = this.protocol_list.filter((protocol) => {
        return protocol.label === input;
      });
      if (input === "") {
        this.name_validity = "";
        this.error_message = "";
      } else if (matched_names.length === 0 && input !== "") {
        this.name_validity = "border: 1px solid #19ac8a";
        this.error_message = "";
        this.set_protocol_name(input);
      } else if (matched_names.length > 0) {
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
  width: 1315px;
  font-family: muli;
}
.error-message {
  color: #bd3532;
  position: absolute;
  left: 53px;
  top: 36px;
  font-size: 13px;
  font-style: italic;
}

.delete_popover_class {
  position: fixed;
  height: 80px;
  width: 201px;
  font-family: Muli;
  padding: 4px;
  display: flex;
  z-index: 100;
  left: 1340px;
  justify-content: center;
  background: rgb(17, 17, 17);
  border: 1px solid #b7b7b7;
  border-radius: 4px;
}

.delete_popover_label {
  font-weight: bold;
  padding-top: 5px;
  color: #b7b7b7;
  height: 50px;
  width: 200px;
  position: absolute;
  left: 50px;
}

.popover_button_container {
  display: flex;
  justify-content: space-evenly;
  bottom: 0px;
  position: absolute;
  width: 197px;
}

.delete_button_container {
  border-bottom-left-radius: 4px;
}

.cancel_button_container {
  border-bottom-right-radius: 4px;
}

button {
  width: 100px;
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
  top: 1%;
  align-items: center;
}

.span__protocol-letter {
  position: relative;
  left: 2%;
  font-weight: bold;
  font-size: 25px;
}
.pencil-icon {
  left: 4%;
  color: #b7b7b7;
  position: relative;
}
.trash-icon {
  margin-left: 11%;
  margin-right: 4px;
  color: #4c4c4c;
  padding-top: 1px;
  font-size: 20px;
}

.pencil-icon:hover,
.trash-icon:hover {
  cursor: pointer;
  opacity: 0.6;
}

.div__right-settings-panel {
  left: 1000px;
  width: 90%;
  display: flex;
  justify-self: flex-end;
  justify-content: flex-end;
  align-items: center;
  margin: 5px;
}
.number_input {
  background: #1c1c1c;
  height: 25px;
  width: 50px;
  border: none;
  color: #b7b7b7;
  font-size: 12px;
  margin-right: 1%;
  text-align: center;
}
.protocol_name_nput {
  background: rgb(0, 0, 0);
  height: 25px;
  width: 300px;
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
  height: 28px;
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
  background: rgb(17, 17, 17);
  width: 1315px;
  height: 166px;
}
.div__Tabs-panel {
  background: rgb(17, 17, 17);
  width: 200px;
  height: 28px;
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
