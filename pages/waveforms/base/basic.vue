<template>
  <div class="div__waveform-container">
    <Waveform :title="'A01'" :tissue_data_points="temp_datapoints"></Waveform>
  </div>
</template>

<script>
import Waveform from "@/components/playback/waveform/Waveform.vue";
// import { Waveform } from "@/dist/mantarray.common"; // Eli (4/8/20) apparently the braces in the import statement are CRITICAL. I don't know why, but it fails without them
import { convert_x_y_arrays_to_d3_array } from "@/js_utils/waveform_data_formatter.js";
export default {
  components: {
    Waveform,
  },
  created: function () {
    const x_values = [0, 30000, 70000, 140000, 230000];
    const y_values = [290.429978, 298.5820692, 327.728242, 352.3291106, 370.8505055];

    this.temp_datapoints = convert_x_y_arrays_to_d3_array(x_values, y_values);
  },
};
</script>
<style scoped>
.div__waveform-container {
  width: 521px;
  height: 419px;
  background: #000000;
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>
