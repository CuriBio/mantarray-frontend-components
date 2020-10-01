<template>
  <div style="top: 54px; left: 76px; position: absolute">
    <Waveform :title="'D03'" :data_points="temp_datapoints"></Waveform>
  </div>
</template>

<script>
import { Waveform } from "@/dist/mantarray.common";
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
