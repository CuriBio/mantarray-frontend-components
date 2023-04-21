<template>
  <div>
    <StimulationStudio :style="'left: 10px; top: 10px;'" />
    <button class="update-button" @click="update_protocol_list">Update protocol list</button>
    <button class="update-button" :style="'top: 300px;'" @click="create_message">Create message</button>
    <button class="update-button" :style="'top: 500px;'" @click="enable_controls">Enable buttons</button>
    <button class="update-button" :style="'top: 700px;'" @click="mock_config_check">Mock config check</button>
    <div class="controls-container">
      <StimulationControls />
    </div>
  </div>
</template>
<script>
import StimulationStudio from "@/components/stimulation/StimulationStudio.vue";
import StimulationControls from "@/components/playback/controls/StimulationControls.vue";
import { mapMutations, mapActions } from "vuex";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";
// import { StimulationStudio, StimulationControls } from "@/dist/mantarray.common";
import playback_module from "@/store/modules/playback";

export default {
  components: {
    StimulationStudio,
    StimulationControls,
  },
  methods: {
    ...mapMutations("stimulation", ["set_new_protocol", "reset_state", "set_stim_status"]),
    ...mapActions("stimulation", ["create_protocol_message"]),
    ...mapMutations("playback", ["set_enable_stim_controls"]),
    async update_protocol_list() {
      const test_protocol = {
        label: "mock_protocol",
        letter: "A",
        color: "#4ca0af",
        protocol: {
          name: "mock",
          stimulation_type: "C",
          run_until_stopped: false,
          rest_duration: 0,
          time_unit: "seconds",
          subprotocols: [
            {
              type: "Biphasic",
              phase_one_duration: 3,
              phase_one_charge: 40,
              interphase_interval: 1,
              phase_two_duration: 3,
              phase_two_charge: -40,
              postphase_interval: 1,
              num_cycles: 5,
            },
            {
              type: "Delay",
              duration: 50,
              unit: "milliseconds",
            },
            {
              type: "Biphasic",
              phase_one_duration: 4,
              phase_one_charge: 10,
              interphase_interval: 1,
              phase_two_duration: 4,
              phase_two_charge: -10,
              postphase_interval: 1,
              num_cycles: 5,
            },
          ],
          detailed_subprotocols: [
            {
              type: "Biphasic",
              src: "/Biphasic.png",
              nested_protocols: [],
              color: "bb9e69",
              pulse_settings: {
                phase_one_duration: 3,
                phase_one_charge: 40,
                interphase_interval: 1,
                phase_two_duration: 3,
                phase_two_charge: -40,
                postphase_interval: 1,
                total_active_duration: { duration: 50, unit: "milliseconds" },
                num_cycles: 1,
                frequency: 1,
              },
            },
            {
              type: "Delay",
              src: "/Delay.png",
              nested_protocols: [],
              color: "70f30",
              pulse_settings: {
                duration: 50,
                unit: "milliseconds",
              },
            },
            {
              type: "Biphasic",
              src: "/Biphasic.png",
              nested_protocols: [],
              color: "e9584b",
              pulse_settings: {
                phase_one_duration: 4,
                phase_one_charge: 10,
                interphase_interval: 1,
                phase_two_duration: 4,
                phase_two_charge: -10,
                postphase_interval: 1,
                total_active_duration: { duration: 50, unit: "milliseconds" },
                num_cycles: 1,
                frequency: 1,
              },
            },
          ],
        },
      };
      const test_protocol_2 = {
        label: "mock_protocol_2",
        letter: "B",
        color: "#578844",
        protocol: {
          name: "mock_protocol_2",
          stimulation_type: "C",
          run_until_stopped: true,
          rest_duration: 1,
          time_unit: "seconds",
          subprotocols: [
            {
              type: "Biphasic",
              phase_one_duration: 5,
              phase_one_charge: 200,
              interphase_interval: 0,
              phase_two_duration: 5,
              phase_two_charge: -200,
              postphase_interval: 0,
              num_cycles: 1,
            },
            {
              type: "Delay",
              duration: 1,
              unit: "seconds",
            },
          ],
          detailed_subprotocols: [
            {
              type: "Biphasic",
              src: "/Biphasic.png",
              nested_protocols: [],
              color: "5391fa",
              pulse_settings: {
                phase_one_duration: 5,
                phase_one_charge: 200,
                interphase_interval: 0,
                phase_two_duration: 5,
                phase_two_charge: -200,
                postphase_interval: 0,
                total_active_duration: { duration: 1, unit: "seconds" },
                num_cycles: 1,
                frequency: 2,
              },
            },
          ],
        },
      };
      this.set_new_protocol(test_protocol);
      this.set_new_protocol(test_protocol_2);

      this.reset_state();
    },
    create_message() {
      this.create_protocol_message();
    },
    enable_controls() {
      this.$store.state.playback.enable_stim_controls = true;
      this.$store.dispatch("playback/validate_barcode", {
        type: "stim_barcode",
        new_value: "MS2022001000",
      });
      this.$store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED);
    },
    mock_config_check() {
      //   this.set_stim_status(STIM_STATUS.CONFIG_CHECK_IN_PROGRESS);
      this.set_stim_status(STIM_STATUS.SHORT_CIRCUIT_ERROR);
    },
  },
};
</script>
<style scoped>
.update-button {
  position: absolute;
  top: 100px;
  left: 1740px;
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
.controls-container {
  left: 5%;
  top: 75%;
  position: absolute;
}
</style>
