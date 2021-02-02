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
    /*   0 4  8 12 16 20     In order to speed the rendering its better to pre-compute
         1 5  9 13 17 21     top and left postions for the simulated well and center
         2 6 10 14 18 22
         3 7 11 15 19 23
      */
    computed_top: function () {
      switch (this.index) {
        case 0:
        case 4:
        case 8:
        case 12:
        case 16:
        case 20:
          return 25.427;
        case 1:
        case 5:
        case 9:
        case 13:
        case 17:
        case 21:
          return 85.352;
        case 2:
        case 6:
        case 10:
        case 14:
        case 18:
        case 22:
          return 145.278;
        case 3:
        case 7:
        case 11:
        case 15:
        case 19:
        case 23:
          return 205.157;
      }
      return 0;
    },
    computed_left: function () {
      switch (this.index) {
        case 0:
        case 1:
        case 2:
        case 3:
          return 29.979;
        case 4:
        case 5:
        case 6:
        case 7:
          return 91.584;
        case 8:
        case 9:
        case 10:
        case 11:
          return 153.188;
        case 12:
        case 13:
        case 14:
        case 15:
          return 214.792;
        case 16:
        case 17:
        case 18:
        case 19:
          return 276.4;
        case 20:
        case 21:
        case 22:
        case 23:
          return 339;
      }
      return 0;
    },
    computed_protocol_top: function () {
      switch (this.index) {
        case 0:
        case 4:
        case 8:
        case 12:
        case 16:
        case 20:
          return 43;
        case 1:
        case 5:
        case 9:
        case 13:
        case 17:
        case 21:
          return 102.925;
        case 2:
        case 6:
        case 10:
        case 14:
        case 18:
        case 22:
          return 162.851;
        case 3:
        case 7:
        case 11:
        case 15:
        case 19:
        case 23:
          return 222.73;
      }
      return 0;
    },
    computed_protocol_left: function () {
      switch (this.index) {
        case 0:
        case 1:
        case 2:
        case 3:
          return 52.5;
        case 4:
        case 5:
        case 6:
        case 7:
          return 114.105;
        case 8:
        case 9:
        case 10:
        case 11:
          return 175.709;
        case 12:
        case 13:
        case 14:
        case 15:
          return 237.313;
        case 16:
        case 17:
        case 18:
        case 19:
          return 298.921;
        case 20:
        case 21:
        case 22:
        case 23:
          return 361.521;
      }
      return 0;
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
