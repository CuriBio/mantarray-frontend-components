import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import axios from "axios";
const MockAxiosAdapter = require("axios-mock-adapter");
import { ping_get_available_data } from "@/store/modules/waveform/actions";
import { arry, new_arry } from "./../js_utils/waveform_data_provider.js";
import { system_status_regexp, get_available_data_regex } from "@/store/modules/flask/url_regex";
import { STATUS } from "@/store/modules/flask/enums";
import { socket as socket_client_side } from "@/store/plugins/websocket";

const http = require("http");
const io_server = require("socket.io");

describe("store/waveform", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;
  let ar;
  let nr;

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    // some tests modify these two values, so make a deep copy before each test
    ar = JSON.parse(JSON.stringify(arry));
    nr = JSON.parse(JSON.stringify(new_arry));
  });

  afterEach(() => {
    // event handlers persist through tests, so clear them all after each test
    socket_client_side.off();
  });

  test("When initialized, Then the plate_waveforms is an empty representation of a 96-well plate", () => {
    const array_of_waveforms = store.state.waveform.plate_waveforms;
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

  test("Given some values in plate_waveforms, When the clear_plate_waveforms mutation is committed, Then plate_waveforms becomes empty x/y data points array", () => {
    store.commit("waveform/set_plate_waveforms", [
      { x_data_points: [1], y_data_points: [2] },
      { x_data_points: [1], y_data_points: [2] },
    ]);

    store.commit("waveform/clear_plate_waveforms");
    expect(store.state.waveform.plate_waveforms).toHaveLength(2);
    expect(store.state.waveform.plate_waveforms[0].x_data_points).toHaveLength(0);
    expect(store.state.waveform.plate_waveforms[0].y_data_points).toHaveLength(0);
    expect(store.state.waveform.plate_waveforms[1].x_data_points).toHaveLength(0);
    expect(store.state.waveform.plate_waveforms[1].y_data_points).toHaveLength(0);
  });

  test("When waveforms is initially mutated with few data points, Then subsequent mutations append data points to the existing plate_waveforms", async () => {
    store.commit("waveform/set_plate_waveforms", ar);

    const stored_waveform = store.getters["waveform/plate_waveforms"];

    expect(stored_waveform).toHaveLength(24);
    expect(stored_waveform[0].x_data_points).toHaveLength(4);

    store.commit("waveform/append_plate_waveforms", nr);

    expect(stored_waveform).toHaveLength(24);
    expect(stored_waveform[0].x_data_points).toHaveLength(8);
  });
  test("When the x-zoom levels and x-zoom-idx  are updated in Vuex, Then assert that the values are retained", async () => {
    const samples_per_second = 100000;
    const x_zoom_levels = [
      { x_scale: 30 * samples_per_second },
      { x_scale: 15 * samples_per_second },
      { x_scale: 5 * samples_per_second },
      { x_scale: 2 * samples_per_second },
      { x_scale: 1 * samples_per_second },
    ];
    const default_x_axis_zoom_idx = 2;
    store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
    store.commit("waveform/set_x_axis_zoom_idx", default_x_axis_zoom_idx);

    expect(store.getters["waveform/x_zoom_level_idx"]).toStrictEqual(default_x_axis_zoom_idx);
    expect(store.getters["waveform/x_zoom_levels"]).toStrictEqual(x_zoom_levels);
  });
  test("When the y-zoom levels and y-zoom-idx are updated in Vuex, Then assert that the values are retained", async () => {
    const y_zoom_levels = [
      { y_min: -10000000, y_max: 10000000 },
      { y_min: -100000, y_max: 100000 },
      { y_min: -1000, y_max: 1000 },
    ];
    const default_y_axis_zoom_idx = 0;
    store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);
    store.commit("waveform/set_y_axis_zoom_idx", default_y_axis_zoom_idx);

    expect(store.getters["waveform/y_axis_zoom_idx"]).toStrictEqual(default_y_axis_zoom_idx);
    expect(store.getters["waveform/y_axis_zoom_levels"]).toStrictEqual(y_zoom_levels);
  });

  describe("websocket", () => {
    let http_server;
    let ws_server;
    let socket_server_side;

    beforeAll(() => {
      http_server = http.createServer().listen(4567); // TODO use constant here
      ws_server = io_server(http_server);
    });

    beforeEach((done) => {
      ws_server.on("connect", (socket) => {
        socket_server_side = socket;
        done();
      });
    });

    afterAll(() => {
      ws_server.close();
      http_server.close();
    });

    afterEach(() => {
      if (socket_server_side.connected) {
        socket_server_side.disconnect();
      }
    });
    test("When backend emits waveform_data message, Then ws client updates plate_waveforms", async () => {
      expect(store.getters["waveform/plate_waveforms"][0].x_data_points).toHaveLength(0);
      store.commit("waveform/set_plate_waveforms", ar);

      const stored_waveform = store.getters["waveform/plate_waveforms"];
      expect(stored_waveform).toHaveLength(24);
      expect(stored_waveform[0].x_data_points).toHaveLength(4);

      await new Promise((resolve) => {
        socket_server_side.emit("waveform_data", JSON.stringify(nr), (ack) => {
          resolve(ack);
        });
      });

      expect(stored_waveform).toHaveLength(24);
      expect(stored_waveform[0].x_data_points).toHaveLength(8);
    });
  });

  describe("get_available_data", () => {
    let mocked_axios;
    let context = null;

    beforeEach(async () => {
      mocked_axios = new MockAxiosAdapter(axios);

      store.commit("waveform/set_plate_waveforms", ar);
      context = await store.dispatch("waveform/get_waveform_action_context");
    });

    test("When ping_get_available_data is invoked, Then the /get_available_data route is called with Axios", async () => {
      mocked_axios.onGet(get_available_data_regex).reply(200, nr);

      const bound_ping_get_waveform_data = ping_get_available_data.bind(context);
      await bound_ping_get_waveform_data();
      expect(mocked_axios.history.get).toHaveLength(1);
      expect(mocked_axios.history.get[0].url).toMatch("http://localhost:4567/get_available_data");
    });
    test("Given that the playback x_time_index is set to a specific value in Vuex, When ping_get_available_data is invoked, Then the /get_available_data route is called with Axios with the x_time_index as a parameter", async () => {
      const expected_idx = 9876;
      store.commit("playback/set_x_time_index", expected_idx);
      mocked_axios.onGet(get_available_data_regex).reply(200, nr);

      const bound_ping_get_waveform_data = ping_get_available_data.bind(context);
      await bound_ping_get_waveform_data();
      expect(mocked_axios.history.get).toHaveLength(1);
      expect(mocked_axios.history.get[0].url).toMatch(
        "http://localhost:4567/get_available_data?currently_displayed_time_index=" + expected_idx
      );
    });
    test("When the get_available_data is invoked, Then http error response of empty data its handled", async () => {
      mocked_axios
        .onGet(get_available_data_regex) // We pass in_simulation_mode true and validate default false is replaced
        .reply(204, {}); // 513 there is no HTTP status code with this value so it will be caught in the server.
      // 204 No Content is the right HTTP status code.
      const bound_ping_get_waveform_data = ping_get_available_data.bind(context);
      await bound_ping_get_waveform_data();
      expect(mocked_axios.history.get).toHaveLength(1);
      expect(mocked_axios.history.get[0].url).toMatch("http://localhost:4567/get_available_data");
    });
    test("Given that the axios get method to respond with http status 200, When the start_get_waveform_pinging action is dispatched, Then setInterval is invoked and the interval ID stored in Vuex", async () => {
      mocked_axios.onGet(get_available_data_regex).reply(200, nr);

      // confirm pre-condition
      expect(store.state.waveform.waveform_ping_interval_id).toBeNull();
      const expected_interval_id = 173;
      const spied_set_interval = jest.spyOn(window, "setInterval");
      spied_set_interval.mockReturnValueOnce(expected_interval_id);

      await store.dispatch("waveform/start_get_waveform_pinging");
      expect(spied_set_interval.mock.calls).toHaveLength(1);
      expect(store.state.waveform.waveform_ping_interval_id).toStrictEqual(expected_interval_id);
    });

    describe("Given get waveform pinging is active", () => {
      beforeEach(async () => {
        mocked_axios.onGet(get_available_data_regex).reply(200, nr);

        await store.dispatch("waveform/start_get_waveform_pinging");
      });
      test("When start_get_available_data is dispatched, Then the waveform_ping_interval_id does not change and setInterval is not called again", async () => {
        const initial_interval_id = store.state.waveform.waveform_ping_interval_id;
        await store.dispatch("waveform/start_get_waveform_pinging");

        expect(store.state.waveform.waveform_ping_interval_id).toStrictEqual(initial_interval_id);
      });
      test("Given /system_status is mocked to return 200 (and some dummy response) and live_view is started and /start_recording is mocked to return an HTTP error, When start_recording is dispatched, Then all 3 intervals are cleared in Vuex (status pinging, data pinging, and playback progression)", async () => {
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
        expect(store.state.waveform.waveform_ping_interval_id).not.toBeNull();
        expect(store.state.flask.status_ping_interval_id).not.toBeNull();
        expect(store.state.playback.playback_progression_interval_id).not.toBeNull();

        await store.dispatch("playback/start_recording");

        expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.ERROR);
        expect(store.state.flask.status_ping_interval_id).toBeNull();
        expect(store.state.playback.playback_progression_interval_id).toBeNull();
        expect(store.state.waveform.waveform_ping_interval_id).toBeNull();
      });
    });
  });
});
