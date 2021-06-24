<template>
  <div class="protocol-viewer-background">
    <StimulationStudioWaveform
      :display_waveform_idx="0"
      :x_axis_sample_length="500000"
      :y_min="-y_min_max"
      :y_max="y_min_max"
      :plot_area_pixel_height="160"
      :plot_area_pixel_width="1000"
      :data_points="temp_datapoints"
      :y_axis_label="stimulation_type"
      :x_axis_label="time_unit"
    />
  </div>
</template>
<script>
import StimulationStudioWaveform from "@/components/stimulation/StimulationStudioWaveform.vue";
import { convert_x_y_arrays_to_d3_array } from "@/js_utils/waveform_data_formatter.js";

export default {
  name: "StimulationStudioProtocolViewer",
  components: {
    StimulationStudioWaveform,
  },
  props: {
    stimulation_type: { type: String, default: "Voltage (mV)" },
    time_unit: { type: String, default: "Time (s)" },
  },
  data() {
    return {
      y_min_max: 7,
    };
  },
  created: function () {
    const x_values = [0, 1000, 1000, 3000, 3000, 6000, 6000, 11000, 11000, 12000, 12000, 16000, 16000, 20000];
    const y_values = [0, 0, 3, 3, 2, 2, 0, 0, -5, -5, 1, 1, 0, 0];

    this.temp_datapoints = convert_x_y_arrays_to_d3_array(x_values, y_values);
  },
};
</script>
<style scoped>
.protocol-viewer-background {
  background: rgb(0, 0, 0);
  position: absolute;
  height: 27%;
  width: 60%;
  left: 20%;
  top: 66%;
}
</style>