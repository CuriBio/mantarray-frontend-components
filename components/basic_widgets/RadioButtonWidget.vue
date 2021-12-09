<template>
  <div class="radio-button-widget">
    <b-form-radio-group
      v-model="selected"
      :options="radio_buttons"
      name="radios-stacked"
      value-field="value"
      text-field="value"
      stacked
      @input="radio_toggle"
    ></b-form-radio-group>
  </div>
</template>

<script>
import Vue from "vue";
import { BFormRadioGroup } from "bootstrap-vue";
Vue.component("BFormRadioGroup", BFormRadioGroup);

export default {
  name: "RadioButtonWidget",
  props: {
    radio_buttons: {
      type: Array,
      required: true,
    },
    pre_selected: {
      type: Number,
      default: undefined,
    },
  },

  data: function () {
    return {
      selected: null,
    };
  },
  watch: {
    pre_selected: function () {
      this.preselect();
    },
  },
  created: function () {
    this.preselect();
  },
  methods: {
    preselect: function () {
      if (this.pre_selected != undefined) {
        this.selected = this.radio_buttons[this.pre_selected].value;
      }
    },
    radio_toggle: function (name) {
      const theme_name_array = this.radio_buttons.map((opt) => opt.value);
      const btn_info = {
        name: this.selected,
        index: theme_name_array.indexOf(name),
      };
      this.$emit("radio-btn-selected", btn_info);
    },
  },
};
</script>
<style type="text/css">
.radio-button-widget {
  white-space: nowrap;
  margin-bottom: 0;
  color: #b7b7b7;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
}

.custom-radio .custom-control-label::before {
  background-color: #000; /* black */
}

/* This is the checked state */
.custom-radio .custom-control-input:checked ~ .custom-control-label::before,
.custom-radio .custom-control-input:checked ~ .custom-control-label::after {
  background-color: #000; /* black */
  /* this bg image SVG is just a white circle, you can replace it with any valid SVG code */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='3' fill='%2319ac8a'/%3E%3C/svg%3E");
  border-radius: 50%;
}

/* This is the checked state */
.custom-radio .custom-control-input:checked:hover ~ .custom-control-label::before,
.custom-radio .custom-control-input:checked:hover ~ .custom-control-label::after {
  background-color: #000; /* black */
  /* this bg image SVG is just a white circle, you can replace it with any valid SVG code */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='4' fill='%2319ac8a'/%3E%3C/svg%3E");
  border-radius: 50%;
}

/* active state i.e. displayed while the mouse is being pressed down */
.custom-radio .custom-control-input:active ~ .custom-control-label::before {
  color: #fff;
  background-color: #fff; /* white */
}

/* the shadow; displayed while the element is in focus */
.custom-radio .custom-control-input:focus ~ .custom-control-label::before,
.custom-radio .custom-control-input:focus ~ .custom-control-label::after {
  color: #19ac8a;
  box-shadow: 0 0 0 1px #19ac8a;
}

.custom-radio .custom-control-input:hover ~ .custom-control-label::before,
.custom-radio .custom-control-input:hover ~ .custom-control-label::after {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3E%3Ccircle r='1.5' fill='%23fff'/%3E%3C/svg%3E");
}
</style>
