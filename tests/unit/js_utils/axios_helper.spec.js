import Vuex from "vuex";
import axios from "axios";
const MockAxiosAdapter = require("axios-mock-adapter");
const sinon = require("sinon");
import { createLocalVue } from "@vue/test-utils";
import { STATUS } from "@/store/modules/flask/enums";

import {
  all_mantarray_commands_regexp,
  system_status_regexp,
} from "@/store/modules/flask/url_regex";
import { get_available_data_regex } from "@/store/modules/waveform/url_regex";
import { new_arry as waveform_data_response } from "../js_utils/waveform_data_provider.js";
import { call_axios_get_from_vuex } from "@/js_utils/axios_helpers.js";
const sandbox = sinon.createSandbox();

describe("axios_helper.call_axios_get_from_vuex", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;
  let mocked_axios;
  let context = null;
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
    store.commit("waveform/stop_waveform_pinging");
    mocked_axios.restore();
    jest.restoreAllMocks();
    sandbox.restore();
  });
  test.each([
    ["flask/get_flask_action_context"],
    ["playback/get_playback_action_context"],
  ])(
    "Given that the context variable is obtained from %s and /system_status is mocked to return 404 and the SystemState is SERVER_STILL_INITIALIZING and a interval ID is committed to the store for status pinging, When the function is called with the URL /system_status, Then System State remains in SERVER_STILL_INITIALIZING (does not change to Error) and the status pinging interval does not get cleared",
    async (context_str) => {
      context = await store.dispatch(context_str);

      mocked_axios.onGet(system_status_regexp).reply(404);
      const expected_interval_id = 5;
      store.commit(
        "flask/set_status_uuid",
        STATUS.MESSAGE.SERVER_STILL_INITIALIZING
      );
      store.commit("flask/set_status_ping_interval_id", expected_interval_id);

      // confirm pre-conditions
      expect(store.state.flask.status_uuid).toStrictEqual(
        STATUS.MESSAGE.SERVER_STILL_INITIALIZING
      );

      const result = await call_axios_get_from_vuex(
        "http://localhost:4567/system_status",
        context
      );

      expect(store.state.flask.status_ping_interval_id).toStrictEqual(
        expected_interval_id
      );
      expect(store.state.flask.status_uuid).toStrictEqual(
        STATUS.MESSAGE.SERVER_STILL_INITIALIZING
      );
      expect(result.status).toStrictEqual(404);
    }
  );
  test.each([
    ["flask/get_flask_action_context"],
    ["playback/get_playback_action_context"],
  ])(
    "Given that the context variable is obtained from %s and /system_status is mocked to return 500 (something other than 404) and the SystemState is SERVER_STILL_INITIALIZING, and a status pinging interval is committed to Vuex, When the function is called with the URL /system_status, Then System State changes to ERROR and the status pinging interval is cleared and the return value is the axios response",
    async (context_str) => {
      context = await store.dispatch(context_str);
      const expected_status_code = 500;
      mocked_axios.onGet(system_status_regexp).reply(expected_status_code);

      store.commit(
        "flask/set_status_uuid",
        STATUS.MESSAGE.SERVER_STILL_INITIALIZING
      );

      store.commit("flask/set_status_ping_interval_id", 5);

      // confirm pre-conditions
      expect(store.state.flask.status_uuid).toStrictEqual(
        STATUS.MESSAGE.SERVER_STILL_INITIALIZING
      );
      expect(store.state.flask.status_ping_interval_id).not.toBeNull();

      const result = await call_axios_get_from_vuex(
        "http://localhost:4567/system_status",
        context
      );

      expect(store.state.flask.status_ping_interval_id).toBeNull();
      expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.ERROR);
      expect(result.status).toStrictEqual(expected_status_code);
    }
  );

  describe("Given the SYSTEM STATE is set to SERVER_READY", () => {
    beforeEach(() => {
      store.commit("flask/set_status_uuid", STATUS.MESSAGE.SERVER_READY);
    });

    describe("Given /system_status is mocked to return 200 and some dummy values", () => {
      beforeEach(() => {
        mocked_axios.onGet(system_status_regexp).reply(200, {
          ui_status_code: STATUS.MESSAGE.CALIBRATION_NEEDED,
          in_simulation_mode: true,
        });
      });

      test.each([
        ["flask/get_flask_action_context"],
        ["playback/get_playback_action_context"],
      ])(
        "Given that the context variable is obtained from %s and /get_available_data is mocked to return some valid values and data pinging is active, and status pinging is active and live_view is started and /start_recording is mocked to return an HTTP error, When the function is called with the URL /start_recording, Then all 3 intervals are cleared in Vuex (status pinging, data pinging, and playback progression)",
        async (context_str) => {
          context = await store.dispatch(context_str);

          mocked_axios
            .onGet(get_available_data_regex)
            .reply(200, waveform_data_response);

          await store.dispatch("waveform/start_get_waveform_pinging");

          mocked_axios.onGet("/start_recording").reply(405);

          await store.dispatch("flask/start_status_pinging");
          await store.dispatch("playback/start_playback_progression");

          // confirm pre-conditions
          expect(store.state.waveform.waveform_ping_interval_id).not.toBeNull();
          expect(store.state.flask.status_ping_interval_id).not.toBeNull();
          expect(
            store.state.playback.playback_progression_interval_id
          ).not.toBeNull();

          await call_axios_get_from_vuex(
            "http://localhost:4567/start_recording",
            context
          );

          expect(store.state.flask.status_uuid).toStrictEqual(
            STATUS.MESSAGE.ERROR
          );
          expect(store.state.flask.status_ping_interval_id).toBeNull();
          expect(
            store.state.playback.playback_progression_interval_id
          ).toBeNull();
          expect(store.state.waveform.waveform_ping_interval_id).toBeNull();
        }
      );
      test.each([
        ["flask/get_flask_action_context"],
        ["playback/get_playback_action_context"],
      ])(
        "Given that the context variable is obtained from %s and status pinging is active and /start_calibration is mocked to return an HTTP error, When the function is called for the /start_calibration URL, Then the status pinging interval is cleared in Vuex",
        async (context_str) => {
          context = await store.dispatch(context_str);

          mocked_axios.onGet("/start_calibration").reply(507);

          await store.dispatch("playback/start_playback_progression");

          // confirm pre-condition
          expect(
            store.state.playback.playback_progression_interval_id
          ).not.toBeNull();

          await call_axios_get_from_vuex(
            "http://localhost:4567/start_calibration",
            context
          );

          expect(
            store.state.playback.playback_progression_interval_id
          ).toBeNull();
        }
      );
      test.each([
        ["flask/get_flask_action_context"],
        ["playback/get_playback_action_context"],
      ])(
        "Given that the context variable is obtained from %s and playback progression is active and /start_recording is mocked to return an HTTP error, When the function is called for the /start_recording URL, Then the playback progression interval is cleared in Vuex",
        async (context_str) => {
          context = await store.dispatch(context_str);

          mocked_axios.onGet("/start_recording").reply(309);

          await store.dispatch("flask/start_status_pinging");

          // confirm pre-condition
          expect(store.state.flask.status_ping_interval_id).not.toBeNull();

          await call_axios_get_from_vuex(
            "http://localhost:4567/start_recording",
            context
          );

          expect(store.state.flask.status_ping_interval_id).toBeNull();
        }
      );
      test.each([
        ["flask/get_flask_action_context"],
        ["playback/get_playback_action_context"],
      ])(
        "Given that the context variable is obtained from %s and /get_available_data is mocked to return some dummy data, and data pinging is active, When the function is called for the  /start_live_view URL, Then the data pinging interval is cleared in Vuex",
        async (context_str) => {
          context = await store.dispatch(context_str);

          mocked_axios
            .onGet(get_available_data_regex)
            .reply(200, waveform_data_response)
            .onGet("/start_live_view")
            .reply(401);

          await store.dispatch("waveform/start_get_waveform_pinging");

          // confirm pre-condition
          expect(store.state.waveform.waveform_ping_interval_id).not.toBeNull();

          await call_axios_get_from_vuex(
            "http://localhost:4567/start_live_view",
            context
          );

          expect(store.state.waveform.waveform_ping_interval_id).toBeNull();
        }
      );
    });

    describe("Given that the context variable is obtained from the Vuex Flask module", () => {
      beforeEach(async () => {
        context = await store.dispatch("flask/get_flask_action_context");
      });

      describe("Given axios is mocked to return status code 200", () => {
        beforeEach(async () => {
          mocked_axios.onGet(all_mantarray_commands_regexp).reply(200);
        });
        test("When the function is called, Then axios is called with the supplied URL", async () => {
          const whole_url = "http://localhost:4567/start_recording";

          await call_axios_get_from_vuex(whole_url, context);

          expect(mocked_axios.history.get[0].url).toStrictEqual(whole_url);
        });
      });
      test("Given axios is mocked to return status code 200 and a mocked set of data, When the function is called, Then it returns the result of the axios request", async () => {
        const whole_url = "http://localhost:4567/start_recording";
        const expected_result = {
          ui_status_code: STATUS.MESSAGE.CALIBRATION_NEEDED,
          in_simulation_mode: true,
        };
        mocked_axios.onGet(whole_url).reply(200, expected_result);
        const actual = await call_axios_get_from_vuex(whole_url, context);

        expect(actual.data).toStrictEqual(expected_result);
      });

      test.each([
        [404, "4xx series"],
        [307, "3xx series"],
        [550, "5xx series"],
      ])(
        "Given axios is mocked to return status code %s (%s), When the function is called with a generic URL, Then the system status in Vuex is updated to axios error mode",
        async (error_code, description) => {
          const whole_url = "http://localhost:4567/start_recording";
          mocked_axios.onGet(whole_url).reply(error_code);
          await call_axios_get_from_vuex(whole_url, context);

          expect(store.state.flask.status_uuid).toStrictEqual(
            STATUS.MESSAGE.ERROR
          );
        }
      );
    });
    describe("Given that the context variable is obtained from the Vuex Playback module", () => {
      beforeEach(async () => {
        context = await store.dispatch("playback/get_playback_action_context");
      });

      test.each([
        [406, "4xx series"],
        [306, "3xx series"],
        [504, "5xx series"],
      ])(
        "Given axios is mocked to return status code %s (%s), When the function is called with a generic URL, Then the system status in Vuex is updated to axios error mode",
        async (error_code, description) => {
          const whole_url = "http://localhost:4567/start_recording";
          mocked_axios.onGet(whole_url).reply(error_code);
          await call_axios_get_from_vuex(whole_url, context);

          expect(store.state.flask.status_uuid).toStrictEqual(
            STATUS.MESSAGE.ERROR
          );
        }
      );
    });
  });
});
