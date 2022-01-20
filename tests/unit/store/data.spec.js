import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import axios from "axios";
const MockAxiosAdapter = require("axios-mock-adapter");
import { system_status_regexp } from "@/store/modules/flask/url_regex";
import { STATUS } from "@/store/modules/flask/enums";
import { ENUMS } from "@/store/modules/playback/enums";
import { socket as socket_client_side } from "@/store/plugins/websocket";
import { arry, new_arry } from "../js_utils/waveform_data_provider.js";
import { ping_system_status } from "../../../store/modules/flask/actions";

const http = require("http");
const io_server = require("socket.io");

describe("store/data", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;
  let ar;
  let nr;

  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
    // event handlers persist through tests, so clear them all before any tests in this file run
    socket_client_side.off();
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    // some tests modify these two values, so make a deep copy before each test
    ar = JSON.parse(JSON.stringify(arry));
    nr = JSON.parse(JSON.stringify(new_arry));
    store.commit("waveform/set_x_axis_zoom_levels", [
      { x_scale: 30 * 1e6 },
      { x_scale: 15 * 1e6 },
      { x_scale: 5 * 1e6 },
      { x_scale: 2 * 1e6 },
      { x_scale: 1 * 1e6 },
    ]);
  });

  afterEach(() => {
    // event handlers persist through tests, so clear them all after each test
    socket_client_side.off();
  });

  test("When initialized, Then the plate_waveforms is an empty representation of a 96-well plate", () => {
    const array_of_waveforms = store.state.data.plate_waveforms;
    expect(array_of_waveforms).toHaveLength(96);
    expect(array_of_waveforms[0]).toStrictEqual(
      expect.objectContaining({
        x_data_points: [],
        y_data_points: [],
      })
    );
    expect(array_of_waveforms[95]).toStrictEqual(
      expect.objectContaining({
        x_data_points: [],
        y_data_points: [],
      })
    );
  });

  describe("mutations/getters", () => {
    test("Given some values in plate_waveforms, When the clear_plate_waveforms mutation is committed, Then plate_waveforms becomes empty x/y data points array", () => {
      store.commit("data/set_plate_waveforms", [
        { x_data_points: [1], y_data_points: [2] },
        { x_data_points: [1], y_data_points: [2] },
      ]);

      store.commit("data/clear_plate_waveforms");
      expect(store.state.data.plate_waveforms).toHaveLength(2);
      expect(store.state.data.plate_waveforms[0].x_data_points).toHaveLength(0);
      expect(store.state.data.plate_waveforms[0].y_data_points).toHaveLength(0);
      expect(store.state.data.plate_waveforms[1].x_data_points).toHaveLength(0);
      expect(store.state.data.plate_waveforms[1].y_data_points).toHaveLength(0);
    });

    test("When plate_waveforms is initially mutated with few data points, Then subsequent mutations append data points to the existing plate_waveforms", async () => {
      store.commit("data/set_plate_waveforms", ar);

      const stored_waveform = store.getters["data/plate_waveforms"];
      expect(stored_waveform).toHaveLength(24);
      expect(stored_waveform[0].x_data_points).toHaveLength(4);

      await store.dispatch("data/append_plate_waveforms", nr);
      expect(store.state.data.plate_waveforms).toHaveLength(24);
      expect(store.state.data.plate_waveforms[0].x_data_points).toHaveLength(8);
      // Tanner (12/20/21): There was a bug where stored_waveform was being changed from an array to an object in append_plate_waveforms, so adding this assertion to prevent that
      expect(Array.isArray(store.state.data.plate_waveforms)).toBe(true);
    });

    test("When mutating heatmap_values, Then getting heatmap_values should return mutated value", async () => {
      const test = {
        "Twitch Force": { data: [0] },
        "Twitch Period": { data: [1] },
        "Twitch Frequency": { data: [2] },
        "Twitch Width 80": { data: [3] },
        "Contraction Velocity": { data: [4] },
        "Relaxation Velocity": { data: [5] },
      };
      store.commit("data/set_heatmap_values", test);
      expect(store.getters["data/heatmap_values"]["Twitch Frequency"]).toStrictEqual({ data: [2] });
    });

    test("When mutating heatmap data at value, Then the data at value in state should return mutated data array", async () => {
      const test = {
        "Twitch Force": { data: [[], [], [], []] },
      };
      store.commit("data/set_heatmap_values", test);
      store.commit("data/set_metric_data", {
        name: "Twitch Force",
        data: [1, 2, 3, 4],
      });
      store.state.data.heatmap_values["Twitch Force"].data.map((well) => {
        expect(well).toHaveLength(1);
      });
    });
  });

  test("Given some values in stim_waveforms, When the clear_stim_waveforms mutation is committed, Then stim_waveforms becomes empty x/y data points array", () => {
    store.commit("data/set_stim_waveforms", [
      { x_data_points: [1], y_data_points: [2] },
      { x_data_points: [1], y_data_points: [2] },
    ]);
    expect(store.state.data.stim_waveforms).toHaveLength(2);
    expect(store.state.data.stim_waveforms).toHaveLength(2);
    expect(store.state.data.stim_waveforms[0].x_data_points).toHaveLength(1);
    expect(store.state.data.stim_waveforms[0].y_data_points).toHaveLength(1);
    expect(store.state.data.stim_waveforms[1].x_data_points).toHaveLength(1);
    expect(store.state.data.stim_waveforms[1].y_data_points).toHaveLength(1);

    store.commit("data/clear_stim_waveforms");
    expect(store.state.data.stim_waveforms).toHaveLength(2);
    expect(store.state.data.stim_waveforms[0].x_data_points).toHaveLength(0);
    expect(store.state.data.stim_waveforms[0].y_data_points).toHaveLength(0);
    expect(store.state.data.stim_waveforms[1].x_data_points).toHaveLength(0);
    expect(store.state.data.stim_waveforms[1].y_data_points).toHaveLength(0);
  });

  test("When stim_waveforms is initially mutated with few data points, Then subsequent mutations append data points to the existing stim_waveforms", async () => {
    store.commit("data/set_stim_waveforms", [
      { x_data_points: [11, 12], y_data_points: [0, 0] },
      { x_data_points: [21], y_data_points: [0] },
      { x_data_points: [], y_data_points: [] },
    ]);

    const stored_waveform = store.getters["data/stim_waveforms"];

    store.dispatch("data/append_stim_waveforms", {
      0: [[13], [99]],
      2: [
        [211, 212],
        [999, 999],
      ],
    });

    expect(stored_waveform).toHaveLength(3);
    expect(stored_waveform[0]).toStrictEqual({
      x_data_points: [11, 12, 13],
      y_data_points: [0, 0, 101000],
    });
    expect(stored_waveform[1]).toStrictEqual({
      x_data_points: [21],
      y_data_points: [0],
    });
    expect(stored_waveform[2]).toStrictEqual({
      x_data_points: [211, 212],
      y_data_points: [101000, 101000],
    });
  });

  describe("websocket", () => {
    // windows CI is having issues
    if (process.platform == "win32") {
      return;
    }
    let http_server;
    let ws_server;
    let socket_server_side;
    beforeEach(() => {
      store.commit("waveform/set_x_axis_zoom_levels", [
        { x_scale: 30 * 1e6 },
        { x_scale: 15 * 1e6 },
        { x_scale: 5 * 1e6 },
        { x_scale: 2 * 1e6 },
        { x_scale: 1 * 1e6 },
      ]);
    });
    beforeAll((done) => {
      http_server = http.createServer().listen(4567); // TODO use constant here
      ws_server = io_server(http_server);
      // wait for connection
      ws_server.on("connect", (socket) => {
        socket_server_side = socket;
        done();
      });
    });

    afterAll(() => {
      if (socket_server_side.connected) {
        socket_server_side.disconnect();
      }
      ws_server.close();
      http_server.close();
    });

    test("Given ws client has a 'message' event handler, When ws server emits a 'message' event, Then client receives message", async () => {
      // Sanity test for websockets
      const expected_message = "Test Message";

      await new Promise((resolve) => {
        socket_client_side.on("message", (message) => {
          expect(message).toEqual(expected_message);
          resolve();
        });
        socket_server_side.send(expected_message);
      });
    });
    test.each([
      ["live_view_active", ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE],
      ["recording", ENUMS.PLAYBACK_STATES.RECORDING],
    ])(
      "Given that playback is in %s state, When backend emits twitch_metrics message, Then ws client updates heatmap_values",
      async (state_name, state_uuid) => {
        store.commit("playback/set_playback_state", state_uuid);

        const init_heatmap_values = {
          "Twitch Force": { data: [[0], [], [20]] },
          "Twitch Period": { data: [[100], [], [120]] },
          "Twitch Frequency": { data: [[200], [], [220]] },
          "Twitch Width 80": { data: [[300], [], [320]] },
          "Contraction Velocity": { data: [[400], [], [420]] },
          "Relaxation Velocity": { data: [[500], [], [520]] },
        };
        store.commit("data/set_heatmap_values", init_heatmap_values);

        const stored_metrics = store.getters["data/heatmap_values"];

        const new_heatmap_values = {
          0: {
            "89cf1105-a015-434f-b527-4169b9400e26": [1, 2], // Twitch Force
            "0fcc0dc3-f9aa-4f1b-91b3-e5b5924279a9": [501, 502], // Relaxation Velocity
          },
          2: {
            "89cf1105-a015-434f-b527-4169b9400e26": [21, 22], // Twitch Force
            "0fcc0dc3-f9aa-4f1b-91b3-e5b5924279a9": [521, 522], // Relaxation Velocity
          },
        };

        await new Promise((resolve) => {
          socket_server_side.emit("twitch_metrics", JSON.stringify(new_heatmap_values), (ack) => {
            resolve(ack);
          });
        });

        let data_validator = (well, idx) => {
          let expected_length = idx != 1 ? 3 : 0;
          expect(well).toHaveLength(expected_length);
        };
        stored_metrics["Twitch Force"].data.map(data_validator);
        stored_metrics["Relaxation Velocity"].data.map(data_validator);
      }
    );
    test.each([
      ["buffering", ENUMS.PLAYBACK_STATES.BUFFERING],
      ["calibrated", ENUMS.PLAYBACK_STATES.CALIBRATED],
    ])(
      "Given that playback is in %s state, When backend emits twitch_metrics message, Then ws client does not update heatmap_values",
      async (state_name, state_uuid) => {
        store.commit("playback/set_playback_state", state_uuid);

        const init_heatmap_values = {
          "Twitch Force": { data: [[0], [], [20]] },
          "Twitch Period": { data: [[100], [], [120]] },
          "Twitch Frequency": { data: [[200], [], [220]] },
          "Twitch Width 80": { data: [[300], [], [320]] },
          "Contraction Velocity": { data: [[400], [], [420]] },
          "Relaxation Velocity": { data: [[500], [], [520]] },
        };
        store.commit("data/set_heatmap_values", init_heatmap_values);

        const stored_metrics = store.getters["data/heatmap_values"];

        const new_heatmap_values = {
          0: {
            "89cf1105-a015-434f-b527-4169b9400e26": [1, 2], // Twitch Force
            "0fcc0dc3-f9aa-4f1b-91b3-e5b5924279a9": [501, 502], // Relaxation Velocity
          },
          2: {
            "89cf1105-a015-434f-b527-4169b9400e26": [21, 22], // Twitch Force
            "0fcc0dc3-f9aa-4f1b-91b3-e5b5924279a9": [521, 522], // Relaxation Velocity
          },
        };

        await new Promise((resolve) => {
          socket_server_side.emit("twitch_metrics", JSON.stringify(new_heatmap_values), (ack) => {
            resolve(ack);
          });
        });

        let data_validator = (well, idx) => {
          let expected_length = idx != 1 ? 1 : 0;
          expect(well).toHaveLength(expected_length);
        };
        stored_metrics["Twitch Force"].data.map(data_validator);
        stored_metrics["Relaxation Velocity"].data.map(data_validator);
      }
    );
    test.each([
      ["buffering", ENUMS.PLAYBACK_STATES.BUFFERING],
      ["live_view_active", ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE],
      ["recording", ENUMS.PLAYBACK_STATES.RECORDING],
    ])(
      "Given that playback is in %s state, When backend emits waveform_data message, Then ws client updates plate_waveforms",
      async (state_name, state_uuid) => {
        store.commit("playback/set_playback_state", state_uuid);

        store.commit("data/set_plate_waveforms", ar);

        const stored_waveform = store.getters["data/plate_waveforms"];
        expect(stored_waveform).toHaveLength(24);
        expect(stored_waveform[0].x_data_points).toHaveLength(4);

        await new Promise((resolve) => {
          socket_server_side.emit("waveform_data", JSON.stringify(nr), (ack) => {
            resolve(ack);
          });
        });

        expect(stored_waveform).toHaveLength(24);
        expect(stored_waveform[0].x_data_points).toHaveLength(8);
      }
    );
    test.each([["calibrated", ENUMS.PLAYBACK_STATES.CALIBRATED]])(
      "Given that playback is in %s state, When backend emits waveform_data message, Then ws client does not update plate_waveforms",
      async (state_name, state_uuid) => {
        store.commit("playback/set_playback_state", state_uuid);

        store.commit("data/set_plate_waveforms", ar);

        const stored_waveform = store.getters["data/plate_waveforms"];
        expect(stored_waveform).toHaveLength(24);
        expect(stored_waveform[0].x_data_points).toHaveLength(4);

        await new Promise((resolve) => {
          socket_server_side.emit("waveform_data", JSON.stringify(nr), (ack) => {
            resolve(ack);
          });
        });

        expect(stored_waveform).toHaveLength(24);
        expect(stored_waveform[0].x_data_points).toHaveLength(4);
      }
    );
    test("When backend emits stimulation message, Then ws client updates stim_waveforms", async () => {
      store.commit("data/set_stim_waveforms", [
        { x_data_points: [1], y_data_points: [2] },
        { x_data_points: [3], y_data_points: [4] },
      ]);

      const stored_stim_data = store.getters["data/stim_waveforms"];
      expect(stored_stim_data).toHaveLength(2);
      expect(stored_stim_data[0].x_data_points).toHaveLength(1);

      const new_stim_data = {
        0: [
          [2, 3],
          [5, 6],
        ],
        1: [[8], [10]],
      };

      await new Promise((resolve) => {
        socket_server_side.emit("stimulation", JSON.stringify(new_stim_data), (ack) => {
          resolve(ack);
        });
      });

      expect(stored_stim_data).toHaveLength(2);
      expect(stored_stim_data[0]).toStrictEqual({
        x_data_points: [1, 2, 3],
        y_data_points: [2, 101000, 101000],
      });
      expect(stored_stim_data[1]).toStrictEqual({
        x_data_points: [3, 8],
        y_data_points: [4, 101000],
      });
    });
    test("When backend emits status update message with no error, Then ws client updates file count", async () => {
      const new_status_update = {
        file_name: "test_filename",
      };

      await new Promise((resolve) => {
        socket_server_side.emit("upload_status", JSON.stringify(new_status_update), (ack) => {
          resolve(ack);
        });
      });

      const { total_uploaded_files, upload_error, file_count } = store.state.settings;

      expect(total_uploaded_files[0]).toBe(new_status_update.file_name);
      expect(upload_error).toBe(false);
      expect(file_count).toBe(1);
    });

    test("When backend emits status update message with an upload error, Then ws client does not update file count and sets upload_error status to true", async () => {
      const new_status_update = {
        file_name: "test_filename",
        error: "upload_error",
      };

      await new Promise((resolve) => {
        socket_server_side.emit("upload_status", JSON.stringify(new_status_update), (ack) => {
          resolve(ack);
        });
      });

      const { total_uploaded_files, upload_error, file_count } = store.state.settings;

      expect(total_uploaded_files[0]).toBe(new_status_update.file_name);
      expect(upload_error).toBe(true);
      expect(file_count).toBe(0);
    });
  });

  // TODO move these to another test file
  describe("Given current status is LIVE_VIEW_ACTIVE", () => {
    let mocked_axios;
    let context = null;

    beforeEach(async () => {
      mocked_axios = new MockAxiosAdapter(axios);

      store.commit("data/set_plate_waveforms", ar);
      context = await store.dispatch("flask/get_flask_action_context");

      store.commit("flask/set_status_uuid", STATUS.MESSAGE.LIVE_VIEW_ACTIVE);
    });

    test("Given that the playback x_time_index is set to a specific value in Vuex, Then the /system_status route is called with Axios with the x_time_index as a parameter", async () => {
      const expected_idx = 9876;
      store.commit("playback/set_x_time_index", expected_idx);
      mocked_axios.onGet(system_status_regexp).reply(200, nr);

      const bound_ping_system_status = ping_system_status.bind(context);
      await bound_ping_system_status();
      expect(mocked_axios.history.get).toHaveLength(1);
      expect(mocked_axios.history.get[0].url).toMatch(new RegExp("http://localhost:4567/system_status?"));
      expect(mocked_axios.history.get[0].url).toMatch(
        new RegExp("currently_displayed_time_index=" + expected_idx)
      );
    });

    test("Given /system_status is mocked to return 200 (and some dummy response) and and /start_recording is mocked to return an HTTP error, When start_recording is dispatched, Then both intervals are cleared in Vuex (status pinging, and playback progression)", async () => {
      mocked_axios
        .onGet(system_status_regexp)
        .reply(200, {
          ui_status_code: STATUS.MESSAGE.CALIBRATION_NEEDED,
          in_simulation_mode: true,
        })
        .onGet("/start_recording")
        .reply(405);

      await store.dispatch("flask/start_status_pinging");
      await store.dispatch("playback/start_playback_progression");

      // confirm pre-conditions
      expect(store.state.flask.status_ping_interval_id).not.toBeNull();
      expect(store.state.playback.playback_progression_interval_id).not.toBeNull();

      await store.dispatch("playback/start_recording");

      expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.ERROR);
      expect(store.state.flask.status_ping_interval_id).toBeNull();
      expect(store.state.playback.playback_progression_interval_id).toBeNull();
    });
  });
});
