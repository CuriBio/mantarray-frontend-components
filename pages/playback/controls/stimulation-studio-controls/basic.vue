<template>
  <div>
    <StimulationStudioControls />
    <button class="update-button" @click="update_protocol_assignment">Update protocol assignments</button>
  </div>
</template>

<script>
import { StimulationStudioControls } from "@/dist/mantarray.common";
// import StimulationStudioControls from "@/components/playback/controls/StimulationStudioControls.vue";

export default {
  components: {
    StimulationStudioControls,
  },
  methods: {
    update_protocol_assignment() {
      const test_assignment = {
        A2: {
          letter: "A",
          color: "#4ca0af",
          label: "Tester",
          protocol: {
            name: "Tester",
            stimulation_type: "V",
            rest_duration: 1,
            time_unit: "milliseconds",
            stop_setting: "Stimulate Until Stopped",
            pulses: [
              {
                phase_one_duration: 15,
                phase_one_charge: 0,
                interpulse_duration: 0,
                phase_two_duration: 0,
                phase_two_charge: 0,
              },
              {
                phase_one_duration: 20,
                phase_one_charge: 0,
                interpulse_duration: 0,
                phase_two_duration: 0,
                phase_two_charge: 0,
              },
            ],
            detailed_pulses: [
              {
                type: "Delay",
                src: "/delay-tile.png",
                nested_protocols: [],
                repeat: { color: "d822f9", number_of_repeats: 0 },
                pulse_settings: {
                  phase_one_duration: 15,
                  phase_one_charge: 0,
                  interpulse_duration: 0,
                  phase_two_duration: 0,
                  phase_two_charge: 0,
                },
              },
            ],
          },
        },
      };
      this.$store.state.stimulation.protocol_assignments = test_assignment;
    },
  },
};
</script>
<style scoped>
.update-button {
  position: absolute;
  top: 100px;
  left: 300px;
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
