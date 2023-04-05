<template>
  <div>
    <div id="stimulation-end-warning">
      <StatusWarningWidget
        v-if="show_warning"
        id="warning-modal"
        :modal_labels="analysis_end_modal_labels"
        @handle_confirmation="close_warning_modal"
      />
    </div>
    <div v-if="is_visible" :class="{ flash: is_flashing }">Stimulation is Running</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import StatusWarningWidget from "@/components/status/StatusWarningWidget";

export default {
  name: "StimulationRunningWidget",
  components: {
    StatusWarningWidget,
  },
  data: function () {
    return {
      show_warning: false,
      analysis_end_modal_labels: {
        header: "Attention!",
        msg_one: `Stimulation was stopped.`,
        msg_two: "Please confirm to continue.",
        button_names: ["Close"],
      },
    };
  },
  computed: {
    ...mapState("stimulation", ["stim_play_state"]),
    is_flashing() {
      return this.stim_play_state;
    },
    is_visible() {
      return this.stim_play_state;
    },
  },
  watch: {
    stim_play_state(newVal, oldVal) {
      if (oldVal && !newVal) {
        this.show_warning = true;
      }
    },
  },
  methods: {
    close_warning_modal() {
      this.show_warning = false;
    },
  },
};
</script>

<style>
#stimulation-end-warning {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
.flash {
  animation: flash 1s infinite;
  color: white;
}

@keyframes flash {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
