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
        :hover_color="hovercolors_add_customer"
        :is_enabled="enablelist"
      >
      </ButtonWidget>
    </div>
    <div style="top: 110px; left: 88px; position: absolute">
      <ButtonWidget
        :button_widget_width="500"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="btnnames_add_customer"
        :enabled_color="visiblecolor_add_customer"
        :disabled_color="hidecolor_add_customer"
        :hover_color="hovercolors_add_customer"
        :is_enabled="enablelist_add_customer"
      >
      </ButtonWidget>
    </div>
    <div style="top: 170px; left: 88px; position: absolute">
      <ButtonWidget
        :button_widget_width="400"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="btnnames_trash_treatment"
        :enabled_color="visiblecolor_trash_treatment"
        :disabled_color="hidecolor_trash_treatment"
        :hover_color="hovercolors_trash_treatment"
        :is_enabled="enablelist_trash_treatment"
      >
      </ButtonWidget>
    </div>
    <div style="top: 230px; left: 88px; position: absolute">
      <ButtonWidget
        :button_widget_width="1000"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="btnnames_plate_map_treatment"
        :enabled_color="visiblecolor_plate_map_treatment"
        :disabled_color="hidecolor_plate_map_treatment"
        :hover_color="hovercolors_plate_map_treatment"
        :is_enabled="enablelist_plate_map_treatment"
      >
      </ButtonWidget>
    </div>
    <div style="top: 290px; left: 88px; position: absolute">
      <ButtonWidget
        :button_widget_width="500"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="btnnames_create_plate_map_treatment"
        :enabled_color="visiblecolor_create_plate_map_treatment"
        :disabled_color="hidecolor_create_plate_map_treatment"
        :hover_color="hovercolors_create_plate_map_treatment"
        :is_enabled="enablelist_create_plate_map_treatment"
      >
      </ButtonWidget>
    </div>
    <div style="top: 350px; left: 88px; position: absolute">
      <ButtonWidget
        :button_widget_width="420"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="btnnames_create_plate_map_okay"
        :enabled_color="visiblecolor_create_plate_map_okay"
        :disabled_color="hidecolor_create_plate_map_okay"
        :hover_color="hovercolors_create_plate_map_okay"
        :is_enabled="enablelist_create_plate_map_okay"
      >
      </ButtonWidget>
    </div>
    <div style="top: 410px; left: 88px; position: absolute">
      <ButtonWidget
        :button_widget_width="265"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="btnnames_y_axis_widget"
        :enabled_color="visiblecolor_y_axis_widget"
        :disabled_color="hidecolor_y_axis_widget"
        :hover_color="hovercolors_y_axis_widget"
        :is_enabled="enablelist_y_axis_widget"
      >
      </ButtonWidget>
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
  created: function () {
    this.btnnames = ["Cancel", "Delete ID", "Save ID"];
    this.enablelist = [true, true, true];
    this.visiblecolor = "#FFFFFF";
    this.hidecolor = "#3F3F3F";
    this.hovercolors = ["#BD4932", "#BD4932", "#19ac8a"];

    this.btnnames_add_customer = ["Cancel", "Save ID"];
    this.enablelist_add_customer = [true, true];
    this.visiblecolor_add_customer = "#FFFFFF";
    this.hidecolor_add_customer = "#3F3F3F";
    this.hovercolors_add_customer = ["#BD4932", "#19ac8a"];

    this.btnnames_trash_treatment = ["No", "Yes"];
    this.enablelist_trash_treatment = [true, true];
    this.visiblecolor_trash_treatment = "#FFFFFF";
    this.hidecolor_trash_treatment = "#3F3F3F";
    this.hovercolors_trash_treatment = ["#BD4932", "#19ac8a"];

    this.btnnames_plate_map_treatment = ["Cancel", "Select Label(s)"];
    this.enablelist_plate_map_treatment = [true, true];
    this.visiblecolor_plate_map_treatment = "#FFFFFF";
    this.hidecolor_plate_map_treatment = "#3F3F3F";
    this.hovercolors_plate_map_treatment = ["#BD4932", "#19ac8a"];

    this.btnnames_create_plate_map_treatment = ["Cancel", "Create Treatment"];
    this.enablelist_create_plate_map_treatment = [true, true];
    this.visiblecolor_create_plate_map_treatment = "#FFFFFF";
    this.hidecolor_create_plate_map_treatment = "#3F3F3F";
    this.hovercolors_create_plate_map_treatment = ["#BD4932", "#19ac8a"];

    this.btnnames_create_plate_map_okay = ["Okay"];
    this.enablelist_create_plate_map_okay = [true];
    this.visiblecolor_create_plate_map_okay = "#FFFFFF";
    this.hidecolor_create_plate_map_okay = "#3F3F3F";
    this.hovercolors_create_plate_map_okay = ["#BD4932"];

    this.btnnames_y_axis_widget = ["Cancel", "Apply"];
    this.enablelist_y_axis_widget = [true, true];
    this.visiblecolor_y_axis_widget = "#FFFFFF";
    this.hidecolor_y_axis_widget = "#3F3F3F";
    this.hovercolors_y_axis_widget = ["#BD4932", "#19ac8a"];
  },
};
</script>
