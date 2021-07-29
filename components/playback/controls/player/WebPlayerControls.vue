<template>
  <div class="div__playback-web-player-controls">
    <span class="span__playback-web-player-controls-text">Playback Options:</span>
    <div class="div__playback-web-player-controls-settings-button">
      <PlayerControlsSettingsButton
        ><!-- original mockflow ID: id="cmpD237ca46010539bffd0dce8076a207641"--></PlayerControlsSettingsButton
      >
    </div>
    <span
      class="span__playback-web-player-controls-play-button"
      :class="svg__playback_web_player_controls_play_button__dynamic_class"
      @click="on_play_click()"
    >
      <!-- original mockflow ID: id="cmpD5e8bf5701514a91630d619c1a308f43d"-->

      <FontAwesomeIcon :icon="['fa', 'play-circle']" />
    </span>

    <svg
      class="svg__playback-web-player-controls-pause-button"
      viewBox="0 0 72 72"
      :class="svg__playback_web_player_controls_pause_button__dynamic_class"
      @click="on_pause_click()"
    >
      <!-- original mockflow ID: id="cmpD5e8bf5701514a91630d619c1a308f43d"-->
      <path
        d="M36,0A36,36,0,1,0,72,36,36,36,0,0,0,36,0ZM33.1,49.6a3,3,0,0,1-3,3H22.4a3.1,3.1,0,0,1-3-3V22.4a3.1,3.1,0,0,1,3-3h7.7a3,3,0,0,1,3,3Zm19.5,0a3.1,3.1,0,0,1-3,3H41.9a3,3,0,0,1-3-3V22.4a3,3,0,0,1,3-3h7.7a3.1,3.1,0,0,1,3,3Z"
      ></path>
    </svg>

    <svg
      class="svg__playback-web-player-controls-stop-button"
      viewBox="0 0 72 72"
      :class="svg__playback_web_player_controls_stop_button__dynamic_class"
      @click="on_stop_click()"
    >
      <!-- original mockflow ID: id="cmpD0c21e73b858601c2f188b0d5a903fcb3"-->
      <path
        d="M36,0A36,36,0,1,0,72,36,36,36,0,0,0,36,0ZM52.6,49.6a3.1,3.1,0,0,1-3,3H22.4a3.1,3.1,0,0,1-3-3V22.4a3.1,3.1,0,0,1,3-3H49.6a3.1,3.1,0,0,1,3,3Z"
      ></path>
    </svg>

    <svg
      class="svg__playback-web-player-controls-loop-button"
      viewBox="0 0 72 72"
      :class="svg__playback_web_player_controls_loop_button__dynamic_class"
      @click="loop_playback = !loop_playback"
    >
      <!-- original mockflow ID: id="cmpD92d8b2f97846a56d52d1103b34dd8e08"-->
      <path
        d="M63.1,42,40,52.9a1.5,1.5,0,0,0-.2,2.5l4.1,2.8A23.7,23.7,0,0,1,12.4,37.1,1.4,1.4,0,0,0,11,35.7H1.6A1.4,1.4,0,0,0,.2,37.1a27.9,27.9,0,0,0,.7,5.8.4.4,0,0,0,0,.5,35.4,35.4,0,0,0,9.7,18A36.2,36.2,0,0,0,36,71.9a35.7,35.7,0,0,0,19.4-5.7L60.8,70A1.4,1.4,0,0,0,63,68.9l2.1-25.5A1.4,1.4,0,0,0,63.1,42Z"
      ></path>
      <path
        d="M71.2,29.2a.5.5,0,0,0,0-.5A35.8,35.8,0,0,0,36.1.2,35.7,35.7,0,0,0,16.7,5.9L11.3,2.1A1.4,1.4,0,0,0,9.1,3.2L7,28.6A1.4,1.4,0,0,0,9,30L32.1,19.2a1.5,1.5,0,0,0,.2-2.5l-4.1-2.9a23.9,23.9,0,0,1,27.2,8.7A23.5,23.5,0,0,1,59.7,35a1.3,1.3,0,0,0,1.4,1.3h9.4a1.5,1.5,0,0,0,1.4-1.5A27.8,27.8,0,0,0,71.2,29.2Z"
      ></path>
    </svg>
  </div>
</template>
<script>
import PlayerControlsSettingsButton from "./PlayerControlsSettingsButton.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import playback_module from "@/store/modules/playback";
import { faPlayCircle as fa_play_circle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapState } from "vuex";
library.add(fa_play_circle);

/**
 * @vue-prop {Boolean} create_with_vuex_in_stopped_state - to create stopped state
 * @vue-event {Event} on_play_click - Click the play button to start playback
 * @vue-event {Event} on_pause_click - Click the pause button to pause playback
 * @vue-event {Event} on_stop_click - Click the stop button to stop playback
 * @vue-computed {Boolean} loop_playback - a boolean value which in Vuex, true on loopback else false
 * @vue-computed {String} playback_state = String that holds the playback_state in Vuex store.
 */
export default {
  name: "WebPlayerControls",
  components: { FontAwesomeIcon, PlayerControlsSettingsButton },
  props: {
    create_with_vuex_in_stopped_state: { type: Boolean, default: false }, // primarily used for E2E testing,
  },
  computed: {
    loop_playback: {
      get() {
        return this.$store.state.playback.loop_playback;
      },
      set(new_state) {
        this.$store.commit("playback/set_loop_playback", new_state);
      },
    },
    ...mapState("playback", {
      playback_state: "playback_state",
    }),
    svg__playback_web_player_controls_loop_button__dynamic_class: function () {
      return {
        "span__playback-web-player-controls--active": this.loop_playback,
        "span__playback-web-player-controls--available": !this.loop_playback,
      };
    },
    svg__playback_web_player_controls_play_button__dynamic_class: function () {
      return {
        "span__playback-web-player-controls--active":
          this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.PLAYING,
        "span__playback-web-player-controls--available":
          this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.STOPPED ||
          this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.PAUSED,
      };
    },
    svg__playback_web_player_controls_pause_button__dynamic_class: function () {
      return {
        "span__playback-web-player-controls--active":
          this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.PAUSED,
        "span__playback-web-player-controls--available":
          this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.PLAYING,
      };
    },
    svg__playback_web_player_controls_stop_button__dynamic_class: function () {
      return {
        "span__playback-web-player-controls--available":
          this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.PLAYING ||
          this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.PAUSED,
      };
    },
  },
  created() {
    if (this.create_with_vuex_in_stopped_state) {
      this.$store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.STOPPED
      );
    }
  },
  methods: {
    on_play_click: function () {
      if (
        this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.STOPPED ||
        this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.PAUSED
      ) {
        this.$store.dispatch(
          "playback/transition_playback_state",
          playback_module.ENUMS.PLAYBACK_STATES.PLAYING
        );
      }
    },
    on_pause_click: function () {
      if (this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.PLAYING) {
        this.$store.dispatch(
          "playback/transition_playback_state",
          playback_module.ENUMS.PLAYBACK_STATES.PAUSED
        );
      }
    },
    on_stop_click: function () {
      if (
        this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.PLAYING ||
        this.playback_state === playback_module.ENUMS.PLAYBACK_STATES.PAUSED
      ) {
        this.$store.dispatch("playback/stop_playback");
      }
    },
  },
};
</script>
<style type="text=css">
.div__playback-web-player-controls {
  --span__playback-web-player-controls-button--Top: 37px;
  --span__playback-web-player-controls-button--LeftmostLeft: 16px;
  --span__playback-web-player-controls-button--LeftSeparation: 55.5px;
  height: 81px;
  width: 287px;
  top: 0px;
  left: 0px;
  position: absolute;
  background-color: #000000;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  text-align: center;
  color: #2f2f2f;
  fill: #2f2f2f;
}

.span__playback-web-player-controls-text {
  pointer-events: all;
  line-height: 100%;
  overflow: hidden;
  position: absolute;
  width: 207px;
  height: 23px;
  left: 11px;
  top: 6px;
  padding: 5px;
  user-select: none;
  font-size: 16px;
  color: #ffffff;
  text-align: left;
}

.div__playback-web-player-controls-settings-button {
  position: absolute;
  top: var(--span__playback-web-player-controls-button--Top);
  left: var(--span__playback-web-player-controls-button--LeftmostLeft);
}

.span__playback-web-player-controls--available {
  color: #b7b7b7;
  fill: #b7b7b7;
}
.span__playback-web-player-controls--active {
  color: #ffffff;
  fill: #ffffff;
}

.span__playback-web-player-controls-play-button {
  position: absolute;
  top: var(--span__playback-web-player-controls-button--Top);
  left: calc(
    var(--span__playback-web-player-controls-button--LeftmostLeft) +
      var(--span__playback-web-player-controls-button--LeftSeparation) * 1
  );
  position: absolute;
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 30px;
}

.svg__playback-web-player-controls-pause-button {
  width: 30px;
  height: 30px;
  top: var(--span__playback-web-player-controls-button--Top);
  left: calc(
    var(--span__playback-web-player-controls-button--LeftmostLeft) +
      var(--span__playback-web-player-controls-button--LeftSeparation) * 2
  );
  position: absolute;
}

.svg__playback-web-player-controls-stop-button {
  position: absolute;
  top: var(--span__playback-web-player-controls-button--Top);
  left: calc(
    var(--span__playback-web-player-controls-button--LeftmostLeft) +
      var(--span__playback-web-player-controls-button--LeftSeparation) * 3
  );
  position: absolute;
  width: 30px;
  height: 30px;
}
.svg__playback-web-player-controls-loop-button {
  position: absolute;
  top: var(--span__playback-web-player-controls-button--Top);
  left: calc(
    var(--span__playback-web-player-controls-button--LeftmostLeft) +
      var(--span__playback-web-player-controls-button--LeftSeparation) * 4
  );
  position: absolute;
  width: 30px;
  height: 30px;
}
</style>
