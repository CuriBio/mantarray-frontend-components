<template>
  <div class="div__stimulation-controls-container">
    <span class="span__additional-controls-header">Additional Controls</span>
    <span class="span__stimulation-label">Stimulation</span>
    <div class="div__border-container">
      <svg class="svg__stimulation-active-button" height="20" width="20">
        <defs>
          <radialGradient id="greenGradient">
            <stop offset="10%" :stop-color="play_state ? 'lightgreen' : '#b7b7b7'" />
            <stop offset="95%" :stop-color="play_state ? 'rgb(0, 88, 0)' : '#858585'" />
          </radialGradient>
        </defs>
        <circle cx="10" cy="10" r="10" fill="url('#greenGradient')" />
      </svg>
      <svg class="svg__stimulation-controls-loop-button" viewBox="0 0 72 72">
        <path
          d="M63.1,42,40,52.9a1.5,1.5,0,0,0-.2,2.5l4.1,2.8A23.7,23.7,0,0,1,12.4,37.1,1.4,1.4,0,0,0,11,35.7H1.6A1.4,1.4,0,0,0,.2,37.1a27.9,27.9,0,0,0,.7,5.8.4.4,0,0,0,0,.5,35.4,35.4,0,0,0,9.7,18A36.2,36.2,0,0,0,36,71.9a35.7,35.7,0,0,0,19.4-5.7L60.8,70A1.4,1.4,0,0,0,63,68.9l2.1-25.5A1.4,1.4,0,0,0,63.1,42Z"
        ></path>
        <path
          d="M71.2,29.2a.5.5,0,0,0,0-.5A35.8,35.8,0,0,0,36.1.2,35.7,35.7,0,0,0,16.7,5.9L11.3,2.1A1.4,1.4,0,0,0,9.1,3.2L7,28.6A1.4,1.4,0,0,0,9,30L32.1,19.2a1.5,1.5,0,0,0,.2-2.5l-4.1-2.9a23.9,23.9,0,0,1,27.2,8.7A23.5,23.5,0,0,1,59.7,35a1.3,1.3,0,0,0,1.4,1.3h9.4a1.5,1.5,0,0,0,1.4-1.5A27.8,27.8,0,0,0,71.2,29.2Z"
        ></path>
      </svg>
      <span class="span__stimulation-controls-play-stop-button" @click="handle_play_stop">
        <FontAwesomeIcon v-if="!play_state" class="fontawesome_icon_class" :icon="['fa', 'play-circle']" />
        <FontAwesomeIcon v-if="play_state" class="fontawesome_icon_class" :icon="['fa', 'stop-circle']" />
      </span>
    </div>
    <img class="img__additional-controls-icon" src="/additional-controls-icon.png" />
    <img class="img__waveform-icon" src="/waveform-icon.png" />
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faPlayCircle as fa_play_circle,
  faStopCircle as fa_stop_circle,
} from "@fortawesome/free-solid-svg-icons";
library.add(fa_play_circle, fa_stop_circle);

// TODO Luci, swap out PNG for SVG once folder becomes available

export default {
  name: "StimulationControls",
  components: {
    FontAwesomeIcon,
  },
  data() {
    return {
      play_state: false,
    };
  },
  methods: {
    async handle_play_stop() {
      this.play_state = !this.play_state;
      if (this.play_state) await this.$store.dispatch("playback/start_recording");
      if (!this.play_state) await this.$store.dispatch("playback/stop_recording");
    },
  },
};
</script>
<style scoped>
.div__stimulation-controls-container {
  position: absolute;
  background: black;
  height: 110px;
  width: 100%;
  top: 40%;
  padding: 5px;
  font-family: Muli;
  padding-left: 20px;
  font-weight: lighter;
}
.span__additional-controls-header {
  color: rgb(255, 255, 255);
  position: relative;
}
.div__border-container {
  position: relative;
  border: 3px solid rgb(17, 17, 17);
  height: 50px;
  width: 40%;
  top: 10%;
  left: 30%;
  display: grid;
  grid-template-columns: repeat(25%, 4);
  align-items: center;
  justify-items: center;
  padding: 5px;
}
.span__stimulation-label {
  position: absolute;
  color: rgb(255, 255, 255);
  font-size: 9px;
  background: black;
  top: 31%;
  left: 41%;
  z-index: 1;
  letter-spacing: 1px;
}
.span__stimulation-controls-play-stop-button {
  position: relative;
  color: #b7b7b7;
  grid-column: 4;
  height: 20px;
  width: 20px;
}
.svg__stimulation-controls-loop-button {
  position: relative;
  fill: #b7b7b7;
  height: 20px;
  width: 20px;
  grid-column: 3/4;
}
.svg__stimulation-active-button {
  position: relative;
  color: #b7b7b7;
  grid-column: 2/3;
}
.img__waveform-icon {
  position: relative;
  bottom: 45px;
  height: 67px;
  right: 40px;
}
.fontawesome_icon_class {
  height: 20px;
  width: 20px;
}
.img__additional-controls-icon {
  position: relative;
  opacity: 50%;
  height: 65px;
  bottom: 45px;
  left: -15px;
}
</style>
