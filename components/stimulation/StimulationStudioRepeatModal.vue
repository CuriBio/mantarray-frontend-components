<template>
  <div class="div__stimulationstudio-current-settings-background">
    <span class="span__stimulationstudio-current-settings-title">Repeat Protocol</span>
    <canvas class="canvas__stimulationstudio-horizontal-line-seperator-one" width="472" height="1"> </canvas>
    <span class="span__stimulationstudio-current-settings-label-one">Frequency</span>
    <div class="div__stimulationstudio-duration-input-container" width="162" height="57">
      <span class="span__stimulationstudio-duration-input">
        <InputWidget
          :placeholder="'5'"
          :dom_id_suffix="'repeats'"
          :invalid_text="invalid_text"
          :input_width="100"
          :initial_value="current_number_of_repeats !== null ? current_number_of_repeats : ''"
          @update:value="number_of_repeats = $event"
        ></InputWidget
      ></span>
    </div>
    <span
      class="span__stimulationstudio-current-settings-label-one"
      :style="'left: 70%; top: 46%; position: relative;'"
    >
      Hz
    </span>
    <div :class="'button-container'">
      <ButtonWidget
        :id="'button-widget-id'"
        :button_widget_width="520"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="button_names"
        :hover_color="['#19ac8a', '#bd4932']"
        :is_enabled="is_enabled_array"
        @btn-click="close"
      />
    </div>
  </div>
</template>
<script>
import InputWidget from "@/components/basic_widgets/InputWidget.vue";
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";

export default {
  name: "StimulationStudioRepeatModal",
  components: {
    InputWidget,
    ButtonWidget,
  },
  props: {
    button_names: {
      type: Array,
      default() {
        return ["Save", "Cancel"];
      },
    },
    is_enabled_array: {
      type: Array,
      default() {
        return [true, true];
      },
    },
    current_number_of_repeats: {
      type: String,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      number_of_repeats: null,
      invalid_text: "",
    };
  },
  created() {
    this.number_of_repeats = this.current_number_of_repeats;
  },
  methods: {
    close(idx) {
      const button_label = this.button_names[idx];
      this.$emit("close", { button_label, number_of_repeats: this.number_of_repeats });
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
  height: 250px;
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
  top: 210px;
  left: 0;
  position: absolute;
  cursor: pointer;
}

.button-container-mono {
  top: 540px;
  position: absolute;
  cursor: pointer;
}

.span__stimulationstudio-current-settings-label-one {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 206px;
  height: 30px;
  top: calc(164.5px - 55px);
  left: 4px;
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
  left: 250px;
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
</style>
