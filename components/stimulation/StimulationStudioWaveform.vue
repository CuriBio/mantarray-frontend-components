<template>
  <div class="div__waveform">
    <div class="div__waveform-graph" :style="div__waveform_graph__dynamic_style"></div>
    <div class="div__waveform-y-axis-title">
      <StimulationStudioZoomControls :axis="'y-axis'" />
      <span>{{ y_axis_label }}</span>
    </div>

    <div class="div__waveform-x-axis-title">
      <span :style="'padding-right: 35px;'">{{ x_axis_label }}</span>
      <StimulationStudioZoomControls :axis="'x-axis'" />
    </div>
  </div>
</template>
<script>
import { axisBottom, axisLeft, line as d3_line, select as d3_select, scaleLinear } from "d3";
import StimulationStudioZoomControls from "@/components/stimulation/StimulationStudioZoomControls.vue";
/**
 * @vue-prop {String} title - Current title of the waveform
 * @vue-prop {Int} x_axis_sample_length - Current X Axis sample length
 * @vue-prop {Int} x_axis_min - Current position on X Axis
 * @vue-prop {Int} y_min - Current Minimum scale position on Y Axis
 * @vue-prop {Int} y_max - Current Maximum scale position on Y Axis
 * @vue-prop {String} y_axis_label - Current Y Axis Label String value.
 * @vue-prop {String} x_axis_label - Current X Axis Label String value.
 * @vue-prop {Object} data_points  - Currently contains the array of 2D waveform data points[[x1,y1],[x2,y2]...]
 * @vue-prop {String} line_color   - Color of the line graph
 * @vue-prop {Object} margin       - An Object which determines a closing boundry margin
 * @vue-prop {Int} plot_area_pixel_height - Graph height definition
 * @vue-prop {Int} plot_area_pixel_width  - Graph widht definition
 * @vue-data {Object} the_svg             - An Object which is used to create SVG element via D3 library
 * @vue-data {Object} x_axis_node         - An Object which is used to create X Axis node
 * @vue-data {Object} x_axis_scale        - An Object which is used to process the X Axis scale
 * @vue-data {Object} y_axis_node         - An Object which is used to create Y Axis node
 * @vue-data {Object} y_axis_scale        - An Object which is used to process the Y Axis scale
 * @vue-data {Object} waveform_line_node  - An Object which is used to plot the line graph
 * @vue-data {Object} div__waveform_graph__dynamic_style - An CSS property to hold the dynamic value
 * @vue-event {Event} x_axis_min           - A Function  is invoked when x_axis_min prop is modified
 * @vue-event {Event} x_axis_sample_length - A Function  is invoked when x_axis_sample_length prop is modified
 * @vue-event {Event} y_min                - A Function  is invoked when y_min prop is modified
 * @vue-event {Event} y_max                - A Function  is invoked when y_max prop is modified
 * @vue-event {Event} data_points          - A Function  is invoked when data_points prop is modified
 * @vue-event {Event} render_plot          - An Important function which plots the waveform svg in realtime.
 */
export default {
  name: "StimulationStudioWaveform",
  components: { StimulationStudioZoomControls },
  props: {
    title: { type: String, default: "" },
    x_axis_sample_length: { type: Number, default: 100 },
    x_axis_min: { type: Number, default: 0 },
    y_min: { type: Number, default: 0 },
    y_max: { type: Number, default: 400 },
    y_axis_label: { type: String, default: "Voltage (V)" },
    x_axis_label: { type: String, default: "Time (s)" },
    data_points: {
      type: Array, // exactly the format D3 accepts: 2D array of [[x1,y1],[x2,y2],...]
      default: function () {
        return [];
      },
    },
    line_color: { type: String, default: "#00c465" },
    margin: {
      type: Object,
      default: function () {
        return { top: 10, right: 20, bottom: 20, left: 60 };
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
    repeat_colors: {
      type: Object,
      default: function () {
        return {};
      },
    },
    delay_blocks: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data: function () {
    return {
      the_svg: null,
      x_axis_node: null,
      x_axis_scale: null,
      y_axis_node: null,
      y_axis_scale: null,
      waveform_line_node: null,
      div__waveform_graph__dynamic_style: {
        width: this.plot_area_pixel_width + this.margin.left + this.margin.right + "px",
      },
      frequency_of_ticks: 5,
    };
  },
  watch: {
    x_axis_min() {
      this.render_plot();
    },
    x_axis_sample_length() {
      this.render_plot();
    },
    y_min() {
      this.render_plot();
    },
    y_max() {
      this.render_plot();
    },
    data_points() {
      this.render_plot();
    },
  },
  mounted: function () {
    // Eli (2/2/2020): having the svg be appended in the `data` function didn't work, so moved it to here
    let the_svg = this.the_svg;
    the_svg = d3_select(this.$el)
      .select(".div__waveform-graph")
      .append("svg")
      .attr("width", this.plot_area_pixel_width + this.margin.left + this.margin.right)
      .attr("height", this.plot_area_pixel_height + this.margin.top + this.margin.bottom)
      .attr("style", "background-color: black;")
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
      .attr("id", "svg_of_waveform")
      .attr("font-family", "Muli");

    this.waveform_line_node = the_svg
      .append("g")
      .attr("id", "waveform_line_node")
      .attr("class", "waveform_path_node");

    this.line = the_svg.append("g").attr("x", 40);
    // Draw black rectangles over the margins so that any excess waveform line is not visible to use
    const blocker_color = "#000000";
    const margin_blockers_node = the_svg.append("g").attr("id", "margin_blockers_node");

    const margin = this.margin;

    // Left Side
    margin_blockers_node
      .append("rect")
      .attr("id", "margin_blocker_left")
      .attr("x", -margin.left)
      .attr("y", -margin.top)
      .attr("width", margin.left)
      .attr("height", this.plot_area_pixel_height + margin.top + margin.bottom)
      .attr("fill", blocker_color);
    // Right Side
    margin_blockers_node
      .append("rect")
      .attr("id", "margin_blocker_right")
      .attr("x", this.plot_area_pixel_width + 1)
      .attr("y", -margin.top)
      .attr("width", margin.right)
      .attr("height", this.plot_area_pixel_height + margin.top + margin.bottom)
      .attr("fill", blocker_color);
    // Top
    margin_blockers_node
      .append("rect")
      .attr("id", "margin_blocker_top")
      .attr("x", 0)
      .attr("y", -margin.top)
      .attr("width", this.plot_area_pixel_width + 1)
      .attr("height", margin.top)
      .attr("fill", blocker_color);

    // Bottom
    margin_blockers_node
      .append("rect")
      .attr("id", "margin_blocker_bottom")
      .attr("x", 0)
      .attr("y", this.plot_area_pixel_height)
      .attr("width", this.plot_area_pixel_width + 1)
      .attr("height", margin.bottom)
      .attr("fill", blocker_color);

    this.x_axis_node = the_svg
      .append("g")
      .attr("transform", "translate(0," + this.plot_area_pixel_height + ")")
      .attr("id", "x_axis_node")
      .attr("stroke", "#b7b7b7")
      .attr("class", "g__waveform-x-axis");

    this.y_axis_node = the_svg
      .append("g")
      .attr("id", "y_axis_node")
      .attr("stroke", "#b7b7b7")
      .attr("class", "g__waveform-y-axis");

    this.render_plot();
  },
  methods: {
    render_plot: function () {
      this.create_x_axis_scale();
      this.create_y_axis_scale();

      this.display_x_axis();
      this.display_y_axis();
      this.plot_data();
    },

    create_x_axis_scale: function () {
      this.x_axis_scale = scaleLinear()
        .domain([this.x_axis_min, this.x_axis_min + this.x_axis_sample_length])
        .range([0, this.plot_area_pixel_width]);
    },
    create_y_axis_scale: function () {
      this.y_axis_scale = scaleLinear()
        .domain([this.y_min, this.y_max])
        .range([this.plot_area_pixel_height, 0]);
    },
    display_x_axis: function () {
      this.x_axis_node.call(axisBottom(this.x_axis_scale));
    },
    display_y_axis: function () {
      this.y_axis_node.call(axisLeft(this.y_axis_scale).ticks(this.frequency_of_ticks));
    },
    plot_data: function () {
      const data_to_plot = this.data_points;

      const x_axis_scale = this.x_axis_scale;
      const y_axis_scale = this.y_axis_scale;

      this.waveform_line_node.selectAll("*").remove();
      this.waveform_line_node
        .append("path")
        .datum(data_to_plot)
        .attr("fill", "none")
        .attr("stroke", this.line_color)
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3_line()
            .x(function (d) {
              return x_axis_scale(d[0]);
            })
            .y(function (d) {
              return y_axis_scale(d[1]);
            })
        );
      for (const color in this.repeat_colors) {
        if (this.repeat_colors !== {}) {
          // repetitive, but eslint errors without a conditional inside the loop
          const starting_idx = this.repeat_colors[color][0];
          const ending_idx = this.repeat_colors[color][1];
          const sliced_data_array = data_to_plot.slice(starting_idx, ending_idx);

          this.waveform_line_node
            .append("path")
            .datum(sliced_data_array)
            .attr("fill", "none")
            .attr("stroke", "#" + color)
            .attr("stroke-width", 1.5)
            .attr(
              "d",
              d3_line()
                .x(function (d) {
                  return x_axis_scale(d[0]);
                })
                .y(function (d) {
                  return y_axis_scale(d[1]);
                })
            );
        }
      }
      for (const block of this.delay_blocks) {
        // repetitive, but eslint errors without a conditional inside the loop
        if (this.delay_blocks.length !== 0 && !isNaN(block[1])) {
          const starting_idx = block[0];
          const start_line = [
            [starting_idx, this.y_min],
            [starting_idx, this.y_max],
          ];
          const ending_idx = block[1];
          const end_line = [
            [ending_idx, this.y_min],
            [ending_idx, this.y_max],
          ];

          this.waveform_line_node
            .append("path")
            .datum(start_line)
            .attr("fill", "none")
            .attr("stroke", "#ffffff")
            .attr("stroke-dasharray", "2,2")
            .attr(
              "d",
              d3_line()
                .x(function (d) {
                  return x_axis_scale(d[0]);
                })
                .y(function (d) {
                  return y_axis_scale(d[1]);
                })
            );
          this.waveform_line_node
            .append("path")
            .datum(end_line)
            .attr("fill", "none")
            .attr("stroke", "#ffffff")
            .attr("stroke-dasharray", "2,2")
            .attr(
              "d",
              d3_line()
                .x(function (d) {
                  return x_axis_scale(d[0]);
                })
                .y(function (d) {
                  return y_axis_scale(d[1]);
                })
            );
        }
      }
    },
  },
};
</script>

<style scoped>
.div__waveform {
  width: 100%;
  height: 244px;
  background: #000000;
  position: relative;
  top: 0px;
  left: 0px;
  z-index: 0;
  box-sizing: content-box;
  overflow: hidden;
  overflow-x: scroll;
}
.div__waveform-y-axis-title {
  line-height: 1;
  transform: rotate(270deg);
  padding: 5px;
  margin: 0px;
  overflow-wrap: break-word;
  color: #b7b7b7;
  font-family: Muli;
  font-weight: bold;
  position: absolute;
  top: 110px;
  left: -170px;
  width: 379px;
  height: 28px;
  overflow: hidden;
  user-select: none;
  text-align: center;
  font-size: 14px;
  letter-spacing: normal;
  z-index: 99;
  pointer-events: all;
  box-sizing: content-box;
}
.div__waveform-x-axis-title {
  line-height: 1;
  padding: 5px;
  margin: 0px;
  overflow-wrap: break-word;
  color: #b7b7b7;
  font-family: Muli;
  font-weight: bold;
  position: sticky;
  top: 220px;
  left: 325px;
  width: 430px;
  height: 29px;
  overflow: hidden;
  user-select: none;
  text-align: center;
  font-size: 14px;
  letter-spacing: normal;
  z-index: 99;
  pointer-events: all;
  box-sizing: content-box;
}
.div__waveform-graph {
  overflow: hidden;
  user-select: none;
  position: absolute;
  height: 200px;
  top: 15px;
  left: 14px;
  z-index: 1;
  font-family: Muli;
}
.g__waveform-x-axis {
  stroke: #b7b7b7;
  font-family: Muli;
}
.g__waveform-x-axis path {
  stroke: #b7b7b7;
}
.g__waveform-x-axis .tick line {
  stroke: #b7b7b7;
}
.g__waveform-y-axis {
  stroke: #b7b7b7;
  font-family: Muli;
  font-size: 13px;
}
.g__waveform-y-axis path {
  stroke: #b7b7b7;
}
.g__waveform-y-axis .tick line {
  stroke: #b7b7b7;
}
</style>
