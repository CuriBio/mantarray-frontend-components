<template>
  <div>
    <div class="div__radiobutton-background">
      <div class="div__radio_selected" @click="radio_toggle()">
        <FontAwesomeIcon v-show="status" :icon="['fa', 'dot-circle']" />
        <FontAwesomeIcon v-show="!status" :icon="['fa', 'circle']" />
        Spike&nbsp;Amplitude
      </div>
    </div>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircle as fa_circle } from "@fortawesome/free-solid-svg-icons";
import { faDotCircle as fa_dotcircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fa_circle);
library.add(fa_dotcircle);
export default {
  name: "RadioButtonWidget",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      status: false,
    };
  },
  methods: {
    radio_toggle: function () {
      this.status = !this.status;
    },
  },
};
</script>
<style type="text/css">
.div__radiobutton-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(17, 17, 17);
  position: absolute;
  top: 0px;
  left: 0px;
  width: 140px;
  height: 50px;
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
.div__radio_selected {
  white-space: nowrap;
  padding-top: 15px;
  color: #b7b7b7;
  padding-bottom: 7px;
}
</style>
