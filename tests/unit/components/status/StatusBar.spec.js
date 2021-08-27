import { mount } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import StatusWidget from "@/components/status/StatusBar.vue";
import ErrorCatchWidget from "@/components/status/ErrorCatchWidget.vue";
import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
const MockAxiosAdapter = require("axios-mock-adapter");
import { createLocalVue } from "@vue/test-utils";
import { STATUS } from "@/store/modules/flask/enums";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

let NuxtStore;
let store;
let mocked_axios;

const text_selector = ".span__status-bar-text";

describe("StatusWidget.vue", () => {
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
    "Given that /shutdown is mocked to return status 200, When Vuex is mutated to the state %s, Then the status text should update to be: %s",
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

      expect(wrapper.find(text_selector).text()).toBe(expected_text);
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

    expect(wrapper.find(text_selector).text()).toBe("Status: Calibrating...");
  });

  test("When Vuex is mutated to an unknown UUID, Then the status text should update to include that UUID", async () => {
    const propsData = {};
    wrapper = mount(StatusWidget, {
      propsData,
      store,
      localVue,
    });

    store.commit("flask/set_status_uuid", "3dbb8814-09f1-44db-b7d5-7a9f702beac4");
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find(text_selector).text()).toBe("Status:3dbb8814-09f1-44db-b7d5-7a9f702beac4");
  });
  test("Given that the http response is 404 for api request /shutdown, When Vuex is mutated to an ERROR UUID, Then the status text should update as 'Error Occurred' and the the dialog of ErrorCatchWidget is visible", async () => {
    const shutdown_url = "http://localhost:4567/shutdown";
    mocked_axios.onGet(shutdown_url).reply(404);
    const propsData = {};
    wrapper = mount(StatusWidget, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    expect(wrapper.contains("#error-catch")).toBe(true);
    const modal = wrapper.find("#error-catch");
    expect(modal.isVisible()).toBe(false);
    store.commit("flask/set_status_uuid", STATUS.MESSAGE.ERROR);
    await wrapper.vm.$nextTick(); // wait for update
    expect(mocked_axios.history.get[0].url).toStrictEqual(shutdown_url);
    expect(wrapper.find(text_selector).text()).toBe("Status: Error Occurred");
    Vue.nextTick(() => {
      expect(modal.isVisible()).toBe(true);
      done();
    });
  });
  test("When Vuex is mutated to an SHUTDOWN UUID, Then the status text should update as 'Shutting Down'", async () => {
    const propsData = {};
    wrapper = mount(StatusWidget, {
      propsData,
      store,
      localVue,
    });

    store.commit("flask/set_status_uuid", STATUS.MESSAGE.SHUTDOWN);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find(text_selector).text()).toBe("Status: Shutting Down");
    await wrapper.vm.$nextTick(); // wait for update
  });
  test("Given that the http response is 200 for api request /shutdown, When an event 'ok-clicked'  is emitted from 'ErrorCatchWidget, Then verify that the dialog of ErrorCatchWidget is hidden and Status is changed to 'Shutting Down", async () => {
    const shutdown_url = "http://localhost:4567/shutdown";
    mocked_axios.onGet(shutdown_url).reply(200, {});
    const propsData = {};
    wrapper = mount(StatusWidget, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    expect(wrapper.contains("#error-catch")).toBe(true);
    const modal = wrapper.find("#error-catch");

    store.commit("flask/set_status_uuid", STATUS.MESSAGE.ERROR);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find(text_selector).text()).toBe("Status: Error Occurred");
    Vue.nextTick(() => {
      expect(modal.isVisible()).toBe(true);
      done();
    });

    wrapper.vm.remove_error_catch(); // the event of ok-clicked got invoked.

    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find(text_selector).text()).toBe("Status: Shutting Down");

    Vue.nextTick(() => {
      expect(modal.isVisible()).toBe(false);
      done();
    });
  });

  test.each([
    "SERVER_STILL_INITIALIZING",
    "SERVER_READY",
    "INITIALIZING_INSTRUMEN",
    "CALIBRATION_NEEDED",
    "CALIBRATING",
    "CALIBRATED",
    "BUFFERING",
    "ERROR",
  ])(
    "When a user wants to exit the desktop app, Then the closure warning modal should not appear if there are no active processes",
    async (vuex_state) => {
      const confirmation_spy = jest.spyOn(StatusWidget.methods, "handle_confirmation");
      wrapper = mount(StatusWidget, {
        store,
        localVue,
      });

      await store.commit("flask/set_status_uuid", STATUS.MESSAGE.vuex_state);
      await wrapper.setProps({ confirmation_request: true });
      expect(confirmation_spy).toHaveBeenCalledWith(1);
    }
  );

  test.each(["LIVE_VIEW_ACTIVE", "RECORDING"])(
    "When a user wants to exit the desktop app, Then the closure warning modal should appear if there are active processes",
    async (vuex_state) => {
      wrapper = mount(StatusWidget, {
        store,
        localVue,
      });

      await store.commit("flask/set_status_uuid", STATUS.MESSAGE.vuex_state);
      await wrapper.setProps({ confirmation_request: true });
      Vue.nextTick(() => {
        expect(wrapper.find("#closure").isVisible()).toBe(true);
      });
    }
  );
});
