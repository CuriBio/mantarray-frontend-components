import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";
const MockAxiosAdapter = require("axios-mock-adapter");
const sinon = require("sinon");
import { createLocalVue } from "@vue/test-utils";
import playback_module from "@/store/modules/playback";
import { STATUS } from "@/store/modules/flask/enums";
import { ENUMS } from "@/store/modules/playback/enums";
import * as axios_helpers from "@/js_utils/axios_helpers";
const wait_for_expect = require("wait-for-expect");
import { all_mantarray_commands_regexp, system_status_regexp } from "@/store/modules/flask/url_regex";
import { PLAYBACK_ENUMS } from "@/dist/mantarray.common";
import { advance_playback_progression, micros_per_milli } from "@/store/modules/playback/actions";
const sandbox = sinon.createSandbox();
const base_url = "http://localhost:4567";
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
    jest.clearAllMocks();
    sandbox.restore();
  });

  test("When imported from a pre-built library, Then assert the ENUM values to match the original", () => {
    expect(PLAYBACK_ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE).toStrictEqual(
      playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
    );
  });

  describe("Playback", () => {
    test("When the playback store is initialized, Then playback_state should be NOT_CONNECTED_TO_INSTRUMENT", () => {
      expect(store.state.playback.playback_state).toStrictEqual(
        playback_module.ENUMS.PLAYBACK_STATES.NOT_CONNECTED_TO_INSTRUMENT
      );
    });
    test("When the playback store is initialized, Then playback_progression_time_interval should be 40", () => {
      expect(store.state.playback.playback_progression_time_interval).toStrictEqual(40);
    });
    describe("Given the playback context is obtained from Vuex and the timestamp of beginning of playback progession has been set and the current x_time_index has been set to a number substantially larger than the delay theshold", () => {
      let context;
      let timestamp_of_beginning_of_progression;
      let default_playback_progression_time_interval;
      let bound_advance_playback_progression;
      let spied_performance_now;
      const initial_x_time_index = 10000 * micros_per_milli;
      beforeEach(async () => {
        context = await store.dispatch("playback/get_playback_action_context");
        bound_advance_playback_progression = advance_playback_progression.bind(context);
        store.commit("playback/mark_timestamp_of_beginning_of_progression");
        store.commit("playback/set_x_time_index", initial_x_time_index);
        timestamp_of_beginning_of_progression = store.state.playback.timestamp_of_beginning_of_progression;
        default_playback_progression_time_interval = store.state.playback.playback_progression_time_interval;
        spied_performance_now = jest.spyOn(performance, "now");
      });
      test("Given performance.now is mocked to return a time interval just below the lag threshold, When advance_playback_progression is invoked, Then the x_time_index is incremented the default amount", () => {
        spied_performance_now.mockReturnValueOnce(
          timestamp_of_beginning_of_progression +
            initial_x_time_index / micros_per_milli +
            store.state.playback.num_milliseconds_to_fast_forward_if_delayed -
            0.1
        );
        // confirm pre-condition
        expect(store.state.playback.x_time_index).toStrictEqual(initial_x_time_index);
        spied_performance_now.mockReturnValueOnce(timestamp_of_beginning_of_progression + 1);
        bound_advance_playback_progression();
        expect(store.state.playback.x_time_index).toStrictEqual(
          initial_x_time_index + default_playback_progression_time_interval * micros_per_milli
        );
      });
      test("Given performance.now is mocked to return a time interval of a lag equal to the threshold, When advance_playback_progression is invoked, Then the x_time_index is incremented the designated larger amount to start to catch up", () => {
        spied_performance_now.mockReturnValueOnce(
          initial_x_time_index / micros_per_milli +
            timestamp_of_beginning_of_progression +
            store.state.playback.num_milliseconds_to_fast_forward_if_delayed
        );
        // confirm pre-condition
        expect(store.state.playback.x_time_index).toStrictEqual(initial_x_time_index);

        bound_advance_playback_progression();
        // TODO figure out why this check is sporadically failing
        expect(store.state.playback.x_time_index).toStrictEqual(
          initial_x_time_index +
            store.state.playback.num_milliseconds_to_fast_forward_if_delayed * micros_per_milli
        );
      });
      test("Given the delay threshold has been changed lower from the default and performance.now is mocked to return a time interval of a lag just larger than the threshold, When advance_playback_progression is invoked, Then the x_time_index is incremented the new designated larger amount to start to catch up", () => {
        const new_delay_threshold = 80;
        store.commit("playback/set_num_milliseconds_to_fast_forward_if_delayed", new_delay_threshold);
        spied_performance_now.mockReturnValueOnce(
          initial_x_time_index / micros_per_milli +
            timestamp_of_beginning_of_progression +
            new_delay_threshold +
            0.1
        );
        // confirm pre-condition
        expect(store.state.playback.x_time_index).toStrictEqual(initial_x_time_index);

        bound_advance_playback_progression();
        expect(store.state.playback.x_time_index).toStrictEqual(
          initial_x_time_index + new_delay_threshold * micros_per_milli
        );
      });
    });
  });

  describe("mutations", () => {
    test("When set_playback_progression_interval_id is invoked, Then the Vuex state is updated", () => {
      const expected_interval_id = 223;
      store.commit("playback/set_playback_progression_interval_id", expected_interval_id);
      expect(store.state.playback.playback_progression_interval_id).toStrictEqual(expected_interval_id);
    });
    test("When set_num_milliseconds_to_fast_forward_if_delayed is invoked, Then the Vuex state is updated", () => {
      const expected = 2000;
      // confirm pre-condition
      expect(store.state.playback.num_milliseconds_to_fast_forward_if_delayed).not.toStrictEqual(expected);

      store.commit("playback/set_num_milliseconds_to_fast_forward_if_delayed", expected);
      expect(store.state.playback.num_milliseconds_to_fast_forward_if_delayed).toStrictEqual(expected);
    });
    test("When mark_timestamp_of_beginning_of_progression is invoked, Then the Vuex state is updated to the current value of performance.now", () => {
      const spied_performance_now = jest.spyOn(performance, "now");
      store.commit("playback/mark_timestamp_of_beginning_of_progression");
      expect(store.state.playback.timestamp_of_beginning_of_progression).toStrictEqual(
        spied_performance_now.mock.results[0].value
      );
    });
    test("Given playback_progression_interval is not active, When stop_playback_progression is committed, Then clearInterval is not called", async () => {
      const expected_interval_id = store.state.playback.playback_progression_interval_id;
      // confirm pre-condition
      expect(expected_interval_id).toBeNull();

      const spied_clear_interval = jest.spyOn(window, "clearInterval");

      store.commit("playback/stop_playback_progression");

      expect(spied_clear_interval).not.toHaveBeenCalled();
    });
    test("Given tooltips_delay is having a default value of 2 sec, When a value different than the default value is committed to tooltips_delay, Then the Vuex state is updated", () => {
      const expected_tooltips_delay = 1000;
      expect(store.state.playback.tooltips_delay).toStrictEqual(2000);
      store.commit("playback/set_tooltips_delay", expected_tooltips_delay);
      expect(store.state.playback.tooltips_delay).toStrictEqual(expected_tooltips_delay);
    });

    describe("Given playback_progression interval is active", () => {
      beforeEach(async () => {
        await store.dispatch("playback/start_playback_progression");
      });
      test("When start_playback_progression is dispatched again, Then setInterval is not called again and the interval ID in Vuex does not change", async () => {
        const expected_interval_id = store.state.playback.playback_progression_interval_id;
        // confirm pre-condition
        expect(expected_interval_id).not.toBeNull();

        const spied_set_interval = jest.spyOn(window, "setInterval");

        await store.dispatch("playback/start_playback_progression");

        expect(spied_set_interval.mock.calls).toHaveLength(0);
        expect(store.state.playback.playback_progression_interval_id).toStrictEqual(expected_interval_id);
      });
      test("When stop_playback_progression is committed, Then clearInterval is called and the interval ID in Vuex is set to null", async () => {
        const expected_interval_id = store.state.playback.playback_progression_interval_id;
        // confirm pre-condition
        expect(expected_interval_id).not.toBeNull();

        const spied_clear_interval = jest.spyOn(window, "clearInterval");

        store.commit("playback/stop_playback_progression");

        expect(spied_clear_interval).toHaveBeenCalledWith(expected_interval_id);
        expect(store.state.playback.playback_progression_interval_id).toBeNull();
      });
    });

    test("When set_playback_state is committed, Then the playback_state is mutated", () => {
      store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE);
      expect(store.state.playback.playback_state).toStrictEqual(
        playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
      );
      store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED);
      expect(store.state.playback.playback_state).toStrictEqual(
        playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED
      );
    });
    test("When the playback store is initialized, Then the x_time_index is initially 0", () => {
      expect(store.getters["playback/x_time_index"]).toBe(0);
    });
    test("When a value is committed to set_x_time_index, Then the x_time_index in the store gets updated to that value", () => {
      store.commit("playback/set_x_time_index", 12345);
      expect(store.getters["playback/x_time_index"]).toBe(12345);
    });
    test("When the increment_x_time_index is mutated, Then the x_time_index is incremented", () => {
      store.commit("playback/increment_x_time_index", 100);
      expect(store.getters["playback/x_time_index"]).toBe(100);
      store.commit("playback/increment_x_time_index", 150);
      expect(store.getters["playback/x_time_index"]).toBe(250);
    });
    describe("barcode validity", () => {
      test.each([
        ["", "error due to empty string", false],
        ["ML34567890123", "error due tolength over 12", false],
        ["ML345678901", "error due tolength under 12", false],
        ["ML二千万一千〇九", "error due to all unicode", false],
        ["ML2021$72144", "error due to invalid character '$'", false],
        ["ML2020172144", "error due to invalid year '2020'", false],
        ["ML2021000144", "error due to invalid Julian date '000'", false],
        ["ML2021367144", "error due to invalid Julian date '367'", false],
        ["MS2021172000", "header 'MS'", false],
        ["ML2021172001", "valid kit ID '001'", true],
        ["ML2021172002", "valid kit ID '002'", true],
        ["ML2021172003", "valid kit ID '003'", true],
        ["ML2021172004", "valid kit ID '004'", true],
        ["ML9999172001", "year '9999'", true],
        ["ML2021001144", "julian date '001'", true],
        ["ML2021366144", "julian date '366'", true],
      ])(
        "Given a plate barcode scanned results in value %s, When validation rule FAILS  or PASSES due %s, Then validation results set valid to %s",
        async (plate_barcode, reason, valid) => {
          // testing with plate barcode here but the functionality is exactly the same for stim barcodes
          store.dispatch("playback/validate_barcode", { type: "plate_barcode", new_value: plate_barcode });
          expect(store.state.playback.barcodes.plate_barcode.valid).toBe(valid);
        }
      );
    });
  });
  describe("actions", () => {
    describe("Given timers are mocked", () => {
      beforeEach(() => {
        sandbox.useFakeTimers({ toFake: ["setInterval", "clearInterval"] });
      });
      test("Given playback_progression is not active, When time is advanced, Then the x_time_index does not change", () => {
        sandbox.clock.tick(10000);
        expect(store.state.playback.x_time_index).toStrictEqual(0);
      });
      describe("Given playback_progression is active", () => {
        let playback_update_time_interval;
        const micros_per_milli = 1000;
        beforeEach(async () => {
          await store.dispatch("playback/start_playback_progression");
          playback_update_time_interval = store.state.playback.playback_progression_time_interval;
        });
        test("Given x_time_index started at 0, When time is advanced 4 updated intervals, Then x_time_index moves the correct number of microseconds", () => {
          // confirm pre-condition
          expect(store.state.playback.x_time_index).toStrictEqual(0);
          sandbox.clock.tick(4 * playback_update_time_interval);
          expect(store.state.playback.x_time_index).toStrictEqual(
            4 * playback_update_time_interval * micros_per_milli
          );
        });
        test("Given x_time_index started at 0, When time is advanced not quite 1 time interval, Then x_time_index does not change", () => {
          // confirm pre-condition
          expect(store.state.playback.x_time_index).toStrictEqual(0);
          sandbox.clock.tick(playback_update_time_interval - 1);
          expect(store.state.playback.x_time_index).toStrictEqual(0);
        });
        test("Given x_time_index started at 0, When time is advanced exactly 1 time interval, Then x_time_index moves the correct number of micros_per_milli", () => {
          // confirm pre-condition
          expect(store.state.playback.x_time_index).toStrictEqual(0);
          sandbox.clock.tick(playback_update_time_interval);
          expect(store.state.playback.x_time_index).toStrictEqual(
            playback_update_time_interval * micros_per_milli
          );
        });
        test("Given x_time_index started at 10, When time is advanced exactly 1 time interval, Then x_time_index moves the correct number of micros_per_milli", () => {
          store.commit("playback/set_x_time_index", 10);
          sandbox.clock.tick(playback_update_time_interval);
          expect(store.state.playback.x_time_index).toStrictEqual(
            playback_update_time_interval * micros_per_milli + 10
          );
        });
        test("Given x_time_index started at 0, When time is advanced exactly 1 time interval, Then x_time_index moves the correct number of micros_per_milli, When playback_progression is stopped and time is advanced another time interval, Then x_time_index does not change", () => {
          // confirm pre-condition
          expect(store.state.playback.x_time_index).toStrictEqual(0);
          sandbox.clock.tick(playback_update_time_interval);
          const expected_x_time_index = playback_update_time_interval * micros_per_milli;
          expect(store.state.playback.x_time_index).toStrictEqual(expected_x_time_index);
          store.commit("playback/stop_playback_progression");
          sandbox.clock.tick(playback_update_time_interval);
          expect(store.state.playback.x_time_index).toStrictEqual(expected_x_time_index);
        });
      });
    });
    test("Given x_time_index is not 0 and playback state is LIVE_VIEW_ACTIVE, and playback_progression_interval is active, When stop_playback is dispatched, Then x_time_index becomes 0, playback state becomes CALIBRATED and the playback_progression_interval is cleared", async () => {
      store.commit("playback/set_x_time_index", 200);
      await store.dispatch("playback/start_playback_progression");
      store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE);

      // confirm pre-condition
      expect(store.state.playback.playback_progression_interval_id).not.toBeNull();

      await store.dispatch("playback/stop_playback");
      expect(store.state.playback.playback_progression_interval_id).toBeNull();
      expect(store.state.playback.x_time_index).toStrictEqual(0);
      expect(store.state.playback.playback_state).toStrictEqual(
        playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED
      );
    });
    test("When transition_playback_state is dispatched, Then the playback_state is mutated", async () => {
      store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
      );
      expect(store.state.playback.playback_state).toStrictEqual(
        playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
      );
    });
    test("Given playback_progression interval is not active and playback_state is BUFFERING, When the playback_state transitions to LIVE_VIEW_ACTIVE, Then the playback_progression_interval becomes active", async () => {
      await store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.BUFFERING
      );

      // confirm pre-condition
      expect(store.state.playback.playback_progression_interval_id).toBeNull();

      await store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
      );

      expect(store.state.playback.playback_progression_interval_id).not.toBeNull();
    });
    test("Given playback_progression interval is not active and playback_state is CALIBRATED, When the playback_state transitions to CALIBRATING, Then the playback_progression_interval does not become active", async () => {
      await store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED
      );

      // confirm pre-condition
      expect(store.state.playback.playback_progression_interval_id).toBeNull();

      await store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING
      );

      expect(store.state.playback.playback_progression_interval_id).toBeNull();
    });

    test("Given playback_progression interval is active and playback_state is LIVE_VIEW_ACTIVE, When the playback_state transitions to CALIBRATED, Then the playback_progression_interval is cleared", async () => {
      store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE);
      await store.dispatch("playback/start_playback_progression");

      // confirm pre-condition
      expect(store.state.playback.playback_progression_interval_id).not.toBeNull();

      await store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED
      );

      expect(store.state.playback.playback_progression_interval_id).toBeNull();
    });
    test("Given playback_progression interval is active and playback_state is LIVE_VIEW_ACTIVE, When the playback_state transitions to RECORDING, Then the playback_progression_interval is not cleared", async () => {
      store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE);
      await store.dispatch("playback/start_playback_progression");

      // confirm pre-condition
      expect(store.state.playback.playback_progression_interval_id).not.toBeNull();

      await store.dispatch(
        "playback/transition_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.RECORDING
      );

      expect(store.state.playback.playback_progression_interval_id).not.toBeNull();
    });
    test("Given playback_progression interval is not active, When start_playback_progression is dispatched, Then setInterval is called and the interval ID and timestamp of when it was started are committed to Vuex", async () => {
      // confirm pre-condition
      expect(store.state.playback.playback_progression_interval_id).toBeNull();

      const expected_interval_id = 175;
      const spied_set_interval = jest.spyOn(window, "setInterval");
      spied_set_interval.mockReturnValueOnce(expected_interval_id);

      await store.dispatch("playback/start_playback_progression");

      expect(spied_set_interval.mock.calls).toHaveLength(1);
      expect(store.state.playback.playback_progression_interval_id).toStrictEqual(expected_interval_id);
      expect(store.state.playback.timestamp_of_beginning_of_progression).not.toBeUndefined();
    });

    test.each(["RECORDING", "LIVE_VIEW_ACTIVE"])(
      "When playback_state is %s and user selects to stop all processes to run a data analysis, Then playback state will return to CALIBRATED",
      async (active_state) => {
        await store.dispatch("playback/transition_playback_state", ENUMS.PLAYBACK_STATES[active_state]);

        expect(store.state.playback.playback_state).toBe(ENUMS.PLAYBACK_STATES[active_state]);
        await store.dispatch("playback/stop_active_processes");

        expect(store.state.playback.playback_state).toBe(ENUMS.PLAYBACK_STATES.CALIBRATED);
      }
    );

    describe("Given all axios requests are mocked to return status 200", () => {
      beforeEach(() => {
        mocked_axios.onGet(all_mantarray_commands_regexp).reply(200);
      });
      test("Given a valid barcode is set in Vuex and a playback x time index has been set, When start_recording is invoked, Then the playback and status states mutate to recording and the start of recording time is mutated to the x_time_index and an axios call was made to /start_recording with the correct time index and barcode and hardware_test_recording parameter and ignore_next_system_status_if_matching_this_status is mutated to LIVE_VIEW_ACTIVE", async () => {
        const api = "start_recording";

        const expected_status_state = STATUS.MESSAGE.RECORDING;

        // confirm pre-condition
        expect(store.state.playback.playback_state).not.toStrictEqual(
          playback_module.ENUMS.PLAYBACK_STATES.RECORDING
        );
        expect(store.state.flask.status_uuid).not.toStrictEqual(expected_status_state);

        store.commit("playback/set_x_time_index", 12345);

        const test_plate_barcode = "ML2022001000";
        const test_stim_barcode = "MS2022001000";
        store.dispatch("playback/validate_barcode", { type: "plate_barcode", new_value: test_plate_barcode });
        store.dispatch("playback/validate_barcode", { type: "stim_barcode", new_value: test_stim_barcode });

        const test_recording_name = "Test Name";

        await store.dispatch("playback/start_recording", test_recording_name);

        expect(mocked_axios.history.get[0].url).toStrictEqual(`${base_url}/${api}`);
        expect(mocked_axios.history.get[0].params).toStrictEqual({
          time_index: 12345,
          plate_barcode: test_plate_barcode,
          stim_barcode: test_stim_barcode,
          is_hardware_test_recording: false,
          recording_name: test_recording_name,
          platemap: null,
        });

        expect(store.state.playback.playback_state).toStrictEqual(
          playback_module.ENUMS.PLAYBACK_STATES.RECORDING
        );
        expect(store.state.flask.status_uuid).toStrictEqual(expected_status_state);
        expect(store.state.playback.recording_start_time).toStrictEqual(12345);

        expect(store.state.flask.ignore_next_system_status_if_matching_this_status).toStrictEqual(
          STATUS.MESSAGE.LIVE_VIEW_ACTIVE
        );
      });

      test("When user attempts to start a new recording with a platemap stored, Then the platemap config will be sent in /start_recording request instead of defaulting to null", async () => {
        const api = "start_recording";
        await store.commit("platemap/save_new_platemap", {
          map_name: "test_platemap",
          labels: [{ name: "test_label", wells: [], color: "#111" }],
        });

        const test_plate_barcode = "ML2022001000";
        const test_stim_barcode = "MS2022001000";
        store.dispatch("playback/validate_barcode", { type: "plate_barcode", new_value: test_plate_barcode });
        store.dispatch("playback/validate_barcode", { type: "stim_barcode", new_value: test_stim_barcode });

        const test_recording_name = "Test Name";
        await store.dispatch("playback/start_recording", test_recording_name);

        expect(mocked_axios.history.get[0].url).toStrictEqual(`${base_url}/${api}`);
        expect(mocked_axios.history.get[0].params).toStrictEqual({
          time_index: 0,
          plate_barcode: test_plate_barcode,
          stim_barcode: test_stim_barcode,
          is_hardware_test_recording: false,
          recording_name: test_recording_name,
          platemap: { map_name: "test_platemap", labels: [{ name: "test_label", wells: [] }] },
        });
      });

      test("Given an x_time_index is set in Vuex and a valid barcode is set in Vuex, When stop_recording is invoked, Then the playback and status states mutate to live_view_active and the /stop_recording route is called with the x_time_index parameter and the recording start time is reset to 0 in Vuex and the ignore_next_system_status_if_matching_this_status state in Vuex is set to RECORDING", async () => {
        const api = "stop_recording";

        const expected_status_state = STATUS.MESSAGE.LIVE_VIEW_ACTIVE;
        // confirm pre-condition
        expect(store.state.playback.playback_state).not.toStrictEqual(
          playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
        );
        expect(store.state.flask.status_uuid).not.toStrictEqual(expected_status_state);

        store.commit("playback/set_x_time_index", 456789);

        store.dispatch("playback/validate_barcode", { type: "plate_barcode", new_value: "ML2022001000" });

        await store.dispatch("playback/stop_recording");

        expect(mocked_axios.history.get[0].url).toStrictEqual(`${base_url}/${api}`);
        expect(mocked_axios.history.get[0].params).toStrictEqual({ time_index: 456789 });

        expect(store.state.playback.playback_state).toStrictEqual(
          playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
        );
        expect(store.state.playback.recording_start_time).toStrictEqual(0);
        expect(store.state.flask.status_uuid).toStrictEqual(expected_status_state);
        expect(store.state.flask.ignore_next_system_status_if_matching_this_status).toStrictEqual(
          STATUS.MESSAGE.RECORDING
        );
      });
    });
    describe("Given Mantarray Command routes return status 200", () => {
      beforeEach(async () => {
        mocked_axios.onGet(all_mantarray_commands_regexp).reply(200);
      });

      test("When stop_live_view is dispatched, Then ignore_next_system_status_if_matching_this_status is set to LIVE_VIEW_ACTIVE", async () => {
        await store.dispatch("playback/stop_live_view");
        expect(store.state.flask.ignore_next_system_status_if_matching_this_status).toStrictEqual(
          STATUS.MESSAGE.LIVE_VIEW_ACTIVE
        );
      });
      test("Given the Vuex plate_waveforms state has some values, When stop_live_view is dispatched, Then the plate_waveforms x/y data points are reset to empty arrays", async () => {
        store.commit("data/set_plate_waveforms", [
          { x_data_points: [55], y_data_points: [2.3] },
          { x_data_points: [4], y_data_points: [999] },
        ]);
        await store.dispatch("playback/stop_live_view");

        expect(store.state.data.plate_waveforms).toHaveLength(2);
        expect(store.state.data.plate_waveforms[0].x_data_points).toHaveLength(0);
        expect(store.state.data.plate_waveforms[0].y_data_points).toHaveLength(0);
        expect(store.state.data.plate_waveforms[1].x_data_points).toHaveLength(0);
        expect(store.state.data.plate_waveforms[1].y_data_points).toHaveLength(0);
      });
      test("Given the Vuex stim_waveforms state has some values, When stop_live_view is dispatched, Then the stim_waveforms x/y data points are reset to empty arrays", async () => {
        store.commit("data/set_stim_waveforms", [
          { x_data_points: [55], y_data_points: [2.3] },
          { x_data_points: [4], y_data_points: [999] },
        ]);
        await store.dispatch("playback/stop_live_view");

        expect(store.state.data.stim_waveforms).toHaveLength(2);
        expect(store.state.data.stim_waveforms[0].x_data_points).toHaveLength(0);
        expect(store.state.data.stim_waveforms[0].y_data_points).toHaveLength(0);
        expect(store.state.data.stim_waveforms[1].x_data_points).toHaveLength(0);
        expect(store.state.data.stim_waveforms[1].y_data_points).toHaveLength(0);
      });
      test("Given the Vuex heatmap_values state has some values, When stop_live_view is dispatched, Then the heatmap_values inner arrays are all reset to empty arrays", async () => {
        store.commit("data/set_heatmap_values", {
          "Twitch Force": { data: [[0], [10]] },
          "Twitch Frequency": { data: [[100], [110]] },
        });
        await store.dispatch("playback/stop_live_view");

        expect(store.state.data.heatmap_values["Twitch Force"].data).toHaveLength(2);
        expect(store.state.data.heatmap_values["Twitch Force"].data[0]).toHaveLength(0);
        expect(store.state.data.heatmap_values["Twitch Force"].data[1]).toHaveLength(0);
        expect(store.state.data.heatmap_values["Twitch Frequency"].data).toHaveLength(2);
        expect(store.state.data.heatmap_values["Twitch Frequency"].data[0]).toHaveLength(0);
        expect(store.state.data.heatmap_values["Twitch Frequency"].data[1]).toHaveLength(0);
      });
    });
    test("Given playback_progression interval is active and Mantarray Commands are mocked to return status 200, When stop_live_view is called, Then the interval is cleared", async () => {
      mocked_axios.onGet(all_mantarray_commands_regexp).reply(200);

      await store.dispatch("playback/start_playback_progression");

      const expected_interval_id = store.state.playback.playback_progression_interval_id;
      // confirm pre-condition
      expect(store.state.playback.playback_progression_interval_id).not.toBeNull();

      const spied_clear_interval = jest.spyOn(window, "clearInterval");

      await store.dispatch("playback/stop_live_view");

      expect(spied_clear_interval).toHaveBeenCalledWith(expected_interval_id);
      expect(store.state.playback.playback_progression_interval_id).toBeNull();
    });
    test("Given playback_progression interval is active and SYSTEM_STATUS is set to LIVE_VIEW_ACTIVE and Mantarray Commands are mocked to return status 400, When an axios error handled called, Then the SYSTEM_STATUS is set to ERROR and the interval playback_progression_interval_id is cleared", async () => {
      mocked_axios.onGet(all_mantarray_commands_regexp).reply(400);
      store.commit("flask/set_status_uuid", STATUS.MESSAGE.LIVE_VIEW_ACTIVE);

      await store.dispatch("playback/start_playback_progression");

      const expected_interval_id = store.state.playback.playback_progression_interval_id;
      // confirm pre-condition
      expect(expected_interval_id).toBeGreaterThanOrEqual(0);

      await store.dispatch("playback/start_calibration");
      expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.ERROR);
      expect(store.state.flask.status_ping_interval_id).toBeNull();
      expect(store.state.playback.playback_progression_interval_id).toBeNull();
    });
    test("Given x_time_index is not 0, When stop_live_view is called, Then the playback and status states mutate to calibrated and x_time_index mutates to 0", async () => {
      const api = "stop_managed_acquisition";

      mocked_axios.onGet(all_mantarray_commands_regexp).reply(200);

      const expected_status_state = STATUS.MESSAGE.CALIBRATED;
      store.commit("playback/set_x_time_index", 400);
      // confirm pre-condition
      expect(store.state.playback.playback_state).not.toStrictEqual(
        playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED
      );
      expect(store.state.flask.status_uuid).not.toStrictEqual(expected_status_state);

      await store.dispatch("playback/stop_live_view");

      expect(mocked_axios.history.get[0].url).toStrictEqual(`${base_url}/${api}`);

      expect(store.state.playback.playback_state).toStrictEqual(
        playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED
      );
      expect(store.state.playback.x_time_index).toStrictEqual(0);

      expect(store.state.flask.status_uuid).toStrictEqual(expected_status_state);
    });

    describe("Given /system_status is mocked to return the status CALIBRATED and all other routes are mocked to return status 200", () => {
      const api = "start_calibration";
      beforeEach(() => {
        mocked_axios
          .onGet(system_status_regexp, { params: { current_vuex_status_uuid: STATUS.MESSAGE.CALIBRATING } })
          .reply(200, { ui_status_code: STATUS.MESSAGE.CALIBRATED });

        mocked_axios.onGet(all_mantarray_commands_regexp).reply(200);
      });
      test.each([
        ["CALIBRATION_NEEDED", "CALIBRATION_NEEDED"],
        ["CALIBRATED", "CALIBRATED"],
      ])(
        "Given the flask status is set to %s, When start_calibration is called, Then ignore_next_system_status_if_matching_this_status is mutated to %s",
        async (expected_state_str, copy_of_expected_state_for_test_title_display) => {
          const expected_state = STATUS.MESSAGE[expected_state_str];
          store.commit("flask/set_status_uuid", expected_state);
          // confirm pre-condition
          expect(store.state.flask.status_uuid).toStrictEqual(expected_state);
          await store.dispatch("playback/start_calibration");
          expect(store.state.flask.ignore_next_system_status_if_matching_this_status).toStrictEqual(
            expected_state
          );
        }
      );

      test("When start_calibration is called, Then playback state mutates to calibrating and starts status_pinging in Flask, then playback state mutates to calibrated", async () => {
        // confirm pre-condition
        expect(store.state.playback.playback_state).not.toStrictEqual(
          playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING
        );

        await store.dispatch("playback/start_calibration");

        const request_to_start_calibration = mocked_axios.history.get[0];

        expect(request_to_start_calibration.url).toMatch(`${base_url}/${api}`);

        expect(store.state.playback.playback_state).toStrictEqual(
          playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING
        );

        await wait_for_expect(() => {
          expect(store.state.flask.status_ping_interval_id).toBeGreaterThanOrEqual(0);
          expect(store.state.playback.playback_state).toStrictEqual(
            playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED
          );
        });
      });
    });

    test("Given the /system_status is mocked with LIVE_VIEW_ACTIVE as response, When playback state mutates to BUFFERING and starts status_pinging in Flask, Then playback state mutates to LIVE_VIEW_ACTIVE and ignore_next_system_status_if_matching_this_status mutates to CALIBRATED", async () => {
      const api = "start_managed_acquisition";

      mocked_axios
        .onGet(system_status_regexp, { params: { current_vuex_status_uuid: STATUS.MESSAGE.BUFFERING } })
        .reply(200, { ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE });

      mocked_axios.onGet(all_mantarray_commands_regexp).reply(200);

      expect(store.state.playback.playback_state).not.toStrictEqual(
        playback_module.ENUMS.PLAYBACK_STATES.BUFFERING
      );

      const plate_barcode = "ML22001000-2";
      store.dispatch("playback/validate_barcode", { type: "plate_barcode", new_value: plate_barcode });

      await store.dispatch("playback/start_live_view");

      const request_to_start_acquisition = mocked_axios.history.get[0];

      expect(request_to_start_acquisition.url).toMatch(`${base_url}/${api}`);
      expect(request_to_start_acquisition.params).toStrictEqual({ plate_barcode });

      expect(store.state.playback.playback_state).toStrictEqual(
        playback_module.ENUMS.PLAYBACK_STATES.BUFFERING
      );
      expect(store.state.flask.ignore_next_system_status_if_matching_this_status).toStrictEqual(
        STATUS.MESSAGE.CALIBRATED
      );
      await wait_for_expect(() => {
        expect(store.state.flask.status_ping_interval_id).toBeGreaterThanOrEqual(0);
        expect(store.state.playback.playback_state).toStrictEqual(
          playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
        );
      });
    });
    test("When a user successfully attempts to start a local data analysis, Then the recording names will be posted to  the flask server and state will update to ACTIVE", async () => {
      const test_recordings = ["rec_1", "rec_2", "rec_3", "rec_4", "rec_5"];
      const post_endpoint = "/start_data_analysis";
      const post_url = "http://localhost:4567/start_data_analysis";

      const spied_helper = jest.spyOn(axios_helpers, "call_axios_post_from_vuex");
      mocked_axios.onPost(post_url).reply(204);

      await store.dispatch("playback/start_data_analysis", test_recordings);

      expect(store.state.playback.data_analysis_state).toBe(ENUMS.DATA_ANALYSIS_STATE.ACTIVE);
      expect(spied_helper).toHaveBeenCalledWith(post_endpoint, { selected_recordings: test_recordings });
    });

    test("When a user attempts to start a local data analysis and an error occurs, Then the analysis state will get updated to ERROR", async () => {
      const test_recordings = ["rec_1", "rec_2", "rec_3", "rec_4", "rec_5"];
      const post_url = "http://localhost:4567/start_data_analysis";

      mocked_axios.onPost(post_url).reply(404);

      await store.dispatch("playback/start_data_analysis", test_recordings);

      expect(store.state.playback.data_analysis_state).toBe(ENUMS.DATA_ANALYSIS_STATE.ERROR);
    });
  });
});
