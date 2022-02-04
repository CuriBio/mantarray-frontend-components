<template>
  <div class="div__axis-controls">
    <span class="span__axis-controls-zoom-out-button" @click="zoom_out">
      <FontAwesomeIcon :icon="['fa', 'minus-circle']" />
    </span>

    <span class="span__axis-controls-zoom-in-button" @click="zoom_in">
      <FontAwesomeIcon :icon="['fa', 'plus-circle']" />
    </span>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faMinusCircle, faPlusCircle);

/**
 * @vue-props {String} axis - Determines which axis scale the controls change
 * @vue-data {String} zoom_in_message - Popover on hover for zoom in button
 * @vue-data {String} zoom_out_message - Popover on hover for zoom out button
 * @vue-method {event} zoom_in - Commits the zoom-in to change corresponding scale
 * @vue-method {event} zoom_out - Commits the zoom-out to change corresponding scale
 */

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
      this.$store.commit("stimulation/set_zoom_in", this.axis);
    },
    zoom_out() {
      this.$store.commit("stimulation/set_zoom_out", this.axis);
    },
  },
};
</script>
<style scoped>
.div__axis-controls {
  position: relative;
  left: 0px;
}

.span__axis-controls-zoom-out-button {
  text-align: center;
  font-weight: normal;
  position: relative;
  padding-right: 8px;
  height: 24px;
  width: 24px;
}
.span__axis-controls-zoom-in-button {
  font-weight: normal;
  position: relative;
  height: 24px;
  width: 24px;
}
* {
  -webkit-font-smoothing: antialiased;
}
span:hover {
  opacity: 0.8;
}
</style>
