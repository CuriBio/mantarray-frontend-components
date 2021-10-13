<template>
  <div>
    <span class="span__playback-player-controls-settings-button">
      <!-- original mockflow ID: id="cmpD237ca46010539bffd0dce8076a207641"-->
      <FontAwesomeIcon :icon="['fa', 'cog']" />
    </span>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCog as fa_cog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fa_cog);

export default {
  name: "PlayerControlsSettingsButton",
  components: { FontAwesomeIcon },
};
</script>
<style type="text=css">
.span__playback-player-controls-settings-button {
  text-align: center;
  position: absolute;
  width: 30px;
  height: 30px;
  line-height: 30px;
  top: 0px;
  left: 0px;
  color: #b7b7b7;
  font-size: 30px;
}
.span__playback-player-controls-settings-button:hover {
  color: #ffffff;
}

/* Added as a part of the task */
.span__playback-player-controls-settings-button_modified:hover {
  color: #ececed;
}

#settings-form {
  position: fixed;
  margin: 5% auto;
  top: 10%;
  left: 0;
  right: 0;
}
</style>
