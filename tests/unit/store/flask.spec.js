import Vuex from "vuex";
import axios from "axios";
const MockAxiosAdapter = require("axios-mock-adapter");
import { createLocalVue } from "@vue/test-utils";
const wait_for_expect = require("wait-for-expect");

import { STATUS } from "@/store/modules/flask/enums";
import playback_module from "@/store/modules/playback";
import { ping_system_status } from "../../../store/modules/flask/actions";
import {
  system_status_regexp,
  system_status_when_buffering_regexp,
  system_status_when_calibrating_regexp,
  system_status_when_server_ready_regexp,
  system_status_when_initializing_instrument_regexp,
  system_status_when_server_initializing_regexp,
  all_mantarray_commands_regexp,
} from "@/store/modules/flask/url_regex";
import { get_available_data_regex } from "@/store/modules/waveform/url_regex";

import { FLASK_STATUS_ENUMS } from "@/dist/mantarray.common";
import {
  system_status_regexp as dist_system_status_regexp,
  system_status_when_server_ready_regexp as dist_system_status_when_server_ready_regexp,
  system_status_when_initializing_instrument_regexp as dist_system_status_when_initializing_instrument_regexp,
  system_status_when_server_initializing_regexp as dist_system_status_when_server_initializing_regexp,
  all_mantarray_commands_regexp as dist_all_mantarray_commands_regexp,
} from "@/dist/mantarray.common";

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
  test("Confirm these items can be successfully imported from the built library", () => {
    expect(FLASK_STATUS_ENUMS.MESSAGE.CALIBRATION_NEEDED_uuid).toEqual(
      STATUS.MESSAGE.CALIBRATION_NEEDED_uuid
    );
    expect(dist_all_mantarray_commands_regexp).toEqual(
      all_mantarray_commands_regexp
    );
    expect(dist_system_status_regexp).toEqual(system_status_regexp);
    expect(dist_system_status_when_server_ready_regexp).toEqual(
      system_status_when_server_ready_regexp
    );
    expect(dist_system_status_when_initializing_instrument_regexp).toEqual(
      system_status_when_initializing_instrument_regexp
    );
    expect(dist_system_status_when_server_initializing_regexp).toEqual(
      system_status_when_server_initializing_regexp
    );
  });
  describe("Given the store in its default state", () => {
    test("Then port should be 4567", () => {
      expect(store.state.flask.port).toEqual(4567);
    });
    test("Then status_ping_interval_id should be null", () => {
      expect(store.state.flask.status_ping_interval_id).toBe(null);
    });
  });

  describe("ping_system_status", () => {
    let context = null;
    beforeEach(async () => {
      context = await store.dispatch("flask/get_flask_action_context");
    });
    test("Given the current state is SERVER_READY and the returned state is CALIBRATION_NEEDED, Then the vuex status state should update to CALIBRATION_NEEDED and the Vuex Playback State should update to CALIBRATION_NEEDED", async () => {
      mocked_axios.onGet(system_status_regexp).reply(200, {
        ui_status_code: STATUS.MESSAGE.CALIBRATION_NEEDED,
        in_simulation_mode: true,
      });
      store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.NOT_CONNECTED_TO_INSTRUMENT
      );
      store.commit("flask/set_status_uuid", STATUS.MESSAGE.SERVER_READY);

      const bound_ping_system_status = ping_system_status.bind(context);
      await bound_ping_system_status();

      expect(store.state.flask.status_uuid).toEqual(
        STATUS.MESSAGE.CALIBRATION_NEEDED
      );
      expect(store.state.playback.playback_state).toEqual(
        playback_module.ENUMS.PLAYBACK_STATES.CALIBRATION_NEEDED
      );
    });
    test("Given the current state is not SERVER_READY and the returned status is having HTTP return status error 404 it should be gracefully handled", async () => {
      mocked_axios.onGet(system_status_regexp).reply(404);
      store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.NOT_CONNECTED_TO_INSTRUMENT
      );
      store.commit(
        "flask/set_status_uuid",
        STATUS.MESSAGE.SERVER_STILL_INITIALIZING
      );
      const bound_ping_system_status = ping_system_status.bind(context);
      await bound_ping_system_status();

      expect(store.state.flask.status_uuid).not.toBe(
        STATUS.MESSAGE.CALIBRATION_NEEDED
      );
      expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.ERROR);
      expect(store.state.playback.playback_state).toEqual(
        playback_module.ENUMS.PLAYBACK_STATES.NOT_CONNECTED_TO_INSTRUMENT
      );
    });
    test("Given all axios requests are mocked to return 404, When stop_status_pinging is dispatched, Then the system status updates to be in the ERROR state", async () => {
      mocked_axios.onGet(all_mantarray_commands_regexp).reply(404);

      const bound_ping_system_status = ping_system_status.bind(context);
      await bound_ping_system_status();

      await store.dispatch("flask/stop_status_pinging");
      expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.ERROR);
    });
    test("Given playback state is BUFFERING and /system_status returns LIVE_VIEW_ACTIVE and /get_available_data returns code 204, When ping_system_status in called, Then start_waveform_pinging is invoked", async () => {
      store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.BUFFERING
      );
      mocked_axios
        .onGet(system_status_regexp)
        .reply(200, {
          ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE_uuid,
          in_simulation_mode: false,
        })
        .onGet(get_available_data_regex)
        .reply(204);

      const bound_ping_system_status = ping_system_status.bind(context);
      await bound_ping_system_status();

      await wait_for_expect(() => {
        expect(store.state.waveform.waveform_ping_interval_id).not.toBeNull();
      });
    });
    test("Given playback state is RECORDING and /system_status returns LIVE_VIEW_ACTIVE and /get_available_data returns code 204, When ping_system_status in called, Then start_waveform_pinging is not invoked", async () => {
      store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.RECORDING
      );
      mocked_axios
        .onGet(system_status_regexp)
        .reply(200, {
          ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE_uuid,
          in_simulation_mode: false,
        })
        .onGet(get_available_data_regex)
        .reply(204);

      const bound_ping_system_status = ping_system_status.bind(context);
      await bound_ping_system_status();
      const expected_interval_id = 173;
      const spied_set_interval = jest.spyOn(window, "setInterval");
      spied_set_interval.mockReturnValueOnce(expected_interval_id);

      await store.dispatch("waveform/start_get_waveform_pinging");
      expect(spied_set_interval.mock.calls.length).toBe(1);
      expect(store.state.waveform.waveform_ping_interval_id).toEqual(
        expected_interval_id
      );
    });
    test("Given the current state is calibrating and the returned state is CALIBRATED, Then the URL should include the current state UUID and the vuex status state should update to CALIBRATED and the Vuex Playback State should update to CALIBRATED", async () => {
      mocked_axios.onGet(system_status_regexp).reply(200, {
        ui_status_code: STATUS.MESSAGE.CALIBRATED,
        in_simulation_mode: false,
      });

      store.commit("flask/set_status_uuid", STATUS.MESSAGE.CALIBRATING);

      const bound_ping_system_status = ping_system_status.bind(context);
      await bound_ping_system_status();

      expect(mocked_axios.history.get.length).toBe(1);
      expect(mocked_axios.history.get[0].url).toMatch(
        system_status_when_calibrating_regexp
      );

      expect(store.state.flask.status_uuid).toEqual(
        STATUS.MESSAGE.STOPPED_uuid
      );
      expect(store.state.playback.playback_state).toEqual(
        playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED
      );
    });
    test("Given the current state is BUFFERING and the returned state is LIVE_VIEW_ACTIVE, Then the URL should include the current state UUID and the vuex status state should update to LIVE_VIEW_ACTIVE and the Vuex Playback State should update to LIVE_VIEW_ACTIVE", async () => {
      mocked_axios
        .onGet(system_status_regexp) // We pass in_simulation_mode true and validate default false is replaced
        .reply(200, {
          ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE_uuid,
          in_simulation_mode: true,
        });

      store.commit("flask/set_status_uuid", STATUS.MESSAGE.BUFFERING_uuid);

      const bound_ping_system_status = ping_system_status.bind(context);
      await bound_ping_system_status();
      expect(mocked_axios.history.get.length).toBe(1);
      expect(mocked_axios.history.get[0].url).toMatch(
        system_status_when_buffering_regexp
      );

      expect(store.state.flask.status_uuid).toEqual(
        STATUS.MESSAGE.LIVE_VIEW_ACTIVE_uuid
      );
      expect(store.state.flask.simulation_mode).toEqual(true);

      expect(store.state.playback.playback_state).toEqual(
        playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
      );
    });
  });
  describe("Actions", () => {
    describe("Given the store in its default state", () => {
      beforeEach(() => {
        jest.restoreAllMocks();
      });

      test("Given the current state is BUFFERING and system_status returns LIVE_VIEW_ACTIVE, When start_status_pinging is dispatched, Then setInterval is called and returned ID set as the status_ping_interval_id state, and the Vuex state for status ID and Playback states are updated", async () => {
        mocked_axios.onGet(system_status_regexp).reply(200, {
          ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE_uuid,
          in_simulation_mode: false,
        });

        store.commit("flask/set_status_uuid", STATUS.MESSAGE.BUFFERING_uuid);

        // confirm pre-condition
        expect(store.state.flask.status_ping_interval_id).toBe(null);
        const expected_interval_id = 173;
        const spied_set_interval = jest.spyOn(window, "setInterval");
        spied_set_interval.mockReturnValueOnce(expected_interval_id);

        await store.dispatch("flask/start_status_pinging");
        expect(spied_set_interval.mock.calls.length).toBe(1);
        expect(store.state.flask.status_ping_interval_id).toEqual(
          expected_interval_id
        );
        expect(store.state.flask.status_uuid).toEqual(
          STATUS.MESSAGE.LIVE_VIEW_ACTIVE_uuid
        );
        expect(store.state.playback.playback_state).toEqual(
          playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
        );
      });
    });
    describe("Given status pinging is active", () => {
      beforeEach(async () => {
        mocked_axios.onGet(system_status_regexp).reply(200, {
          ui_status_code: STATUS.MESSAGE.CALIBRATION_NEEDED_uuid,
          in_simulation_mode: false,
        });

        await store.dispatch("flask/start_status_pinging");
      });

      test("When start_status_pinging is dispatched, the status_ping_interval_id state does not change and setInterval is not called", async () => {
        const spied_set_interval = jest.spyOn(window, "setInterval");
        const initial_interval_id = store.state.flask.status_ping_interval_id;
        await store.dispatch("flask/start_status_pinging");
        expect(spied_set_interval).not.toBeCalled();
        expect(store.state.flask.status_ping_interval_id).toEqual(
          initial_interval_id
        );
      });
    });
  });

  describe("mutations", () => {
    describe("Given the store in its default state", () => {
      test("Given the status is set to ERROR, When attempting to commit a different system status, Then it remains in ERROR mode", () => {
        store.commit("flask/set_status_uuid", STATUS.MESSAGE.ERROR);

        store.commit(
          "flask/set_status_uuid",
          STATUS.MESSAGE.CALIBRATION_NEEDED
        );
        expect(store.state.flask.status_uuid).toStrictEqual(
          STATUS.MESSAGE.ERROR
        );
      });

      test("When set_status_ping_interval_id is committed, the ID mutates", async () => {
        const expected_id = 2993;
        store.commit("flask/set_status_ping_interval_id", expected_id);
        expect(store.state.flask.status_ping_interval_id).toEqual(expected_id);
      });

      test("When stop_status_pinging is committed, clearInterval is not called unnecessarily", async () => {
        const spied_clear_interval = jest.spyOn(window, "clearInterval");

        store.commit("flask/stop_status_pinging");
        expect(spied_clear_interval).not.toBeCalled();
      });

      test("UUID setting for known ids", async () => {
        const need_calibration_uuid = "009301eb-625c-4dc4-9e92-1a4d0762465f";

        store.commit("flask/set_status_uuid", need_calibration_uuid);
        expect(store.state.flask.status_uuid).toEqual(need_calibration_uuid);
      });

      test("Simulation setting for known ids", async () => {
        const need_simulation = true;

        store.commit("flask/set_simulation_status", need_simulation);
        expect(store.state.flask.simulation_mode).toEqual(need_simulation);
      });

      test("Simulation default settings is false", async () => {
        expect(store.state.flask.simulation_mode).toEqual(false);
      });
    });
    describe("Given status pinging is active", () => {
      beforeEach(async () => {
        mocked_axios.onGet(system_status_regexp).reply(200, {
          ui_status_code: STATUS.MESSAGE.CALIBRATION_NEEDED_uuid,
          in_simulation_mode: false,
        });

        await store.dispatch("flask/start_status_pinging");
      });

      test("When stop_status_pinging is committed, the interval is cleared and the status_ping_interval_id state becomes null", async () => {
        const initial_interval_id = store.state.flask.status_ping_interval_id;
        // confirm pre-condition
        expect(initial_interval_id).toBeGreaterThanOrEqual(0);

        const spied_clear_interval = jest.spyOn(window, "clearInterval");

        store.commit("flask/stop_status_pinging");
        expect(spied_clear_interval).toBeCalledWith(initial_interval_id);
        expect(store.state.flask.status_ping_interval_id).toBe(null);
      });
    });
  });
});
