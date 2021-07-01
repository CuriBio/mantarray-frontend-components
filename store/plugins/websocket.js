const io = require("socket.io-client");

export const socket = io("ws://localhost:4567"); // TODO use constant here

/**
 * Create a socket.io plugin for a Vuex store
 * @param {Socket} socket the socket.io instance to connect to the Vuex store
 * @return {function} function the Vuex store will use to connect the pluging to itself
 */
export default function create_web_socket_plugin(socket) {
  return (store) => {
    // note that every time a store with this plugin is created, this event handler gets recreated as well
    socket.on("waveform_data", function (data_json, cb = null) {
      store.commit("data/append_plate_waveforms", JSON.parse(data_json));
      if (cb !== null) {
        // this callback is only used for testing. The backend will not send a callback
        cb("commit done");
      }
    });
  };
}
