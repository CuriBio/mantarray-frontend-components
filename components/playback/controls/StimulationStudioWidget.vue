<template>
  <div>
    <!-- original mockflow ID: id="cmpD1d83165d7321a67ce408a4ab3362bc9e" -->
    <div class="div__simulationstudio-backdrop"></div>
    <!-- original mockflow ID: id="cmpDab1a64dec495767a5b74b08ff7a4e5b9" -->
    <div class="div__simulationstudio-plus-icon-container">
      <!-- original mockflow ID: id="cmpDab1a64dec495767a5b74b08ff7a4e5b9_txt" -->
      <span class="span__simulationstudio-plus-icon">
        <FontAwesomeIcon :icon="['fa', 'plus-circle']" />
      </span>
    </div>
    <!-- original mockflow ID: id="cmpD34abec77f7037c34fbf133456d60d15f" -->
    <span class="span__simulationstudio-column-one-label"> 01</span>
    <!-- original mockflow ID: id="cmpD98be435858e9366d82cf010fe27cf35f" -->
    <span class="span__simulationstudio-column-two-label"> 02</span>
    <!-- original mockflow ID: id="cmpD43568dfde594b3e69cdc542f3e91f340" -->
    <span class="span__simulationstudio-column-three-label"> 03</span>
    <!-- original mockflow ID: id="cmpDd05caaf37656caa225ece4ecdea766a7" -->
    <span class="span__simulationstudio-column-four-label"> 04</span>
    <!-- original mockflow ID: id="cmpD48f3c66865ccb64fdc16e2df94b32a43" -->
    <span class="span__simulationstudio-column-five-label"> 05</span>
    <!-- original mockflow ID: id="cmpDd18479bab00e9bb3528b0474607745c0" -->
    <span class="span__simulationstudio-column-six-label"> 06</span>
    <!-- original mockflow ID: id="cmpD74431fd91f87701e70b59d56d8606e5d" -->
    <span class="span__simulationstudio-row-A-label">A</span>
    <!-- original mockflow ID: id="cmpD33f4ac4298e177bacb902754385028f3" -->
    <span class="span__simulationstudio-row-B-label">B</span>
    <!-- original mockflow ID: id="cmpD43b75d3f4a36b0673c38d4652a2bf4db" -->
    <span class="span__simulationstudio-row-C-label">C</span>
    <!-- original mockflow ID: id="cmpD98faa95f3101aa71b43be46356df0458" -->
    <span class="span__simulationstudio-row-D-label">D</span>
    <StimulationStudioPlateWell
      v-for="well_index in Array(24).keys()"
      :key="well_index"
      :classname="'plate_' + well_index"
      :protocol_type="''"
      :svg_height="72"
      :svg_width="72"
      :circle_x="36"
      :circle_y="36"
      :radius="28"
      :strk="'#1C1C1C'"
      :protocol_fill="'#B7B7B7'"
      :stroke_wdth="0"
      :index="well_index"
    ></StimulationStudioPlateWell>
  </div>
</template>
<script>
import StimulationStudioPlateWell from "@/components/playback/controls/StimulationStudioPlateWell.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faPlusCircle);

export default {
  name: "StimulationStudioWidget",
  components: { FontAwesomeIcon, StimulationStudioPlateWell },
  props: {},
  data: function () {
    return {};
  },
  methods: {},
};
</script>
<style>
.div__simulationstudio-backdrop {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(28, 28, 28);
  position: absolute;
  width: 415px;
  height: 280px;
  top: calc(94px - 94px);
  left: calc(737.5px - 737.5px);
  visibility: visible;
  border: 0px none rgb(0, 0, 0);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px 0px;
  z-index: 7;
  pointer-events: all;
}
.div__simulationstudio-plus-icon-container {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 30px;
  height: 30px;
  top: calc(97.5px - 94px);
  left: calc(743.5px - 737.5px);
  visibility: visible;
  z-index: 96;
}

.span__simulationstudio-plus-icon {
  overflow: hidden;
  white-space: nowrap;
  text-align: center;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 20px;
  height: 20px;
  line-height: 20px;
  top: 5px;
  left: 5px;
  font-size: 20px;
  color: rgb(183, 183, 183);
}

.span__simulationstudio-column-one-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 53px;
  height: 27px;
  top: calc(96px - 94px);
  left: calc(773.479px - 737.5px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: center;
  z-index: 63;
}

.span__simulationstudio-column-two-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 53px;
  height: 27px;
  top: calc(96px - 94px);
  left: calc(835.084px -737.5px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: center;
  z-index: 65;
}

.span__simulationstudio-column-three-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 53px;
  height: 27px;
  top: calc(96px - 94px);
  left: calc(896.688px - 737.5px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: center;
  z-index: 67;
}

.span__simulationstudio-column-four-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 53px;
  height: 27px;
  top: calc(96px - 94px);
  left: calc(958.292px - 737.5px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: center;
  z-index: 69;
}

.span__simulationstudio-column-five-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 53px;
  height: 27px;
  top: calc(96px - 94px);
  left: calc(1019.9px - 737.5px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: center;
  z-index: 71;
}

.span__simulationstudio-column-six-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 53px;
  height: 27px;
  top: calc(96px - 94px);
  left: calc(1081.5px - 737.5px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: center;
  z-index: 73;
}

.span__simulationstudio-row-A-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 22px;
  height: 25px;
  top: calc(135.928px - 94px);
  left: calc(744.5px - 737.5px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: left;
  z-index: 57;
}

.span__simulationstudio-row-B-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 22px;
  height: 25px;
  top: calc(197.621px - 94px);
  left: calc(744.5px - 737.5px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: left;
  z-index: 55;
}

.span__simulationstudio-row-C-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 22px;
  height: 25px;
  top: calc(259.779px - 94px);
  left: calc(744.5px - 737.5px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: left;
  z-index: 61;
}

.span__simulationstudio-row-D-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 22px;
  height: 25px;
  top: calc(318.1px - 94px);
  left: calc(744.5px - 737.5px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: left;
  z-index: 59;
}

.div__simulationstudio-plate-well-location-zero {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(119.427px - 94px);
  left: calc(767.479px - 737.5px);
  visibility: visible;
  z-index: 9;
}

.span__simulationstudio-plate-well-location-zero-protocol-value {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 25px;
  height: 25px;
  top: calc(137px - 94px);
  left: calc(790px - 737.5px);
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

.div__simulationstudio-plate-well-location-one {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(119.427px - 94px);
  left: calc(829.084px - 737.5px);
  visibility: visible;
  z-index: 11;
}

.span__simulationstudio-plate-well-location-one-protocol-value {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 25px;
  height: 25px;
  top: calc(137px - 94px);
  left: calc(852px - 737.5px);
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
  z-index: 103;
}

.div__simulationstudio-plate-well-location-two {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(119.427px - 94px);
  left: calc(890.688px -737.5px);
  visibility: visible;
  z-index: 13;
}

.span__simulationstudio-plate-well-location-two-protocol-value {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 25px;
  height: 25px;
  top: calc(137px - 94px);
  left: calc(914px - 737.5px);
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
  z-index: 105;
}

.div__simulationstudio-plate-well-location-three {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(119.427px - 94px);
  left: calc(952.292px - 737.5px);
  visibility: visible;
  z-index: 15;
}

.div__simulationstudio-plate-well-location-four {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(119.427px - 94px);
  left: calc(1013.9px - 737.5px);
  visibility: visible;
  z-index: 17;
}

.div__simulationstudio-plate-well-location-five {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 64px;
  height: 64px;
  top: calc(119.992px - 94px);
  left: calc(1076.5px - 737.5px);
  visibility: visible;
  z-index: 87;
}

.div__simulationstudio-plate-well-location-six {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(179.352px - 94px);
  left: calc(767.479px - 737.5px);
  visibility: visible;
  z-index: 19;
}

.div__simulationstudio-plate-well-location-seven {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(179.352px - 94px);
  left: calc(829.084px - 737.5px);
  visibility: visible;
  z-index: 21;
}

.div__simulationstudio-plate-well-location-eight {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(179.352px - 94px);
  left: calc(890.688px - 737.5px);
  visibility: visible;
  z-index: 23;
}

.div__simulationstudio-plate-well-location-nine {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(179.352px - 94px);
  left: calc(952.292px - 737.5px);
  visibility: visible;
  z-index: 25;
}

.div__simulationstudio-plate-well-location-ten {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(179.352px - 94px);
  left: calc(1013.9px - 737.5px);
  visibility: visible;
  z-index: 27;
}

.div__simulationstudio-plate-well-location-eleven {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(179.352px - 94px);
  left: calc(1075.5px - 737.5px);
  visibility: visible;
  z-index: 29;
}

.div__simulationstudio-plate-well-location-twelve {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(239.278px - 94px);
  left: calc(767.479px - 737.5px);
  visibility: visible;
  z-index: 31;
}

.div__simulationstudio-plate-well-location-thirteen {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(239.278px - 94px);
  left: calc(829.084px - 737.5px);
  visibility: visible;
  z-index: 33;
}

.div__simulationstudio-plate-well-location-fourteen {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(239.278px - 94px);
  left: calc(890.688px - 737.5px);
  visibility: visible;
  z-index: 35;
}

.div__simulationstudio-plate-well-location-fifteen {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(239.278px - 94px);
  left: calc(952.292px - 737.5px);
  visibility: visible;
  z-index: 37;
}

.div__simulationstudio-plate-well-location-sixteen {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(239.278px - 94px);
  left: calc(1013.9px - 737.5px);
  visibility: visible;
  z-index: 39;
}

.div__simulationstudio-plate-well-location-seventeen {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(239.278px - 94px);
  left: calc(1075.5px - 737.5px);
  visibility: visible;
  z-index: 41;
}

.div__simulationstudio-plate-well-location-eighteen {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(299.157px - 94px);
  left: calc(767.479px - 737.5px);
  visibility: visible;
  z-index: 43;
}

.div__simulationstudio-plate-well-location-nineteen {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(299.203px - 94px);
  left: calc(829.084px - 737.5px);
  visibility: visible;
  z-index: 45;
}

.div__simulationstudio-plate-well-location-twenty {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(299.203px - 94px);
  left: calc(890.688px - 737.5px);
  visibility: visible;
  z-index: 47;
}

.div__simulationstudio-plate-well-location-twentyone {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(299.203px - 94px);
  left: calc(952.292px - 737.5px);
  visibility: visible;
  z-index: 49;
}

.div__simulationstudio-plate-well-location-twentytwo {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(299.203px - 94px);
  left: calc(1013.9px - 737.5px);
  visibility: visible;
  z-index: 51;
}

.div__simulationstudio-plate-well-location-twentythree {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 66px;
  height: 66px;
  top: calc(299.203px - 94px);
  left: calc(1075.5px - 737.5px);
  visibility: visible;
  z-index: 53;
}
</style>
