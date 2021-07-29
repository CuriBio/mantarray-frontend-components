<template>
  <div v-show="mode" class="div__simulationmode" style="">
    <div
      id="mfPageD13bb8c313a32d88d20ab88bff685b448"
      style="
        top: 0px;
        left: 0px;
        background-color: rgba(255, 255, 255, 0);
        width: 287px;
        height: 55px;
        position: absolute;
        overflow: hidden;
        pointer-events: none;

        display: block;
      "
    >
      <div
        id="cmpD9b25a40818ab580091430ad25525cc28"
        class="mfWFCompCls"
        style="
          transform: rotate(0deg);
          box-sizing: border-box;
          padding: 0px;
          margin: 0px;
          background: #e21e1e;
          position: absolute;
          width: 287px;
          height: 55px;
          top: 0px;
          left: 0px;
          visibility: visible;
          border: 0px solid rgb(0, 0, 0);
          border-radius: 0px;
          box-shadow: none;
          pointer-events: all;
        "
      ></div>
      <div
        id="Da8b3f2b0d2d765e9e828addbe2451ca1"
        unselectable="on"
        group-id=""
        class="sdrag"
        width="287"
        height="55"
        style="
          overflow: hidden;
          transform: rotate(0deg);
          user-select: none;
          position: absolute;
          width: 287px;
          height: 55px;
          top: 0px;
          left: 0px;

          visibility: visible;
          display: none;
        "
      >
        <div
          id="Da8b3f2b0d2d765e9e828addbe2451ca1_base"
          width="287"
          height="55"
          style="
            -webkit-transform: translateZ(0);
            background-color: #878d99;
            opacity: 0;
            border: 0px solid;
            position: absolute;
            width: 287px;
            height: 55px;
            top: 0px;
            left: 0px;
          "
        ></div>
      </div>
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
          top: 32px;
          left: -0.252101px;
          padding: 5px;
          visibility: visible;
          user-select: none;
          font-family: Muli;
          font-weight: normal;
          font-style: normal;
          text-decoration: none;
          font-size: 9px;
          color: rgb(255, 255, 255);
          text-align: center;
        "
      >
      </span>
      <div
        id="Df48cb4003156538bcea3780adbd13e91"
        unselectable="on"
        group-id=""
        class="sdrag"
        width="286"
        height="16"
        style="
          overflow: hidden;
          transform: rotate(0deg);
          user-select: none;
          position: absolute;
          width: 286px;
          height: 16px;
          top: 32px;
          left: -0.252101px;

          visibility: visible;
          display: none;
        "
      >
        <div
          id="Df48cb4003156538bcea3780adbd13e91_base"
          width="286"
          height="16"
          style="
            -webkit-transform: translateZ(0);
            background-color: #878d99;
            opacity: 0;
            border: 0px solid;
            position: absolute;
            width: 286px;
            height: 16px;
            top: 0px;
            left: 0px;
          "
        ></div>
      </div>
      <span
        id="cmpD55a22039f232e968ad3af730513910f1"
        class="mfWFCompCls"
        style="
          pointer-events: all;
          line-height: 100%;
          transform: rotate(0deg);
          overflow: hidden;
          position: absolute;
          width: 287px;
          height: 16px;
          top: 10px;
          left: -4.823529px;
          padding: 5px;
          visibility: visible;
          user-select: none;
          font-family: Muli;
          font-weight: bold;
          font-style: normal;
          text-decoration: none;
          font-size: 11px;
          color: rgb(255, 255, 255);
          text-align: center;
        "
      >
        SIMULATION&nbsp;<wbr />MODE:&nbsp;<wbr />Not&nbsp;<wbr />Connected&nbsp;<wbr />to&nbsp;<wbr />Mantarray</span
      >
      <div
        id="D38e122d9d8d294fa97a320550b2a0a9e"
        unselectable="on"
        group-id=""
        class="sdrag"
        width="287"
        height="16"
        style="
          overflow: hidden;
          transform: rotate(0deg);
          user-select: none;
          position: absolute;
          width: 287px;
          height: 16px;
          top: 10px;
          left: 0.176471px;

          visibility: visible;
          display: none;
        "
      >
        <div
          id="D38e122d9d8d294fa97a320550b2a0a9e_base"
          width="287"
          height="16"
          style="
            -webkit-transform: translateZ(0);
            background-color: #878d99;
            opacity: 0;
            border: 0px solid;
            position: absolute;
            width: 287px;
            height: 16px;
            top: 0px;
            left: 0px;
          "
        ></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
/**
 * @vue-data     {Boolean} mode - Contains a true or false based on if its in simulation mode or not
 * @vue-computed {Boolean} simulation_mode_id - Contains a true or false based based on the value set in Vuex store.
 * @vue-event    {Event} simulation_mode_id - A function which is invoked when siumlation mode is modified.
 */
export default {
  name: "SimulationMode",
  computed: {
    ...mapState("flask", {
      mode: "simulation_mode",
    }),
  },
};
</script>
<style></style>
