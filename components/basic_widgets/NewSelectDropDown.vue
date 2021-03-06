<template>
  <div
    class="div__input-dropdown-background"
    :style="'width: ' + input_width_background + 'px;' + 'height: ' + input_height_background + 'px;'"
  >
    <span
      v-if="title_label !== ''"
      class="span__input-dropdown-content-label"
      :style="'width: ' + input_width + 'px;'"
    >
      {{ title_label }}
    </span>
    <div
      class="div__input-dropdown-controls-content-widget"
      :style="
        'width: ' + input_width + 'px;' + 'top:' + input_widget_top + 'px;' + 'height:' + input_height + 'px;'
      "
      @click="toggle()"
    >
      <div
        class="span__input-dropdown-controls-content-input-txt-widget"
        :style="'width: ' + input_width + 'px;'"
      >
        <span class="span__input-controls-content-input-txt-widget">
          <span :style="'color:' + chosen_option.color">{{ chosen_option.letter }}</span>
          {{ chosen_option.name }}</span
        >
      </div>
      <div class="arrow" :class="{ expanded: visible }"></div>
      <div :class="{ hidden: !visible, visible }">
        <ul>
          <li v-for="item in options_list" :key="item.id" :value="item" @click="change_selection(item.id)">
            <span :style="'color:' + item.color">{{ item.letter }}</span
            >{{ item.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "NewSelectDropDown",
  props: {
    title_label: { type: String, default: "" }, // title_text (str) (optional, defaults to empty string "")
    value: { type: String, default: "" }, // field_value (str) (optional, defaults to empty string "")
    options_text: { type: Array, required: true },
    input_width: { type: Number, default: 210 },
    options_idx: { type: String, default: "" },
    input_height: { type: Number, default: 0 }, // This prop is utilized by the parent component
  },
  data() {
    return {
      input_width_background: this.input_width + 4,
      visible: false,
      chosen_option: null,
      options_list: [],
      dropdown_options: [],
    };
  },
  computed: {
    input_height_background: function () {
      return this.title_label !== "" ? 100 : 60;
    },
    input_widget_top: function () {
      return this.title_label !== "" ? 40 : 0;
    },
  },
  watch: {
    chosen_option: function () {
      this.filter_options();
    },
  },
  created() {
    this.get_dropdown_options();
    this.chosen_option = this.dropdown_options[0];
    this.filter_options();
    this.unsubscribe = this.$store.subscribe(async (mutation) => {
      if (
        mutation.type === "stimulation/reset_state" ||
        mutation.type === "stimulation/reset_protocol_editor"
      ) {
        this.get_dropdown_options();
        this.chosen_option = this.dropdown_options[0];
        this.filter_options();
      }
      if (
        mutation.type === "stimulation/set_imported_protocol" ||
        mutation.type === "stimulation/add_saved_protocol"
      ) {
        this.get_dropdown_options();
        const imported_idx = this.dropdown_options.length - 1;
        this.chosen_option = this.options_list[imported_idx];
        this.filter_options();
        this.change_selection(imported_idx);
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  methods: {
    change_selection(idx) {
      this.chosen_option = this.dropdown_options[idx];
      this.$emit("selection-changed", idx);
    },
    toggle() {
      this.visible = !this.visible;
    },
    get_dropdown_options() {
      const list = [];
      for (let i = 0; i < this.options_text.length; i++) {
        let name;
        typeof this.options_text[i] === "string"
          ? (name = {
              id: i,
              name: this.options_text[i],
            })
          : (name = {
              id: i,
              name: this.options_text[i].label,
              letter: this.options_text[i].letter + " ",
              color: this.options_text[i].color,
            });
        list.push(name);
      }
      this.dropdown_options = list;
    },
    filter_options() {
      this.options_list = this.dropdown_options.filter((option) => {
        if (option !== this.chosen_option) return option;
      });
    },
  },
};
</script>
<style scoped>
.div__input-dropdown-background {
  transform: rotate(0deg);
  padding: 0px;
  margin: 0px;
  position: absolute;
  top: 0px;
  left: 0px;
  border-radius: 0px;
  box-shadow: none;
  cursor: pointer;
}
.span__input-dropdown-content-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  position: absolute;
  height: 30px;
  top: 0px;
  left: 0px;
  padding: 5px;
  user-select: none;
  font-family: Muli;
  font-size: 19px;
  color: rgb(255, 255, 255);
  text-align: center;
  cursor: pointer;
}
.span__input-controls-content-input-txt-widget {
  padding-left: 10px;
  padding-right: 10px;
  white-space: nowrap;
  transform: translateZ(0px);
  position: absolute;
  height: 45px;
  line-height: 45px;
  top: 0px;
  left: 0px;
  user-select: none;
  font-family: Muli;
  font-size: 15px;
  color: #b7b7b7;
  background-color: #1c1c1c;
}
.div__input-dropdown-controls-content-widget {
  pointer-events: all;
  transform: rotate(0deg);
  position: absolute;
  left: 0px;
  background-color: #1c1c1c;
  font-family: Muli;
  padding: 10px;
}
.arrow {
  position: absolute;
  right: 10px;
  top: 40%;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 7px solid #888;
  transform: rotateZ(0deg) translateY(0px);
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.59, 1.39, 0.37, 1.01);
}
.expanded {
  transform: rotateZ(180deg) translateY(2px);
  overflow: hidden;
  overflow: hidden;
  visibility: visible;
  z-index: 100;
}
ul {
  width: 100%;
  list-style-type: none;
  padding: 0;
  margin-top: 35px;
  left: 0;
  font-size: 16px;
  position: absolute;
  color: #b7b7b7;
  border-top: 1px solid rgb(17, 17, 17);
}
li {
  padding: 12px;
  color: #b7b7b7;
  background-color: #292929;
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
