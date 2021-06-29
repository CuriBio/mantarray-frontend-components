const io = require("socket.io-client");

export const socket = io("ws://localhost:4567"); // TODO use constant here

/**
 * Create a socket.io plugin for a Vuex store
 * @param {Object} socket the socket.io instance to connect to the Vuex store  // TODO should figure out what the actual type is
 * @return {Object} not sure how to type an anonymous func
 */
export default function create_web_socket_plugin(socket) {
  return (store) => {
    socket.on("waveform_data", function (data_json, cb = null) {
      store.commit("waveform/append_plate_waveforms", JSON.parse(data_json));
      if (cb !== null) {
        // this callback is only used for testing. The backend will not send a callback
        cb("commit done");
      }
    });
  };
}
