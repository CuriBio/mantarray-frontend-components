<template>
  <div>
    <StimulationControls />
    <button class="enable-button" @click="enable_controls">Enable Stim Controls</button>
    <button class="update-button" @click="update_protocol_assignment">Update protocol assignments</button>
    <button class="start-button" @click="start_stim">Start</button>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { StimulationControls } from "@/dist/mantarray.common";
import { STIM_STATUS } from "../../../../store/modules/stimulation/enums";
// import StimulationControls from "@/components/playback/controls/StimulationControls.vue";

export default {
  components: {
    StimulationControls,
  },
  created() {
    this.unsubscribe = this.$store.subscribeAction(async (action, state) => {
      // simulate response from BE when play/stop button is pressed
      if (action.type === "stimulation/create_protocol_message") {
        this.set_stim_play_state(true);
      } else if (action.type === "stimulation/stop_stimulation") {
        this.set_stim_play_state(false);
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  methods: {
    ...mapMutations("stimulation", ["set_stim_play_state"]),
    ...mapMutations("playback", ["set_enable_stim_controls"]),
    update_protocol_assignment() {
      const test_assignment = {
        A2: {
          letter: "A",
          color: "#4ca0af",
          label: "Tester",
          protocol: {
            name: "Tester",
            stimulation_type: "C",
            rest_duration: 1,
            time_unit: "milliseconds",
            run_until_stopped: true,
            subprotocols: [
              {
                phase_one_duration: 15,
                phase_one_charge: 0,
                interphase_interval: 0,
                phase_two_duration: 0,
                phase_two_charge: 0,
              },
              {
                phase_one_duration: 20,
                phase_one_charge: 0,
                interphase_interval: 0,
                phase_two_duration: 0,
                phase_two_charge: 0,
              },
            ],
            detailed_subprotocols: [
              {
                type: "Delay",
                src: "/delay-tile.png",
                nested_protocols: [],
                repeat: { color: "d822f9", number_of_repeats: 0 },
                pulse_settings: {
                  phase_one_duration: 15,
                  phase_one_charge: 0,
                  interphase_interval: 0,
                  phase_two_duration: 0,
                  phase_two_charge: 0,
                },
              },
            ],
          },
        },
      };
      this.$store.state.stimulation.protocol_assignments = test_assignment;
      this.$store.state.stimulation.stim_status = STIM_STATUS.READY;
    },
    enable_controls() {
      this.set_enable_stim_controls(true);
    },
    async start_stim() {
      // always start stimulation
      await this.$store.dispatch(`stimulation/create_protocol_message`);
    },
  },
};
</script>
<style scoped>
.enable-button {
  position: absolute;
  top: 45px;
  left: 350px;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  background-color: #4ca0af;
  z-index: 999;
}
.update-button {
  position: absolute;
  top: 100px;
  left: 350px;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  background-color: #4ca0af;
  z-index: 999;
}
.start-button {
  position: absolute;
  top: 155px;
  left: 350px;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  background-color: #4ca0af;
  z-index: 999;
}
</style>
