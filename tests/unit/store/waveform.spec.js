import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import axios from "axios";
const MockAxiosAdapter = require("axios-mock-adapter");
import { ping_get_available_data } from "../../../store/modules/waveform/actions";
import { arry, new_arry } from "./../js_utils/waveform_data_provider.js";
import { get_available_data_regex } from "@/store/modules/waveform/url_regex";

const ar = arry;
const nr = new_arry;

describe("store/waveform", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });
  test("When initialized, Then the plate_waveforms is an empty representation of a 96-well plate", () => {
    const array_of_waveforms = store.state.waveform.plate_waveforms;
    expect(array_of_waveforms.length).toEqual(96);
    expect(array_of_waveforms[0]).toEqual(
      expect.objectContaining({
        x_data_points: [],
        y_data_points: [],
      })
    );
    expect(array_of_waveforms[95]).toEqual(
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
    expect(store.state.waveform.plate_waveforms.length).toEqual(2);
    expect(
      store.state.waveform.plate_waveforms[0].x_data_points.length
    ).toEqual(0);
    expect(
      store.state.waveform.plate_waveforms[0].y_data_points.length
    ).toEqual(0);
    expect(
      store.state.waveform.plate_waveforms[1].x_data_points.length
    ).toEqual(0);
    expect(
      store.state.waveform.plate_waveforms[1].y_data_points.length
    ).toEqual(0);
  });

  it("sets active_plate_waveforms to the hardcoded value initially", () => {
    const dictionary_of_waveforms =
      store.getters["waveform/active_plate_waveforms"];
    const well_0_waveform = dictionary_of_waveforms[0];
    expect(well_0_waveform.x_data_points[0]).toEqual(0);
    expect(well_0_waveform.y_data_points[0]).toEqual(290.429978);
  });

  // it("Calls axios real API to obtain the raw waveform data from the HTTP GET and stores the waveform in plate_waveforms", async () => {
  //   jest.setTimeout(10000);

  //   const parsed_data = await store.dispatch("waveform/fetchApi");

  //   const well_0_waveform = parsed_data[0];
  //   expect(parsed_data.length).toEqual(24);
  //   expect(well_0_waveform.x_data_points[0]).toEqual(0);
  //   expect(well_0_waveform.y_data_points[0]).toEqual(230.417297);

  //   const stored_waveform = store.getters["waveform/plate_waveforms"];

  //   const store_0_waveform = stored_waveform[0];
  //   expect(stored_waveform.length).toEqual(24);
  //   expect(store_0_waveform.x_data_points[0]).toEqual(0);
  //   expect(store_0_waveform.y_data_points[0]).toEqual(230.417297);
  // });

  it("Calls the mutations and starts appending new_value to the exisitng plate_waveforms", async () => {
    store.commit("waveform/set_plate_waveforms", ar);

    const stored_waveform = store.getters["waveform/plate_waveforms"];

    expect(stored_waveform.length).toEqual(24);
    expect(stored_waveform[0].x_data_points.length).toEqual(4);

    store.commit("waveform/append_plate_waveforms", nr);

    const new_stored_waveform = store.getters["waveform/plate_waveforms"];
    expect(stored_waveform.length).toEqual(24);
    expect(stored_waveform[0].x_data_points.length).toEqual(8);
  });
  it("Calls the mutations to set the x-zoom levels and x-zoom-idx and confirm the values are retained", async () => {
    let samples_per_second = 100000;
    let x_zoom_levels = [
      { x_scale: 30 * samples_per_second },
      { x_scale: 15 * samples_per_second },
      { x_scale: 5 * samples_per_second },
      { x_scale: 2 * samples_per_second },
      { x_scale: 1 * samples_per_second },
    ];
    let default_x_axis_zoom_idx = 2;
    store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
    store.commit("waveform/set_x_axis_zoom_idx", default_x_axis_zoom_idx);

    expect(store.getters["waveform/x_zoom_level_idx"]).toEqual(
      default_x_axis_zoom_idx
    );
    expect(store.getters["waveform/x_zoom_levels"]).toEqual(x_zoom_levels);
  });
  test("Calls the mutations to set the y-zoom levels and y-zoom-idx and confirm the values are retained", async () => {
    let y_zoom_levels = [
      { y_min: -10000000, y_max: 10000000 },
      { y_min: -100000, y_max: 100000 },
      { y_min: -1000, y_max: 1000 },
    ];
    let default_y_axis_zoom_idx = 0;
    store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);
    store.commit("waveform/set_y_axis_zoom_idx", default_y_axis_zoom_idx);

    expect(store.getters["waveform/y_axis_zoom_idx"]).toEqual(
      default_y_axis_zoom_idx
    );
    expect(store.getters["waveform/y_axis_zoom_levels"]).toEqual(y_zoom_levels);
  });

  describe("ping_get_available_data testing", () => {
    let mocked_axios;
    let context = null;

    beforeEach(async () => {
      mocked_axios = new MockAxiosAdapter(axios);

      store.commit("waveform/set_plate_waveforms", ar);
      context = await store.dispatch("waveform/get_waveform_action_context");
    });

    test("When ping_get_available_data is invoked, Then the /get_available_data route is called with Axios", async () => {
      mocked_axios.onGet(get_available_data_regex).reply(200, nr);

      const bound_ping_get_waveform_data = ping_get_available_data.bind(
        context
      );
      await bound_ping_get_waveform_data();
      expect(mocked_axios.history.get.length).toBe(1);
      expect(mocked_axios.history.get[0].url).toMatch(
        "http://localhost:4567/get_available_data"
      );
    });
    test("Given that the playback x_time_index is set to a specific value in Vuex, When ping_get_available_data is invoked, Then the /get_available_data route is called with Axios with the x_time_index as a parameter", async () => {
      const expected_idx = 9876;
      store.commit("playback/set_x_time_index", expected_idx);
      mocked_axios.onGet(get_available_data_regex).reply(200, nr);

      const bound_ping_get_waveform_data = ping_get_available_data.bind(
        context
      );
      await bound_ping_get_waveform_data();
      expect(mocked_axios.history.get.length).toBe(1);
      expect(mocked_axios.history.get[0].url).toMatch(
        "http://localhost:4567/get_available_data?currently_displayed_time_index=" +
          expected_idx
      );
    });
    test("verify if the get_available_data is invoked with http error response empty data its handled ", async () => {
      mocked_axios
        .onGet(get_available_data_regex) // We pass in_simulation_mode true and validate default false is replaced
        .reply(204, {}); // 513 there is no HTTP status code with this value so it will be caught in the server.
      // 204 No Content is the right HTTP status code.
      const bound_ping_get_waveform_data = ping_get_available_data.bind(
        context
      );
      await bound_ping_get_waveform_data();
      expect(mocked_axios.history.get.length).toBe(1);
      expect(mocked_axios.history.get[0].url).toMatch(
        "http://localhost:4567/get_available_data"
      );
    });
    test("When the start_get_waveform_pinging action is dispatched, Then setInterval is invoked and the interval ID stored in Vuex", async () => {
      mocked_axios.onGet(get_available_data_regex).reply(200, nr);

      // confirm pre-condition
      expect(store.state.waveform.waveform_ping_interval_id).toBe(null);
      const expected_interval_id = 173;
      const spied_set_interval = jest.spyOn(window, "setInterval");
      spied_set_interval.mockReturnValueOnce(expected_interval_id);

      await store.dispatch("waveform/start_get_waveform_pinging");
      expect(spied_set_interval.mock.calls.length).toBe(1);
      expect(store.state.waveform.waveform_ping_interval_id).toEqual(
        expected_interval_id
      );
    });

    describe("Given get waveform pinging is active", () => {
      beforeEach(async () => {
        mocked_axios
          .onGet(get_available_data_regex) // We pass in_simulation_mode true and validate default false is replaced
          .reply(200, nr);

        await store.dispatch("waveform/start_get_waveform_pinging");
      });
      test("When start_get_available_data is dispatched, the waveform_ping_interval_id does not change and setInterval is not called again", async () => {
        const spied_set_interval = jest.spyOn(window, "setInterval");
        const initial_interval_id = store.state.waveform_ping_interval_id;
        await store.dispatch("waveform/start_get_waveform_pinging");

        expect(store.state.waveform_ping_interval_id).toEqual(
          initial_interval_id
        );
      });
    });
  });
});
