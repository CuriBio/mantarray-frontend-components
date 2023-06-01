import { mount } from "@vue/test-utils";
const flush_promises = require("flush-promises");
import component_to_test from "@/components/playback/controls/player/DesktopPlayerControls.vue";
import { DesktopPlayerControls as dist_component_to_test } from "@/dist/mantarray.common";
import playback_module from "@/store/modules/playback";
const wait_for_expect = require("wait-for-expect");
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { createLocalVue } from "@vue/test-utils";
const MockAxiosAdapter = require("axios-mock-adapter");
import SettingsForm from "@/components/settings/SettingsForm.vue";
import RecordingNameInputWidget from "@/components/status/RecordingNameInputWidget.vue";
import { STATUS } from "@/store/modules/flask/enums";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";
import { system_status_regexp, all_mantarray_commands_regexp } from "@/store/modules/flask/url_regex";
let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueAxios, axios);
let NuxtStore;
let store;
let mocked_axios;

describe("DesktopPlayerControls.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    jest.restoreAllMocks();
    mocked_axios = new MockAxiosAdapter(axios);
    mocked_axios.onGet(all_mantarray_commands_regexp).reply(200, {});
  });

  afterEach(async () => {
    jest.useRealTimers();
    wrapper.destroy();
    store.commit("playback/stop_playback_progression");
  });
  test("When mounting DesktopPlayerControls from the build dist file, it loads successfully", () => {
    const propsData = {};
    wrapper = shallowMount(dist_component_to_test, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.find(".span__playback-desktop-player-controls-text");

    expect(target_span.text()).toEqual("Record Options");
  });

  test("Given an invalid barcode in Vuex and the playback state is CALIBRATED, Then the Start Live View button should be Unavailable, When barcode becomes valid in Vuex Then Start Live View should be Available, Then when barcode becomes invalid, Start Live View becomes unavailable", async () => {
    store.dispatch("playback/validate_barcode", { type: "plate_barcode", new_value: null });
    store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED);

    const propsData = {};
    wrapper = shallowMount(component_to_test, {
      propsData,
      store,
      localVue,
    });

    const target_button = wrapper.find(".svg__playback-desktop-player-controls-live-view-button");

    let the_classes = target_button.classes();

    expect(the_classes).not.toContain("span__playback-desktop-player-controls--available");

    store.dispatch("playback/validate_barcode", { type: "plate_barcode", new_value: "ML2022053000" });
    await wrapper.vm.$nextTick(); // wait for update
    the_classes = target_button.classes();
    expect(the_classes).toContain("span__playback-desktop-player-controls--available");

    store.dispatch("playback/validate_barcode", { type: "plate_barcode", new_value: null });
    await wrapper.vm.$nextTick(); // wait for update
    the_classes = target_button.classes();
    expect(the_classes).not.toContain("span__playback-desktop-player-controls--available");
  });

  test("When a user selects the settings control button, Then the modal will appear and will emit a save customer id event when closed with save", async () => {
    const close_spy = jest.spyOn(component_to_test.methods, "close_settings_modal");
    wrapper = mount(component_to_test, {
      store,
      localVue,
    });

    await wrapper.find(".div__playback-desktop-player-controls-settings-button").trigger("click");
    expect(wrapper.find("#settings-form")).toBeTruthy();

    await wrapper.find(SettingsForm).vm.$emit("close_modal", true);
    expect(close_spy).toHaveBeenCalledWith(true);
    expect(wrapper.emitted("save_account_info")).toHaveLength(1);
  });

  test("When a user closes the recording snapshot error modal, Then the recording_snapshot_error state will return to false", async () => {
    wrapper = mount(component_to_test, {
      store,
      localVue,
    });
    const generic_msg = "Generic recording snapshot error";
    store.commit("data/set_recording_snapshot_error", generic_msg);
    expect(store.state.data.recording_snapshot_error).toBe(generic_msg);

    wrapper.vm.close_rec_snapshot_err_modal();

    expect(store.state.data.recording_snapshot_error).toBe(false);
  });

  test("When a user selects the settings control button, Then the modal will appear and will not emit a save event when closed with cancel", async () => {
    const close_spy = jest.spyOn(component_to_test.methods, "close_settings_modal");
    wrapper = mount(component_to_test, {
      store,
      localVue,
    });

    await wrapper.find(".div__playback-desktop-player-controls-settings-button").trigger("click");
    expect(wrapper.find("#settings-form")).toBeTruthy();

    wrapper.find(SettingsForm).vm.$emit("close_modal", false);
    expect(close_spy).toHaveBeenCalledWith(false);
    expect(wrapper.emitted("save_account_info")).toBeFalsy();
  });

  test("When a user confirms recording name, recording snapshot is false and false in store, Then live view will not be stopped", async () => {
    wrapper = mount(component_to_test, {
      store,
      localVue,
    });

    jest.spyOn(store, "dispatch").mockImplementation(() => null);
    store.state.playback.playback_state = playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE;

    wrapper.find(RecordingNameInputWidget).vm.$emit("handle_confirmation", false);

    expect(store.state.playback.playback_state).toBe(playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE);
  });

  test("When user_cred_input_needed is set to true, Then user input prompt message is displayed and settings form is opened upon closing modal", async () => {
    wrapper = mount(component_to_test, {
      store,
      localVue,
    });

    // confirm precondition
    expect(wrapper.find("#user-input-prompt-message").isVisible()).toBe(false);
    expect(wrapper.find("#settings-form").isVisible()).toBe(false);

    store.commit("settings/set_user_cred_input_needed", true);
    Vue.nextTick(() => {
      expect(wrapper.find("#user-input-prompt-message").isVisible()).toBe(true);
      expect(wrapper.find("#settings-form").isVisible()).toBe(false);
    });

    await wrapper.findAll(".span__button-label").at(0).trigger("click");

    Vue.nextTick(() => {
      expect(wrapper.find("#user-input-prompt-message").isVisible()).toBe(false);
      expect(wrapper.find("#settings-form").isVisible()).toBe(true);
    });
  });

  test.each([
    [Array(24).fill([]), true],
    [[], false],
    [Array(23).fill([]), false],
  ])(
    "When recording_snapshot_data changes to have a length of %s, Then the visibility of the recording snapshot modal will be %s",
    async (data, bool) => {
      wrapper = mount(component_to_test, {
        store,
        localVue,
      });

      // confirm precondition
      expect(wrapper.find("#recording-snapshot-widget").isVisible()).toBe(false);

      store.commit("data/set_recording_snapshot_data", data);

      Vue.nextTick(() => {
        expect(wrapper.find("#recording-snapshot-widget").isVisible()).toBe(bool);
      });
    }
  );

  test.each([0, 1])(
    "When firmware_update_available is set to true, Then firmware update available message is displayed and send_firmware_update_confirmation is emitted upon closure",
    async (close_idx) => {
      const action_spy = jest.spyOn(store, "dispatch").mockImplementation(() => null);
      wrapper = mount(component_to_test, {
        store,
        localVue,
      });

      // confirm precondition
      expect(wrapper.find("#fw-update-available-message").isVisible()).toBe(false);

      store.commit("settings/set_firmware_update_available", true);
      Vue.nextTick(() => {
        expect(wrapper.find("#fw-update-available-message").isVisible()).toBe(true);
        expect(wrapper.find("#calibration-warning").isVisible()).toBe(false);
      });

      await wrapper.findAll(".span__button-label").at(close_idx).trigger("click");

      Vue.nextTick(() => {
        expect(wrapper.find("#fw-update-available-message").isVisible()).toBe(false);
        expect(action_spy).toHaveBeenCalledWith(
          "settings/send_firmware_update_confirmation",
          close_idx === 1
        );
      });
    }
  );

  describe("Given a valid plate barcode has been committed to Vuex", () => {
    beforeEach(async () => {
      store.dispatch("playback/validate_barcode", { type: "plate_barcode", new_value: "ML2022053000" });
    });

    test.each([
      ["NEEDS_CALIBRATION", ".svg__playback-desktop-player-controls-record-button--inactive"],
      ["CALIBRATING", ".svg__playback-desktop-player-controls-record-button--inactive"],
      ["CALIBRATED", ".svg__playback-desktop-player-controls-record-button--inactive"],
      ["BUFFERING", ".svg__playback-desktop-player-controls-record-button--inactive"],
      ["RECORDING", ".svg__playback-desktop-player-controls-live-view-button"],
      ["NEEDS_CALIBRATION", ".svg__playback-desktop-player-controls-live-view-button"],
      ["LIVE_VIEW_ACTIVE", ".svg__playback-desktop-player-controls-calibrate-button"],
      ["NOT_CONNECTED_TO_INSTRUMENT", ".svg__playback-desktop-player-controls-calibrate-button"],
    ])(
      "Given Vuex is in state %s, Then clicking button %s does not transition playback state",
      async (playback_state_enum_str, selector_str) => {
        const propsData = {};
        wrapper = shallowMount(component_to_test, {
          propsData,
          store,
          localVue,
        });
        const target_button = wrapper.find(selector_str);

        const playback_state_enum = playback_module.ENUMS.PLAYBACK_STATES[playback_state_enum_str];
        // set initial state
        await store.dispatch("playback/transition_playback_state", playback_state_enum);
        await wrapper.vm.$nextTick(); // wait for update

        await target_button.trigger("click");
        await wrapper.vm.$nextTick(); // wait for update
        expect(store.state.playback.playback_state).toEqual(playback_state_enum);
      }
    );
    describe("Tests that invoke axios", () => {
      beforeEach(async () => {
        mocked_axios
          .onGet(system_status_regexp, { params: { current_vuex_status_uuid: STATUS.MESSAGE.CALIBRATING } })
          .replyOnce(200, { ui_status_code: STATUS.MESSAGE.CALIBRATING });
        mocked_axios
          .onGet(system_status_regexp, { params: { current_vuex_status_uuid: STATUS.MESSAGE.CALIBRATING } })
          .reply(200, { ui_status_code: STATUS.MESSAGE.CALIBRATED });

        mocked_axios
          .onGet(system_status_regexp, { params: { current_vuex_status_uuid: STATUS.MESSAGE.RECORDING } })
          .reply(200, { ui_status_code: STATUS.MESSAGE.RECORDING });

        mocked_axios
          .onGet(system_status_regexp, {
            params: { current_vuex_status_uuid: STATUS.MESSAGE.LIVE_VIEW_ACTIVE },
          })
          .reply(200, { ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE });

        mocked_axios
          .onGet(system_status_regexp, { params: { current_vuex_status_uuid: STATUS.MESSAGE.CALIBRATED } })
          .reply(200, { ui_status_code: STATUS.MESSAGE.CALIBRATED });

        mocked_axios
          .onGet(system_status_regexp, { params: { current_vuex_status_uuid: STATUS.MESSAGE.BUFFERING } })
          .replyOnce(200, { ui_status_code: STATUS.MESSAGE.BUFFERING });
        mocked_axios
          .onGet(system_status_regexp, { params: { current_vuex_status_uuid: STATUS.MESSAGE.BUFFERING } })
          .reply(200, { ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE });
      });
      afterEach(async () => {
        // make sure to stop pinging before unmocking axios so there aren't any unmocked HTTP requests
        store.commit("flask/stop_status_pinging");
        mocked_axios.restore();
      });

      test("Given an invalid barcode in Vuex and the playback state is CALIBRATED, When Start Live View is clicked Then the playback state does not transition", async () => {
        store.dispatch("playback/validate_barcode", { type: "plate_barcode", new_value: null });
        store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED);

        const propsData = {};
        wrapper = shallowMount(component_to_test, {
          propsData,
          store,
          localVue,
        });

        const target_button = wrapper.find(".svg__playback-desktop-player-controls-live-view-button");

        await target_button.trigger("click");
        await flush_promises();

        expect(store.state.playback.playback_state).toEqual(playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED);
      });

      test.each([
        ["LIVE_VIEW_ACTIVE", ".svg__playback-desktop-player-controls-live-view-button", "CALIBRATED"],
        ["RECORDING", ".svg__playback-desktop-player-controls-record-button--active", "CALIBRATED"],
        ["NEEDS_CALIBRATION", ".svg__playback-desktop-player-controls-calibrate-button", "CALIBRATING"],
        ["CALIBRATED", ".svg__playback-desktop-player-controls-calibrate-button", "CALIBRATING"],
        ["CALIBRATED", ".svg__playback-desktop-player-controls-live-view-button", "BUFFERING"],
      ])(
        "Given Vuex in playback state %s, When button matching %s is clicked, Then Vuex transitions playback state to %s",
        async (starting_playback_state_enum, selector_str, ending_playback_state_enum) => {
          const propsData = {};
          wrapper = shallowMount(component_to_test, {
            propsData,
            store,
            localVue,
          });
          const target_button = wrapper.find(selector_str);
          // set initial state
          store.commit(
            "playback/set_playback_state",
            playback_module.ENUMS.PLAYBACK_STATES[starting_playback_state_enum]
          );
          await wrapper.vm.$nextTick(); // wait for update

          await target_button.trigger("click");

          await wait_for_expect(() => {
            // wait for the axios promises to resolve
            expect(store.state.playback.playback_state).toBe(
              playback_module.ENUMS.PLAYBACK_STATES[ending_playback_state_enum]
            );
          });
        }
      );

      test("Given Vuex in playback state RECORDING, When stop recording button is clicked and recording name is confirmed, Then Vuex transitions playback state to LIVE_VIEW_ACTIVE", async () => {
        const propsData = {};
        wrapper = mount(component_to_test, {
          propsData,
          store,
          localVue,
        });
        // set initial state
        await store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES["RECORDING"]);
        await wrapper.vm.$nextTick(); // wait for update

        // stop recording
        const stop_button = wrapper.find(".svg__playback-desktop-player-controls-record-button--active");
        await stop_button.trigger("click");
        await wrapper.findAll(".span__button-label").at(8).trigger("click");
        expect(store.state.playback.playback_state).toBe(
          playback_module.ENUMS.PLAYBACK_STATES["LIVE_VIEW_ACTIVE"]
        );
      });
    });
    test("When a user starts a recording and doesn't manually stop it within 10 minutes, Then a recording and live view will get stopped regardless at that time point", async () => {
      jest.useFakeTimers();
      wrapper = mount(component_to_test, {
        store,
        localVue,
      });
      await store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES["LIVE_VIEW_ACTIVE"]
      );

      await wrapper.find(".svg__playback-desktop-player-controls-record-button--inactive").trigger("click");
      await wait_for_expect(() => {
        expect(store.state.playback.playback_state).toBe(playback_module.ENUMS.PLAYBACK_STATES["RECORDING"]);
      });

      jest.advanceTimersByTime(10 * 60e3);
      await wait_for_expect(() => {
        expect(store.state.playback.playback_state).toBe(playback_module.ENUMS.PLAYBACK_STATES["CALIBRATED"]);
      });
    });
    test.each([
      [
        "NEEDS_CALIBRATION",
        ".svg__playback-desktop-player-controls-record-button--inactive",
        true,
        false,
        false,
      ],
      [
        "LIVE_VIEW_ACTIVE",
        ".svg__playback-desktop-player-controls-record-button--inactive",

        true,
        true,
        false,
      ],
      ["RECORDING", ".svg__playback-desktop-player-controls-record-button--inactive", false, false, false],
      [
        "LIVE_VIEW_ACTIVE",
        ".svg__playback-desktop-player-controls-record-button--active",

        false,
        false,
        false,
      ],
      ["RECORDING", ".svg__playback-desktop-player-controls-record-button--active", true, false, true],
      ["NEEDS_CALIBRATION", ".svg__playback-desktop-player-controls-live-view-button", true, false, false],
      ["CALIBRATING", ".svg__playback-desktop-player-controls-live-view-button", true, false, false],
      ["CALIBRATED", ".svg__playback-desktop-player-controls-live-view-button", true, true, false],
      ["BUFFERING", ".svg__playback-desktop-player-controls-live-view-button", true, false, false],
      ["LIVE_VIEW_ACTIVE", ".svg__playback-desktop-player-controls-live-view-button", true, false, true],
      ["RECORDING", ".svg__playback-desktop-player-controls-live-view-button", true, false, false],
      [
        "NEEDS_CALIBRATION",
        ".ellipse__playback-desktop-player-controls-calibrate-button-indicator",
        false,
        false,
        false,
      ],
      [
        "CALIBRATING",
        ".ellipse__playback-desktop-player-controls-calibrate-button-indicator",
        false,
        false,
        false,
      ],

      [
        "CALIBRATED",
        ".ellipse__playback-desktop-player-controls-calibrate-button-indicator",
        true,
        false,
        false,
      ],
      [
        "NOT_CONNECTED_TO_INSTRUMENT",
        ".svg__playback-desktop-player-controls-calibrate-button",
        true,
        false,
        false,
      ],
      [
        "NOT_CONNECTED_TO_INSTRUMENT",
        ".ellipse__playback-desktop-player-controls-calibrate-button-indicator",
        false,
        false,
        false,
      ],
      ["NEEDS_CALIBRATION", ".svg__playback-desktop-player-controls-calibrate-button", true, true, false],
      ["CALIBRATING", ".svg__playback-desktop-player-controls-calibrate-button", true, false, false],
      ["CALIBRATING", ".span__playback-desktop-player-controls-calibrating", true, false, true],
      ["CALIBRATED", ".span__playback-desktop-player-controls-calibrating", false, false, true],
      ["CALIBRATED", ".svg__playback-desktop-player-controls-calibrate-button", true, true, false],
      ["BUFFERING", ".svg__playback-desktop-player-controls-calibrate-button", true, false, false],
      ["BUFFERING", ".span__playback-desktop-player-controls-buffering", true, false, true],
      ["LIVE_VIEW_ACTIVE", ".span__playback-desktop-player-controls-buffering", false, false, true],
    ])(
      "When playback state in Vuex changes to %s, Then display of button matching %s changes so that visible is %s, available is %s and active is %s",
      async (playback_state_enum, selector_str, expected_visible, expected_available, expected_active) => {
        const propsData = {};
        wrapper = shallowMount(component_to_test, {
          propsData,
          store,
          localVue,
        });
        const target_button = wrapper.find(selector_str);

        // set initial state
        store.commit(
          "playback/set_playback_state",
          playback_module.ENUMS.PLAYBACK_STATES[playback_state_enum]
        );
        await wrapper.vm.$nextTick(); // wait for update

        await wait_for_expect(() => {
          const the_classes = target_button.classes();

          expect(target_button.isVisible()).toBe(expected_visible);

          if (expected_available) {
            expect(the_classes).toContain("span__playback-desktop-player-controls--available");
          } else {
            expect(the_classes).not.toContain("span__playback-desktop-player-controls--available");
          }
          if (expected_active) {
            expect(the_classes).toContain("span__playback-desktop-player-controls--active");
          } else {
            expect(the_classes).not.toContain("span__playback-desktop-player-controls--active");
          }
        });
      }
    );
    test("Given calibration button would otherwise be active, When stim is running, Then calibration button is inactive", async () => {
      const propsData = {};
      wrapper = shallowMount(component_to_test, {
        propsData,
        store,
        localVue,
      });
      const target_button = wrapper.find(".svg__playback-desktop-player-controls-calibrate-button");
      store.state.stimulation.protocol_assignments = { 1: {} };
      store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED);
      store.commit("stimulation/set_stim_status", STIM_STATUS.STIM_ACTIVE);
      await wrapper.vm.$nextTick(); // wait for update

      await wait_for_expect(() => {
        const the_classes = target_button.classes();
        expect(target_button.isVisible()).toBe(true);
        expect(the_classes).not.toContain("span__playback-desktop-player-controls--available");
      });
    });
    test.each([
      ["LIVE_VIEW_ACTIVE", ".svg__playback-desktop-player-controls-live-view-button", false],
      ["RECORDING", ".svg__playback-desktop-player-controls-live-view-button", true],
    ])(
      "When playback state in Vuex changes to %s, Then the display of button matching %s updates so that running-in-background class is %s",
      async (
        playback_state_enum,
        selector_str,

        expected_running_in_background
      ) => {
        const propsData = {};
        wrapper = shallowMount(component_to_test, {
          propsData,
          store,
          localVue,
        });
        const target_button = wrapper.find(selector_str);

        // set initial state
        store.commit(
          "playback/set_playback_state",
          playback_module.ENUMS.PLAYBACK_STATES[playback_state_enum]
        );
        await wrapper.vm.$nextTick(); // wait for update

        await wait_for_expect(() => {
          const the_classes = target_button.classes();

          if (expected_running_in_background) {
            expect(the_classes).toContain("span__playback-desktop-player-controls--running-in-background");
          } else {
            expect(the_classes).not.toContain(
              "span__playback-desktop-player-controls--running-in-background"
            );
          }
        });
      }
    );
    test("When Vuex is in the Calibrating state, Then the calibrating animation matches the DOM snapshot", async () => {
      const propsData = {};
      wrapper = shallowMount(component_to_test, {
        propsData,
        store,
        localVue,
      });
      store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING);
      await wrapper.vm.$nextTick(); // wait for update

      const target_span = wrapper.find(".span__playback-desktop-player-controls-calibrating");

      expect(target_span).toMatchInlineSnapshot(
        `<span class="svg__playback-desktop-player-controls-button span__playback-desktop-player-controls-calibrating span__playback-desktop-player-controls--active" style=""><fontawesomeicon-stub icon="fa,spinner" pulse="true"></fontawesomeicon-stub></span>`
      );
    });
    test("When Vuex is in the Buffering state, Then the buffering animation matches the DOM snapshot", async () => {
      const propsData = {};
      wrapper = shallowMount(component_to_test, {
        propsData,
        store,
        localVue,
      });
      store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.BUFFERING);
      await wrapper.vm.$nextTick(); // wait for update

      const target_span = wrapper.find(".span__playback-desktop-player-controls-buffering");

      expect(target_span).toMatchInlineSnapshot(
        `<span class="svg__playback-desktop-player-controls-button span__playback-desktop-player-controls-buffering span__playback-desktop-player-controls--active" style=""><fontawesomeicon-stub icon="fa,spinner" pulse="true"></fontawesomeicon-stub></span>`
      );
    });

    test("When in beta 2 mode, Then confirmation modal saying to confirm that device is empty will appear before starting calibration", async () => {
      const action_spy = jest.spyOn(store, "dispatch").mockImplementation(() => null);

      wrapper = mount(component_to_test, {
        store,
        localVue,
      });
      store.commit("settings/set_beta_2_mode", true);
      store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.NEEDS_CALIBRATION);
      await wrapper.vm.$nextTick(); // wait for update

      await wrapper.find(".svg__playback-desktop-player-controls-calibrate-button").trigger("click");

      Vue.nextTick(() => {
        expect(wrapper.find("#calibration-modal").isVisible()).toBe(true);
      });

      await wrapper.findAll(".span__button-label").at(1).trigger("click");

      expect(action_spy).toHaveBeenCalledWith("playback/start_calibration");
    });

    test("When recording limit has been reached, Then the recording limit modal will be visible", async () => {
      const action_spy = jest.spyOn(store, "dispatch").mockImplementation(() => null);
      jest.useFakeTimers();
      wrapper = mount(component_to_test, {
        store,
        localVue,
      });
      await store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
      );
      await wrapper.find(".svg__playback-desktop-player-controls-record-button").trigger("click");

      jest.advanceTimersByTime(10 * 60e3);
      jest.runAllTicks();
      Vue.nextTick(() => {
        expect(wrapper.find("#recording-limit").isVisible()).toBe(true);
        expect(action_spy).toHaveBeenCalledWith("playback/stop_recording");
      });
    });

    test("When live view becomes active from the stimulation studio, Then stimulation will be automatically started", async () => {
      const action_spy = jest.spyOn(store, "dispatch").mockImplementation(() => null);
      wrapper = mount(component_to_test, {
        store,
        localVue,
      });
      await store.commit("playback/set_start_recording_from_stim", true);
      await store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES.LIVE_VIEW_ACTIVE
      );

      expect(action_spy).toHaveBeenCalledWith("stimulation/create_protocol_message");
    });

    test.each([
      ["CALIBRATED", "playback/start_live_view"],
      ["LIVE_VIEW_ACTIVE", "stimulation/create_protocol_message"],
    ])(
      "When vuex state is %s and start_recording_from_stim is set to true, Then the %s action should be called",
      async (playback_state, dispatched_actions) => {
        const action_spy = jest.spyOn(store, "dispatch").mockImplementation(() => null);
        wrapper = mount(component_to_test, {
          store,
          localVue,
        });
        await store.commit(
          "playback/set_playback_state",
          playback_module.ENUMS.PLAYBACK_STATES[playback_state]
        );

        await store.commit("playback/set_start_recording_from_stim", true);
        expect(action_spy).toHaveBeenCalledWith(dispatched_actions);
      }
    );

    test("When vuex state is changed to RECORDING and start_recording_from_stim is set to true, Then the start_recording_from_stim will become false", async () => {
      wrapper = mount(component_to_test, {
        store,
        localVue,
      });
      await store.commit("playback/set_start_recording_from_stim", true);
      await store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.RECORDING);

      expect(store.state.playback.start_recording_from_stim).toBe(false);
    });

    test("When vuex state start_recording_from_stim is set to true, Then changing to false will set stim_start_time_idx to null", async () => {
      wrapper = mount(component_to_test, {
        store,
        localVue,
      });

      await store.commit("playback/set_start_recording_from_stim", true);
      await store.commit("stimulation/set_stim_start_time_idx", 100000);

      expect(store.state.playback.start_recording_from_stim).toBe(true);
      expect(store.state.stimulation.stim_start_time_idx).toBe(100000);

      await store.commit("playback/set_start_recording_from_stim", false);

      expect(store.state.stimulation.stim_start_time_idx).toBeNull();
    });
  });
});
