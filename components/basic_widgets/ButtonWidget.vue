<template>
  <div>
    <div class="div__button-background" :style="background_cssprops">
      <span
        v-for="btn_index in num_of_btn"
        :key="btn_index"
        :ref="btn_index.toString()"
        class="span__button-label"
        :style="btn_stateprop(btn_index)"
        @click="selected(btn_index)"
        @mouseenter="hover_active(btn_index)"
        @mouseleave="hover_inactive(btn_index)"
        >{{ button_names[btn_index - 1] }}
      </span>
    </div>
    <div v-if="num_of_verticalline >= 1">
      <canvas
        v-for="line_index in num_of_verticalline"
        :key="line_index"
        class="canvas__vertical-line"
        :style="btn_divider_display(line_index)"
      >
      </canvas>
    </div>
    <canvas class="canvas__common-horizontal-line" :style="'width: ' + (button_widget_width - 10) + 'px;'">
    </canvas>
  </div>
</template>
<script>
export default {
  name: "ButtonWidget",
  props: {
    button_names: {
      type: Array,
      required: true,
    },
    enabled_color: { type: String, default: "#FFFFFF" },
    disabled_color: { type: String, default: "#3F3F3F" },
    hover_color: {
      type: Array,
      required: true,
    },
    is_enabled: {
      type: Array,
      default: function () {
        return new Array(this.button_names.length).fill(true);
      },
    },
    button_widget_width: { type: Number, default: 0 },
    button_widget_height: { type: Number, default: 0 },
    button_widget_top: { type: Number, default: 0 },
    button_widget_left: { type: Number, default: 0 },
    button_background_color: { type: String, default: "rgb(17, 17, 17)" },
  },
  computed: {
    num_of_btn: function () {
      return this.button_names.length;
    },
    num_of_verticalline: function () {
      return this.button_names.length - 1;
    },
    background_cssprops: function () {
      return (
        "width: " +
        this.button_widget_width +
        "px; height: " +
        this.button_widget_height +
        "px; top: " +
        this.button_widget_top +
        "px; left: " +
        this.button_widget_left +
        "px; background: " +
        this.button_background_color
      );
    },
  },
  methods: {
    btn_stateprop(value) {
      const count = value - 1;
      const computed_width = this.button_widget_width / this.num_of_btn;
      const computed_left = computed_width * count;
      return this.is_enabled[count]
        ? "color: " +
            this.enabled_color +
            ";" +
            "width: " +
            computed_width +
            "px;" +
            "left: " +
            computed_left +
            "px;" +
            "cursor: pointer;"
        : "color: " +
            this.disabled_color +
            ";" +
            "width: " +
            computed_width +
            "px;" +
            "left: " +
            computed_left +
            "px;";
    },
    btn_divider_display(value) {
      const computed_width = this.button_widget_width / this.num_of_btn;
      const left_shift = computed_width * value;
      return "left: " + left_shift + "px;";
    },
    selected(value) {
      if (this.is_enabled[value - 1]) {
        this.$emit("btn-click", value - 1);
      }
    },
    hover_active(value) {
      if (this.is_enabled[value - 1]) {
        const local_ref = this.$refs[value.toString()];
        local_ref[0].style.color = this.hover_color[value - 1];
      }
    },
    hover_inactive(value) {
      if (this.is_enabled[value - 1]) {
        const local_ref = this.$refs[value.toString()];
        local_ref[0].style.color = this.enabled_color;
      }
    },
  },
};
</script>
<style>
body {
  user-select: none;
}
.div__button-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  visibility: visible;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 3;
  pointer-events: all;
  overflow: hidden;
}

.span__button-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  height: 30px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: #3f3f3f;
  text-align: center;
  z-index: 3;
}

.canvas__vertical-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 2px;
  height: 50px;
  top: 0px;
  left: 0px;
  visibility: visible;
  z-index: 3;
  background-color: #3f3f3f;
  opacity: 0.5;
}

.canvas__common-horizontal-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  height: 2px;
  top: 0px;
  left: 5px;
  visibility: visible;
  z-index: 3;
  background-color: #3f3f3f;
  opacity: 0.5;
}
</style>
