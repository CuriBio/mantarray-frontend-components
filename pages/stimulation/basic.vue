<template>
  <div>
    <StimulationStudio :style="'left: 10px; top: 10px;'" />
    <button class="update-button" @click="update_protocol_list">Update protocol list</button>
  </div>
</template>
<script>
import StimulationStudio from "@/components/stimulation/StimulationStudio.vue";
import { mapMutations } from "vuex";
// import { StimulationStudio } from "@/dist/mantarray.common";

export default {
  components: {
    StimulationStudio,
  },
  methods: {
    ...mapMutations("stimulation", ["set_new_protocol", "reset_state"]),
    update_protocol_list() {
      const test_protocol = {
        letter: "A",
        color: "#4ca0af",
        label: "Tester",
        protocol: {
          name: "Tester",
          stimulation_type: "V",
          rest_duration: 1,
          time_unit: "milliseconds",
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
              settings: {
                phase_one_duration: 15,
                phase_one_charge: 0,
                interpulse_duration: 0,
                phase_two_duration: 0,
                phase_two_charge: 0,
              },
            },
          ],
        },
      };
      this.set_new_protocol(test_protocol);
      this.reset_state();
    },
  },
};
</script>
<style scoped>
.update-button {
  position: absolute;
  top: 100px;
  left: 1840px;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  background-color: #4caf78;
  z-index: 999;
}
</style>
