<template>
  <div
    class="div__small-dropdown-background"
    :style="'width: ' + input_width_background + 'px;' + 'height: ' + input_height + 'px;'"
  >
    <div
      :id="'small_dropdown_' + dom_id_suffix"
      class="div__small-dropdown-controls-content-widget"
      :style="
        'width: ' + input_width + 'px;' + 'top:' + input_widget_top + 'px;' + 'height:' + input_height + 'px;'
      "
      @click="!disable_toggle ? toggle() : null"
    >
      <div
        class="span__small-dropdown-controls-content-input-txt-widget"
        :style="'width: ' + input_width + 'px;'"
      >
        <span class="span__small-controls-content-input-txt-widget">{{ chosen_option.name }}</span>
      </div>
      <div class="arrow" :class="{ expanded: visible }" />
      <div :class="{ hidden: !visible, visible }">
        <ul :style="`bottom: ${bottom_pixels}px`">
          <li
            v-for="item in options_list"
            :id="dom_id_suffix + `_${item.id}`"
            :key="item.id"
            :value="item"
            @click="!disable_selection ? change_selection(item.id) : null"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "SmallDropDown",
  props: {
    options_text: { type: Array, required: true },
    input_width: { type: Number, default: 210 },
    input_height: { type: Number, default: 0 },
    options_idx: { type: Number, default: 0 },
    dom_id_suffix: { type: String, default: "" }, // for testing
    title_label: { type: String, default: "" },
    disable_toggle: { type: Boolean, default: false },
    disable_selection: { type: Boolean, default: false },
  },
  data() {
    return {
      input_width_background: this.input_width + 4,
      visible: false,
      chosen_option: null,
      options_list: [],
    };
  },
  computed: {
    dropdown_options: function () {
      const list = [];
      for (let i = 0; i < this.options_text.length; i++) {
        const name = {
          id: i,
          name: this.options_text[i],
        };
        list.push(name);
      }
      return list;
    },
    input_widget_top: function () {
      return this.title_label !== "" ? 40 : 0;
    },
    bottom_pixels: function () {
      return (this.options_text.length - 2) * 25 + 12;
    },
  },
  watch: {
    chosen_option: function () {
      this.update_options_list();
    },
    options_idx: function () {
      this.get_preselected_option();
    },
    disable_toggle: function () {
      if (this.disable_toggle) this.visible = false;
    },
    options_text: function () {
      this.update_options_list();
      this.get_preselected_option();
    },
  },
  created() {
    this.get_preselected_option();
    this.options_list = this.dropdown_options;
    this.unsubscribe = this.$store.subscribe(async (mutation) => {
      if (
        mutation.type === "stimulation/reset_state" ||
        mutation.type === "stimulation/reset_protocol_editor"
      ) {
        this.chosen_option = this.dropdown_options[0];
        this.change_selection(0);
        this.visible = false;
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  methods: {
    update_options_list() {
      this.options_list = this.dropdown_options.filter((option) => option !== this.chosen_option);
    },
    get_preselected_option() {
      this.chosen_option = this.dropdown_options[this.options_idx];
    },
    change_selection(idx) {
      this.chosen_option = this.dropdown_options[idx];
      this.$emit("selection-changed", idx);
    },
    toggle() {
      this.visible = !this.visible;
    },
  },
};
</script>
<style scoped>
body {
  user-select: none;
}
.div__small-dropdown-background {
  transform: rotate(0deg);
  margin: 0px;
  position: relative;
  top: 0px;
  left: 0px;
  margin-bottom: 7px;
  border-radius: 0px;
  box-shadow: none;
  cursor: pointer;
  z-index: 5;
}
.span__small-controls-content-input-txt-widget {
  padding-left: 10px;
  padding-right: 10px;
  white-space: nowrap;
  transform: translateZ(0px);
  position: absolute;
  height: 25px;
  line-height: 25px;
  top: 0px;
  left: 0px;
  user-select: none;
  font-family: Muli;
  font-size: 11px;
  color: #b7b7b7;
  background-color: #1c1c1c;
}
.div__small-dropdown-controls-content-widget {
  transform: rotate(0deg);
  position: absolute;
  background-color: #1c1c1c;
  font-family: Muli;
  padding: 8px;
}
.arrow {
  position: absolute;
  right: 10px;
  top: 43%;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #888;
  transform: rotateZ(0deg) translateY(0px);
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.59, 1.39, 0.37, 1.01);
}
.expanded {
  transform: rotateZ(180deg) translateY(2px);
}
ul {
  width: 100%;
  list-style-type: none;
  padding: 0;
  left: 0;
  font-size: 11px;
  height: 25px;
  line-height: 25px;
  position: absolute;
  color: #b7b7b7;
  z-index: 5;
}

li {
  color: #b7b7b7;
  background-color: #292929;
  padding-left: 10px;
  padding-right: 10px;
}
li:hover {
  background: #1c1c1c;
}
.current {
  color: #b7b7b7;
  background-color: #1c1c1c;
  visibility: hidden;
}
.hidden {
  visibility: hidden;
}
.visible {
  visibility: visible;
}
</style>
