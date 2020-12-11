import { mount } from "@vue/test-utils";
import StatusWidget from "@/components/status/StatusBar.vue";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import axios from "axios";
const MockAxiosAdapter = require("axios-mock-adapter");
import { createLocalVue } from "@vue/test-utils";
import { STATUS } from "@/store/modules/flask/enums";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;
let mocked_axios;

const text_selector = ".span__status-bar-text";

beforeAll(async () => {
  // note the store will mutate across tests, so make sure to re-create it in beforeEach
  const storePath = `${process.env.buildDir}/store.js`;
  NuxtStore = await import(storePath);
});

beforeEach(async () => {
  store = await NuxtStore.createStore();
  mocked_axios = new MockAxiosAdapter(axios);
});

afterEach(() => {
  wrapper.destroy();
  mocked_axios.restore();
});

describe("StatusWidget.vue", () => {
  test.each([
    ["SERVER_STILL_INITIALIZING", "Status: Connecting..."],
    ["SERVER_READY", "Status: Connecting..."],
    ["INITIALIZING_INSTRUMENT", "Status: Initializing..."],
    ["CALIBRATION_NEEDED", "Status: Connected...Calibration Needed"],
    ["CALIBRATING", "Status: Calibrating..."],
    ["CALIBRATED", "Status: Ready"],
    ["BUFFERING", "Status: Preparing for Live View..."],
    ["LIVE_VIEW_ACTIVE", "Status: Live View Active"],
    ["RECORDING", "Status: Recording to File"],
    ["ERROR", "Status: Error Occurred"],
  ])(
    "When Vuex is mutated to the state %s, Then the status text should update to be: %s",
    async (vuex_state, expected_text) => {
      const shutdown_url = "http://localhost:4567/shutdown";
      mocked_axios.onGet(shutdown_url).reply(200, {});
      const propsData = {};
      wrapper = mount(StatusWidget, {
        propsData,
        store,
        localVue,
      });
      store.commit("flask/set_status_uuid", STATUS.MESSAGE[vuex_state]);
      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.find(text_selector).text()).toEqual(expected_text);
    }
  );
  test("When initially mounted, Then the status text matches the Vuex state", () => {
    const propsData = {};
    store.commit("flask/set_status_uuid", STATUS.MESSAGE.CALIBRATING_uuid);
    wrapper = mount(StatusWidget, {
      propsData,
      store,
      localVue,
    });

    expect(wrapper.find(text_selector).text()).toEqual(
      "Status: Calibrating..."
    );
  });

  test("When Vuex is mutated to an unknown UUID, Then the status text should update to include that UUID", async () => {
    const propsData = {};
    wrapper = mount(StatusWidget, {
      propsData,
      store,
      localVue,
    });

    store.commit(
      "flask/set_status_uuid",
      "3dbb8814-09f1-44db-b7d5-7a9f702beac4"
    );
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find(text_selector).text()).toEqual(
      "Status:3dbb8814-09f1-44db-b7d5-7a9f702beac4"
    );
  });
  test("When Vuex is mutated to an ERROR UUID, Then the status text should update as 'Error Occurred' ", async () => {
    const shutdown_url = "http://localhost:4567/shutdown";
    mocked_axios.onGet(shutdown_url).reply(200, {});
    const propsData = {};
    wrapper = mount(StatusWidget, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    store.commit("flask/set_status_uuid", STATUS.MESSAGE.ERROR);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find(text_selector).text()).toEqual(
      "Status: Error Occurred"
    );
  });
  test("When Vuex is mutated to an SHUTDOWN UUID, Then the status text should update as 'Shutting Down' ", async () => {
    const propsData = {};
    wrapper = mount(StatusWidget, {
      propsData,
      store,
      localVue,
    });

    store.commit("flask/set_status_uuid", STATUS.MESSAGE.SHUTDOWN);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find(text_selector).text()).toEqual("Status: Shutting Down");
    await wrapper.vm.$nextTick(); // wait for update
  });
});
