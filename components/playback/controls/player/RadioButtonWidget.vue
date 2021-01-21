<template>
  <div>
    <b-form-radio-group
      v-model="selected"
      :options="radio_buttons"
      :aria-describedby="ariaDescribedby"
      name="plain-stacked"
      plain
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
      default: 0,
    },
  },
  data: function () {
    return {
      selected: false,
    };
  },
  computed: {
    num_of_btn: function () {
      return this.radio_buttons.length;
    },
  },
  created: function () {
    if (this.pre_selected != undefined) {
      this.selected = this.radio_buttons[this.pre_selected];
    }
  },
  methods: {
    radio_toggle: function (ev) {
      const btn_info = {
        name: this.selected,
        index: this.radio_buttons.indexOf(this.selected),
      };
      this.$emit("radio-btn-selected", btn_info);
    },
  },
};
</script>
<style type="text/css">
.form-check-label {
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

.form-check-input {
  color: #b7b7b7;
  border-color: #b7b7b7;
  background-color: #b7b7b7;
  border: 5px solid #b7b7b7;
  margin-top: 0.5rem;
}

input[type="radio"] {
  -webkit-appearance: none;
  width: 15px;
  height: 15px;
  border: 1px solid #b7b7b7;
  border-radius: 50%;
  outline: none;
  box-shadow: 0 0 5px 0px #b7b7b7 inset;
}
input[type="radio"]:hover {
  box-shadow: 0 0 5px 0px orange inset;
}
input[type="radio"]:before {
  content: "";
  display: block;
  width: 60%;
  height: 60%;
  margin: 20% auto;
  border-radius: 50%;
}
input[type="radio"]:checked:before {
  background: #19ac8a;
}
</style>
