<template>
  <div class="protocol-viewer-background">
    <Waveform
      :title="'Protocol Name(TBD)'"
      :display_waveform_idx="0"
      :x_axis_sample_length="500000"
      :y_min="0"
      :y_max="200"
      :plot_area_pixel_height="150"
      :plot_area_pixel_width="800"
      :data_points="temp_datapoints"
      :y_axis_label="y_axis_label"
      :x_axis_label="x_axis_label"
    />
  </div>
</template>
<script>
import Waveform from "@/components/playback/waveform/Waveform.vue";
import { convert_x_y_arrays_to_d3_array } from "@/js_utils/waveform_data_formatter.js";

export default {
  name: "StimulationStudioProtocolViewer",
  components: {
    Waveform,
  },
  data() {
    return {
      y_axis_label: "Voltage",
      x_axis_label: "Seconds",
    };
  },
  created: function () {
    const x_values = [0, 3000, 7000, 14000, 23000];
    const y_values = [290.429978, 298.5820692, 327.728242, 352.3291106, 370.8505055];

    this.temp_datapoints = convert_x_y_arrays_to_d3_array(x_values, y_values);
  },
};
</script>
<style scoped>
.protocol-viewer-background {
  border: 1px dashed white;
  background: rgb(0, 0, 0);
  position: absolute;
  height: 23%;
  width: 60%;
  left: 20%;
  top: 67%;
}
</style>
