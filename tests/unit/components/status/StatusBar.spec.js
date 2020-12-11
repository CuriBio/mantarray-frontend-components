import { mount } from "@vue/test-utils";
import StatusWidget from "@/components/status/StatusBar.vue";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { STATUS } from "@/store/modules/flask/enums";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

const text_selector = ".span__status-bar-text";

beforeAll(async () => {
  // note the store will mutate across tests, so make sure to re-create it in beforeEach
  const storePath = `${process.env.buildDir}/store.js`;
  NuxtStore = await import(storePath);
});

beforeEach(async () => {
  store = await NuxtStore.createStore();
});

afterEach(() => wrapper.destroy());

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
});
