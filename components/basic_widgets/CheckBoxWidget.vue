<template>
  <div>
    <div class="div__checkbox-background">
      <b-form-checkbox-group
        v-model="selected"
        :options="checkbox_options"
        value-field="value"
        stacked
        @input="change_method"
      />
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { BFormCheckboxGroup } from "bootstrap-vue";
Vue.component("BFormCheckboxGroup", BFormCheckboxGroup);

export default {
  name: "CheckBoxWidget",
  props: {
    checkbox_options: {
      type: Array,
      required: true,
    },
    reset: {
      type: Boolean,
      default: false,
    },
    initial_selected: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selected: [],
    };
  },
  watch: {
    reset: function () {
      if (this.reset) this.selected = [];
    },
    initial_selected: function () {
      if (this.initial_selected) {
        this.selected.push(this.checkbox_options[0].value);
        this.$emit("checkbox-selected", this.selected);
      }
    },
  },
  methods: {
    change_method() {
      this.$emit("checkbox-selected", this.selected);
    },
  },
};
</script>
<style type="text/css">
.div__checkbox-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  position: absolute;
  top: 0px;
  left: 0px;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
  color: rgb(183, 183, 183);
  visibility: visible;
  border-radius: 0px;
  box-shadow: none;
  pointer-events: all;
  cursor: pointer;
}

.custom-control-label {
  padding-left: 10px;
}

.custom-checkbox .custom-control-label::before {
  background-color: #000; /* black */
}

/* This is the checked state */
.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before,
.custom-checkbox .custom-control-input:checked ~ .custom-control-label::after {
  background-color: #19ac8a; /* black */
  border-radius: 20%;
}

/* active state i.e. displayed while the mouse is being pressed down */
.custom-checkbox .custom-control-input:active ~ .custom-control-label::before {
  color: #fff;
  background-color: #fff; /* white */
}

/* the shadow; displayed while the element is in focus */
.custom-checkbox .custom-control-input:focus ~ .custom-control-label::before,
.custom-checkbox .custom-control-input:focus ~ .custom-control-label::after {
  color: #19ac8a;
  border-radius: 20%;
}

input[type="checkbox"]:disabled,
input[type="checkbox"]:disabled + span {
  background-color: #6e6f72;
}
</style>
