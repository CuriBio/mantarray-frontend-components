<template>
  <div class="protocol-viewer-background">
    <StimulationStudioWaveform
      :x_axis_sample_length="x_axis_sample_length"
      :y_min="-y_min_max"
      :y_max="y_min_max"
      :plot_area_pixel_height="160"
      :plot_area_pixel_width="970"
      :data_points="datapoints"
      :y_axis_label="stimulation_type"
      :x_axis_label="time_unit"
      :repeat_colors="repeat_colors"
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
    stimulation_type: { type: String, default: "Voltage (V)" },
    time_unit: { type: String, default: "Time (s)" },
  },
  data() {
    return {
      y_min_max: 10,
      datapoints: [],
      repeat_colors: {},
      x_axis_sample_length: 100,
    };
  },
  created: function () {
    const state = this.$store.state.stimulation;
    this.unsubscribe = this.$store.subscribe(async (mutation) => {
      if (mutation.type === "stimulation/handle_protocol_order") {
        this.datapoints = await convert_x_y_arrays_to_d3_array(state.x_axis_points, state.y_axis_points);
        this.repeat_colors = state.repeat_colors;
      }
      if (mutation.type === "stimulation/handle_delete_protocol") {
        this.datapoints = [];
      }
      if (mutation.type === "stimulation/handle_time_unit") {
        if (state.new_protocol.time_unit === "milliseconds") this.x_axis_sample_length *= 1000;
        if (state.new_protocol.time_unit === "seconds") this.x_axis_sample_length /= 1000;
        state.x_axis_scale = this.x_axis_sample_length;
      }
      if (mutation.type === "stimulation/handle_zoom_out" || mutation.type === "stimulation/handle_zoom_in") {
        this.x_axis_sample_length = state.x_axis_scale;
        this.y_min_max = state.y_axis_scale;
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
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
  overflow: hidden;
}
</style>
