<template>
  <div>
    <b-form-radio-group
      v-model="selected"
      :options="radio_buttons"
      :aria-describedby="ariaDescribedby"
      name="plain-stacked"
      plain
      stacked
    ></b-form-radio-group>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircle as fa_circle } from "@fortawesome/free-regular-svg-icons";
import { faDotCircle as fa_dotcircle } from "@fortawesome/free-regular-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Vue from "vue";
library.add(fa_circle);
library.add(fa_dotcircle);

import { BFormRadioGroup } from "bootstrap-vue";
Vue.component("BFormRadioGroup", BFormRadioGroup);

export default {
  name: "RadioButtonWidget",
  props: {
    radio_buttons: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      status: [],
    };
  },
  computed: {
    num_of_btn: function () {
      return this.radio_buttons.length;
    },
  },
  methods: {
    radio_toggle: function (ev) {
      this.$emit(
        "radio-btn-selected",
        this.radio_buttons.indexOf(this.selected)
      );
    },
  },
};
</script>
<style type="text/css">
.div__radio_selected {
  white-space: nowrap;
  padding-top: 15px;
  color: #b7b7b7;
  padding-bottom: 7px;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
}

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
</style>
