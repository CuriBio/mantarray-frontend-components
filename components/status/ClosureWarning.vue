<template>
  <div>
    <div class="div__closure-warning-background">
      <span class="span__closure-warning-label">Warning!</span>
      <div class="span__closure-warning-message">
        <p>Operations are still in progress.</p>
        <p>Are you sure you want to exit?</p>
      </div>
      <div class="div__closure-warning-button">
        <ButtonWidget
          :button_widget_width="420"
          :button_widget_height="50"
          :button_widget_top="0"
          :button_widget_left="0"
          :button_names="['Cancel', 'Yes']"
          :enabled_color="'#B7B7B7'"
          :hover_color="['#bd4932', '#19ac8a']"
          @btn-click="handle_click"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";

export default {
  name: "ClosureWarning",
  components: {
    ButtonWidget
  },
  methods: {
    handle_click: function(idx) {
      this.$emit("handle_confirmation", idx);
    }
  }
};
</script>
<style scoped>
.div__closure-warning-background {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  width: 420px;
  height: 150px;
  top: 0;
  left: 0;
  visibility: visible;
  color: #1c1c1c;
  border-color: #000000;
  background: rgb(17, 17, 17);
  z-index: 3;
}

.span__closure-warning-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 420px;
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
.span__closure-warning-message {
  line-height: 1.2;
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  overflow-wrap: break-word;
  color: rgb(183, 183, 183);
  font-family: Muli;
  position: absolute;
  top: 65px;
  left: 21px;
  width: 378px;
  height: 123px;
  overflow: hidden;
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
.div__closure-warning-button {
  top: 150px;
  left: 0px;
  position: absolute;
}
</style>
