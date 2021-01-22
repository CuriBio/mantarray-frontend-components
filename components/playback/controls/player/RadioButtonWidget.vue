<template>
  <div class="radio-button-widget">
    <b-form-radio-group
      v-model="selected"
      :options="radio_buttons"
      :aria-describedby="ariaDescribedby"
      name="plain-stacked"
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
.custom-control-label {
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

.custom-control-input:checked ~ .custom-control-label::before {
  color: #fff;
  border-color: #7b1fa2;
  background-color: #7b1fa2;
}

/*.custom-radio .custom-control-input:checked {*/
/*  color: #b7b7b7;*/
/*  border-color: #b7b7b7;*/
/*  background-color: #19ac8a;*/
/*  border: 5px solid #19ac8a;*/
/*  margin-top: 0.0rem;*/
/*}*/
/*.custom-radio .custom-control-input:active::before*/
/*{*/
/*  color: #ffffff;*/
/*  border-color: #ffffff;*/
/*  background-color: #ffffff;*/
/*  border: 5px solid #ffffff;*/
/*  margin-top: 0.0rem;*/
/*}*/

/*input[type="radio"] {*/
/*  -webkit-appearance: none;*/
/*  width: 15px;*/
/*  height: 15px;*/
/*  border: 1px solid #b7b7b7;*/
/*  border-radius: 50%;*/
/*  outline: none;*/
/*   box-shadow: 0 0 5px 0px #b7b7b7 inset; */
/*}*/
/*input[type="radio"]:hover {*/
/*  box-shadow: 0 0 5px 0px solid #ffffff;*/
/*}*/
/*input[type="radio"]:before {*/
/*  content: "";*/
/*  display: block;*/
/*  width: 60%;*/
/*  height: 60%;*/
/*  margin: 20% auto;*/
/*  border-radius: 50%;*/
/*}*/
/*.radio-button-widget .active {*/
/*  color: #19ac8a;*/
/*  border-color: #19ac8a;*/
/*  border: 5px solid #ffffff;*/
/*  background-color: #19ac8a;*/
/*  box-shadow: none !important;*/
/*}*/

/*.custom-control-input:hover {*/
/*  color: #ececed;*/
/*  border-color: #ececed;*/
/*  border: 5px solid #ececed;*/
/*  background-color: #ececed;*/
/*  box-shadow: none !important;*/
/*}*/
</style>
