<template>
  <div class="div__waveform">
    <div class="div__waveform-well-title">
      <span>{{ title }}</span>
    </div>
    <div class="div__waveform-graph" :style="div__waveform_graph__dynamic_style"></div>
    <div class="div__waveform-y-axis-title">
      <span> {{ y_axis_label }}</span>
    </div>

    <div class="div__waveform-x-axis-title">
      <span> {{ x_axis_label }}</span>
    </div>
  </div>
</template>
<script>
import { axisBottom, axisLeft, line as d3_line, select as d3_select, scaleLinear } from "d3";
/**
 * @vue-prop {String} title - Current title of the waveform
 * @vue-prop {Int} samples_per_second - Current samples per second
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
  name: "Waveform",
  components: {},
  props: {
    title: { type: String, required: true },
    samples_per_second: { type: Number, default: 100000 },
    x_axis_sample_length: { type: Number, default: 100000 },
    x_axis_min: { type: Number, default: 0 },
    y_min: { type: Number, default: 0 },
    y_max: { type: Number, default: 400 },
    y_axis_label: { type: String, default: "Absolute Force (μN)" },
    x_axis_label: { type: String, default: "Time (seconds)" },
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

    // Draw black rectangles over the margins so that any excess waveform line is not visible to user

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
        .domain([
          this.x_axis_min / this.samples_per_second,
          (this.x_axis_min + this.x_axis_sample_length) / this.samples_per_second,
        ])
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
      this.y_axis_node.call(axisLeft(this.y_axis_scale));
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
              return x_axis_scale(d[0] / 100000);
            })
            .y(function (d) {
              return y_axis_scale(d[1]);
            })
        );
    },
  },
};
</script>

<style type="text/css">
.div__waveform *,
.div__waveform *:before,
.div__waveform *:after {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.div__waveform {
  width: 521px;
  height: 419px;
  background: #000000;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 0;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

.div__waveform-well-title *,
.div__waveform-well-title *:before,
.div__waveform-well-title *:after {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.div__waveform-well-title {
  white-space: nowrap;
  word-wrap: break-word;
  font-weight: bold;
  font-family: Muli;
  font-style: normal;
  text-decoration: none;
  font-size: 18px;
  color: rgb(255, 255, 255);
  text-align: left;
  user-select: none;
  position: absolute;
  width: 51px;
  height: 32px;
  top: 0px;
  left: 5px;
  z-index: 99;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

.div__waveform-y-axis-title *,
.div__waveform-y-axis-title *:before,
.div__waveform-y-axis-title *:after {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.div__waveform-y-axis-title {
  line-height: 1;
  transform: rotate(270deg);
  padding: 5px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(255, 255, 255);
  font-family: Muli;
  font-weight: bold;
  position: absolute;
  top: 214px;
  left: -170px;
  width: 379px;
  height: 28px;
  overflow: hidden;
  user-select: none;
  text-align: center;
  font-size: 16px;
  letter-spacing: normal;
  z-index: 99;
  pointer-events: all;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

.div__waveform-x-axis-title *,
.div__waveform-x-axis-title *:before,
.div__waveform-x-axis-title *:after {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.div__waveform-x-axis-title {
  line-height: 1;
  padding: 5px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(255, 255, 255);
  font-family: Muli;
  font-weight: bold;
  position: absolute;
  top: 395px;
  left: 69px;
  width: 430px;
  height: 29px;
  overflow: hidden;
  user-select: none;
  text-align: center;
  font-size: 16px;
  letter-spacing: normal;
  z-index: 99;
  pointer-events: all;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

.div__waveform-graph *,
.div__waveform-graph *:before,
.div__waveform-graph *:after {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.div__waveform-graph {
  overflow: hidden;
  user-select: none;
  position: absolute;
  height: 400px;
  top: 18px;
  left: 14px;
  z-index: 1;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}

.g__waveform-x-axis {
  stroke: #b7b7b7;
  font-family: Muli;
  font-size: 13px;
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
