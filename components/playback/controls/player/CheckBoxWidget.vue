<template>
  <div>
    <div class="div__checkbox-background">
      <div class="div__checkbox_selected" @click="check_toggle()">
        <FontAwesomeIcon v-show="status" :icon="['far', 'check-square']" />
        <FontAwesomeIcon v-show="!status" :icon="['far', 'square']" />
        Ascorbic&nbsp;Acid
      </div>
      <div class="div__checkbox_selected" @click="check_toggle1()">
        <FontAwesomeIcon v-show="status1" :icon="['far', 'check-square']" />
        <FontAwesomeIcon v-show="!status1" :icon="['far', 'square']" />
        &nbsp;&nbsp;&nbsp;&nbsp;B27
      </div>
      <div class="div__checkbox_selected" @click="check_toggle2()">
        <FontAwesomeIcon v-show="status2" :icon="['far', 'check-square']" />
        <FontAwesomeIcon v-show="!status2" :icon="['far', 'square']" />
        &nbsp;&nbsp;&nbsp;&nbsp;B27 (-insulin)
      </div>
    </div>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheckSquare as fa_checksquare } from "@fortawesome/free-regular-svg-icons";
import { faSquare as fa_square } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fa_checksquare);
library.add(fa_square);
export default {
  name: "CheckBoxWidget",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      status: false,
      status1: false,
      status2: false,
    };
  },
  methods: {
    check_toggle: function () {
      this.status = !this.status;
    },
    check_toggle1: function () {
      this.status1 = !this.status1;
    },
    check_toggle2: function () {
      this.status2 = !this.status2;
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
</style>
