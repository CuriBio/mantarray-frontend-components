import Vuex from "vuex";
import axios from "axios";
const MockAxiosAdapter = require("axios-mock-adapter");
const sinon = require("sinon");
import { createLocalVue } from "@vue/test-utils";
import { STATUS } from "@/store/modules/flask/enums";

import { all_mantarray_commands_regexp } from "@/store/modules/flask/url_regex";
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
    mocked_axios.restore();
    jest.restoreAllMocks();
    sandbox.restore();
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
