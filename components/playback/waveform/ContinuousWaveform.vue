<template>
  <Waveform
    :title="title"
    :data_points="d3_formatted_data_points"
    :samples_per_second="samples_per_second"
    :x_axis_sample_length="x_axis_sample_length"
    :x_axis_min="x_axis_min"
    :y_min="y_min"
    :y_max="y_max"
    :y_axis_label="y_label"
    :x_axis_label="x_label"
    :line_color="line_color"
    :margin="margin"
    :plot_area_pixel_height="plot_area_pixel_height"
    :plot_area_pixel_width="plot_area_pixel_width"
  ></Waveform>
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
 * @vue-prop {String} line_color - A String to define the line color
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
    samples_per_second: { type: Number, default: 100000 },
    y_label: { type: String, default: null },
    x_label: { type: String, default: null },
    display_waveform_idx: { type: Number, default: 0 },
    line_color: { type: String, default: "#00c465" },
    margin: {
      type: Object,
      default: function () {
        return { top: 10, right: 20, bottom: 30, left: 60 };
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
    };
  },
  computed: {
    ...mapState("playback", {
      x_time_index: "x_time_index",
    }),
    ...mapState("twentyfourcontrols", {
      current_quadrant: "is_quadrant",
    }),
    ...mapState("waveform", {
      plate_waveforms: "plate_waveforms",
    }),
    ...mapState("waveform", {
      y_zoom_levels: "y_zoom_levels",
    }),
    ...mapState("waveform", {
      y_zoom_level_idx: "y_zoom_level_idx",
    }),
    ...mapState("waveform", {
      x_zoom_levels: "x_zoom_levels",
    }),
    ...mapState("waveform", {
      x_zoom_level_idx: "x_zoom_level_idx",
    }),

    x_axis_min: function () {
      if (this.display_data_prior_to_current_timepoint) {
        return this.x_time_index - this.x_axis_sample_length;
      } else {
        return this.x_time_index;
      }
    },

    title: function () {
      return twenty_four_well_plate_definition.get_well_name_from_well_index(
        this.current_quadrant[this.display_waveform_idx],
        true
      );
    },
    y_min: function () {
      return this.y_zoom_levels[this.y_zoom_level_idx].y_min;
    },
    y_max: function () {
      return this.y_zoom_levels[this.y_zoom_level_idx].y_max;
    },
    x_axis_sample_length: function () {
      return this.x_zoom_levels[this.x_zoom_level_idx].x_scale;
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
    calculate_data_to_plot: function () {
      const data_for_this_waveform_in_vuex = this.plate_waveforms[
        this.current_quadrant[this.display_waveform_idx]
      ];
      if (
        data_for_this_waveform_in_vuex === undefined ||
        data_for_this_waveform_in_vuex.x_data_points.length == 0
      ) {
        this.d3_formatted_data_points = [];
        return;
      }
      let local_data_points = [];
      let local_x_min_value = this.x_time_index;
      if (this.display_data_prior_to_current_timepoint) {
        local_x_min_value -= this.x_axis_sample_length;
      }
      local_data_points = data_for_this_waveform_in_vuex;
      local_data_points = get_array_slice_to_display(
        local_data_points.x_data_points,
        local_data_points.y_data_points,
        local_x_min_value,
        this.x_axis_sample_length
      );
      this.d3_formatted_data_points = local_data_points;
    },
  },
};
</script>
