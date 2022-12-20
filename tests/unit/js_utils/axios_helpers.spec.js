import Vuex from "vuex";
import axios from "axios";
const MockAxiosAdapter = require("axios-mock-adapter");
const sinon = require("sinon");
import { createLocalVue } from "@vue/test-utils";
import { STATUS } from "@/store/modules/flask/enums";

import { all_mantarray_commands_regexp, system_status_regexp } from "@/store/modules/flask/url_regex";
import { call_axios_get_from_vuex, call_axios_post_from_vuex } from "@/js_utils/axios_helpers.js";
const sandbox = sinon.createSandbox();
let log_spy;
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
    log_spy = jest.spyOn(console, "log");
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
  test.each([["flask/get_flask_action_context"], ["playback/get_playback_action_context"]])(
    "Given that the context variable is obtained from %s and /system_status is mocked to return 404 and the SystemState is SERVER_BOOTING_UP and a interval ID is committed to the store for status pinging, When the function is called with the URL /system_status, Then System State remains in SERVER_BOOTING_UP (does not change to Error) and the status pinging interval does not get cleared",
    async (context_str) => {
      context = await store.dispatch(context_str);

      mocked_axios.onGet(system_status_regexp).reply(404);
      const expected_interval_id = 5;
      store.commit("flask/set_status_uuid", STATUS.MESSAGE.SERVER_BOOTING_UP);
      store.commit("flask/set_status_ping_interval_id", expected_interval_id);

      // confirm pre-conditions
      expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.SERVER_BOOTING_UP);

      await call_axios_get_from_vuex("http://localhost:4567/system_status", context);

      expect(store.state.flask.status_ping_interval_id).toStrictEqual(expected_interval_id);
      expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.SERVER_BOOTING_UP);
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

      test.each([["flask/get_flask_action_context"], ["playback/get_playback_action_context"]])(
        "Given that the context variable is obtained from %s and status pinging is active and live_view is started and /start_recording is mocked to return an HTTP error, When the function is called with the URL /start_recording, Then both intervals are cleared in Vuex (status pinging and playback progression)",
        async (context_str) => {
          context = await store.dispatch(context_str);
          mocked_axios.onGet("/start_recording").reply(405);

          await store.dispatch("flask/start_status_pinging");
          await store.dispatch("playback/start_playback_progression");

          // confirm pre-conditions
          expect(store.state.flask.status_ping_interval_id).not.toBeNull();
          expect(store.state.playback.playback_progression_interval_id).not.toBeNull();

          await call_axios_get_from_vuex("http://localhost:4567/start_recording", context);
          expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.ERROR);
          expect(store.state.flask.status_ping_interval_id).toBeNull();
          expect(store.state.playback.playback_progression_interval_id).toBeNull();
        }
      );
      test.each([["flask/get_flask_action_context"], ["playback/get_playback_action_context"]])(
        "Given that the context variable is obtained from %s and status pinging is active and /start_calibration is mocked to return an HTTP error, When the function is called for the /start_calibration URL, Then the status pinging interval is cleared in Vuex",
        async (context_str) => {
          context = await store.dispatch(context_str);

          mocked_axios.onGet("/start_calibration").reply(507);

          await store.dispatch("playback/start_playback_progression");

          // confirm pre-condition
          expect(store.state.playback.playback_progression_interval_id).not.toBeNull();

          await call_axios_get_from_vuex("/start_calibration", context);
          expect(log_spy.mock.calls).toContainEqual(["status:", 507]);

          expect(store.state.playback.playback_progression_interval_id).toBeNull();
        }
      );
      test.each([["flask/get_flask_action_context"], ["playback/get_playback_action_context"]])(
        "Given that the context variable is obtained from %s and playback progression is active and /start_recording is mocked to return an HTTP error, When the function is called for the /start_recording URL, Then the playback progression interval is cleared in Vuex",
        async (context_str) => {
          context = await store.dispatch(context_str);

          mocked_axios.onGet("/start_recording").reply(309);

          await store.dispatch("flask/start_status_pinging");

          // confirm pre-condition
          expect(store.state.flask.status_ping_interval_id).not.toBeNull();

          await call_axios_get_from_vuex("http://localhost:4567/start_recording", context);

          expect(store.state.flask.status_ping_interval_id).toBeNull();
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

          expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.ERROR);
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

          expect(store.state.flask.status_uuid).toStrictEqual(STATUS.MESSAGE.ERROR);
        }
      );
    });
  });
});

describe("axios_helper.stim_studio", () => {
  const sample_message = {
    data: { protocol: { stimulation_type: "C", well_title: "A01", subprotocols: [] } },
  };
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let mocked_axios;

  beforeEach(async () => {
    mocked_axios = new MockAxiosAdapter(axios);
  });

  afterEach(async () => {
    mocked_axios.restore();
    jest.restoreAllMocks();
  });

  test("Given axios is mocked to return status code 500 when posting new protocol message, When the function is called, Then it returns the status code of the axios request and logs", async () => {
    const whole_url = "http://localhost:4567/set_protocols";
    const endpoint = "/set_protocols";

    const status_code = 500;
    mocked_axios.onPost(whole_url).reply(status_code);
    const error = await call_axios_post_from_vuex(endpoint, sample_message);
    expect(error).toBe(status_code);
  });

  test("Given axios is mocked to return status code 200 when posting new protocol message, When the function is called, Then it returns the status code of the axios request and logs", async () => {
    const whole_url = "http://localhost:4567/set_protocols";
    const endpoint = "/set_protocols";

    const status_code = 200;
    mocked_axios.onPost(whole_url).reply(status_code);
    const response = await call_axios_post_from_vuex(endpoint, sample_message);
    expect(response.status).toBe(200);
  });

  test("Given axios is mocked to return status code 500 when posting Stim status update, When the function is called, Then it returns the status code of the axios request and logs", async () => {
    const whole_url = "http://localhost:4567/set_stim_play_state?running=true";
    const endpoint = "/set_stim_play_state?running=true";

    const status_code = 500;
    mocked_axios.onPost(whole_url).reply(status_code);
    const error = await call_axios_post_from_vuex(endpoint);
    expect(error).toBe(status_code);
  });
  test("Given axios is mocked to return status code 200 when posting Stim status update, When the function is called, Then it returns the status code of the axios request and logs", async () => {
    const whole_url = "http://localhost:4567/set_stim_play_state?running=false";
    const endpoint = "/set_stim_play_state?running=false";

    const status_code = 200;
    mocked_axios.onPost(whole_url).reply(status_code);
    const response = await call_axios_post_from_vuex(endpoint);
    expect(response.status).toBe(200);
  });
});
