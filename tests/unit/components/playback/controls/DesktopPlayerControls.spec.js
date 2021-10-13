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
import { STATUS } from "@/store/modules/flask/enums";
import {
  system_status_when_buffering_regexp,
  system_status_when_calibrated_regexp,
  system_status_when_calibrating_regexp,
  system_status_when_recording_regexp,
  system_status_when_live_view_active_regexp,
  all_mantarray_commands_regexp,
} from "@/store/modules/flask/url_regex";
let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueAxios, axios);
let NuxtStore;
let store;
let mocked_axios;

beforeAll(async () => {
  // note the store will mutate across tests, so make sure to re-create it in beforeEach
  const storePath = `${process.env.buildDir}/store.js`;
  NuxtStore = await import(storePath);
});

beforeEach(async () => {
  store = await NuxtStore.createStore();
  jest.restoreAllMocks();
});

afterEach(async () => {
  wrapper.destroy();
  store.commit("playback/stop_playback_progression");
});

describe("DesktopPlayerControls.vue", () => {
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
    store.commit("playback/set_barcode_number", null);
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

    store.commit("playback/set_barcode_number", "MA202240004");
    await wrapper.vm.$nextTick(); // wait for update
    the_classes = target_button.classes();
    expect(the_classes).toContain("span__playback-desktop-player-controls--available");

    store.commit("playback/set_barcode_number", null);
    await wrapper.vm.$nextTick(); // wait for update
    the_classes = target_button.classes();
    expect(the_classes).not.toContain("span__playback-desktop-player-controls--available");
  });

  test("When a user selects the settings control button, Then the modal will appear and will emit a close event when closed", async () => {
    const close_spy = jest.spyOn(component_to_test.methods, "close_modal");
    wrapper = mount(component_to_test, {
      store,
      localVue,
    });

    await wrapper.find(".div__playback-desktop-player-controls-settings-button").trigger("click");
    expect(wrapper.find("#settings-form")).toBeTruthy();

    await wrapper.find(SettingsForm).vm.$emit("close_modal");
    expect(close_spy).toHaveBeenCalledWith();
  });

  describe("Given a valid barcode has been committed to Vuex", () => {
    beforeEach(async () => {
      store.commit("playback/set_barcode_number", "MA202240004");
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
        mocked_axios = new MockAxiosAdapter(axios);

        mocked_axios.onGet(all_mantarray_commands_regexp).reply(200, {});

        mocked_axios
          .onGet(system_status_when_calibrating_regexp)
          .replyOnce(200, { ui_status_code: STATUS.MESSAGE.CALIBRATING });
        mocked_axios
          .onGet(system_status_when_calibrating_regexp)
          .reply(200, { ui_status_code: STATUS.MESSAGE.STOPPED });

        mocked_axios
          .onGet(system_status_when_recording_regexp)
          .reply(200, { ui_status_code: STATUS.MESSAGE.RECORDING });

        mocked_axios
          .onGet(system_status_when_live_view_active_regexp)
          .reply(200, { ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE });

        mocked_axios
          .onGet(system_status_when_calibrated_regexp)
          .reply(200, { ui_status_code: STATUS.MESSAGE.STOPPED });

        mocked_axios
          .onGet(system_status_when_buffering_regexp)
          .replyOnce(200, { ui_status_code: STATUS.MESSAGE.BUFFERING });
        mocked_axios
          .onGet(system_status_when_buffering_regexp)
          .reply(200, { ui_status_code: STATUS.MESSAGE.LIVE_VIEW_ACTIVE_uuid });
      });
      afterEach(async () => {
        // make sure to stop pinging before unmocking axios so there aren't any unmocked HTTP requests
        store.commit("flask/stop_status_pinging");
        mocked_axios.restore();
      });

      test("Given an invalid barcode in Vuex and the playback state is CALIBRATED, When Start Live View is clicked Then the playback state does not transition", async () => {
        store.commit("playback/set_barcode_number", null);
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
        ["LIVE_VIEW_ACTIVE", ".svg__playback-desktop-player-controls-record-button--inactive", "RECORDING"],
        ["LIVE_VIEW_ACTIVE", ".svg__playback-desktop-player-controls-live-view-button", "CALIBRATED"],
        ["RECORDING", ".svg__playback-desktop-player-controls-record-button--active", "LIVE_VIEW_ACTIVE"],
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
          await store.commit("settings/set_customer_index", 0);
          // set initial state
          store.commit(
            "playback/set_playback_state",
            playback_module.ENUMS.PLAYBACK_STATES[starting_playback_state_enum]
          );
          await wrapper.vm.$nextTick(); // wait for update

          await target_button.trigger("click");

          await wait_for_expect(() => {
            // wait for the axios promises to resolve
            expect(store.state.playback.playback_state).toEqual(
              playback_module.ENUMS.PLAYBACK_STATES[ending_playback_state_enum]
            );
          });
        }
      );
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
    test("Given Vuex is in the Calibrating state, the calibrating animation matches the DOM snapshot", async () => {
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
    test("Given Vuex is in the Buffering state, the buffering animation matches the DOM snapshot", async () => {
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
  });
});
