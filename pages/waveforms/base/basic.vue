<template>
  <div>
    <Waveform :title="'A01'" :data_points="temp_datapoints"></Waveform>
  </div>
</template>

<script>
import { Waveform } from "@/dist/mantarray.common"; // Eli (4/8/20) apparently the braces in the import statement are CRITICAL. I don't know why, but it fails without them
import { convert_x_y_arrays_to_d3_array } from "@/js_utils/waveform_data_formatter.js";
export default {
  components: {
    Waveform,
  },
  created: function () {
    const x_values = [0, 3000, 7000, 14000, 23000];
    const y_values = [
      290.429978,
      298.5820692,
      327.728242,
      352.3291106,
      370.8505055,
    ];

    this.temp_datapoints = convert_x_y_arrays_to_d3_array(x_values, y_values);
  },
};
</script>
