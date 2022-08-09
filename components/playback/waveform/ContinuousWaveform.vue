<template>
  <Waveform
    :title="title"
    :tissue_data_points="d3_formatted_data_points"
    :samples_per_second="samples_per_second"
    :x_axis_sample_length="x_axis_sample_length"
    :x_axis_min="x_axis_min"
    :y_min="y_min"
    :y_max="y_max"
    :y_axis_label="y_label"
    :x_axis_label="x_label"
    :tissue_line_color="tissue_line_color"
    :margin="margin"
    :plot_area_pixel_height="plot_area_pixel_height"
    :plot_area_pixel_width="plot_area_pixel_width"
    :stim_fill_assignments="fill_assignments"
    :stim_fill_colors="fill_colors"
  />
</template>
<script>
import { get_array_slice_to_display } from "@/js_utils/waveform_data_formatter.js";
import { mapState } from "vuex";
import Waveform from "@/components/playback/waveform/Waveform.vue";
import { WellTitle as LabwareDefinition } from "@/js_utils/labware_calculations.js";
const twenty_four_well_plate_definition = new LabwareDefinition(4, 6);

/**
 * @vue-prop {Int} samples_per_second - A parameter to define number of Samples per second.
 * @vue-prop {String} y_label  - A String to define the Y-Axis label text
 * @vue-prop {String} x_label  - A String to define the X-Axis label text
 * @vue-prop {Int} display_waveform_idx - An index number to the waveform
 * @vue-prop {String} tissue_line_color - A String to define the tissue line color
 * @vue-prop {Object} margin - - An Object which determines a closing boundry margin
 * @vue-prop {Int} plot_area_pixel_height - Graph height definition
 * @vue-prop {Int} plot_area_pixel_width  - Graph widht definition
 * @vue-prop {Boolean} display_data_prior_to_current_timepoint - A Boolean value to define to zoom in prior to time point for DesktopPlayer
 * @vue-computed {Int} x_time_index - A Time index present in the Vuex store.
 * @vue-computed {Array} current_quadrant - An Array that contains the indeces of the present six waveforms
 * @vue-computed {Object} plate_waveforms - An Object which contains the data of twentyfour waveforms.
 * @vue-computed {Array} y_zoom_levels - An Array of range of Y Axis Zoom levels
 * @vue-computed {Int} y_zoom_level_idx - A value which identifies the present Y Axis Zoom level.
 * @vue-computed {Array} x_zoom_levels - An Array of X Axis Zoom levels
 * @vue-computed {Int} x_zoom_level_idx - A value which identifies the present X Axis Zoom level.
 * @vue-event {Event} plate_waveforms - A function that would be invoked when plateforms are modified.
 * @vue-event {Event} current_quadrant - A function that would be invoked when focus of quadrant is modified.
 * @vue-event {Event} x_time_index - A function that would be invoked when time index is updated.
 * @vue-event {Event} x_axis_sample_length - A function that gets invoked if samples on X Axis is updated.
 */
export default {
  name: "ContinuousWaveform",
  components: {
    Waveform,
  },
  props: {
    samples_per_second: { type: Number, default: 1e6 },
    y_label: { type: String, default: null },
    x_label: { type: String, default: null },
    display_waveform_idx: { type: Number, default: 0 },
    tissue_line_color: { type: String, default: "#00c465" },
    margin: {
      type: Object,
      default: function () {
        return { top: 0, right: 20, bottom: 30, left: 60 };
      },
    },
    plot_area_pixel_height: {
      type: Number,
      default: 352,
    },
    plot_area_pixel_width: {
      type: Number,
      default: 406,
    },
    display_data_prior_to_current_timepoint: { type: Boolean, default: false }, // for the Desktop application, data is only available prior to the current timepoint, so put x_time_index on the right edge of the graph instead of the left edge by setting this Bool to True
  },

  data: function () {
    return {
      d3_formatted_data_points: [],
      fill_assignments: [],
    };
  },
  computed: {
    ...mapState("playback", ["x_time_index"]),
    ...mapState("twentyfourcontrols", { current_quadrant: "is_quadrant" }),
    ...mapState("data", ["plate_waveforms", "stim_fill_assignments", "stim_fill_colors"]),
    ...mapState("waveform", ["x_zoom_levels", "x_zoom_level_idx", "y_axis_scale", "y_axis_range"]),
    well_idx: function () {
      return this.current_quadrant[this.display_waveform_idx];
    },
    x_axis_min: function () {
      if (this.display_data_prior_to_current_timepoint) {
        return this.x_time_index - this.x_axis_sample_length;
      } else {
        return this.x_time_index;
      }
    },
    title: function () {
      return twenty_four_well_plate_definition.get_well_name_from_well_index(this.well_idx, true);
    },
    y_max: function () {
      // round to 2 decimals, based on https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
      const y_max_unrounded = this.y_axis_range.midpoint + this.y_axis_scale;
      const y_max = Math.round((y_max_unrounded + Number.EPSILON) * 100) / 100;
      return Math.min(y_max, 100000);
    },
    y_min: function () {
      const y_min_unrounded = this.y_axis_range.midpoint - this.y_axis_scale;
      const y_min = Math.round((y_min_unrounded + Number.EPSILON) * 100) / 100;
      return Math.max(y_min, -200);
    },
    x_axis_sample_length: function () {
      return this.x_zoom_levels[this.x_zoom_level_idx].x_scale;
    },
    fill_colors: function () {
      const str_idx = this.well_idx.toString();
      return this.stim_fill_colors[str_idx];
    },
  },
  watch: {
    plate_waveforms() {
      this.calculate_data_to_plot();
    },
    current_quadrant() {
      this.calculate_data_to_plot();
    },
    x_time_index() {
      this.calculate_data_to_plot();
    },
    x_axis_sample_length() {
      this.calculate_data_to_plot();
    },
  },
  mounted: function () {
    this.calculate_data_to_plot();
  },
  methods: {
    calculate_data_to_plot: async function () {
      const stim_data = this.stim_fill_assignments[this.well_idx];
      const data_for_this_waveform_in_vuex = this.plate_waveforms[this.well_idx];
      const { x_data_points, y_data_points } = data_for_this_waveform_in_vuex;

      // render the least amount of datapoints
      this.d3_formatted_data_points =
        data_for_this_waveform_in_vuex === undefined || x_data_points.length == 0
          ? []
          : get_array_slice_to_display(
              x_data_points,
              y_data_points,
              this.x_axis_min,
              this.x_axis_sample_length
            );

      this.fill_assignments = stim_data;
    },
  },
};
</script>
