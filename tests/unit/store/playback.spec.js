import Vuex from "vuex";
import axios from "axios";
const MockAxiosAdapter = require("axios-mock-adapter");
const sinon = require("sinon");
import { createLocalVue } from "@vue/test-utils";
import playback_module from "@/store/modules/playback";
import flask_module from "@/store/modules/flask";
import { STATUS } from "@/store/modules/flask/enums";

const wait_for_expect = require("wait-for-expect");
import {
  all_mantarray_commands_regexp,
  system_status_when_calibrating_regexp,
  system_status_when_buffering_regexp,
} from "@/store/modules/flask/url_regex";
import { get_available_data_regex } from "@/store/modules/waveform/url_regex";
import { PLAYBACK_ENUMS } from "@/dist/mantarray.common";

const sandbox = sinon.createSandbox();

describe("store/playback", () => {
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
    store = await NuxtStore.createStore();
    mocked_axios = new MockAxiosAdapter(axios);
  });
  afterEach(async () => {
    // clean up any pinging that was started
    store.commit("flask/stop_status_pinging");
    store.commit("playback/stop_playback_progression");
    mocked_axios.restore();
    jest.restoreAllMocks();
    sandbox.restore();
  });
  test("Confirm these items can be successfully imported from the built library", () => {
    expect(PLAYBACK_ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE).toEqual(
      playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
    );
  });

  describe("When default state is initialized", () => {
    test("Then playback_state should be FILE_NOT_LOADED", () => {
      expect(store.state.playback.playback_state).toEqual(
        playback_module.ENUMS.PLAYBACK_STATES.FILE_NOT_LOADED
      );
    });
    test("Then playback_progression_time_interval should be 40", () => {
      expect(store.state.playback.playback_progression_time_interval).toEqual(
        40
      );
    });
  });

  describe("mutations", () => {
    test("When set_playback_progression_interval_id is called, then the Vuex state is updated", () => {
      const expected_interval_id = 223;
      store.commit(
        "playback/set_playback_progression_interval_id",
        expected_interval_id
      );
      expect(store.state.playback.playback_progression_interval_id).toEqual(
        expected_interval_id
      );
    });

    test("Given playback_progression_interval is not active, When stop_playback_progression is committed, Then clearInterval is not called", async () => {
      const expected_interval_id =
        store.state.playback.playback_progression_interval_id;
      // confirm pre-condition
      expect(expected_interval_id).toBeNull();

      const spied_clear_interval = jest.spyOn(window, "clearInterval");

      store.commit("playback/stop_playback_progression");

      expect(spied_clear_interval).not.toBeCalled();
    });
    test("Given tooltips_delay is having a default value of 2 sec, then modified to 1 sec, the Vuex state is updated", () => {
      const expected_tooltips_delay = 1000;
      expect(store.state.playback.tooltips_delay).toEqual(2000);
      store.commit("playback/set_tooltips_delay", expected_tooltips_delay);
      expect(store.state.playback.tooltips_delay).toEqual(
        expected_tooltips_delay
      );
    });

    describe("Given playback_progression interval is active", () => {
      beforeEach(async () => {
        await store.dispatch("playback/start_playback_progression");
      });
      test("When start_playback_progression is dispatched again, Then setInterval is not called again and the interval ID in Vuex does not change", async () => {
        const expected_interval_id =
          store.state.playback.playback_progression_interval_id;
        // confirm pre-condition
        expect(expected_interval_id).not.toBeNull();

        const spied_set_interval = jest.spyOn(window, "setInterval");

        await store.dispatch("playback/start_playback_progression");

        expect(spied_set_interval.mock.calls.length).toBe(0);
        expect(store.state.playback.playback_progression_interval_id).toEqual(
          expected_interval_id
        );
      });
      test("When stop_playback_progression is committed, Then clearInterval is called and the interval ID in Vuex is set to null", async () => {
        const expected_interval_id =
          store.state.playback.playback_progression_interval_id;
        // confirm pre-condition
        expect(expected_interval_id).not.toBeNull();

        const spied_clear_interval = jest.spyOn(window, "clearInterval");

        store.commit("playback/stop_playback_progression");

        expect(spied_clear_interval).toBeCalledWith(expected_interval_id);
        expect(
          store.state.playback.playback_progression_interval_id
        ).toBeNull();
      });
    });

    test("When set_playback_state is committed the playback_state is mutated", () => {
      store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.PLAYING
      );
      expect(store.state.playback.playback_state).toEqual(
        playback_module.ENUMS.PLAYBACK_STATES.PLAYING
      );
      store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.STOPPED
      );
      expect(store.state.playback.playback_state).toEqual(
        playback_module.ENUMS.PLAYBACK_STATES.STOPPED
      );
    });

    it("should set is_playing to false initially", () => {
      expect(store.getters["playback/is_playing"]).toBe(false);
    });
    it("mutates is_playing", () => {
      store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.PLAYING
      );
      expect(store.getters["playback/is_playing"]).toBe(true);
      store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.STOPPED
      );
      expect(store.getters["playback/is_playing"]).toBe(false);
    });

    it("should set loop_playback to false initially", () => {
      expect(store.getters["playback/loop_playback"]).toBe(false);
    });

    it("mutates loop_playback", () => {
      store.commit("playback/set_loop_playback", true);
      expect(store.getters["playback/loop_playback"]).toBe(true);
      store.commit("playback/set_loop_playback", false);
      expect(store.getters["playback/loop_playback"]).toBe(false);
    });

    it("should set x_time_index to 0 initially", () => {
      expect(store.getters["playback/x_time_index"]).toBe(0);
    });
    it("mutates x_time_index", () => {
      store.commit("playback/set_x_time_index", 12345);
      expect(store.getters["playback/x_time_index"]).toBe(12345);
    });
    it("increments x_time_index through mutatin", () => {
      store.commit("playback/increment_x_time_index", 100);
      expect(store.getters["playback/x_time_index"]).toBe(100);
      store.commit("playback/increment_x_time_index", 150);
      expect(store.getters["playback/x_time_index"]).toBe(250);
    });
  });

  describe("actions", () => {
    describe("Given timers are mocked", () => {
      beforeEach(() => {
        sandbox.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
      });
      test("Given playback_progression is not active, When time is advanced, x_time_index does not change", () => {
        sandbox.clock.tick(10000);
        expect(store.state.playback.x_time_index).toEqual(0);
      });
      describe("Given playback_progression is active", () => {
        let playback_update_time_interval;
        const centimilliseconds_per_millisecond = 100;
        beforeEach(async () => {
          await store.dispatch("playback/start_playback_progression");
          playback_update_time_interval =
            store.state.playback.playback_progression_time_interval;
        });
        test("Given x_time_index started at 0, When time is advanced 4 updated intervals, Then x_time_index moves the correct number of centimilliseconds", () => {
          // confirm pre-condition
          expect(store.state.playback.x_time_index).toEqual(0);
          sandbox.clock.tick(4 * playback_update_time_interval);
          expect(store.state.playback.x_time_index).toEqual(
            4 *
              playback_update_time_interval *
              centimilliseconds_per_millisecond
          );
        });
        test("Given x_time_index started at 0, When time is advanced not quite 1 time interval, Then x_time_index does not change", () => {
          // confirm pre-condition
          expect(store.state.playback.x_time_index).toEqual(0);
          sandbox.clock.tick(playback_update_time_interval - 1);
          expect(store.state.playback.x_time_index).toEqual(0);
        });
        test("Given x_time_index started at 0, When time is advanced exactly 1 time interval, Then x_time_index moves the correct number of centimilliseconds_per_millisecond", () => {
          // confirm pre-condition
          expect(store.state.playback.x_time_index).toEqual(0);
          sandbox.clock.tick(playback_update_time_interval);
          expect(store.state.playback.x_time_index).toEqual(
            playback_update_time_interval * centimilliseconds_per_millisecond
          );
        });
        test("Given x_time_index started at 10, When time is advanced exactly 1 time interval, Then x_time_index moves the correct number of centimilliseconds_per_millisecond", () => {
          store.commit("playback/set_x_time_index", 10);
          sandbox.clock.tick(playback_update_time_interval);
          expect(store.state.playback.x_time_index).toEqual(
            playback_update_time_interval * centimilliseconds_per_millisecond +
              10
          );
        });
        test("Given x_time_index started at 0, When time is advanced exactly 1 time interval, Then x_time_index moves the correct number of centimilliseconds_per_millisecond, When playback_progression is stopped and time is advanced another time interval, Then x_time_index does not change", () => {
          // confirm pre-condition
          expect(store.state.playback.x_time_index).toEqual(0);
          sandbox.clock.tick(playback_update_time_interval);
          const expected_x_time_index =
            playback_update_time_interval * centimilliseconds_per_millisecond;
          expect(store.state.playback.x_time_index).toEqual(
            expected_x_time_index
          );
          store.commit("playback/stop_playback_progression");
          sandbox.clock.tick(playback_update_time_interval);
          expect(store.state.playback.x_time_index).toEqual(
            expected_x_time_index
          );
        });
      });
    });
    test("Given x_time_index is not 0 and playback state is PLAYING, and playback_progression_interval is active, When stop_playback is dispatched, Then x_time_index becomes 0, playback state becomes STOPPED and the playback_progression_interval is cleared", async () => {
      store.commit("playback/set_x_time_index", 200);
      await store.dispatch("playback/start_playback_progression");
      store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.PLAYING
      );

      // confirm pre-condition
      expect(
        store.state.playback.playback_progression_interval_id
      ).not.toBeNull();

      await store.dispatch("playback/stop_playback");
      expect(store.state.playback.playback_progression_interval_id).toBeNull();
      expect(store.state.playback.x_time_index).toEqual(0);
      expect(store.state.playback.playback_state).toEqual(
        playback_module.ENUMS.PLAYBACK_STATES.STOPPED
      );
    });
    test("When transition_playback_state is dispatched the playback_state is mutated", async () => {
      store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.PLAYING
      );
      expect(store.state.playback.playback_state).toEqual(
        playback_module.ENUMS.PLAYBACK_STATES.PLAYING
      );
    });
    test("Given playback_progression interval is not active and playback_state is BUFFERING, When the playback_state transitions to LIVE_VIEW_ACTIVE/PLAYING, Then the playback_progression_interval becomes active", async () => {
      await store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.BUFFERING
      );

      // confirm pre-condition
      expect(store.state.playback.playback_progression_interval_id).toBeNull();

      await store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.PLAYING
      );

      expect(
        store.state.playback.playback_progression_interval_id
      ).not.toBeNull();
    });
    test("Given playback_progression interval is not active and playback_state is STOPPED, When the playback_state transitions to CALIBRATING, Then the playback_progression_interval does not become active", async () => {
      await store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.STOPPED
      );

      // confirm pre-condition
      expect(store.state.playback.playback_progression_interval_id).toBeNull();

      await store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING
      );

      expect(store.state.playback.playback_progression_interval_id).toBeNull();
    });

    test("Given playback_progression interval is not active and playback_state is STOPPED, When the playback_state transitions to LIVE_VIEW_ACTIVE/PLAYING, Then the playback_progression_interval becomes active", async () => {
      await store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.STOPPED
      );

      // confirm pre-condition
      expect(store.state.playback.playback_progression_interval_id).toBeNull();

      await store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.PLAYING
      );

      expect(
        store.state.playback.playback_progression_interval_id
      ).not.toBeNull();
    });
    test("Given playback_progression interval is active and playback_state is LIVE_VIEW_ACTIVE, When the playback_state transitions to STOPPED, Then the playback_progression_interval is cleared", async () => {
      store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
      );
      await store.dispatch("playback/start_playback_progression");

      // confirm pre-condition
      expect(
        store.state.playback.playback_progression_interval_id
      ).not.toBeNull();

      await store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.STOPPED
      );

      expect(store.state.playback.playback_progression_interval_id).toBeNull();
    });
    test("Given playback_progression interval is active and playback_state is LIVE_VIEW_ACTIVE, When the playback_state transitions to RECORDING, Then the playback_progression_interval is not cleared", async () => {
      store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
      );
      await store.dispatch("playback/start_playback_progression");

      // confirm pre-condition
      expect(
        store.state.playback.playback_progression_interval_id
      ).not.toBeNull();

      await store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.RECORDING
      );

      expect(
        store.state.playback.playback_progression_interval_id
      ).not.toBeNull();
    });

    test("Given playback_progression interval is not active, when start_playback_progression is dispatched, Then setInterval is called and the interval ID committed to Vuex", async () => {
      // confirm pre-condition
      expect(store.state.playback.playback_progression_interval_id).toBeNull();

      const expected_interval_id = 175;
      const spied_set_interval = jest.spyOn(window, "setInterval");
      spied_set_interval.mockReturnValueOnce(expected_interval_id);

      await store.dispatch("playback/start_playback_progression");

      expect(spied_set_interval.mock.calls.length).toBe(1);
      expect(store.state.playback.playback_progression_interval_id).toEqual(
        expected_interval_id
      );
    });
    test("When start_recording is called the playback and status states mutate to recording", async () => {
      let baseurl = "http://localhost:4567";
      let api = "start_recording";

      mocked_axios.onGet(all_mantarray_commands_regexp).reply(200);

      const expected_status_state = STATUS.MESSAGE.RECORDING_uuid;

      // confirm pre-condition
      expect(store.state.playback.playback_state).not.toEqual(
        playback_module.ENUMS.PLAYBACK_STATES.RECORDING
      );
      expect(store.state.flask.status_uuid).not.toEqual(expected_status_state);

      store.commit("playback/set_x_time_index", 12345);

      store.commit("playback/set_barcode_number", "MB2036078");

      await store.dispatch("playback/start_recording");

      expect(mocked_axios.history.get[0].url).toEqual(
        `${baseurl}/${api}?time_index=12345&barcode=MB2036078&is_hardware_test_recording=false`
      );

      expect(store.state.playback.playback_state).toEqual(
        playback_module.ENUMS.PLAYBACK_STATES.RECORDING
      );
      expect(store.state.flask.status_uuid).toEqual(expected_status_state);
      expect(store.state.playback.recording_start_time).toEqual(12345);
    });
    test("When stop_recording is called the playback and status states mutate to live_view_active", async () => {
      let baseurl = "http://localhost:4567";
      let api = "stop_recording";

      mocked_axios.onGet(all_mantarray_commands_regexp).reply(200);
      const expected_status_state = STATUS.MESSAGE.LIVE_VIEW_ACTIVE_uuid;
      // confirm pre-condition
      expect(store.state.playback.playback_state).not.toEqual(
        playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
      );
      expect(store.state.flask.status_uuid).not.toEqual(expected_status_state);

      store.commit("playback/set_x_time_index", 456789);

      store.commit("playback/set_barcode_number", "MB2024599");

      await store.dispatch("playback/stop_recording");

      expect(mocked_axios.history.get[0].url).toEqual(
        `${baseurl}/${api}?time_index=456789`
      );

      expect(store.state.playback.playback_state).toEqual(
        playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
      );
      expect(store.state.playback.recording_start_time).toEqual(0);
      expect(store.state.flask.status_uuid).toEqual(expected_status_state);
    });
    describe("Given Waveform Pinging is active and /get_available_data returns 204 and Mantarray Command routes return status 200", () => {
      beforeEach(async () => {
        mocked_axios
          .onGet(get_available_data_regex)
          .reply(204)
          .onGet(all_mantarray_commands_regexp)
          .reply(200);

        await store.dispatch("waveform/start_get_waveform_pinging");
      });

      test("When stop_live_view is dispatched, Then the clearInterval is called on the waveform_ping_interval_id", async () => {
        const spied_clear_interval = jest.spyOn(window, "clearInterval");
        const expected_interval_id =
          store.state.waveform.waveform_ping_interval_id;

        await store.dispatch("playback/stop_live_view");

        expect(spied_clear_interval).toBeCalledWith(expected_interval_id);
        expect(store.state.waveform.waveform_ping_interval_id).toBeNull();
      });
      test("Given the Vuex plate_waveforms state has some values, When stop_live_view is dispatched, Then the plate_waveforms x/y data points are reset to empty arrays", async () => {
        store.commit("waveform/set_plate_waveforms", [
          { x_data_points: [55], y_data_points: [2.3] },
          { x_data_points: [4], y_data_points: [999] },
        ]);
        await store.dispatch("playback/stop_live_view");

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
    });
    test("Given playback_progression interval is active and Mantarray Commands are mocked to return status 200, When stop_live_view is called, Then the interval is cleared", async () => {
      mocked_axios.onGet(all_mantarray_commands_regexp).reply(200);

      await store.dispatch("playback/start_playback_progression");

      const expected_interval_id =
        store.state.playback.playback_progression_interval_id;
      // confirm pre-condition
      expect(
        store.state.playback.playback_progression_interval_id
      ).not.toBeNull();

      const spied_clear_interval = jest.spyOn(window, "clearInterval");

      await store.dispatch("playback/stop_live_view");

      expect(spied_clear_interval).toBeCalledWith(expected_interval_id);
      expect(store.state.waveform.waveform_ping_interval_id).toBeNull();
    });

    test("Given x_time_index is not 0, When stop_live_view is called, Then the playback and status states mutate to calibrated and x_time_index mutates to 0", async () => {
      let baseurl = "http://localhost:4567";
      let api = "stop_managed_acquisition";

      mocked_axios.onGet(all_mantarray_commands_regexp).reply(200);

      const expected_status_state = STATUS.MESSAGE.STOPPED_uuid;
      store.commit("playback/set_x_time_index", 400);
      // confirm pre-condition
      expect(store.state.playback.playback_state).not.toEqual(
        playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED
      );
      expect(store.state.flask.status_uuid).not.toEqual(expected_status_state);

      await store.dispatch("playback/stop_live_view");

      // expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.ERROR);
      // expect(store.state.flask.playback_progression_interval_id).toBe(null);

      expect(mocked_axios.history.get[0].url).toEqual(`${baseurl}/${api}`);

      expect(store.state.playback.playback_state).toEqual(
        playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED
      );
      expect(store.state.playback.x_time_index).toEqual(0);

      expect(store.state.flask.status_uuid).toEqual(expected_status_state);
    });
    describe("When start_calibration is called", () => {
      beforeEach(() => {
        jest.restoreAllMocks();
      });
      test("Then playback state mutates to calibrating and starts status_pinging in Flask, then playback state mutates to calibrated", async () => {
        let baseurl = "http://localhost:4567";
        let api = "start_calibration";

        mocked_axios
          .onGet(system_status_when_calibrating_regexp)
          .reply(200, { ui_status_code: STATUS.MESSAGE.STOPPED_uuid });

        mocked_axios.onGet(all_mantarray_commands_regexp).reply(200);

        // confirm pre-condition
        expect(store.state.playback.playback_state).not.toEqual(
          playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING
        );

        await store.dispatch("playback/start_calibration");

        let request_to_start_calibration = mocked_axios.history.get[0];

        expect(request_to_start_calibration.url).toMatch(`${baseurl}/${api}`);

        expect(store.state.playback.playback_state).toEqual(
          playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING
        );

        await wait_for_expect(() => {
          expect(
            store.state.flask.status_ping_interval_id
          ).toBeGreaterThanOrEqual(0);
          expect(store.state.playback.playback_state).toEqual(
            playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED
          );
        });
      });
    });
    describe("When start_live_view is called", () => {
      beforeEach(() => {
        jest.restoreAllMocks();
      });
      test("Then playback state mutates to BUFFERING and starts status_pinging in Flask, then playback state mutates to LIVE_VIEW_ACTIVE", async () => {
        let baseurl = "http://localhost:4567";
        let api = "start_managed_acquisition";

        mocked_axios
          .onGet(system_status_when_buffering_regexp)
          .reply(200, { ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE_uuid })
          .onGet(get_available_data_regex)
          .reply(204);

        mocked_axios.onGet(all_mantarray_commands_regexp).reply(200);

        expect(store.state.playback.playback_state).not.toEqual(
          playback_module.ENUMS.PLAYBACK_STATES.BUFFERING
        );

        await store.dispatch("playback/start_live_view");

        let request_to_start_acquisition = mocked_axios.history.get[0];

        expect(request_to_start_acquisition.url).toMatch(`${baseurl}/${api}`);

        expect(store.state.playback.playback_state).toEqual(
          playback_module.ENUMS.PLAYBACK_STATES.BUFFERING
        );

        await wait_for_expect(() => {
          expect(
            store.state.flask.status_ping_interval_id
          ).toBeGreaterThanOrEqual(0);
          expect(store.state.playback.playback_state).toEqual(
            playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
          );
        });
      });
    });
  });
});
