<template>
  <div>
    <div class="div__checkbox-background">
      <b-form-checkbox-group
        v-model="selected"
        :options="checkbox_options"
        stacked
      ></b-form-checkbox-group>
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
  },
  methods: {},
};
</script>
<style type="text/css">
.div__checkbox-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  top: 0px;
  left: 0px;
  width: 140px;
  height: 150px;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
  color: rgb(183, 183, 183);
  visibility: visible;
  border: 2px solid rgb(17, 17, 17);
  border-radius: 0px;
  box-shadow: none;
  z-index: 3;
  pointer-events: all;
}
.div__checkbox_selected {
  white-space: nowrap;
  padding-top: 15px;
  color: #b7b7b7;
  padding-bottom: 7px;
}

.custom-checkbox .custom-control-label::before {
  background-color: #000; /* black */
}

/* This is the checked state */
.custom-checkbox .custom-control-input:checked ~ .custom-control-label::before,
.custom-checkbox .custom-control-input:checked ~ .custom-control-label::after {
  background-color: #000; /* black */
  background-image: url("data:image/svg+xml,%3Csvg aria-hidden='true' data-prefix='far' data-icon='check-square' role='img' width='100%' height='100%'  xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'  %3E%3Cpath fill='%2319ac8a' d='M400 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zm0 400H48V80h352v352zm-35.864-241.724L191.547 361.48c-4.705 4.667-12.303 4.637-16.97-.068l-90.781-91.516c-4.667-4.705-4.637-12.303.069-16.971l22.719-22.536c4.705-4.667 12.303-4.637 16.97.069l59.792 60.277 141.352-140.216c4.705-4.667 12.303-4.637 16.97.068l22.536 22.718c4.667 4.706 4.637 12.304-.068 16.971z' class=''%3E%3C/path%3E%3C/svg%3E");
}

.custom-checkbox .custom-control-label:after {
  background: no-repeat;
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
}

input[type="checkbox"]:disabled,
input[type="checkbox"]:disabled + span {
  background: #6e6f72;
}
</style>
