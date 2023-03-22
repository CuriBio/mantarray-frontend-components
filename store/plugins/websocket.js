import { ENUMS } from "../modules/playback/enums";

const io = require("socket.io-client");

export const socket = io("ws://localhost:4567"); // TODO use constant here

const add_handler_with_error_handling = (socket, handler_name, handler_fn) => {
  socket.on(handler_name, (data_json, cb) => {
    try {
      handler_fn(data_json, cb);
    } catch (e) {
      const err_msg = e.stack || e;
      console.error(`In ${handler_name} WS handler:\n${err_msg}`);
      // TODO should probably put system in an error state here
    }
  });
};

/**
 * Create a socket.io plugin for a Vuex store
 * @param {Socket} socket the socket.io instance to connect to the Vuex store
 * @return {function} function the Vuex store will use to connect the plugin to itself
 */
export default function create_web_socket_plugin(socket) {
  return (store) => {
    // every time a store with this plugin is created, these event handlers get recreated as well

    add_handler_with_error_handling(socket, "waveform_data", (data_json, cb) => {
      if (
        store.state.playback.playback_state === ENUMS.PLAYBACK_STATES.BUFFERING ||
        store.state.playback.playback_state === ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE ||
        store.state.playback.playback_state === ENUMS.PLAYBACK_STATES.RECORDING
      ) {
        store.dispatch("data/append_plate_waveforms", JSON.parse(data_json));
      }

      /* istanbul ignore else */
      if (cb) cb("action done"); // this callback is only used for testing. The backend will not send a callback
    });

    add_handler_with_error_handling(socket, "twitch_metrics", (metrics_json, cb) => {
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

    add_handler_with_error_handling(socket, "recording_snapshot_data", (data_json, cb) => {
      /*
        example data_json = {
          time: [array of timepoints],
          force: [[array of 24 arrays of force data for each well] * 24]
        }
        */
      store.dispatch("data/format_recording_snapshot_data", JSON.parse(data_json));
      store.commit("playback/set_is_recording_snapshot_running", false);

      /* istanbul ignore else */
      if (cb) cb("action done"); // this callback is only used for testing. The backend will not send a callback
    });

    add_handler_with_error_handling(socket, "stimulation_data", (stim_json, cb) => {
      // Tanner (12/20/21): may want to put the same checks here as are in the waveform_data handler once stim waveforms are sent instead of subprotocol indices
      store.dispatch("data/append_stim_waveforms", JSON.parse(stim_json));
      /* istanbul ignore else */
      if (cb) cb("action done"); // this callback is only used for testing. The backend will not send a callback
    });

    add_handler_with_error_handling(socket, "stimulator_circuit_statuses", (message_json, cb) => {
      store.dispatch("data/check_stimulator_circuit_statuses", JSON.parse(message_json));

      /* istanbul ignore else */
      if (cb) cb("action done"); // this callback is only used for testing. The backend will not send a callback
    });

    add_handler_with_error_handling(socket, "barcode", (message_json, cb) => {
      if (!store.state.flask.barcode_manual_mode) {
        const message = JSON.parse(message_json);
        for (const barcode_type in store.state.playback.barcodes)
          if (message[barcode_type])
            store.dispatch("playback/validate_barcode", {
              type: barcode_type,
              new_value: message[barcode_type],
            });
      }

      /* istanbul ignore else */
      if (cb) cb("action done"); // this callback is only used for testing. The backend will not send a callback
    });

    add_handler_with_error_handling(socket, "upload_status", (status_json, cb) => {
      const status = JSON.parse(status_json);

      if (status.error) {
        const is_usage_error = status.error.includes("UsageError");
        store.commit("settings/set_upload_error", is_usage_error ? "usage" : "generic");
        // error is sent as string "CloudAnalysisJobFailedError('UsageError')"
        // UsageError returned when jobs limit has been reached
        if (is_usage_error) {
          store.commit("settings/set_file_count");
        }
      } else store.commit("settings/set_file_count");

      store.commit("settings/set_file_name", status.file_name);
      /* istanbul ignore else */
      if (cb) cb("commit done"); // this callback is only used for testing. The backend will not send a callback
    });

    add_handler_with_error_handling(socket, "sw_update", (message_json, cb) => {
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

    add_handler_with_error_handling(socket, "fw_update", (message_json, cb) => {
      const message = JSON.parse(message_json);
      if (message.firmware_update_available === true) {
        console.log("Firmware update found"); // allow-log
        store.commit("settings/set_firmware_update_available", message);
      }

      /* istanbul ignore else */
      if (cb) cb("commit done"); // this callback is only used for testing. The backend will not send a callback
    });

    add_handler_with_error_handling(socket, "prompt_user_input", (message_json, cb) => {
      const message = JSON.parse(message_json);
      if (message.input_type === "user_creds") {
        store.commit("settings/set_user_cred_input_needed", true);
      }

      /* istanbul ignore else */
      if (cb) cb("commit done"); // this callback is only used for testing. The backend will not send a callback
    });

    add_handler_with_error_handling(socket, "local_analysis", (message_json, cb) => {
      const message = JSON.parse(message_json);
      store.commit("settings/set_data_analysis_directory", message.output_dir);

      if (message.failed_recordings) {
        store.commit("settings/set_failed_recordings", message.failed_recordings);
      }

      store.commit("playback/set_data_analysis_state", ENUMS.DATA_ANALYSIS_STATE.COMPLETE);

      /* istanbul ignore else */
      if (cb) cb("commit done"); // this callback is only used for testing. The backend will not send a callback
    });

    add_handler_with_error_handling(socket, "corrupt_files_alert", (_, cb) => {
      store.commit("data/set_h5_warning");
      /* istanbul ignore else */
      if (cb) cb("commit done"); // this callback is only used for testing. The backend will not send a callback
    });

    add_handler_with_error_handling(socket, "error", (message_json, cb) => {
      const message = JSON.parse(message_json);
      store.commit("settings/set_shutdown_error_status", message);
      /* istanbul ignore else */
      if (cb) cb("commit done"); // this callback is only used for testing. The backend will not send a callback
    });
  };
}
