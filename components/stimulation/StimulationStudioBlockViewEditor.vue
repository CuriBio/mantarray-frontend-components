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
        <span :key="current_letter" class="span__protocol-letter" :style="'color:' + current_color">{{
          current_letter
        }}</span>
        <input
          v-model="protocol_name"
          class="protocol_name_input"
          placeholder="Protocol Name"
          :style="name_validity"
          @change="check_name_validity($event.target.value)"
        />
        <span class="error-message">{{ error_message }}</span>
        <div class="div__right-settings-panel">
          <SmallDropDown
            :input_height="25"
            :input_width="200"
            :disable_selection="true"
            :options_text="stimulation_types_array"
            :options_idx="0"
            :dom_id_suffix="'stimulation_type'"
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
          <div v-b-popover.hover.bottom="rest_input_hover" class="number-input-container">
            <InputWidget
              :style="'position: relative;'"
              :initial_value="rest_duration"
              :placeholder="'0'"
              :dom_id_suffix="'protocol-rest'"
              :invalid_text="invalid_rest_dur_text"
              :disabled="disabled_time"
              :input_width="100"
              :input_height="25"
              :top_adjust="-2"
              @update:value="handle_rest_duration($event)"
            />
          </div>
          <FontAwesomeIcon
            id="trash_icon"
            class="trash-icon"
            :icon="['fa', 'trash-alt']"
            @click="open_del_modal"
          />
        </div>
      </div>
    </div>
    <b-modal
      :id="'del-protocol-modal'"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <StatusWarningWidget
        id="del-protocol"
        :modal_labels="del_protocol_labels"
        @handle_confirmation="close_del_protocol_modal"
      />
    </b-modal>
  </div>
</template>
<script>
import Vue from "vue";
import SmallDropDown from "@/components/basic_widgets/SmallDropDown.vue";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import StatusWarningWidget from "@/components/status/StatusWarningWidget.vue";
import BootstrapVue from "bootstrap-vue";
import { BModal } from "bootstrap-vue";
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import { MAX_SUBPROTOCOL_DURATION_MS } from "@/store/modules/stimulation/enums";
Vue.use(BootstrapVue);
Vue.component("BModal", BModal);
library.add(faTrashAlt);

/**
 * @vue-data {String} active_tab - Shows current selected tab
 * @vue-data {Boolean} disabled - Disables the name and time input fields
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
 * @vue-event {Event} update_protocols - Gets called when a change to the available protocol list occurs to update next available color/letter assignment and dropdown options
 * @vue-event {Event} handle_trash_modal - Toggle view of delete popover on trash icon
 * @vue-event {Event} toggle_tab - Toggles which tab is active
 * @vue-event {Event} handle_delete - Confirms and commits the deletion of protocol to state
 * @vue-event {Event} handle_stop_setting - Currently just assigns the new stop setting to local state
 * @vue-event {Event} handle_rest_duration - Commits the new delay input to state
 * @vue-event {Event} check_name_validity - Checks if the inputted name has already been used
 */

export default {
  name: "StimulationStudioProtocolBlockViewEditor",
  components: {
    SmallDropDown,
    FontAwesomeIcon,
    StatusWarningWidget,
    InputWidget,
  },
  data() {
    return {
      active_tab: "Basic",
      disabled_time: false,
      current_letter: "",
      current_color: "",
      stimulation_types_array: ["Current Controlled Stimulation", "(Not Yet Available)"],
      stop_options_array: ["Stimulate Until Stopped", "Stimulate Until Complete"],
      protocol_name: "",
      stop_option_idx: 0,
      rest_duration: "",
      name_validity: "null",
      error_message: "",
      protocol_list: [],
      del_protocol_labels: {
        header: "Warning!",
        msg_one: "You are about to permanently delete this protocol.",
        msg_two: "Please confirm to continue.",
        button_names: ["Delete", "Cancel"],
      },
      invalid_rest_dur_text: "",
    };
  },
  computed: {
    ...mapState("stimulation", {
      run_until_stopped: (state) => state.protocol_editor.run_until_stopped,
      rest_time_unit: (state) => state.protocol_editor.time_unit,
    }),
    ...mapGetters("stimulation", [
      "get_protocol_name",
      "get_rest_duration",
      "get_protocols",
      "get_next_protocol",
    ]),
    rest_input_hover: function () {
      return {
        content: 'Cannot set this value if using "Stimulate Until Complete"',
        disabled: !this.disabled_time,
      };
    },
  },
  watch: {
    rest_time_unit() {
      if (!this.disabled_time) {
        this.handle_rest_duration(this.rest_duration);
      }
    },
  },
  created() {
    this.update_protocols();
    this.unsubscribe = this.$store.subscribe(async (mutation) => {
      if (
        mutation.type === "stimulation/reset_state" ||
        mutation.type === "stimulation/reset_protocol_editor"
      ) {
        this.update_protocols();
        this.protocol_name = "";
        this.rest_duration = "";
        this.name_validity = "";
      } else if (mutation.type === "stimulation/set_new_protocol") {
        this.update_protocols();
      } else if (mutation.type === "stimulation/set_edit_mode") {
        this.update_protocols();
        this.protocol_name = this.get_protocol_name;
        this.rest_duration = JSON.stringify(this.get_rest_duration);

        this.stop_option_idx = +!this.run_until_stopped;
        this.disabled_time = !this.run_until_stopped;
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  mounted() {
    this.$store.commit("stimulation/set_edit_mode_off");
    this.update_protocols();
  },
  methods: {
    ...mapActions("stimulation", ["handle_protocol_editor_reset", "handle_new_rest_duration"]),
    ...mapMutations("stimulation", ["set_protocol_name", "set_stop_setting"]),
    update_protocols() {
      this.protocol_list = this.get_protocols;
      const { letter, color } = this.get_next_protocol;
      this.current_letter = letter;
      this.current_color = color;
    },
    toggle_tab(tab) {
      tab === "Basic" ? (this.active_tab = "Basic") : (this.active_tab = "Advanced");
    },
    open_del_modal() {
      this.$bvModal.show("del-protocol-modal");
    },
    close_del_protocol_modal(idx) {
      this.$bvModal.hide("del-protocol-modal");
      if (idx === 0) this.handle_protocol_editor_reset();
    },
    handle_stop_setting(idx) {
      const setting = this.stop_options_array[idx];
      this.stop_option_idx = idx;

      this.disabled_time = idx === 1;

      if (this.disabled_time) this.handle_rest_duration("0");

      this.set_stop_setting(setting.includes("Stopped"));
    },
    handle_rest_duration(time) {
      const time_int = +time;

      this.rest_duration = time;
      if (isNaN(time_int) || time_int < 0) {
        this.invalid_rest_dur_text = "Must be a (+) number";
      } else if (this.get_dur_in_ms(time_int) > MAX_SUBPROTOCOL_DURATION_MS) {
        this.invalid_rest_dur_text = "Must be <= 24hrs";
      } else {
        this.invalid_rest_dur_text = "";
        this.handle_new_rest_duration(this.rest_duration);
      }

      const rest_dur_is_valid = this.invalid_rest_dur_text === "";
      this.$emit("new-rest-dur", rest_dur_is_valid);
    },
    get_dur_in_ms(value) {
      return this.rest_time_unit === "milliseconds" ? value : value * 1000;
    },
    check_name_validity(input) {
      const matched_names = this.protocol_list.filter((protocol) => {
        return protocol.label === input;
      });
      if (input === "") {
        this.name_validity = "";
        this.error_message = "";
      } else if (matched_names.length === 0) {
        this.name_validity = "border: 1px solid #19ac8a";
        this.error_message = "";
        this.set_protocol_name(input);
      } else {
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

.trash-icon {
  margin-left: 11%;
  margin-right: 4px;
  color: #4c4c4c;
  padding-top: 1px;
  font-size: 20px;
}

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

.number-input-container {
  height: 25px;
  width: 100px;
  border: none;
  color: #b7b7b7;
  font-size: 12px;
  margin-right: 1%;
  text-align: center;
}

.div__heatmap-layout-minimum-input-container {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 121px;
  height: 59px;
  top: 196px;
  left: 1473.44px;
  visibility: visible;
}

.protocol_name_input {
  background: rgb(0, 0, 0);
  height: 25px;
  width: 300px;
  left: 3%;
  position: relative;
  border: none;
  padding: 0 10px 0 10px;
  color: rgb(255, 255, 255);
}

.protocol_name_input:focus {
  border: 1px solid #b7b7b7;
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
</style>
