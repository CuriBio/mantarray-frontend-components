<template>
  <div class="protocol-viewer-background">
    <StimulationStudioWaveform
      :x_axis_sample_length="x_axis_sample_length"
      :y_min="-y_min_max"
      :y_max="y_min_max"
      :plot_area_pixel_height="160"
      :plot_area_pixel_width="dynamic_plot_width"
      :data_points="datapoints"
      :y_axis_label="'Current'"
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
 * @vue-data {Int} y_min_max - The y axis min and max values
 * @vue-data {Array} datapoints - The d3 formatted x and y axis points
 * @vue-data {Array} repeat_colors - Corresponding color assignments from repeat blocks in pulse order to be assigned to color of line in graph
 * @vue-data {Int} x_axis_sample_length - x-axis max value
 * @vue-data {Array} delay_blocks - Delay block to appear at end of graph to show in between repeats
 * @vue-data {String} x_axis_label - X axis label passed down to graph
 * @vue-method {Event} get_dynamic_sample_length - Calculates last point of line in graph for zoom feature

 */

export default {
  name: "StimulationStudioProtocolViewer",
  components: {
    StimulationStudioWaveform,
  },
  data() {
    return {
      y_min_max: 120,
      datapoints: [],
      repeat_colors: [],
      x_axis_sample_length: 100,
      dynamic_plot_width: 1200,
      delay_blocks: [],
      x_axis_label: "Time",
      last_x_value: 0,
    };
  },
  created: function () {
    const state = this.$store.state.stimulation;
    this.unsubscribe = this.$store.subscribe(async (mutation) => {
      if (mutation.type === "stimulation/set_axis_values" || mutation.type === "stimulation/set_edit_mode") {
        this.datapoints = await convert_x_y_arrays_to_d3_array(state.x_axis_values, state.y_axis_values);
        this.repeat_colors = state.repeat_colors;
        this.delay_blocks = state.delay_blocks;
        this.get_dynamic_sample_length();
      }
      if (
        mutation.type === "stimulation/reset_state" ||
        mutation.type === "stimulation/reset_protocol_editor"
      ) {
        this.datapoints = [];
        this.y_min_max = state.y_axis_scale;
        this.x_axis_sample_length = 100;
        this.dynamic_plot_width = 1200;
        this.delay_blocks = state.delay_blocks;
      }
      if (mutation.type === "stimulation/set_zoom_out") {
        if (state.y_axis_scale !== this.y_min_max) this.y_min_max = state.y_axis_scale;
        else {
          if (this.dynamic_plot_width === 1200) this.x_axis_sample_length *= 1.5;
          else if (this.dynamic_plot_width > 1200) this.dynamic_plot_width /= 1.5;
        }
      }
      if (mutation.type === "stimulation/set_zoom_in") {
        if (state.y_axis_scale !== this.y_min_max) this.y_min_max = state.y_axis_scale;
        else {
          if (this.x_axis_sample_length > this.last_x_value + 50 || this.datapoints.length === 0)
            this.x_axis_sample_length /= 1.5;
          else this.dynamic_plot_width *= 1.5;
        }
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  methods: {
    get_dynamic_sample_length() {
      if (this.delay_blocks.length > 0) {
        if (isNaN(this.delay_blocks[0][1]))
          this.last_x_value = this.datapoints[this.datapoints.length - 1][0];
        else this.last_x_value = this.delay_blocks[0][1];
      }
      if (this.last_x_value === 0) this.x_axis_sample_length = 100;
      else this.x_axis_sample_length = this.last_x_value + 50;
    },
  },
};
</script>
<style scoped>
.protocol-viewer-background {
  background: rgb(0, 0, 0);
  position: absolute;
  height: 50%;
  width: 1315px;
  height: 220px;
  overflow: visible;
}
</style>
