<template>
  <Waveform
    :title="title"
    :tissue_data_points="d3_formatted_data_points.tissue"
    :stim_data_points="d3_formatted_data_points.stim"
    :fill_color_assignments="fill_color_assignments"
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
    Waveform
  },
  props: {
    samples_per_second: { type: Number, default: 1e6 },
    y_label: { type: String, default: null },
    x_label: { type: String, default: null },
    display_waveform_idx: { type: Number, default: 0 },
    tissue_line_color: { type: String, default: "#00c465" },
    margin: {
      type: Object,
      default: function() {
        return { top: 10, right: 20, bottom: 30, left: 60 };
      }
    },
    plot_area_pixel_height: {
      type: Number,
      default: 352
    },
    plot_area_pixel_width: {
      type: Number,
      default: 406
    },
    display_data_prior_to_current_timepoint: { type: Boolean, default: false } // for the Desktop application, data is only available prior to the current timepoint, so put x_time_index on the right edge of the graph instead of the left edge by setting this Bool to True
  },

  data: function() {
    return {
      d3_formatted_data_points: {
        tissue: [],
        stim: []
      },
      fill_colors: [],
      next_fill_color_idx: 0,
      fill_color_assignments: [],
      start_x_time_idx: [],
      stop_x_time_idx: []
    };
  },
  computed: {
    ...mapState("playback", {
      x_time_index: "x_time_index"
    }),
    ...mapState("twentyfourcontrols", {
      current_quadrant: "is_quadrant"
    }),
    ...mapState("data", {
      plate_waveforms: "plate_waveforms",
      stim_waveforms: "stim_waveforms"
    }),
    ...mapState("stimulation", {
      stim_fill_colors: "stim_fill_colors",
      stim_status: "stim_status"
    }),
    ...mapState("waveform", {
      x_zoom_levels: "x_zoom_levels",
      x_zoom_level_idx: "x_zoom_level_idx",
      y_axis_scale: "y_axis_scale",
      y_axis_range: "y_axis_range"
    }),

    x_axis_min: function() {
      if (this.display_data_prior_to_current_timepoint) {
        return this.x_time_index - this.x_axis_sample_length;
      } else {
        return this.x_time_index;
      }
    },

    title: function() {
      return twenty_four_well_plate_definition.get_well_name_from_well_index(
        this.current_quadrant[this.display_waveform_idx],
        true
      );
    },
    y_max: function() {
      // round to 2 decimals, based on https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
      const y_max_unrounded = this.y_axis_range.midpoint + this.y_axis_scale;
      const y_max = Math.round((y_max_unrounded + Number.EPSILON) * 100) / 100;
      return Math.min(y_max, 100000);
    },
    y_min: function() {
      const y_min_unrounded = this.y_axis_range.midpoint - this.y_axis_scale;
      const y_min = Math.round((y_min_unrounded + Number.EPSILON) * 100) / 100;
      return Math.max(y_min, -200);
    },
    x_axis_sample_length: function() {
      return this.x_zoom_levels[this.x_zoom_level_idx].x_scale;
    }
  },

  watch: {
    plate_waveforms() {
      this.calculate_data_to_plot("tissue");
    },
    stim_waveforms() {
      this.calculate_data_to_plot("stim");
    },
    current_quadrant() {
      this.calculate_all_data_to_plot();
    },
    x_time_index() {
      this.calculate_all_data_to_plot();
    },
    x_axis_sample_length() {
      this.calculate_all_data_to_plot();
    },
    stim_status() {
      this.stim_status
        ? this.start_x_time_idx.push(this.x_time_index)
        : this.stop_x_time_idx.push(this.x_time_index);
    }
  },

  mounted: function() {
    this.calculate_all_data_to_plot();
  },
  methods: {
    calculate_data_to_plot: async function(data_type) {
      const waveforms = data_type === "tissue" ? this.plate_waveforms : this.stim_waveforms;
      const data_for_this_waveform_in_vuex = waveforms[this.current_quadrant[this.display_waveform_idx]];
      if (
        data_for_this_waveform_in_vuex === undefined ||
        data_for_this_waveform_in_vuex.x_data_points.length == 0
      ) {
        this.d3_formatted_data_points[data_type] = [];
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
      this.d3_formatted_data_points[data_type] = local_data_points;
      if (data_type === "stim") await this.retrieve_stim_fill_colors();
    },

    retrieve_stim_fill_colors: function async() {
      const stim_data = this.d3_formatted_data_points.stim;
      const well_idx = this.current_quadrant[this.display_waveform_idx];
      const fill_colors = this.stim_fill_colors[well_idx];
      const idx_between_subprotocols = [];
      // Grab indexes of displayed stim data where it changes between subprotocols (y-coordinate = -201
      stim_data.map((sub, idx) => {
        if (sub[1] == -201) idx_between_subprotocols.push(idx);
      });

      // Remove old time (x) coordinates and any added added to beginning
      if (this.fill_color_assignments.length > 1) {
        const first_stim = stim_data[idx_between_subprotocols[0]][0];

        this.fill_color_assignments = this.fill_color_assignments.filter(assignment => {
          return !(first_stim > assignment.stim_data_array[0] || assignment.stim_data_array[1] != -201);
        });
      }

      // Iterate through new displayed stim data array and assign subprotocol colors
      idx_between_subprotocols.map((idx_val, idx) => {
        let next_idx;
        let sub_protocol_exists = false;
        const stim_stopped = this.stop_x_time_idx.some(coordinate => coordinate === stim_data[idx_val][0]);

        if (!stim_stopped) {
          // Get next index of start index of next sub protocol to slice to
          if (idx_between_subprotocols.length - 1 > idx) next_idx = idx_between_subprotocols[idx + 1];
          else {
            next_idx = stim_data.length;
          }

          this.fill_color_assignments.map(assignment => {
            // Reassign existing time (x) coordinate to new indices in displayed stim data
            if (JSON.stringify(assignment.stim_data_array) == JSON.stringify(stim_data[idx_val])) {
              assignment.idx_to_slice = [idx_val, next_idx];
              sub_protocol_exists = true;
            }
          });

          // If new time sub protocol is starting, create new color assignment and add to array
          if (!sub_protocol_exists) {
            const new_assignment = {
              fill_color: fill_colors[this.next_fill_color_idx],
              stim_data_array: [...stim_data[idx_val]],
              idx_to_slice: [idx_val, next_idx]
            };

            this.fill_color_assignments.push(new_assignment);

            // Increment color index
            if (this.next_fill_color_idx == fill_colors.length - 1) this.next_fill_color_idx = 0;
            else this.next_fill_color_idx += 1;
          }
        }
      });

      // Add in temporary fill assignment at beginning to handle the middle of a subprotocol at beginning
      if (idx_between_subprotocols.length > 0) {
        // check to see if previous block is in stopped mode
        const stim_stopped = this.start_x_time_idx.some(
          coordinate => coordinate == this.fill_color_assignments[0].stim_data_array[0]
        );

        if (!stim_stopped) {
          let previous_color_idx;
          const last_color_idx = fill_colors.indexOf(this.fill_color_assignments[0].fill_color);

          if (last_color_idx === 0) previous_color_idx = fill_colors.length - 1;
          else previous_color_idx = last_color_idx - 1;

          if (idx_between_subprotocols[0] !== 0) {
            const filler_assignment = {
              fill_color: fill_colors[previous_color_idx],
              stim_data_array: [...stim_data[0]],
              idx_to_slice: [0, idx_between_subprotocols[0]]
            };
            this.fill_color_assignments.unshift(filler_assignment);
          }
        }
      } else if (idx_between_subprotocols.length == 0 && this.stim_status) {
        // let previous_color_idx;
        const last_color_idx = fill_colors.indexOf(
          this.fill_color_assignments[this.fill_color_assignments.length - 1].fill_color
        );

        this.next_fill_color_idx = last_color_idx;

        if (this.next_fill_color_idx == fill_colors.length - 1) this.next_fill_color_idx = 0;
        else this.next_fill_color_idx += 1;

        const filler_assignment = {
          fill_color: fill_colors[last_color_idx],
          stim_data_array: [...stim_data[0]],
          idx_to_slice: [0, stim_data.length]
        };

        this.fill_color_assignments.unshift(filler_assignment);
      }
    },

    calculate_all_data_to_plot: function() {
      this.calculate_data_to_plot("tissue");
      this.calculate_data_to_plot("stim");
    }
  }
};
</script>
