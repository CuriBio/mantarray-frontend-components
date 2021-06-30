<template>
  <div class="div__axis-controls">
    <div class="div__axis-controls-elements">
      <span class="span__axis-controls-zoom-out-button" @click="zoom_out">
        <FontAwesomeIcon :icon="['fa', 'minus-circle']" />
      </span>

      <span class="span__axis-controls-zoom-in-button" @click="zoom_in">
        <FontAwesomeIcon :icon="['fa', 'plus-circle']" />
      </span>
    </div>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faMinusCircle);
library.add(faPlusCircle);

export default {
  name: "StimulationStudioZoomControls",
  components: { FontAwesomeIcon },
  props: {
    axis: { type: String, default: "" },
  },
  data: function () {
    return {
      zoom_in_message: "Zoom-In",
      zoom_out_message: "Zoom-Out",
    };
  },
  methods: {
    zoom_in() {
      this.$store.commit("stimulation/handle_zoom_in", this.axis);
    },
    zoom_out() {
      this.$store.commit("stimulation/handle_zoom_out", this.axis);
    },
  },
};
</script>
<style scoped>
.div__axis-controls {
  position: absolute;
  top: 3px;
  left: 0px;
}
.div__axis-controls-elements {
  height: 45px;
  width: 218px;
  margin: 0px auto;
}
.span__axis-controls-zoom-out-button {
  overflow: hidden;
  text-align: center;
  font-weight: normal;
  position: relative;
  padding-right: 11px;
  font-size: 18px;
  left: 160px;
}
.span__axis-controls-zoom-in-button {
  overflow: hidden;
  text-align: center;
  font-weight: normal;
  position: relative;
  font-size: 18px;
  left: 155px;
}
* {
  -webkit-font-smoothing: antialiased;
}
span:hover {
  opacity: 80%;
}
</style>
