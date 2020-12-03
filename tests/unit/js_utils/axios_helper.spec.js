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

        expect(mocked_axios.history.get[0].url).toEqual(whole_url);
      });
    });
  });
});
