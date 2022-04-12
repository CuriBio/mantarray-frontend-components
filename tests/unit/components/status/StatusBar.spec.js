import { mount } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import StatusWidget from "@/components/status/StatusBar.vue";
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
const MockAxiosAdapter = require("axios-mock-adapter");
import { createLocalVue } from "@vue/test-utils";
import { STATUS } from "@/store/modules/flask/enums";
import { ENUMS } from "@/store/modules/playback/enums";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";

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
  describe("system_status", () => {
    test.each([
      ["SERVER_STILL_INITIALIZING", "System status: Connecting..."],
      ["SERVER_READY", "System status: Connecting..."],
      ["INITIALIZING_INSTRUMENT", "System status: Initializing..."],
      ["CALIBRATION_NEEDED", "System status: Connected...Calibration Needed"],
      ["CALIBRATING", "System status: Calibrating..."],
      ["CALIBRATED", "System status: Ready"],
      ["BUFFERING", "System status: Preparing for Live View..."],
      ["LIVE_VIEW_ACTIVE", "System status: Live View Active"],
      ["RECORDING", "System status: Recording to File..."],
      ["ERROR", "System status: Error Occurred"],
      ["CHECKING_FOR_UPDATES", "System status: Checking for Firmware Updates..."],
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
    test("When initially mounted, Then the status text matches the Vuex state", async () => {
      const propsData = {};
      store.commit("flask/set_status_uuid", STATUS.MESSAGE.CALIBRATING);
      wrapper = mount(StatusWidget, {
        propsData,
        store,
        localVue,
      });
      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.find(text_selector).text()).toBe("System status: Calibrating...");
    });

    test.each([
      [false, "System status: Connected...Calibration Needed"],
      [true, "Stimulation status: Calibration Needed Before Available"],
    ])(
      "When a playback_state gets updated to CALIBRATION_NEEDED in and prop for stim is %s, Then the status text will get updated to %s",
      async (stim_specific, message) => {
        const propsData = { stim_specific };
        await store.commit("flask/set_status_uuid", STATUS.MESSAGE.READY);
        wrapper = mount(StatusWidget, {
          propsData,
          store,
          localVue,
        });

        await store.dispatch("playback/transition_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATION_NEEDED);

        expect(wrapper.find(text_selector).text()).toBe(message);
      }
    );

    test("When Vuex is mutated to an unknown UUID, Then the status text should update to include that UUID", async () => {
      const propsData = {};
      wrapper = mount(StatusWidget, {
        propsData,
        store,
        localVue,
      });

      store.commit("flask/set_status_uuid", "3dbb8814-09f1-44db-b7d5-7a9f702beac4");
      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.find(text_selector).text()).toBe("System status: 3dbb8814-09f1-44db-b7d5-7a9f702beac4");
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
      expect(wrapper.find(text_selector).text()).toBe("System status: Error Occurred");
      Vue.nextTick(() => {
        expect(modal.isVisible()).toBe(true);
        done();
      });
    });
    test("When Vuex is mutated to an UPDATE ERROR UUID, Then the status text should update as 'Error During Firmware Update' and the the dialog of ErrorCatchWidget is visible", async () => {
      const propsData = {};
      wrapper = mount(StatusWidget, {
        propsData,
        store,
        localVue,
        attachToDocument: true,
      });

      expect(wrapper.contains("#error-catch")).toBe(true);
      const modal = wrapper.find("#error-catch");

      store.commit("flask/set_status_uuid", STATUS.MESSAGE.UPDATE_ERROR);
      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.find(text_selector).text()).toBe("System status: Error During Firmware Update");
      Vue.nextTick(() => {
        expect(modal.isVisible()).toBe(true);
        done();
      });

      wrapper.vm.close_modals_by_id(["error-catch"]); // the event of ok-clicked got invoked.

      Vue.nextTick(() => {
        expect(modal.isVisible()).toBe(false);
        done();
      });
    });
    test.each([
      "SERVER_STILL_INITIALIZING",
      "SERVER_READY",
      "INITIALIZING_INSTRUMENT",
      "CALIBRATION_NEEDED",
      "CALIBRATING",
      "CALIBRATED",
      "UPDATES_NEEDED",
      "UPDATES_COMPLETE",
      "UPDATE_ERROR",
      "ERROR",
    ])(
      "When a user wants to exit the desktop app, Then the closure warning modals should not appear if there are no active processes or fw update",
      async (vuex_state) => {
        const confirmation_spy = jest.spyOn(StatusWidget.methods, "handle_confirmation");
        wrapper = mount(StatusWidget, {
          store,
          localVue,
        });

        await store.commit("flask/set_status_uuid", STATUS.MESSAGE[vuex_state]);
        await wrapper.setProps({ confirmation_request: true });
        expect(confirmation_spy).toHaveBeenCalledWith(1);

        Vue.nextTick(() => {
          expect(wrapper.find("#fw-closure-warning").isVisible()).toBe(false);
          expect(wrapper.find("#ops-closure-warning").isVisible()).toBe(false);
        });
      }
    );

    test.each(["BUFFERING", "LIVE_VIEW_ACTIVE", "RECORDING", "CALIBRATING"])(
      "When a user wants to exit the desktop app, Then the closure warning modal should appear if there are active processes",
      async (vuex_state) => {
        wrapper = mount(StatusWidget, {
          store,
          localVue,
        });
        await store.commit("flask/set_status_uuid", STATUS.MESSAGE[vuex_state]);

        await wrapper.setProps({ confirmation_request: false });
        Vue.nextTick(() => {
          expect(wrapper.find("#ops-closure-warning").isVisible()).toBe(false);
        });

        await wrapper.setProps({ confirmation_request: true });
        Vue.nextTick(() => {
          expect(wrapper.find("#ops-closure-warning").isVisible()).toBe(true);
        });
      }
    );

    test("When a user wants to exit the desktop app and a stimulation is active, Then the closure warning modal should appear", async () => {
      wrapper = mount(StatusWidget, {
        store,
        localVue,
      });

      await store.commit("stimulation/set_stim_play_state", true);
      await wrapper.setProps({ confirmation_request: false });
      Vue.nextTick(() => {
        expect(wrapper.find("#ops-closure-warning").isVisible()).toBe(false);
      });

      await wrapper.setProps({ confirmation_request: true });
      Vue.nextTick(() => {
        expect(wrapper.find("#ops-closure-warning").isVisible()).toBe(true);
      });
    });

    test.each(["DOWNLOADING_UPDATES", "INSTALLING_UPDATES"])(
      "When a user wants to exit the desktop app, Then the fw closure warning modal should appear if a fw update is in progress",
      async (vuex_state) => {
        wrapper = mount(StatusWidget, {
          store,
          localVue,
        });
        await store.commit("flask/set_status_uuid", STATUS.MESSAGE[vuex_state]);

        await wrapper.setProps({ confirmation_request: false });
        Vue.nextTick(() => {
          expect(wrapper.find("#fw-closure-warning").isVisible()).toBe(false);
        });

        await wrapper.setProps({ confirmation_request: true });
        Vue.nextTick(() => {
          expect(wrapper.find("#fw-closure-warning").isVisible()).toBe(true);
        });
      }
    );
  });
  describe("stim_status", () => {
    test.each([
      ["CALIBRATION_NEEDED", "Stimulation status: Calibration Needed Before Available"],
      ["CONFIG_CHECK_NEEDED", "Stimulation status: Configuration Check Needed"],
      ["CONFIG_CHECK_IN_PROGRESS", "Stimulation status: Configuration Check in Progress..."],
      ["CONFIG_CHECK_COMPLETE", "Stimulation status: Configuration Check Complete"],
      ["READY", "Stimulation status: Ready"],
      ["STIM_ACTIVE", "Stimulation status: Stimulating..."],
      ["SHORT_CIRCUIT_ERROR", "Stimulation status: Short Circuit Error"],
      ["ERROR", "Stimulation status: Error Occurred"],
    ])(
      "When stim's stim_status gets mutated to %s, Then the status text should update to be: %s",
      async (vuex_state, expected_text) => {
        const propsData = { stim_specific: true };
        wrapper = mount(StatusWidget, {
          propsData,
          store,
          localVue,
        });
        await store.commit("stimulation/set_stim_status", STIM_STATUS[vuex_state]);
        expect(wrapper.find(text_selector).text()).toBe(expected_text);
      }
    );
    test("When initially mounted, Then the stim status text matches the Vuex state", async () => {
      const propsData = { stim_specific: true };
      await store.commit("stimulation/set_stim_status", STIM_STATUS.CONFIG_CHECK_NEEDED);

      wrapper = mount(StatusWidget, {
        propsData,
        store,
        localVue,
      });
      expect(wrapper.find(text_selector).text()).toBe("Stimulation status: Configuration Check Needed");
    });
  });
});
