<template>
  <div>
    <div class="div__button-background" :style="background_cssprops"></div>
    <span
      v-for="btn_index in num_of_btn"
      :key="btn_index"
      :ref="btn_index.toString()"
      class="span__button_label"
      :style="btn_stateprop(btn_index)"
      @click="selected(btn_index)"
      @mouseenter="hover_active(btn_index)"
      @mouseleave="hover_inactive(btn_index)"
      >{{ btn_names[btn_index - 1] }}
    </span>
    <div v-if="num_of_verticalline >= 1">
      <canvas
        v-for="line_index in num_of_verticalline"
        :key="line_index"
        class="canvas__vertical-line"
        :style="btn_divider_display(line_index)"
      >
      </canvas>
    </div>
    <canvas
      class="canvas__common-horizontal-line"
      :style="'width: ' + (btn_width - 10) + 'px;'"
    >
    </canvas>
  </div>
</template>
<script>
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import { BButton } from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.component("BButton", BButton);
import "bootstrap/dist/css/bootstrap.min.css";

export default {
  name: "ButtonWidget",
  props: {
    btn_names: {
      type: Array,
      default: function () {
        return [];
      },
    },
    focus_color: { type: String, default: "" },
    hide_color: { type: String, default: "" },
    hover_color: {
      type: Array,
      default: function () {
        return [];
      },
    },
    is_enabled: {
      type: Array,
      default: function () {
        return [];
      },
    },
    btn_width: { type: Number, default: 0 },
    btn_height: { type: Number, default: 0 },
    btn_top: { type: Number, default: 0 },
    btn_left: { type: Number, default: 0 },
    event_names: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      count: 0,
    };
  },
  computed: {
    num_of_btn: function () {
      return this.btn_names.length;
    },
    num_of_verticalline: function () {
      return this.btn_names.length - 1;
    },
    background_cssprops: function () {
      return (
        "width: " +
        this.btn_width +
        "px; height: " +
        this.btn_height +
        "px; top: " +
        this.btn_top +
        "px; left: " +
        this.btn_left +
        "px;"
      );
    },
  },
  methods: {
    btn_stateprop(value) {
      this.count = value - 1;
      const computed_width = this.btn_width / this.num_of_btn;
      const computed_left = computed_width * this.count;
      return this.is_enabled[this.count]
        ? "color: " +
            this.focus_color +
            ";" +
            "width: " +
            computed_width +
            "px;" +
            "left: " +
            computed_left +
            "px;"
        : "color: " +
            this.hide_color +
            ";" +
            "width: " +
            computed_width +
            "px;" +
            "left: " +
            computed_left +
            "px;";
    },
    btn_divider_display(value) {
      const computed_width = this.btn_width / this.num_of_btn;
      if (value == 0) {
        return "left: " + computed_width + "px;";
      } else {
        const left_shift = computed_width * value;
        return "left: " + left_shift + "px;";
      }
    },
    selected(value) {
      if (this.is_enabled[value - 1] == true) {
        this.$emit("btn-click", value - 1);
      }
    },
    hover_active(value) {
      if (this.is_enabled[value - 1] == true) {
        const local_ref = this.$refs[value.toString()];
        local_ref[0].style.color = this.hover_color[value - 1];
      }
    },
    hover_inactive(value) {
      if (this.is_enabled[value - 1] == true) {
        const local_ref = this.$refs[value.toString()];
        local_ref[0].style.color = this.focus_color;
      }
    },
  },
};
</script>
<style>
.div__button-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  visibility: visible;
  border: 2px solid rgb(0, 0, 0);
  border-radius: 0px;
  box-shadow: none;
  z-index: 3;
  pointer-events: all;
}

.span__button_label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  height: 30px;
  top: 7.5px;
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
  z-index: 19;
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
  z-index: 15;
  background-color: #3f3f3f;
  opacity: 1;
}

.canvas__common-horizontal-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  height: 2px;
  top: 0px;
  left: 5px;
  visibility: visible;
  z-index: 22;
  background-color: #3f3f3f;
  opacity: 1;
}
</style>
