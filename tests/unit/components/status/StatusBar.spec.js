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
    test("When BE signals corrupt h5 detected, Then show user the error", async () => {
      const propsData = {};
      wrapper = mount(StatusWidget, {
        propsData,
        store,
        localVue,
      });
      const text_selector_h5 = "#h5_warning";
      await store.commit("data/set_h5_warning");
      // select the correct button
      Vue.nextTick(() => {
        expect(wrapper.find(text_selector_h5).isVisible()).toBe(true);
        const h5_exit_button = wrapper.findAll(".span__button-label").at(0);
        // check we have the correct button
        expect(h5_exit_button.text()).toBe([]);
        h5_exit_button.trigger("click");
        expect(wrapper.find(text_selector_h5).isVisible()).toBe(false);
      });
    });

    test.each([[true, false]])(
      "When job limit being reached is %s, Then the limit modal will appear accordingly",
      async (job_limit_reached) => {
        const propsData = {};
        wrapper = mount(StatusWidget, {
          propsData,
          store,
          localVue,
        });

        await store.commit("settings/set_job_limit_reached", !job_limit_reached);
        await store.commit("settings/set_job_limit_reached", job_limit_reached);
        // select the correct button
        Vue.nextTick(() => {
          expect(wrapper.find("#usage-reached-modal").isVisible()).toBe(job_limit_reached);
        });
      }
    );
    test("When is_recording_snapshot_running is changed to true/false, Then the warning modal will appear accordingly", async () => {
      const propsData = {};
      wrapper = mount(StatusWidget, {
        propsData,
        store,
        localVue,
      });
      const method_spy = jest.spyOn(wrapper.vm, "close_modals_by_id");
      await store.commit("playback/set_is_recording_snapshot_running", true);
      await store.commit("playback/set_is_recording_snapshot_running", false);

      expect(method_spy).toHaveBeenCalledTimes(1);
    });

    // add test to check that false = not visible
    test.each([
      ["SERVER_BOOTING_UP", "System status: Booting Up..."],
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
      "InstrumentCreateConnectionError",
      "InstrumentConnectionLostError",
      "InstrumentBadDataError",
      "InstrumentFirmwareError",
    ])(
      "When unique shutdown error gets set to %s in Vuex, Then it will override any status text present before error modal appears",
      async (error_type) => {
        wrapper = mount(StatusWidget, {
          store,
          localVue,
        });
        expect(wrapper.find(text_selector).text()).toBe("System status: Booting Up..."); // initial status
        await store.commit("settings/set_shutdown_error_status", { error_type });
        expect(wrapper.find(text_selector).text()).toBe(`System status: Error Occurred`);
      }
    );

    test("When unknown error type gets sent through WS, Then the status will still be set to error occurred", async () => {
      const propsData = {};
      wrapper = mount(StatusWidget, {
        propsData,
        store,
        localVue,
      });

      expect(wrapper.find(text_selector).text()).toBe("System status: Booting Up..."); // initial status
      await store.commit("settings/set_shutdown_error_status", { error_type: "UnknownError" });
      expect(wrapper.find(text_selector).text()).toBe("System status: Error Occurred");
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
      });
    });

    test("When Vuex is mutated to an ERROR UUID and shutdown status was set to known error, Then the status text should not update to 'Error Occurred'", async () => {
      const propsData = {};
      wrapper = mount(StatusWidget, {
        propsData,
        store,
        localVue,
        attachToDocument: true,
      });

      await store.commit("settings/set_shutdown_error_status", {
        error_type: "InstrumentCreateConnectionError",
      });
      store.commit("flask/set_status_uuid", STATUS.MESSAGE.ERROR);
      expect(wrapper.find(text_selector).text()).toBe(`System status: Error Occurred`);
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
      "SERVER_BOOTING_UP",
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
        await store.commit("settings/set_confirmation_request", true);
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

        await store.commit("settings/set_confirmation_request", false);
        Vue.nextTick(() => {
          expect(wrapper.find("#ops-closure-warning").isVisible()).toBe(false);
        });

        await store.commit("settings/set_confirmation_request", true);
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
      await store.commit("settings/set_confirmation_request", false);
      Vue.nextTick(() => {
        expect(wrapper.find("#ops-closure-warning").isVisible()).toBe(false);
      });

      await store.commit("settings/set_confirmation_request", true);
      Vue.nextTick(() => {
        expect(wrapper.find("#ops-closure-warning").isVisible()).toBe(true);
      });
    });

    test("When a user wants to exit the desktop app and a data analysis is active, Then the closure warning modal will not appear", async () => {
      wrapper = mount(StatusWidget, {
        store,
        localVue,
      });

      await store.commit("playback/set_data_analysis_state", ENUMS.DATA_ANALYSIS_STATE.ACTIVE);
      await store.commit("settings/set_confirmation_request", false);
      Vue.nextTick(() => {
        expect(wrapper.find("#ops-closure-warning").isVisible()).toBe(false);
      });

      await store.commit("settings/set_confirmation_request", true);
      Vue.nextTick(() => {
        expect(wrapper.find("#ops-closure-warning").isVisible()).toBe(false);
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

        await store.commit("settings/set_confirmation_request", false);
        Vue.nextTick(() => {
          expect(wrapper.find("#fw-closure-warning").isVisible()).toBe(false);
        });

        await store.commit("settings/set_confirmation_request", true);
        Vue.nextTick(() => {
          expect(wrapper.find("#fw-closure-warning").isVisible()).toBe(true);
        });
      }
    );

    test.each([
      ["SERVER_BOOTING_UP", "initializing"],
      ["SERVER_STILL_INITIALIZING", "initializing"],
      ["SERVER_READY", "initializing"],
      ["INITIALIZING_INSTRUMENT", "initializing"],
      ["CALIBRATING", "initializing"],
      ["CHECKING_FOR_UPDATES", "initializing"],
      ["DOWNLOADING_UPDATES", "initializing"],
      ["INSTALLING_UPDATES", "initializing"],
      ["UPDATES_NEEDED", "initializing"],
      ["UPDATES_COMPLETE", "initializing"],
      ["UPDATE_ERROR", "initializing"],
      ["LIVE_VIEW_ACTIVE", "active-processes"],
      ["RECORDING", "active-processes"],
      ["BUFFERING", "active-processes"],
    ])(
      "When the desktop app is in state %s and the da_check prop changes to true, Then the %s modal will appear that data analysis cannot be performed at this time",
      async (system_status, modal) => {
        wrapper = mount(StatusWidget, {
          store,
          localVue,
        });
        await store.commit("flask/set_status_uuid", STATUS.MESSAGE[system_status]);
        await wrapper.setProps({ da_check: true });

        Vue.nextTick(() => {
          expect(wrapper.find(`#${modal}-warning`).isVisible()).toBe(true);
        });
      }
    );
    test.each(["CALIBRATION_NEEDED", "CALIBRATED"])(
      "When the desktop app is in state %s and the da_check prop changes to true, Then close_da_check_modal event will be emitted with 1",
      async (system_status) => {
        wrapper = mount(StatusWidget, {
          store,
          localVue,
        });
        await store.commit("flask/set_status_uuid", STATUS.MESSAGE[system_status]);
        await wrapper.setProps({ da_check: true });

        expect(wrapper.emitted("close_da_check_modal")).toStrictEqual([[1]]);

        // assert no second call gets made
        await wrapper.setProps({ da_check: false });
        expect(wrapper.emitted("close_da_check_modal")).toStrictEqual([[1]]);
      }
    );

    test("When user closes warning that processes are active by selecting button at index 1 'Continue' and both stim and playback states are active, Then both actions will be dispatched to stop all corresponding processes", async () => {
      wrapper = mount(StatusWidget, {
        store,
        localVue,
      });
      const action_spy = jest.spyOn(store, "dispatch").mockImplementation(() => null);
      await store.commit("flask/set_status_uuid", STATUS.MESSAGE.RECORDING);
      await store.commit("stimulation/set_stim_play_state", true);
      await wrapper.vm.close_da_check_modal(1);

      expect(action_spy).toHaveBeenCalledWith("stimulation/stop_stimulation");
      expect(action_spy).toHaveBeenCalledWith("playback/stop_active_processes");
      expect(wrapper.emitted("close_da_check_modal")).toStrictEqual([[1]]);
    });

    test.each([
      [
        "stimulation/set_stim_play_state",
        true,
        "stimulation/stop_stimulation",
        "playback/stop_active_processes",
      ],
      [
        "flask/set_status_uuid",
        STATUS.MESSAGE.RECORDING,
        "playback/stop_active_processes",
        "stimulation/stop_stimulation",
      ],
    ])(
      "When user closes warning that processes are active by selecting button at index 1 'Continue', Then one action will be dispatched to stop all corresponding processes",
      async (initial_action, state, expected_call, not_expected_call) => {
        wrapper = mount(StatusWidget, {
          store,
          localVue,
        });
        const action_spy = jest.spyOn(store, "dispatch").mockImplementation(() => null);
        await store.commit(initial_action, state);
        await wrapper.vm.close_da_check_modal(1);

        expect(action_spy).toHaveBeenCalledWith(expected_call);
        expect(action_spy).not.toHaveBeenCalledWith(not_expected_call);
        expect(wrapper.emitted("close_da_check_modal")).toStrictEqual([[1]]);
      }
    );

    test("When user closes warning that processes are active by selecting button at index 0 'Cancel', Then actions will not be called to stop active processes", async () => {
      wrapper = mount(StatusWidget, {
        store,
        localVue,
      });
      const action_spy = jest.spyOn(store, "dispatch").mockImplementation(() => null);
      await store.commit("flask/set_status_uuid", STATUS.MESSAGE.RECORDING);
      await store.commit("stimulation/set_stim_play_state", true);
      await wrapper.vm.close_da_check_modal(0);

      expect(action_spy).not.toHaveBeenCalledWith("stimulation/stop_stimulation");
      expect(action_spy).not.toHaveBeenCalledWith("playback/stop_active_processes");
      expect(wrapper.emitted("close_da_check_modal")).toStrictEqual([[0]]);
    });
  });
  describe("stim_status", () => {
    test.each([
      ["CALIBRATION_NEEDED", "Stim status: Calibration Needed", { 1: {} }, false],
      ["NO_PROTOCOLS_ASSIGNED", "Stim status: No protocols have been assigned", {}, false],
      ["CONFIG_CHECK_NEEDED", "Stim status: Configuration Check Needed", { 1: {} }, false],
      ["CONFIG_CHECK_IN_PROGRESS", "Stim status: Configuration Check in Progress...", { 1: {} }, false],
      ["CONFIG_CHECK_COMPLETE", "Stim status: Configuration Check Complete", { 1: {} }, false],
      ["READY", "Stim status: Ready", { 1: {} }, false],
      ["STIM_ACTIVE", "Stim status: Stimulating...", { 1: {} }, true],
      ["SHORT_CIRCUIT_ERROR", "Stim status: Short Circuit Error", {}, false],
      ["STARTING", "Stim status: Starting...", { 1: {} }, false],
      ["STOPPING", "Stim status: Stopping...", { 1: {} }, true],
      ["ERROR", "Stim status: Error Occurred", {}, false],
    ])(
      "When stim's stim_status gets mutated to %s, Then the status text should update to be: %s",
      async (vuex_state, expected_text, assignments, play_state) => {
        const propsData = { stim_specific: true };
        wrapper = mount(StatusWidget, {
          propsData,
          store,
          localVue,
        });

        store.state.stimulation.protocol_assignments = assignments;
        await store.commit("stimulation/set_stim_play_state", play_state);
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
      expect(wrapper.find(text_selector).text()).toBe("Stim status: No protocols have been assigned");
    });
  });
});
