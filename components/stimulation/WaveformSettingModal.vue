<template>
  <div
    id="cmpD2f15f130a7c848b6dfa50e77a7bd35ad"
    :class="
      waveform_type === 'Monophasic'
        ? 'div__stimulationstudio-current-settings-background-mono'
        : 'div__stimulationstudio-current-settings-background'
    "
  >
    <span id="cmpD5b2290fff52de686574ddc4481707a03" class="span__stimulationstudio-current-settings-title"
      >{{ waveform_type }}&nbsp;<wbr />Pulse&nbsp;<wbr />Details</span
    >
    <canvas
      id="cmpD1bd9abe7f57064ecc21010fe87aa8e0a"
      class="canvas__stimulationstudio-horizontal-line-seperator-one"
      width="472"
      height="1"
    >
    </canvas>
    <span
      id="cmpD334cd34b00ad111c21b729fee2b1def2"
      class="span__stimulationstudio-current-settings-sub-title-one"
      >Phase&nbsp;<wbr />1</span
    >
    <span id="cmpD31286f8dd12f44eb6bfea7751c014f90" class="span__stimulationstudio-current-settings-label-one"
      >Stimulus&nbsp;<wbr />Duration</span
    >
    <div
      id="cmpD830cdea88a8752e1fdd278dd0215b99d"
      class="div__stimulationstudio-duration-input-container"
      width="162"
      height="57"
    >
      <span id="cmpD830cdea88a8752e1fdd278dd0215b99d_txt" class="span__stimulationstudio-duration-input">
        <InputWidget
          :placeholder="'1000'"
          :dom_id_suffix="'duration'"
          :invalid_text="''"
          :input_width="142"
        ></InputWidget
      ></span>
    </div>
    <span id="cmpDad40b728ec40e75944b1291803f7785b" class="span__stimulationstudio-current-settings-label-two"
      >Balance&nbsp;<wbr />Charge</span
    >
    <span
      id="cmpDf2d0dbfd2edb4ffa3b8615863fa1b9a7"
      class="span__stimulationstudio-current-settings-label-three"
      >{{ check_type }}</span
    >
    <div
      id="cmpDf6ba8560cb2fbd91276a29c46743e99a"
      class="div__stimulationstudio-current-input-container"
      width="162"
      height="57"
    >
      <span id="cmpDf6ba8560cb2fbd91276a29c46743e99a_txt" class="span__stimulationstudio-current-input">
        <InputWidget
          :placeholder="'500'"
          :dom_id_suffix="'current'"
          :invalid_text="'Warning: change not balanced'"
          :input_width="142"
        ></InputWidget>
      </span>
    </div>
    <span
      id="cmpD7695902a49c6eaeb81d267812f0a90cd"
      class="span__stimulationstudio-current-settings-label-four"
      >Balance&nbsp;<wbr />Charge</span
    >
    <span
      id="cmpDf06bba2c8f09795a23af83170e2275a8"
      class="span__stimulationstudio-current-settings-label-five"
      >Max&nbsp;<wbr />{{ check_max_type }}</span
    >
    <div
      id="cmpDf07f8e650ebe6951292aa4edcc603608"
      class="div__stimulationstudio-voltage-input-container"
      width="162"
      height="57"
    >
      <span id="cmpDf07f8e650ebe6951292aa4edcc603608_txt" class="span__stimulationstudio-voltage-input">
        <InputWidget
          :placeholder="'250'"
          :dom_id_suffix="'voltage'"
          :invalid_text="''"
          :input_width="142"
        ></InputWidget>
      </span>
    </div>
    <canvas
      id="cmpDefb479b0caa166978ebed24ab8c44baf"
      class="canvas__stimulationstudio-horizontal-line-seperator-two"
      width="472"
      height="1"
    >
    </canvas>
    <span id="cmpD1258ad074a6b3eb7b8a869173413256d" class="span__stimulationstudio-current-settings-label-six"
      >Interpulse&nbsp;<wbr />Interval</span
    >
    <div
      id="cmpD948f417edcd29d68f5801d54232d9431"
      class="div__stimulationstudio-current-settings-interpulse"
      width="162"
      height="57"
    >
      <span
        id="cmpD948f417edcd29d68f5801d54232d9431_txt"
        class="span__stimulationstudio-current-settings-interpulse-input-container"
      >
        <InputWidget
          :placeholder="'1000'"
          :dom_id_suffix="'interpulse'"
          :invalid_text="''"
          :input_width="142"
        ></InputWidget>
      </span>
    </div>
    <div v-if="waveform_type === 'Biphasic'">
      <canvas
        id="cmpDa2bea934b07f6b108e90d5efecf200a3"
        class="canvas__stimulationstudio-horizontal-line-seperator-three"
        width="472"
        height="1"
      >
      </canvas>
      <span
        id="cmpD25434fb95b0bdb4dd6d951c83f90ad78"
        class="span__stimulationstudio-current-settings-sub-title-two"
      >
        Phase&nbsp;<wbr />2</span
      >
      <span
        id="cmpDf5881fe2782d4268a11a2a95a99d21b1"
        class="span__stimulationstudio-current-settings-label-seven"
        >Stimulus&nbsp;<wbr />Duration</span
      >
      <div
        id="cmpD818347e832e1274793ffe2c57a5d0a9c"
        class="div__stimulationstudio-current-settings-durationtwo-container"
        width="162"
        height="57"
      >
        <span
          id="cmpD818347e832e1274793ffe2c57a5d0a9c_txt"
          class="span__stimulationstudio-current-settings-durationtwo-input"
        >
          <InputWidget
            :placeholder="'1000'"
            :dom_id_suffix="'durationtwo'"
            :invalid_text="''"
            :input_width="142"
          ></InputWidget>
        </span>
      </div>
      <span
        id="cmpD470ae881458be847aa3ef17c347d3973"
        class="span__stimulationstudio-current-settings-label-eight"
        >Balance&nbsp;<wbr />Charge</span
      >
      <span
        id="cmpDdd1b9fc6423c3af17206292a54489078"
        class="span__stimulationstudio-current-settings-label-nine"
        >{{ check_type }}</span
      >
      <div
        id="cmpD8ecdf9c4a418509adff741b988ad0676"
        class="div__stimulationstudio-current-settings-currenttwo-input-container"
        width="162"
        height="57"
      >
        <span
          id="cmpD8ecdf9c4a418509adff741b988ad0676_txt"
          class="span__stimulationstudio-current-settings-currenttwo-input"
        >
          <InputWidget
            :placeholder="'500'"
            :dom_id_suffix="'currenttwo'"
            :invalid_text="''"
            :input_width="142"
          ></InputWidget>
        </span>
      </div>
      <span
        id="cmpDbc629158eb67226e3134f41509394ec9"
        class="span__stimulationstudio-current-settings-label-ten"
        >Balance&nbsp;<wbr />Charge</span
      >
      <span
        id="cmpD865c91d150a0c2f32f987466a39edc6e"
        class="span__stimulationstudio-current-settings-label-eleven"
        >Max&nbsp;<wbr />{{ check_max_type }}</span
      >
      <div
        id="cmpDef68ed4233a43cc387c949c403ef9260"
        class="div__stimulationstudio-current-settings-voltagetwo-input-container"
        width="162"
        height="57"
      >
        <span
          id="cmpDef68ed4233a43cc387c949c403ef9260_txt"
          class="span__stimulationstudio-current-settings-voltagetwo-input"
        >
          <InputWidget
            :placeholder="'250'"
            :dom_id_suffix="'voltagetwo'"
            :invalid_text="''"
            :input_width="142"
          ></InputWidget>
        </span>
      </div>
    </div>
    <canvas
      id="cmpDce55000ec63e65a2c9161268a4c9977b"
      :class="
        waveform_type === 'Monophasic'
          ? 'canvas__stimulationstudio-horizontal-line-seperator-four-mono'
          : 'canvas__stimulationstudio-horizontal-line-seperator-four'
      "
      width="472"
      height="2"
    >
    </canvas>
    <div
      id="cmpD478c2ccd7e9ce5794863ee3bd3cacb85"
      :class="
        waveform_type === 'Monophasic'
          ? 'div__stimulationstudio-balance-scale-icon-mono'
          : 'div__stimulationstudio-balance-scale-icon'
      "
    >
      <FontAwesomeIcon :icon="['fas', 'balance-scale']" />
    </div>
    <span
      id="cmpD0f8c9f516e738d930977090bd4d218a8"
      :class="
        waveform_type === 'Monophasic'
          ? 'span__stimulationstudio-current-settings-label-twelve-mono'
          : 'span__stimulationstudio-current-settings-label-twelve'
      "
      >Charge&nbsp;<wbr />Info&nbsp;<wbr />Unavailable</span
    >
    <div
      :class="waveform_type === 'Monophasic' ? 'button-container-mono' : 'button-container'"
      @click="close"
    >
      <ButtonWidget
        :button_widget_width="520"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="['Save', 'Cancel']"
        :hover_color="['#19ac8a', '#bd4932']"
        :is_enabled="enablelist_current_settings"
      />
    </div>
  </div>
</template>
<script>
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faBalanceScale } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faBalanceScale);

export default {
  name: "WaveformSettingModal",
  components: {
    InputWidget,
    ButtonWidget,
    FontAwesomeIcon,
  },
  props: {
    stimulation_type: { type: String, default: "Current" },
    waveform_type: { type: String, default: "Monophasic" },
  },
  data() {
    return {
      enablelist_current_settings: [true, true],
    };
  },
  computed: {
    check_type: function () {
      if (this.stimulation_type === "Current") return "Current (μA)";
      else return "Voltage (mV)";
    },
    check_max_type: function () {
      if (this.stimulation_type === "Current") return "Voltage (mV)";
      else return "Current (μA)";
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped>
.div__stimulationstudio-current-settings-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 522px;
  height: 817px;
  top: calc(55px - 55px);
  left: calc(852px - 852px);
  visibility: visible;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 5;
  pointer-events: all;
}

.div__stimulationstudio-current-settings-background-mono {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 522px;
  height: 590px;
  top: calc(55px - 55px);
  left: calc(852px - 852px);
  visibility: visible;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  pointer-events: all;
  z-index: 5;
}

.span__stimulationstudio-current-settings-title {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 500px;
  height: 30px;
  top: calc(72px - 55px);
  left: calc(863px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 19px;
  color: rgb(255, 255, 255);
  text-align: center;
}

.canvas__stimulationstudio-horizontal-line-seperator-one {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 472px;
  height: 2px;
  top: calc(104px - 45px);
  left: calc(878px - 852px);
  visibility: visible;

  background-color: #292929;
  opacity: 0.5;
}

.span__stimulationstudio-current-settings-sub-title-one {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 499px;
  height: 30px;
  top: calc(122.5px - 55px);
  left: calc(863px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 19px;
  color: rgb(255, 255, 255);
  text-align: center;
}

.button-container {
  top: 762px;
  left: 0;
  position: absolute;
}

.button-container-mono {
  top: 540px;
  position: absolute;
}

.span__stimulationstudio-current-settings-label-one {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 156px;
  height: 30px;
  top: calc(164.5px - 55px);
  left: calc(873px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: right;
}
.div__stimulationstudio-duration-input-container {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 162px;
  height: 57px;
  top: calc(151px - 55px);
  left: calc(1031px - 852px);
  visibility: visible;
}
.span__stimulationstudio-duration-input {
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 150px;
  height: 50px;
  line-height: 45px;
  top: 6px;
  left: 6px;
  user-select: none;
  font-family: Anonymous Pro;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
}
.canvas__stimulationstudio-horizontal-line-seperator-two {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 472px;
  height: 2px;
  top: calc(358px - 45px);
  left: calc(878px - 852px);
  visibility: visible;
  background-color: #292929;
  opacity: 0.5;
}
.span__stimulationstudio-current-settings-label-two {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 128px;
  height: 25px;
  top: calc(166.991px - 55px);
  left: calc(1195.28px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
  color: rgb(183, 183, 183);
  text-align: left;
}
.span__stimulationstudio-current-settings-label-three {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 154px;
  height: 30px;
  top: calc(234.5px - 55px);
  left: calc(875px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: right;
}
.div__stimulationstudio-current-input-container {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 162px;
  height: 90px;
  top: calc(221px - 55px);
  left: calc(1031px - 852px);
  visibility: visible;
}
.span__stimulationstudio-current-input {
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 150px;
  height: 90px;
  line-height: 45px;
  top: 6px;
  left: 6px;
  user-select: none;
  font-family: Anonymous Pro;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
}
.span__stimulationstudio-current-settings-label-four {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 128px;
  height: 25px;
  top: calc(236.991px - 55px);
  left: calc(1195.28px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
  color: rgb(183, 183, 183);
  text-align: left;
}
.span__stimulationstudio-current-settings-label-five {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 158px;
  height: 30px;
  top: calc(304.5px - 55px);
  left: calc(871px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: right;
}
.div__stimulationstudio-voltage-input-container {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 162px;
  height: 57px;
  top: calc(291px - 55px);
  left: calc(1031px - 852px);
  visibility: visible;
}

.span__stimulationstudio-voltage-input {
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 150px;
  height: 50px;
  line-height: 45px;
  top: 6px;
  left: 6px;
  user-select: none;
  font-family: Anonymous Pro;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(110, 111, 114);
}
.span__stimulationstudio-current-settings-label-six {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 154px;
  height: 30px;
  top: calc(403.5px - 55px);
  left: calc(875px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: right;
}
.div__stimulationstudio-current-settings-interpulse {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 162px;
  height: 57px;
  top: calc(390px - 55px);
  left: calc(1031px - 852px);
  visibility: visible;
}
.span__stimulationstudio-current-settings-interpulse-input-container {
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 150px;
  height: 50px;
  line-height: 45px;
  top: 6px;
  left: 6px;
  user-select: none;
  font-family: Anonymous Pro;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
}
.canvas__stimulationstudio-horizontal-line-seperator-three {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 472px;
  height: 2px;
  top: calc(457px - 45px);
  left: calc(878px - 852px);
  visibility: visible;
  background-color: #292929;
  opacity: 0.5;
}
.span__stimulationstudio-current-settings-sub-title-two {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 499px;
  height: 30px;
  top: calc(475.5px - 55px);
  left: calc(863px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 19px;
  color: rgb(255, 255, 255);
  text-align: center;
}
.span__stimulationstudio-current-settings-label-seven {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 156px;
  height: 30px;
  top: calc(517.5px - 55px);
  left: calc(873px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: right;
}
.div__stimulationstudio-current-settings-durationtwo-container {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 162px;
  height: 57px;
  top: calc(504px - 55px);
  left: calc(1031px - 852px);
  visibility: visible;
}
.span__stimulationstudio-current-settings-durationtwo-input {
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 150px;
  height: 50px;
  line-height: 45px;
  top: 6px;
  left: 6px;
  user-select: none;
  font-family: Anonymous Pro;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(110, 111, 114);
}
.span__stimulationstudio-current-settings-label-eight {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 128px;
  height: 25px;
  top: calc(519.991px - 55px);
  left: calc(1195.28px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
  color: rgb(183, 183, 183);
  text-align: left;
}
.span__stimulationstudio-current-settings-label-nine {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 154px;
  height: 30px;
  top: calc(587.5px - 55px);
  left: calc(875px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: right;
}
.div__stimulationstudio-current-settings-currenttwo-input-container {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 162px;
  height: 57px;
  top: calc(574px - 55px);
  left: calc(1031px - 852px);
  visibility: visible;
}
.span__stimulationstudio-current-settings-currenttwo-input {
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 150px;
  height: 50px;
  line-height: 45px;
  top: 6px;
  left: 6px;
  user-select: none;
  font-family: Anonymous Pro;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
}
.span__stimulationstudio-current-settings-label-ten {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 128px;
  height: 25px;
  top: calc(589.991px - 55px);
  left: calc(1195.28px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
  color: rgb(183, 183, 183);
  text-align: left;
}
.span__stimulationstudio-current-settings-label-eleven {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 158px;
  height: 30px;
  top: calc(657.5px - 55px);
  left: calc(871px - 852px);
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
  text-align: right;
}
.div__stimulationstudio-current-settings-voltagetwo-input-container {
  pointer-events: all;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 162px;
  height: 57px;
  top: calc(644px - 55px);
  left: calc(1031px - 852px);
  visibility: visible;
}
.span__stimulationstudio-current-settings-voltagetwo-input {
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  font-weight: normal;
  transform: translateZ(0px);
  position: absolute;
  width: 150px;
  height: 50px;
  line-height: 45px;
  top: 6px;
  left: 6px;
  user-select: none;
  font-family: Anonymous Pro;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(110, 111, 114);
}
.canvas__stimulationstudio-horizontal-line-seperator-four {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 472px;
  height: 2px;
  top: calc(708px - 45px);
  left: calc(878px - 852px);
  visibility: visible;
  background-color: #292929;
  opacity: 0.5;
}
.span__stimulationstudio-current-settings-label-twelve {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 228px;
  height: 30px;
  top: calc(766px - 55px);
  left: calc(999px - 852px);
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
}
.div__stimulationstudio-balance-scale-icon {
  transform: rotate(0deg);
  position: absolute;
  text-align: center;
  width: 22px;
  height: 22px;
  top: calc(743px - 55px);
  left: calc(1102px - 852px);
  color: #b7b7b7;
  visibility: visible;
  filter: none;
}

.canvas__stimulationstudio-horizontal-line-seperator-four-mono {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 472px;
  height: 2px;
  top: 420px;
  left: calc(878px - 852px);
  visibility: visible;
  background-color: #292929;
  opacity: 0.5;
}

.span__stimulationstudio-current-settings-label-twelve-mono {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 228px;
  height: 30px;
  top: 485px;
  left: calc(999px - 852px);
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
}

.div__stimulationstudio-balance-scale-icon-mono {
  transform: rotate(0deg);
  position: absolute;
  text-align: center;
  width: 22px;
  height: 22px;
  top: 450px;
  left: calc(1102px - 852px);
  color: #b7b7b7;
  visibility: visible;
  filter: none;
}
</style>
