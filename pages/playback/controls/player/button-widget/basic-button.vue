<template>
  <div>
    <ButtonWidget
      :btn_width="500"
      :btn_height="50"
      :btn_top="0"
      :btn_left="0"
      :btn_names="btnnames"
      :focus_color="visiblecolor"
      :hide_color="hidecolor"
      :hover_color="hovercolors"
      :is_enabled="enablelist"
    >
    </ButtonWidget>
  </div>
</template>

<script>
import { ButtonWidget } from "@/dist/mantarray.common";
// import ButtonWidget from "@/components/playback/controls/player/ButtonWidget.vue";

export default {
  components: {
    ButtonWidget,
  },
  created: function () {
    this.btnnames = ["Cancel", "Delete ID", "Save ID"];
    this.enablelist = [true, true, true];
    this.visiblecolor = "#FFFFFF";
    this.hidecolor = "#3F3F3F";
    this.hovercolors = ["#BD4932", "#BD4932", "#19ac8a"];
  },
};
</script>
