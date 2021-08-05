<template>
  <div class="protocol-viewer-background">
    <StimulationStudioWaveform
      :x_axis_sample_length="x_axis_sample_length"
      :y_min="-y_min_max"
      :y_max="y_min_max"
      :plot_area_pixel_height="160"
      :plot_area_pixel_width="dynamic_plot_width"
      :data_points="datapoints"
      :y_axis_label="stimulation_type"
      :x_axis_label="x_axis_label"
      :repeat_colors="repeat_colors"
      :delay_blocks="delay_blocks"
    />
  </div>
</template>
<script>
import StimulationStudioWaveform from "@/components/stimulation/StimulationStudioWaveform.vue";
import { convert_x_y_arrays_to_d3_array } from "@/js_utils/waveform_data_formatter.js";

/**
 * @vue-props {Sting} stimulation_type - Current selected stimulation_type assigned to y axis label/scale
 * @vue-data {Int} y_min_max - The y axis min and max values
 * @vue-data {Array} datapoints - The d3 formatted x and y axis points
 * @vue-data {Object} repeat_colors - Corresponding color assignments from repeat blocks in pulse order to be assigned to color of line in graph
 * @vue-data {Int} x_axis_sample_length - x-axis max value
 * @vue-data {Array} delay_blocks - Delay block to appear at end of graph to show in between repeats
 */

export default {
  name: "StimulationStudioProtocolViewer",
  components: {
    StimulationStudioWaveform,
  },
  props: {
    stimulation_type: { type: String, default: "Voltage (V)" },
  },
  data() {
    return {
      y_min_max: 500,
      datapoints: [],
      repeat_colors: {},
      x_axis_sample_length: 100,
      dynamic_plot_width: 1150,
      delay_blocks: [],
      x_axis_label: "Time (ms)",
    };
  },
  created: function () {
    const state = this.$store.state.stimulation;
    this.unsubscribe = this.$store.subscribe(async (mutation) => {
      if (mutation.type === "stimulation/set_axis_values" || mutation.type === "stimulation/set_edit_mode") {
        this.datapoints = await convert_x_y_arrays_to_d3_array(state.x_axis_values, state.y_axis_values);
        this.repeat_colors = state.repeat_colors;
        this.delay_blocks = state.delay_blocks;
      }
      if (
        mutation.type === "stimulation/reset_state" ||
        mutation.type === "stimulation/reset_protocol_editor"
      ) {
        this.datapoints = [];
        this.y_min_max = state.y_axis_scale;
        this.x_axis_sample_length = 100;
        state.x_axis_scale = 100;
        this.dynamic_plot_width = 1150;
        this.delay_blocks = state.delay_blocks;
      }
      if (mutation.type === "stimulation/set_zoom_out" || mutation.type === "stimulation/set_zoom_in") {
        this.x_axis_sample_length = state.x_axis_scale;
        this.y_min_max = state.y_axis_scale;
        state.x_axis_scale = this.x_axis_sample_length;
      }
      // this.get_dynamic_plot_width(state.x_axis_scale);
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  methods: {
    // get_dynamic_plot_width(scale) {
    //   return;
    //   // console.log(scale);
    //   // const last_time_point = this.datapoints[this.datapoints.length - 1][0];
    //   // if (last_time_point >= this.x_axis_sample_length) {
    //   //   this.x_axis_sample_length += scale;
    //   //   this.dynamic_plot_width *= 2;
    //   //   console.log(this.x_axis_sample_length, this.dynamic_plot_width);
    //   // }
    // },
  },
};
</script>
<style scoped>
.protocol-viewer-background {
  background: rgb(0, 0, 0);
  position: relative;
  height: 50%;
  width: 100%;
}
</style>
