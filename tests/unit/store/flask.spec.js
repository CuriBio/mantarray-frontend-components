import Vuex from "vuex";
import axios from "axios";
const MockAxiosAdapter = require("axios-mock-adapter");
import { createLocalVue } from "@vue/test-utils";

import { STATUS } from "@/store/modules/flask/enums";
import playback_module from "@/store/modules/playback";
import { ping_system_status } from "@/store/modules/flask/actions";
import { system_status_regexp } from "@/store/modules/flask/url_regex";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";

describe("store/flask", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;
  let mocked_axios;

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    jest.restoreAllMocks();
    store = await NuxtStore.createStore();
    mocked_axios = new MockAxiosAdapter(axios);
  });
  afterEach(async () => {
    // clean up any pinging that was started
    store.commit("flask/stop_status_pinging");
    store.commit("playback/stop_playback_progression");
    mocked_axios.restore();
  });
  describe("Given the store in its default state", () => {
    test("When the flask Vuex store is initialized, Then port should be 4567", () => {
      expect(store.state.flask.port).toStrictEqual(4567);
    });
    test("When the flask Vuex store is initialized, Then status_ping_interval_id should be null", () => {
      expect(store.state.flask.status_ping_interval_id).toBeNull();
    });
  });

  describe("ping_system_status", () => {
    let context;
    let bound_ping_system_status;
    beforeEach(async () => {
      context = await store.dispatch("flask/get_flask_action_context");
      bound_ping_system_status = ping_system_status.bind(context);
    });
    test("Given the current state is SERVER_READY, When the status response is CALIBRATION_NEEDED, Then the vuex status state should update to CALIBRATION_NEEDED and the Vuex Playback State should update to CALIBRATION_NEEDED", async () => {
      mocked_axios.onGet(system_status_regexp).reply(200, {
        ui_status_code: STATUS.MESSAGE.CALIBRATION_NEEDED,
        in_simulation_mode: true,
      });
      store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.NOT_CONNECTED_TO_INSTRUMENT
      );
      store.commit("flask/set_status_uuid", STATUS.MESSAGE.SERVER_READY);

      await bound_ping_system_status();

      expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.CALIBRATION_NEEDED);
      expect(store.state.playback.playback_state).toStrictEqual(
        playback_module.ENUMS.PLAYBACK_STATES.CALIBRATION_NEEDED
      );
    });
    test("Given the Axios Get method is mocked with response of 404, When ping_system_status is invoked, Then assert playback_state is set NOT_CONNECTED_TO_INSTRUMENT", async () => {
      mocked_axios.onGet(system_status_regexp).reply(404);
      store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.NOT_CONNECTED_TO_INSTRUMENT
      );
      store.commit("flask/set_status_uuid", STATUS.MESSAGE.SERVER_STILL_INITIALIZING);
      await bound_ping_system_status();

      expect(store.state.flask.status_uuid).not.toBe(STATUS.MESSAGE.CALIBRATION_NEEDED);
      expect(store.state.playback.playback_state).toStrictEqual(
        playback_module.ENUMS.PLAYBACK_STATES.NOT_CONNECTED_TO_INSTRUMENT
      );
    });
    test("Given /system_status is mocked to return CALIBRATED as the status and the current status is CALIBRATING, When ping_system_status is called, Then the URL should include the current state UUID and the vuex status should update to CALIBRATED and the Vuex Playback State should update to CALIBRATED", async () => {
      mocked_axios.onGet(system_status_regexp).reply(200, {
        ui_status_code: STATUS.MESSAGE.CALIBRATED,
        in_simulation_mode: false,
      });
      const commit_spy = jest.spyOn(store, "commit");

      store.commit("flask/set_status_uuid", STATUS.MESSAGE.CALIBRATING);

      await bound_ping_system_status();

      expect(mocked_axios.history.get).toHaveLength(1);
      expect(mocked_axios.history.get[0].url).toMatch(system_status_regexp);
      expect(mocked_axios.history.get[0].params).toStrictEqual({
        current_vuex_status_uuid: STATUS.MESSAGE.CALIBRATING,
      });

      expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.CALIBRATED);
      expect(store.state.playback.playback_state).toStrictEqual(
        playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED
      );

      // Also make sure additional controls are enabled
      expect(commit_spy).toHaveBeenCalledWith("playback/set_enable_stim_controls", true, {
        root: true,
      });
    });
    describe("Given /system_status is mocked to return CALIBRATED, and the current status is LIVE_VIEW_ACTIVE", () => {
      beforeEach(() => {
        mocked_axios.onGet(system_status_regexp).reply(200, {
          ui_status_code: STATUS.MESSAGE.CALIBRATED,
          in_simulation_mode: false,
        });

        store.commit("flask/set_status_uuid", STATUS.MESSAGE.LIVE_VIEW_ACTIVE);
      });
      test("Given the ignore_next_system_status_if_matching_this_status state is not null, When ping_system_status is called, Then the ignore_next_system_status_if_matching_this_status state becomes null", async () => {
        store.commit("flask/ignore_next_system_status_if_matching_status", STATUS.MESSAGE.RECORDING);

        // confirm pre-condition
        expect(store.state.flask.ignore_next_system_status_if_matching_this_status).not.toBeNull();

        await bound_ping_system_status();

        expect(store.state.flask.ignore_next_system_status_if_matching_this_status).toBeNull();
      });
    });

    test("Given /system_status is mocked to return LIVE_VIEW_ACTIVE as the status and the current status is BUFFERING, When ping_system_status is called, Then the URL should include the current state UUID and the vuex status state should update to LIVE_VIEW_ACTIVE and the Vuex Playback State should update to LIVE_VIEW_ACTIVE", async () => {
      mocked_axios
        .onGet(system_status_regexp) // We pass in_simulation_mode true and validate default false is replaced
        .reply(200, {
          ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE,
          in_simulation_mode: true,
        });

      store.commit("flask/set_status_uuid", STATUS.MESSAGE.BUFFERING);

      await bound_ping_system_status();
      expect(mocked_axios.history.get).toHaveLength(1);
      expect(mocked_axios.history.get[0].url).toMatch(system_status_regexp);
      expect(mocked_axios.history.get[0].params).toStrictEqual({
        current_vuex_status_uuid: STATUS.MESSAGE.BUFFERING,
      });

      expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.LIVE_VIEW_ACTIVE);
      expect(store.state.flask.simulation_mode).toStrictEqual(true);

      expect(store.state.playback.playback_state).toStrictEqual(
        playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
      );
    });
  });
  describe("Actions", () => {
    describe("Given the store in its default state", () => {
      beforeEach(() => {
        jest.restoreAllMocks();
      });

      test("When start_status_pinging is dispatched, Then setInterval is called and returned ID set as the status_ping_interval_id state, and the Vuex state for status ID and Playback states are updated", async () => {
        mocked_axios.onGet(system_status_regexp).reply(200, {
          ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE,
          in_simulation_mode: false,
        });

        store.commit("flask/set_status_uuid", STATUS.MESSAGE.BUFFERING);

        // confirm pre-condition
        expect(store.state.flask.status_ping_interval_id).toBeNull();
        const expected_interval_id = 173;
        const spied_set_interval = jest.spyOn(window, "setInterval");
        spied_set_interval.mockReturnValueOnce(expected_interval_id);

        await store.dispatch("flask/start_status_pinging");
        expect(spied_set_interval.mock.calls).toHaveLength(1);
        expect(store.state.flask.status_ping_interval_id).toStrictEqual(expected_interval_id);
        expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.LIVE_VIEW_ACTIVE);
        expect(store.state.playback.playback_state).toStrictEqual(
          playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
        );
      });
    });
    describe("Given status pinging is active", () => {
      beforeEach(async () => {
        mocked_axios.onGet(system_status_regexp).reply(200, {
          ui_status_code: STATUS.MESSAGE.CALIBRATION_NEEDED,
          in_simulation_mode: false,
        });

        await store.dispatch("flask/start_status_pinging");
      });

      test("When status_ping_interval_id state does not change, Then setInterval is not called", async () => {
        const spied_set_interval = jest.spyOn(window, "setInterval");
        const initial_interval_id = store.state.flask.status_ping_interval_id;
        await store.dispatch("flask/start_status_pinging");
        expect(spied_set_interval).not.toHaveBeenCalled();
        expect(store.state.flask.status_ping_interval_id).toStrictEqual(initial_interval_id);
      });
    });
  });

  describe("mutations", () => {
    describe("Given the store in its default state", () => {
      test("When ignore_next_system_status_if_matching_status is committed, Then the state updates", () => {
        // confirm pre-condition
        expect(store.state.flask.ignore_next_system_status_if_matching_this_status).toBeNull();

        const expected = STATUS.MESSAGE.CALIBRATION_NEEDED;

        store.commit("flask/ignore_next_system_status_if_matching_status", expected);
        expect(store.state.flask.ignore_next_system_status_if_matching_this_status).toStrictEqual(expected);
      });

      test("Given the status is set to ERROR, When attempting to commit a different system status, Then it remains in ERROR mode", () => {
        store.commit("flask/set_status_uuid", STATUS.MESSAGE.ERROR);

        store.commit("flask/set_status_uuid", STATUS.MESSAGE.CALIBRATION_NEEDED);
        expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.ERROR);
      });
      test("When set_status_ping_interval_id is committed, Then ID mutates", async () => {
        const expected_id = 2993;
        store.commit("flask/set_status_ping_interval_id", expected_id);
        expect(store.state.flask.status_ping_interval_id).toStrictEqual(expected_id);
      });

      test("When stop_status_pinging is committed, Then clearInterval is not called unnecessarily", async () => {
        const spied_clear_interval = jest.spyOn(window, "clearInterval");

        store.commit("flask/stop_status_pinging");
        expect(spied_clear_interval).not.toHaveBeenCalled();
      });

      test("When UUID setting for known ids, Then assert if the value in store is matching the UUID", async () => {
        const need_calibration_uuid = "009301eb-625c-4dc4-9e92-1a4d0762465f";

        store.commit("flask/set_status_uuid", need_calibration_uuid);
        expect(store.state.flask.status_uuid).toStrictEqual(need_calibration_uuid);
      });

      test("When Vuex is initialized to its default state, Then assert if the value in store is matching for 'true'", async () => {
        const need_simulation = true;

        store.commit("flask/set_simulation_status", need_simulation);
        expect(store.state.flask.simulation_mode).toStrictEqual(need_simulation);
      });

      test("When simulation_mode is not set, Then assert simulation_mode default settings is false", async () => {
        expect(store.state.flask.simulation_mode).toStrictEqual(false);
      });
    });
    describe("Given status pinging is active", () => {
      beforeEach(async () => {
        mocked_axios.onGet(system_status_regexp).reply(200, {
          ui_status_code: STATUS.MESSAGE.CALIBRATION_NEEDED,
          in_simulation_mode: false,
        });

        await store.dispatch("flask/start_status_pinging");
      });

      test("When stop_status_pinging is committed, Then the interval is cleared and the status_ping_interval_id state becomes null", async () => {
        const initial_interval_id = store.state.flask.status_ping_interval_id;
        // confirm pre-condition
        expect(initial_interval_id).toBeGreaterThanOrEqual(0);

        const spied_clear_interval = jest.spyOn(window, "clearInterval");

        store.commit("flask/stop_status_pinging");
        expect(spied_clear_interval).toHaveBeenCalledWith(initial_interval_id);
        expect(store.state.flask.status_ping_interval_id).toBeNull();
      });
    });
    describe("SERVER_READY", () => {
      let context = null;

      beforeEach(async () => {
        context = await store.dispatch("flask/get_flask_action_context");
      });

      test("Given that /system_status is mocked to include an is_stimulating value, When the ping_system_status is active, Then stimulation/set_stim_play_state is called with that value", async () => {
        mocked_axios.onGet(system_status_regexp).reply(200, {
          ui_status_code: STATUS.MESSAGE.CALIBRATION_NEEDED,
          in_simulation_mode: false,
          is_stimulating: true,
        });
        const bound_ping_system_status = ping_system_status.bind(context);
        await bound_ping_system_status();
        expect(store.state.stimulation.stim_play_state).toBe(true);

        mocked_axios.onGet(system_status_regexp).reply(200, {
          ui_status_code: STATUS.MESSAGE.CALIBRATION_NEEDED,
          in_simulation_mode: false,
          is_stimulating: false,
        });
        await bound_ping_system_status();
        expect(store.state.stimulation.stim_play_state).toBe(false);
      });
      test("Given a protocol was run with setting 'stimulate until complete' and stimulation is STIM_ACTIVE, When ping_system_status returns an is_stimulating value of false, Then the stim state state should be updated to READY", async () => {
        // to have ACTIVE status, needs to have protocols assigned
        store.state.stimulation.protocol_assignments = { A: {}, B: {} };
        store.state.stimulation.stim_status = STIM_STATUS.STIM_ACTIVE;

        mocked_axios.onGet(system_status_regexp).reply(200, {
          ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE,
          in_simulation_mode: false,
          is_stimulating: false,
        });

        const bound_ping_system_status = ping_system_status.bind(context);
        await bound_ping_system_status();

        expect(store.state.stimulation.stim_play_state).toBe(false);
        expect(store.state.stimulation.stim_status).toBe(STIM_STATUS.READY);
      });
    });
  });
});
