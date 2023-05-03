<template>
  <div>
    <div class="div__recording-name-input-background">
      <span class="span__recording-name-input-label">{{ modal_labels.header }}</span>
      <div id="customer_id" class="div__recording-name-input-box">
        <InputWidget
          :title_label="modal_labels.msg"
          :placeholder="'Recording File Name'"
          :invalid_text="error_message"
          :spellcheck="false"
          :input_width="400"
          :dom_id_suffix="'recording-name'"
          :initial_value="default_recording_name"
          @update:value="check_recording_name($event)"
        />
      </div>
      <div v-if="beta_2_mode" class="div__toggle-container">
        <ToggleWidget
          id="run_recording_snapshot_current"
          :checked_state="run_recording_snapshot_current"
          :label="'run_recording_snapshot_current'"
          @handle_toggle_state="handle_snapshot_toggle"
        />
        <span>Show Snapshot For This Recording</span>
      </div>
      <div class="div__confirm-button-container">
        <ButtonWidget
          :button_widget_width="420"
          :button_widget_height="50"
          :button_widget_top="0"
          :button_widget_left="0"
          :button_names="['Confirm']"
          :enabled_color="'#B7B7B7'"
          :is_enabled="[is_enabled]"
          :hover_color="['#19ac8a']"
          @btn-click="handle_click"
        />
      </div>
    </div>
    <b-modal
      id="existing-recording-warning"
      size="sm"
      hide-footer
      hide-header
      hide-header-close
      :static="true"
      :no-close-on-backdrop="true"
    >
      <StatusWarningWidget
        :modal_labels="existing_recording_labels"
        @handle_confirmation="close_warning_modal"
      />
    </b-modal>
  </div>
</template>
<script>
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";
import Vue from "vue";
import StatusWarningWidget from "@/components/status/StatusWarningWidget.vue";
import ToggleWidget from "@/components/basic_widgets/ToggleWidget.vue";
import { mapState } from "vuex";
import { BModal } from "bootstrap-vue";
Vue.component("BModal", BModal);

export default {
  name: "RecordingNameInputWidget",
  components: { InputWidget, ButtonWidget, StatusWarningWidget, ToggleWidget },
  props: {
    modal_labels: {
      type: Object,
      default() {
        return {
          header: "Important!",
          msg: "Choose a name for this recording.",
        };
      },
    },
    default_recording_name: { type: String, default: "" },
  },
  data: function () {
    return {
      recording_name: this.default_recording_name,
      error_message: "",
      existing_recording_labels: {
        header: "Warning!",
        msg_one: "The name you chose already exists.",
        msg_two: "Would you like to replace the existing recording with this one?",
        button_names: ["Cancel", "Yes"],
      },
      run_recording_snapshot_current: true,
    };
  },
  computed: {
    ...mapState("settings", ["run_recording_snapshot_default", "beta_2_mode"]),
    is_enabled: function () {
      return !this.error_message;
    },
    snapshot_enabled: function () {
      return this.beta_2_mode && this.run_recording_snapshot_current;
    },
  },
  watch: {
    run_recording_snapshot_default: function (new_default) {
      // required because bootstrap modals are always rendered to the page so need a way to change the value as it's changed
      this.run_recording_snapshot_current = new_default;
    },
  },
  methods: {
    check_recording_name: function (recording_name) {
      this.recording_name = recording_name;
      this.error_message = recording_name ? "" : "Please enter a name";
    },
    handle_click: async function () {
      if (this.is_enabled) {
        await this.handle_recording_rename(this.recording_name === this.default_recording_name);
      }
    },
    close_warning_modal: async function (idx) {
      this.$bvModal.hide("existing-recording-warning");

      if (idx === 1) {
        await this.handle_recording_rename(true);
      } else {
        this.error_message = "Name already exists";
      }
    },
    handle_recording_rename: async function (replace_existing) {
      const res = await this.$store.dispatch("playback/handle_recording_rename", {
        recording_name: this.recording_name,
        default_name: this.default_recording_name,
        replace_existing,
        snapshot_enabled: this.snapshot_enabled,
      });

      if (res === 403 && !replace_existing) {
        this.$bvModal.show("existing-recording-warning");
      } else {
        this.$emit("handle_confirmation");
        this.$store.commit("playback/set_is_recording_snapshot_running", this.snapshot_enabled);
        // reset this value back to the default
        this.run_recording_snapshot_current = this.beta_2_mode && this.run_recording_snapshot_default;
      }
    },
    handle_snapshot_toggle: function (state) {
      this.run_recording_snapshot_current = state;
    },
  },
};
</script>
<style scoped>
.div__recording-name-input-background {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  height: 240px;
  width: 420px;
  top: 0;
  left: 0;
  visibility: visible;
  color: #1c1c1c;
  border-color: #000000;
  background: rgb(17, 17, 17);
  z-index: 3;
}
.span__recording-name-input-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 420px;
  height: 30px;
  top: 22.385px;
  left: 0px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  text-align: center;
}
.div__recording-name-input-box {
  top: 45px;
  left: 8px;
  position: absolute;
  z-index: 24;
}
.div__confirm-button-container {
  top: 200px;
  left: 0px;
  position: absolute;
}
.div__toggle-container {
  font-family: Muli;
  font-size: 16px;
  color: rgb(183, 183, 183);
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  position: absolute;
  width: 420px;
  top: 154px;
}
</style>
