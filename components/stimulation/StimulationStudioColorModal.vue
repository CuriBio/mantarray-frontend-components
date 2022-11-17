<template>
  <div class="div__color-modal-container">
    Select color:
    <div class="div__container-color-block">
      <div
        v-for="color in color_selection"
        :id="color"
        :key="color"
        class="individual_color_block"
        :style="'background-color: ' + color"
        @click="handle_color_selection"
      />
    </div>
    <div class="div__color-button-container">
      <ButtonWidget
        :id="'button-widget-id'"
        :button_widget_width="202"
        :button_widget_height="40"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_background_color="'#292929'"
        :button_names="['Cancel']"
        :hover_color="['#bd4932']"
        @btn-click="handle_color_selection"
      />
    </div>
  </div>
</template>
<script>
import ButtonWidget from "@/components/basic_widgets/ButtonWidget.vue";

export default {
  name: "StimulationStudioColorModal",
  components: {
    ButtonWidget,
  },
  props: {
    current_color: {
      type: String,
      required: true,
    },
  },
  computed: {
    color_selection: function () {
      const non_green_ranges = [...Array(71).keys(), ...[...Array(360).keys()].splice(170)];

      return non_green_ranges.filter((hue) => hue % 23 === 0).map((hue) => `hsla(${hue}, 100%, 50%, 1)`);
    },
  },
  methods: {
    handle_color_selection({ target }) {
      const color_to_emit = !target ? this.current_color : target.id;
      this.$emit("change_pulse_color", color_to_emit);
    },
  },
};
</script>
<style>
.div__color-modal-container {
  height: 200px;
  width: 200px;
  background: #292929;
  color: rgb(255, 255, 255);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 5px 10px;
  border-radius: 4px;
}

.div__container-color-block {
  height: 150px;
  width: 160px;
  margin: 5px;
  display: grid;
  grid-template-areas:
    "0 1 2 3"
    "4 5 6 7"
    "8 9 10 11";
}
.individual_color_block {
  border: 1px solid #292929;
}
.individual_color_block:hover {
  border: 2px solid white;
  cursor: pointer;
}
.div__color-button-container {
  width: 202;
  height: 40px;
  top: 213px;
  left: 15px;
  position: absolute;
}
</style>
