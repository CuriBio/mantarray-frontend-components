import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import axios from "axios";
const MockAxiosAdapter = require("axios-mock-adapter");
import { system_status_regexp } from "@/store/modules/flask/url_regex";
import { STATUS } from "@/store/modules/flask/enums";
import { ENUMS } from "@/store/modules/playback/enums";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";
import { socket as socket_client_side } from "@/store/plugins/websocket";
import { arry, new_arry } from "../js_utils/waveform_data_provider.js";
import { ping_system_status } from "@/store/modules/flask/actions";
import { ERRORS } from "../../../store/modules/settings/enums.js";

const valid_plate_barcode_old = "ML2022001000";
const valid_plate_barcode_beta_1 = "ML22001000-1";
const valid_plate_barcode_beta_2 = "ML22001000-2";
const valid_stim_barcode_old = "MS2022001000";

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

    test("When tissue waveforms get appended and stim is active, Then the stim waveforms will get updated with latest tissue data timepoint", async () => {
      const test_stim = {
        0: [
          [5000, 10000],
          [0, 1],
        ],
        1: [[11000], [1]],
      };

      await store.dispatch("data/append_stim_waveforms", test_stim);
      expect(store.state.data.stim_fill_assignments).toStrictEqual(
        [
          [
            [
              0,
              [
                [5000, 101000],
                [10000, 101000],
              ],
            ],
            [
              1,
              [
                [10000, 101000],
                [10000, 101000],
              ],
            ],
          ],
          [
            [
              1,
              [
                [11000, 101000],
                [11000, 101000],
              ],
            ],
          ],
        ].concat(new Array(94).fill([]))
      );

      const tissue_arr = {
        waveform_data: {
          basic_data: {
            waveform_data_points: {
              0: {
                x_data_points: [13000],
                y_data_points: [20],
              },
              1: {
                x_data_points: [13000],
                y_data_points: [50],
              },
            },
          },
        },
      };
      await store.dispatch("data/append_plate_waveforms", tissue_arr);
      expect(store.state.data.stim_fill_assignments).toStrictEqual(
        [
          [
            [
              0,
              [
                [5000, 101000],
                [10000, 101000],
              ],
            ],
            [
              1,
              [
                [10000, 101000],
                [13000, 101000],
              ],
            ],
          ],
          [
            [
              1,
              [
                [11000, 101000],
                [13000, 101000],
              ],
            ],
          ],
        ].concat(new Array(94).fill([]))
      );
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

  test("When stim_waveforms is first mutated and start_recording_from_stim is set to true, Then the first timepoint will be added to stimulation state", async () => {
    await store.commit("playback/set_start_recording_from_stim", true);
    expect(store.state.stimulation.stim_start_time_idx).toBeNull();

    store.dispatch("data/append_stim_waveforms", {
      0: [[1200000], [0]],
      2: [
        [1200000, 0],
        [9999999, 0],
      ],
    });

    expect(store.state.stimulation.stim_start_time_idx).toBe(1200000);
  });

  test("Given stim_fill_assignments already has values for at least one subprotocol for a well, When a data for a single new subprotocol is appended, Then the end timepoint of the first subprotocol is updated to the start timepoint of the new subprotocol", async () => {
    store.dispatch("data/append_stim_waveforms", { 0: [[0], [0]] });

    // confirm precondition
    expect(store.state.data.stim_fill_assignments[0]).toStrictEqual([
      [
        0,
        [
          [0, 101000],
          [0, 101000],
        ],
      ],
    ]);

    store.dispatch("data/append_stim_waveforms", { 0: [[10], [1]] });

    // make sure new valadded to stim_fill_assignments and prev val updated correctly
    expect(store.state.data.stim_fill_assignments[0]).toStrictEqual([
      [
        0,
        [
          [0, 101000],
          [10, 101000],
        ],
      ],
      [
        1,
        [
          [10, 101000],
          [10, 101000],
        ],
      ],
    ]);
  });

  describe("websocket", () => {
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
    test("When h5 files are detected by desktop app, Then client show error", async () => {
      // empty array to represent the corrupt files.
      const expected_message = JSON.stringify([]);
      expect(store.state.data.h5_warning).toBe(false);

      await new Promise((resolve) => {
        socket_server_side.emit("corrupt_files_alert", expected_message, (ack) => {
          resolve(ack);
        });
      });
      expect(store.state.data.h5_warning).toBe(true);
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

        const stored_metrics = store.getters["data/heatmap_values"];
        const data_validator = (well, idx) => {
          const expected_length = idx != 1 ? 3 : 0;
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
    test("When a user starts a data analysis on selected recordings and they complete, Then a websocket message will be sent notifying user of completion and set directory of where to locate files", async () => {
      const expected_message = {
        output_dir: "C:\\test\\analysis\\path\\",
        failed_recordings: ["rec_1", "rec_2", "rec_3"],
      };

      await new Promise((resolve) => {
        socket_server_side.emit("local_analysis", JSON.stringify(expected_message), (ack) => {
          resolve(ack);
        });
      });

      expect(store.state.settings.data_analysis_directory).toBe(expected_message.output_dir);
      expect(store.state.settings.failed_recordings).toStrictEqual(expected_message.failed_recordings);
      expect(store.state.playback.data_analysis_state).toBe(ENUMS.DATA_ANALYSIS_STATE.COMPLETE);
    });

    test("When recording snapshot data gets sent through websocket after a recording stops, Then the handler will dispatch a data action with parsed data", async () => {
      const example_message = {
        time: [0, 1, 2, 3, 4, 5],
        force: [
          [10, 15, 20, 25, 20, 15],
          [300, 400, 300, 500, 600, 300],
        ],
      };

      const expected_coordinates = [
        [
          [0, 10],
          [1, 15],
          [2, 20],
          [3, 25],
          [4, 20],
          [5, 15],
        ],
        [
          [0, 300],
          [1, 400],
          [2, 300],
          [3, 500],
          [4, 600],
          [5, 300],
        ],
      ];

      store.state.playback.is_recording_snapshot_running = true;

      await new Promise((resolve) => {
        socket_server_side.emit("recording_snapshot_data", JSON.stringify(example_message), (ack) => {
          resolve(ack);
        });
      });
      expect(store.state.data.recording_snapshot_data).toStrictEqual(expected_coordinates);
      expect(store.state.playback.is_recording_snapshot_running).toBe(false);
    });

    test("When recording snapshot data returns an error, Then the handler will dispatch a data action with parsed data", async () => {
      const example_message = {
        error: "test_error",
      };

      store.state.playback.is_recording_snapshot_running = true;
      expect(store.state.data.recording_snapshot_error).toBe(false);

      await new Promise((resolve) => {
        socket_server_side.emit("recording_snapshot_data", JSON.stringify(example_message), (ack) => {
          resolve(ack);
        });
      });

      expect(store.state.data.recording_snapshot_error).toBe(example_message.error);
      expect(store.state.playback.is_recording_snapshot_running).toBe(false);
    });

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
        socket_server_side.emit("stimulation_data", JSON.stringify(new_stim_data), (ack) => {
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

    test("When backend emits stimulator_circuit_status message with short circuit errors, Then ws client updates stim status to short circuit error", async () => {
      // confirm precondition
      const initial_statuses = store.state.data.stimulator_circuit_statuses;
      expect(initial_statuses).toHaveLength(0);

      const stimulator_statuses = new Array(24)
        .fill("open", 0, 10)
        .fill("media", 10, 20)
        .fill("short", 20, 24);

      const stimulator_statuses_obj = {};
      stimulator_statuses.map((status, well_idx) => {
        stimulator_statuses_obj[`${well_idx}`] = status;
      });

      await new Promise((resolve) => {
        socket_server_side.emit(
          "stimulator_circuit_statuses",
          JSON.stringify(stimulator_statuses_obj),
          (ack) => {
            resolve(ack);
          }
        );
      });

      const updated_statuses = store.state.data.stimulator_circuit_statuses;
      const stim_status = store.state.stimulation.stim_status;

      expect(updated_statuses).toStrictEqual(initial_statuses);
      expect(stim_status).toBe(STIM_STATUS.SHORT_CIRCUIT_ERROR);
    });

    test("When backend emits stimulator_circuit_status message with error status, Then ws client updates stim status to short circuit error", async () => {
      // confirm precondition
      const initial_statuses = store.state.data.stimulator_circuit_statuses;
      expect(initial_statuses).toHaveLength(0);

      const stimulator_statuses = new Array(24)
        .fill("open", 0, 10)
        .fill("media", 10, 20)
        .fill("error", 20, 24);

      await new Promise((resolve) => {
        socket_server_side.emit("stimulator_circuit_statuses", JSON.stringify(stimulator_statuses), (ack) => {
          resolve(ack);
        });
      });

      const updated_statuses = store.state.data.stimulator_circuit_statuses;
      const stim_status = store.state.stimulation.stim_status;

      expect(updated_statuses).toStrictEqual(initial_statuses);
      expect(stim_status).toBe(STIM_STATUS.SHORT_CIRCUIT_ERROR);
    });

    test("When backend emits stimulator_circuit_status message with no short  errors, Then ws client updates stim status to config check complete and set indices to data state", async () => {
      // confirm precondition
      const initial_statuses = store.state.data.stimulator_circuit_statuses;
      expect(initial_statuses).toHaveLength(0);

      const stimulator_statuses = new Array(24).fill("open", 0, 10).fill("media", 10, 24);

      await new Promise((resolve) => {
        socket_server_side.emit("stimulator_circuit_statuses", JSON.stringify(stimulator_statuses), (ack) => {
          resolve(ack);
        });
      });

      const updated_statuses = store.state.data.stimulator_circuit_statuses;
      const stim_status = store.state.stimulation.stim_status;

      expect(updated_statuses).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      expect(stim_status).toBe(STIM_STATUS.CONFIG_CHECK_COMPLETE);
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

    test("When backend emits status update message with an upload error, Then ws client does not update file count and sets upload_error status to 'generic'", async () => {
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
      expect(upload_error).toBe("generic");
      expect(file_count).toBe(0);
    });

    test("When backend emits status update message with an usage upload error, Then ws client does update file count and sets upload_error status to 'usage'", async () => {
      const new_status_update = {
        file_name: "test_filename",
        error: "CloudAnalysisJobFailedError('UsageError')",
      };

      await new Promise((resolve) => {
        socket_server_side.emit("upload_status", JSON.stringify(new_status_update), (ack) => {
          resolve(ack);
        });
      });

      const { total_uploaded_files, upload_error, file_count } = store.state.settings;

      expect(total_uploaded_files[0]).toBe(new_status_update.file_name);
      expect(upload_error).toBe("usage");
      expect(file_count).toBe(1);
    });

    test("When backend emits sw_update message with allow_software_update value, Then ws client commits value to store", async () => {
      const message = {
        allow_software_update: true,
      };

      // confirm precondition
      expect(store.state.settings.allow_sw_update_install).toBe(false);

      await new Promise((resolve) => {
        socket_server_side.emit("sw_update", JSON.stringify(message), (ack) => {
          resolve(ack);
        });
      });
      expect(store.state.settings.allow_sw_update_install).toBe(true);
    });
    test("When backend emits sw_update message with software_update_available value, Then ws client commits value to store", async () => {
      const message = {
        software_update_available: true,
      };

      // confirm precondition
      expect(store.state.settings.software_update_available).toBe(false);

      await new Promise((resolve) => {
        socket_server_side.emit("sw_update", JSON.stringify(message), (ack) => {
          resolve(ack);
        });
      });
      expect(store.state.settings.software_update_available).toBe(true);
    });
    test("When backend emits fw_update message with firmware_update_available true, Then ws client commits value to store", async () => {
      const message = {
        firmware_update_available: true,
        channel_fw_update: true,
      };

      // confirm precondition
      expect(store.state.settings.firmware_update_available).toBe(false);
      expect(store.state.settings.firmware_update_dur_mins).toBeNull();

      await new Promise((resolve) => {
        socket_server_side.emit("fw_update", JSON.stringify(message), (ack) => {
          resolve(ack);
        });
      });
      expect(store.state.settings.firmware_update_available).toBe(true);
      expect(store.state.settings.firmware_update_dur_mins).toBe(5);
    });
    test("When backend emits fw_update message with firmware_update_available false, Then ws client does not commit value to store", async () => {
      const message = {
        firmware_update_available: false,
      };

      // confirm precondition
      expect(store.state.settings.firmware_update_available).toBe(false);
      expect(store.state.settings.firmware_update_dur_mins).toBeNull();

      await new Promise((resolve) => {
        socket_server_side.emit("fw_update", JSON.stringify(message), (ack) => {
          resolve(ack);
        });
      });
      expect(store.state.settings.firmware_update_available).toBe(false);
      expect(store.state.settings.firmware_update_dur_mins).toBeNull();
    });
    test("When backend emits prompt_user_input message with customer_creds as input type, Then ws client sets correct flag in store", async () => {
      const message = {
        input_type: "user_creds",
      };

      // confirm precondition
      expect(store.state.settings.user_cred_input_needed).toBe(false);

      await new Promise((resolve) => {
        socket_server_side.emit("prompt_user_input", JSON.stringify(message), (ack) => {
          resolve(ack);
        });
      });
      expect(store.state.settings.user_cred_input_needed).toBe(true);
    });

    test.each([
      ["plate_barcode", "ML2022002001", valid_plate_barcode_old, true],
      ["plate_barcode", "ML2022002001", valid_plate_barcode_beta_2, true],
      ["plate_barcode", "ML2022002001", valid_plate_barcode_beta_1, false],
      ["stim_barcode", "MS2022002001", valid_stim_barcode_old, true],
    ])(
      "Given barcode is not in manual mode, When backend emits barcode message with valid %s, Then ws client updates correct barcode in store",
      async (barcode_type, old_barcode, valid_barcode, beta_2_mode) => {
        const message = {
          [barcode_type]: valid_barcode,
        };
        await store.commit("settings/set_beta_2_mode", beta_2_mode);
        await store.commit("flask/set_barcode_manual_mode", false);
        await store.commit("playback/set_barcode", {
          type: barcode_type,
          new_value: old_barcode,
          is_valid: true,
        });

        // confirm precondition
        expect(store.state.playback.barcodes[barcode_type].value).toBe(old_barcode);

        await new Promise((resolve) => {
          socket_server_side.emit("barcode", JSON.stringify(message), (ack) => {
            resolve(ack);
          });
        });

        const stim_config_state = store.state.stimulation.stim_status === STIM_STATUS.NO_PROTOCOLS_ASSIGNED;

        expect(store.state.playback.barcodes[barcode_type].value).toBe(valid_barcode);
        expect(store.state.playback.barcodes[barcode_type].valid).toBe(true);
        expect(stim_config_state).toBe(true);
      }
    );
    test.each([
      ["plate_barcode", valid_plate_barcode_old],
      ["stim_barcode", valid_stim_barcode_old],
    ])(
      "Given barcode is in manual mode, When backend emits barcode message with valid %s, Then ws client does not set new barcode in store",
      async (barcode_type, valid_barcode) => {
        const message = {
          barcode_type: valid_barcode,
        };

        store.commit("flask/set_barcode_manual_mode", true);

        // confirm precondition
        expect(store.state.playback.barcodes[barcode_type].value).toBeNull();

        await new Promise((resolve) => {
          socket_server_side.emit("barcode", JSON.stringify(message), (ack) => {
            resolve(ack);
          });
        });
        expect(store.state.playback.barcodes[barcode_type].value).toBeNull();
      }
    );
    test.each([
      "InstrumentCreateConnectionError",
      "InstrumentConnectionLostError",
      "InstrumentBadDataError",
      "InstrumentFirmwareError",
      "FirmwareAndSoftwareNotCompatibleError",
    ])(
      "When backend emits error messages %s, Then it will update the shutdown error status in settings state",
      async (error_type) => {
        expect(store.state.settings.shutdown_error_status).toBe("");

        const latest_compatible_sw_version =
          error_type === "FirmwareAndSoftwareNotCompatibleError" ? "1.2.3" : null;

        await new Promise((resolve) => {
          socket_server_side.emit(
            "error",
            JSON.stringify({ error_type, latest_compatible_sw_version }),
            (ack) => {
              resolve(ack);
            }
          );
        });

        const additional_text = latest_compatible_sw_version
          ? ". Please download the installer for the correct version here:"
          : ". Mantarray Controller is about to shutdown.";

        expect(store.state.settings.shutdown_error_status).toBe(ERRORS[error_type] + additional_text);
      }
    );
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

    test("When x_time_index is set to a specific value in Vuex, Then the /system_status route is called with Axios with the x_time_index as a parameter", async () => {
      const expected_idx = 9876;
      store.commit("playback/set_x_time_index", expected_idx);
      mocked_axios.onGet(system_status_regexp).reply(200, nr);

      const bound_ping_system_status = ping_system_status.bind(context);
      await bound_ping_system_status();
      expect(mocked_axios.history.get).toHaveLength(1);
      expect(mocked_axios.history.get[0].url).toMatch(new RegExp("http://localhost:4567/system_status?"));
      expect(mocked_axios.history.get[0].params.currently_displayed_time_index).toEqual(expected_idx);
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
