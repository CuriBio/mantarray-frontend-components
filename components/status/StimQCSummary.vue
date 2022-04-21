<template>
  <div>
    <div class="div__stimqc-background">
      <span class="span__stimqc-label">{{ modal_labels.header }}</span>
      <div ref="message_area" class="span__stimqc-message">
        <p>{{ modal_labels.msg_one }}</p>
        <p>{{ modal_labels.msg_two }}</p>
        <div style="margin: 65px 0px 0px 65px">
          <StimulationStudioWidget :disable="true" />
        </div>
      </div>
      <div class="div__stimqc-button-container">
        <ButtonWidget
          :button_widget_width="600"
          :button_widget_height="50"
          :button_widget_top="0"
          :button_widget_left="0"
          :button_names="modal_labels.button_names"
          :enabled_color="'#B7B7B7'"
          :hover_color="['#19ac8a']"
          @btn-click="handle_click"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";
import StimulationStudioWidget from "@/components/plate_based_widgets/stimulationstudio/StimulationStudioWidget.vue";

export default {
  name: "StimQCSummary",
  components: {
    ButtonWidget,
    StimulationStudioWidget,
  },
  props: {
    modal_labels: {
      type: Object,
      default() {
        return {
          header: "Configuration Check Summary!",
          msg_one:
            "An open circuit was detected in the assigned wells shown below. This will prevent you from being able to start a stimulation.",
          msg_two: "Please unassign these wells before proceeding.",
          button_names: ["Okay"],
        };
      },
    },
  },
  methods: {
    handle_click: function (idx) {
      this.$emit("handle_confirmation", idx);
    },
  },
};
</script>
<style scoped>
.div__stimqc-background {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 600px;
  top: 0;
  left: 0;
  height: 520px;
  visibility: visible;
  color: #1c1c1c;
  border-color: #000000;
  background: rgb(17, 17, 17);
  z-index: 3;
}
.span__stimqc-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 600px;
  height: 30px;
  top: 22.385px;
  left: 0px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(255, 255, 255);
  text-align: center;
}
.span__stimqc-message {
  line-height: 1.2;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(183, 183, 183);
  font-family: Muli;
  position: absolute;
  top: 55px;
  left: 21px;
  width: 540px;
  visibility: visible;
  user-select: none;
  text-align: center;
  font-size: 15px;
  letter-spacing: normal;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  pointer-events: all;
}
.div__stimqc-button-container {
  left: 0px;
  position: absolute;
  top: 520px;
}
</style>
