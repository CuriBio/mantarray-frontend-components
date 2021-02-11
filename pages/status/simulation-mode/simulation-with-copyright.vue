<template>
  <div class="simulation-copyright">
    <ComponentToTest></ComponentToTest>

    <span
      id="cmpD24ff6b3120ced14b13a9d7926ae44f18"
      class="mfWFCompCls"
      style="
        pointer-events: all;
        line-height: 100%;
        transform: rotate(0deg);
        overflow: hidden;
        position: absolute;
        width: 286px;
        height: 16px;
        top: 37px;
        left: -0.252101px;
        visibility: visible;
        user-select: none;
        font-family: Muli;
        font-weight: normal;
        font-style: normal;
        text-decoration: none;
        font-size: 9px;
        color: rgb(255, 255, 255);
        text-align: center;
        z-index: 90;
      "
      >©2020&nbsp;<wbr />Curi&nbsp;<wbr />Bio.&nbsp;<wbr />All&nbsp;<wbr />Rights&nbsp;<wbr />Reserved.&nbsp;<wbr />Version:&nbsp;<wbr />001.00.00</span
    >
  </div>
</template>

<script>
import { SimulationMode as ComponentToTest } from "@/dist/mantarray.common";
// import ComponentToTest from "@/components/status/SimulationMode.vue";

export default {
  components: {
    ComponentToTest,
  },
  mounted() {
    this.$store.commit("flask/set_simulation_status", true);
  },
};
</script>
<style>
.simulation-copyright *,
.simulation-copyright *:before,
.simulation-copyright *:after {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.simulation-copyright {
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  font: 12px/14px "Source Sans Pro", sans-serif;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}
</style>
