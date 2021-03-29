<template>
  <div>
    <div style="top: 50px; left: 88px; position: absolute">
      <ButtonWidget
        :button_widget_width="500"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="btnnames"
        :enabled_color="visiblecolor"
        :disabled_color="hidecolor"
        :hover_color="hovercolors"
        :is_enabled="enablelist"
        @btn-click="display_clicked_button"
      >
      </ButtonWidget>
    </div>
    <div class="button-event-handler">
      The Button that was clicked :<b>{{ clicked }}</b>
    </div>
  </div>
</template>

<script>
import { ButtonWidget } from "@/dist/mantarray.common";
// import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";

export default {
  components: {
    ButtonWidget,
  },
  data() {
    return {
      clicked: "",
    };
  },
  created: function () {
    this.btnnames = ["Cancel", "Delete ID", "Save ID"];
    this.enablelist = [true, true, true];
    this.visiblecolor = "#FFFFFF";
    this.hidecolor = "#3F3F3F";
    this.hovercolors = ["#BD4932", "#BD4932", "#19ac8a"];
  },
  methods: {
    display_clicked_button: function (value) {
      this.clicked = this.btnnames[value];
    },
  },
};
</script>
