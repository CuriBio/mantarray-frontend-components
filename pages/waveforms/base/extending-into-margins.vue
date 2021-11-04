<template>
  <div>
    <Waveform
      :title="'C12'"
      :tissue_data_points="temp_datapoints"
      :x_axis_label="'Temperature'"
      :y_axis_label="'Distance'"
    ></Waveform>
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
    const x_values = [-50000, 30000, 70000, 140000, 1500000];
    const y_values = [290.429978, 298.5820692, 800, -250, 370.8505055];

    this.temp_datapoints = convert_x_y_arrays_to_d3_array(x_values, y_values);
  },
};
</script>
