<template>
  <div class="div__recording-time">
    <span class="span__recording-text"
      ><!-- original MockFlow ID: cmpD9e4d5590f7191ac5734d55b90a0dad55 -->
      {{ recording_info }}&nbsp;<wbr />
    </span>
    <!-- original Mockflow ID: cmpD6f15d306b7fda903e3d16885f3ca36aa-->
    <span class="span__time-text">{{ recoded_time }}</span>
    <!--</div>-->
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import playback_module from "@/store/modules/playback";
/**
 * @vue-data {String} recording_info - String with default value
 * @vue-data {String} recoded_time - String with empty string
 * @vue-data {String} playback_state_enums - Playback status in Vuex store.
 * @vue-computed {Int} x_time_index - Current value of time index in Vuex store
 * @vue-computed {Int} recording_start_time - Current value of the recording start time in Vuex store
 */
export default {
  name: "RecordingTime",
  data: function () {
    return {
      recording_info: "Not Recording",
      recoded_time: "",
      playback_state_enums: playback_module.ENUMS.PLAYBACK_STATES,
    };
  },
  computed: {
    ...mapGetters("playback", ["x_time_index", "recording_start_time"]),
    ...mapState("playback", ["playback_state"]),
  },
  watch: {
    playback_state: function () {
      this.update_text_time();
    },
    x_time_index: function () {
      this.update_text_time();
    },
  },
  mounted: function () {},
  methods: {
    pad(n, z) {
      z = z || 2;
      return ("00" + n).slice(-z);
    },
    update_text_time() {
      if (this.playback_state === this.playback_state_enums.RECORDING) {
        const current_diff_in_us = this.x_time_index - this.recording_start_time;
        let current_diff_in_ms = current_diff_in_us / 1000;
        const ms = current_diff_in_ms % 1000;
        current_diff_in_ms = (current_diff_in_ms - ms) / 1000;
        const secs = current_diff_in_ms % 60;
        current_diff_in_ms = (current_diff_in_ms - secs) / 60;
        const mins = current_diff_in_ms % 60;
        const hrs = (current_diff_in_ms - mins) / 60;

        this.recording_info = "Recording:";
        this.recoded_time =
          this.pad(hrs).toString() +
          ":" +
          this.pad(mins).toString() +
          ":" +
          this.pad(secs).toString() +
          "." +
          this.pad(ms, 3).toString();
      } else {
        this.recording_info = "Not Recording";
        this.recoded_time = "";
      }
    },
  },
};
</script>
<style>
.div__recording-time {
  position: relative;
  top: 0px;
  left: 0px;
  background-color: #111111;
  width: 215px;
  height: 45px;
}
.span__recording-text {
  box-sizing: border-box;
  pointer-events: all;
  line-height: 100%;
  overflow: hidden;
  position: absolute;
  width: 128px;
  height: 30px;
  top: 8.3337px;
  left: 4.57143px;
  padding: 5px;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: #ffffff;
  text-align: left;
}
.span__time-text {
  box-sizing: border-box;
  pointer-events: all;
  line-height: 100%;
  overflow: hidden;
  position: absolute;
  width: 115px;
  height: 30px;
  top: 10.3337px;
  left: 93.9091px;
  padding: 5px;
  user-select: none;
  font-family: "Anonymous Pro";
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 16px;
  color: #b7b7b7;
  text-align: left;
}
</style>
