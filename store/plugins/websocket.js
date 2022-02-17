import { ENUMS } from "../modules/playback/enums";

const io = require("socket.io-client");

export const socket = io("ws://localhost:4567"); // TODO use constant here

/**
 * Create a socket.io plugin for a Vuex store
 * @param {Socket} socket the socket.io instance to connect to the Vuex store
 * @return {function} function the Vuex store will use to connect the plugin to itself
 */
export default function create_web_socket_plugin(socket) {
  return (store) => {
    // every time a store with this plugin is created, these event handlers get recreated as well
    socket.on("waveform_data", (data_json, cb) => {
      if (
        store.state.playback.playback_state === ENUMS.PLAYBACK_STATES.BUFFERING ||
        store.state.playback.playback_state === ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE ||
        store.state.playback.playback_state === ENUMS.PLAYBACK_STATES.RECORDING
      ) {
        store.dispatch("data/append_plate_waveforms", JSON.parse(data_json));
      }

      /* istanbul ignore else */
      if (cb) cb("commit done"); // this callback is only used for testing. The backend will not send a callback
    });
    socket.on("twitch_metrics", (metrics_json, cb) => {
      // guard against metrics coming right after live view stops so heatmap stays cleared,
      // also need to make sure heatmap can update while recording
      if (
        store.state.playback.playback_state === ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE ||
        store.state.playback.playback_state === ENUMS.PLAYBACK_STATES.RECORDING
      ) {
        store.commit("data/append_metric_data", JSON.parse(metrics_json));
      }

      /* istanbul ignore else */
      if (cb) cb("commit done"); // this callback is only used for testing. The backend will not send a callback
    });
    socket.on("stimulation", (stim_json, cb) => {
      // Tanner (12/20/21): may want to put the same checks here as are in the waveform_data handler once stim waveforms are sent instead of subprotocol indices
      store.dispatch("data/append_stim_waveforms", JSON.parse(stim_json));

      /* istanbul ignore else */
      if (cb) cb("commit done"); // this callback is only used for testing. The backend will not send a callback
    });
    socket.on("barcode", (message_json, cb) => {
      if (!store.state.flask.barcode_manual_mode) {
        const message = JSON.parse(message_json);
        store.commit("playback/set_barcode_number", message.plate_barcode);
      }

      /* istanbul ignore else */
      if (cb) cb("commit done"); // this callback is only used for testing. The backend will not send a callback
    });
    socket.on("upload_status", (status_json, cb) => {
      const status = JSON.parse(status_json);

      if (status.error) store.commit("settings/set_upload_error", true);
      else store.commit("settings/set_file_count");

      store.commit("settings/set_file_name", status.file_name);

      /* istanbul ignore else */
      if (cb) cb("commit done"); // this callback is only used for testing. The backend will not send a callback
    });
    socket.on("sw_update", (message_json, cb) => {
      const message = JSON.parse(message_json);
      if (message.allow_software_update !== undefined) {
        store.commit("settings/set_allow_sw_update_install", message.allow_software_update);
      }
      if (message.software_update_available !== undefined) {
        const status = message.software_update_available ? "found" : "not found";
        console.log("Software update " + status); // allow-log
        store.commit("settings/set_software_update_available", message.software_update_available);
      }

      /* istanbul ignore else */
      if (cb) cb("commit done"); // this callback is only used for testing. The backend will not send a callback
    });
    socket.on("fw_update", (message_json, cb) => {
      const message = JSON.parse(message_json);
      if (message.firmware_update_available === true) {
        console.log("Firmware update found"); // allow-log
        store.commit("settings/set_firmware_update_available", message);
      }

      /* istanbul ignore else */
      if (cb) cb("commit done"); // this callback is only used for testing. The backend will not send a callback
    });
    socket.on("prompt_user_input", (message_json, cb) => {
      const message = JSON.parse(message_json);
      if (message.input_type === "customer_creds") {
        store.commit("settings/set_user_cred_input_needed", true);
      }

      /* istanbul ignore else */
      if (cb) cb("commit done"); // this callback is only used for testing. The backend will not send a callback
    });
  };
}
