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
    socket.on("waveform_data", function (data_json, cb = null) {
      store.commit("data/append_plate_waveforms", JSON.parse(data_json));
      if (cb !== null) {
        // this callback is only used for testing. The backend will not send a callback
        cb("commit done");
      }
    });
    socket.on("twitch_metrics", function (metrics_json, cb = null) {
      // guard against metrics coming right after live view stops so heatmap stay cleared
      if (store.state.playback.playback_state !== ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE) {
        return; // TODO update test for this
      }
      const new_metric_data = JSON.parse(metrics_json);
      store.commit("data/append_metric_data", new_metric_data);
      if (cb !== null) {
        // this callback is only used for testing. The backend will not send a callback
        cb("commits done");
      }
    });
  };
}
