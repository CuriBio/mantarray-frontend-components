<template>
  <div>
    <div
      class="div__simulationstudio-plate-well-location"
      :style="'top:' + computed_top + 'px;' + 'left:' + computed_left + 'px;'"
    >
      <PlateWell
        :classname="classname"
        :svg_height="svg_height"
        :svg_width="svg_width"
        :circle_x="circle_x"
        :circle_y="circle_y"
        :radius="radius"
        :strk="strk"
        :plate_fill="protocol_fill"
        :stroke_wdth="stroke_wdth"
        :index="index"
      ></PlateWell>
    </div>
    <span
      class="span__simulationstudio-plate-well-protocol-location"
      :style="
        'top:' +
        computed_protocol_top +
        'px;' +
        'left:' +
        computed_protocol_left +
        'px;'
      "
    >
      {{ protocol }}
    </span>
  </div>
</template>
<script>
import PlateWell from "@/components/playback/controls/PlateWell.vue";

export default {
  name: "StimulationStudioPlateWell",
  components: {
    PlateWell,
  },
  props: {
    classname: { type: String, default: "" },
    svg_height: { type: Number, default: 0 },
    svg_width: { type: Number, default: 0 },
    circle_x: { type: Number, default: 0 },
    circle_y: { type: Number, default: 0 },
    radius: { type: Number, default: 0 },
    strk: { type: String, default: "" },
    protocol_fill: { type: String, default: "" },
    stroke_wdth: { type: Number, default: 0 },
    index: { type: Number, default: 0 },
    protocol_type: { type: String, default: "" },
  },
  data() {
    return {
      protocol: this.protocol_type,
    };
  },
  computed: {
    /* 0 5  9 13 17 21     In order to speed the rendering its better to pre-compute
         1 6 10 14 18 22     top and left postions for the simulated well and center
         2 7 11 15 19 23
         3 8 12 16 20 24
      */
    computed_top: function () {
      return 25.427;
    },
    computed_left: function () {
      return 29.979;
    },
    computed_protocol_top: function () {
      return 43;
    },
    computed_protocol_left: function () {
      return 52.5;
    },
  },
};
</script>
<style>
.div__simulationstudio-plate-well-location {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  /*top: calc(119.427px - 94px);*/
  /*left: calc(767.479px - 737.5px);*/
  visibility: visible;
  z-index: 9;
}

.span__simulationstudio-plate-well-protocol-location {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 25px;
  height: 25px;
  /*top: calc(137px - 94px);*/
  /*left: calc(790px - 737.5px);*/
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: bold;
  font-style: normal;
  text-decoration: none;
  font-size: 20px;
  color: rgb(255, 255, 255);
  text-align: left;
  z-index: 101;
}
</style>
