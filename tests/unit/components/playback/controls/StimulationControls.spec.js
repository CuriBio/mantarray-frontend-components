import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import StimulationControls from "@/components/playback/controls/StimulationControls.vue";
import { ENUMS } from "@/store/modules/playback/enums";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";
import waitForExpect from "wait-for-expect";

describe("StimulationControls", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;

  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    await store.commit("playback/set_barcode", {
      type: "plate_barcode",
      new_value: "MA209990004",
      is_valid: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("When StimulationControls mounts, Then the initial play state should be false", () => {
    const wrapper = mount(StimulationControls, {
      store,
      localVue,
    });

    expect(wrapper.vm.play_state).toBe(false);
  });

  describe("Given stimulation controls are disabled", () => {
    beforeEach(() => {
      store.commit("playback/set_enable_stim_controls", false);
    });

    test("Then controls block should be displayed", () => {
      const wrapper = mount(StimulationControls, {
        store,
        localVue,
      });
      const controls_block = wrapper.find(".div__controls-block");
      expect(controls_block.isVisible()).toBe(true);
    });
  });

  describe("Given stimulation controls are enabled", () => {
    beforeEach(() => {
      store.commit("playback/set_enable_stim_controls", true);
    });

    test("Then controls block should not be displayed", () => {
      const wrapper = mount(StimulationControls, {
        store,
        localVue,
      });
      expect(wrapper.find(".div__controls-block").exists()).toBeFalsy();
    });

    test("Given a stimulation is active, When a user clicks the button to turn off stimulation, Then a signal should be dispatched to BE", async () => {
      const dispatch_spy = jest.spyOn(store, "dispatch");
      dispatch_spy.mockImplementation(
        async () => await store.commit("stimulation/set_stim_play_state", false)
      );

      store.state.stimulation.protocol_assignments = { test: "assignment" };

      const wrapper = mount(StimulationControls, {
        store,
        localVue,
      });

      await store.commit("stimulation/set_stim_status", STIM_STATUS.STIM_ACTIVE);
      wrapper.vm.play_state = true;
      // direct call to bypass bootstrap component, jest can't find bootstrap elements
      const test_event = { preventDefault: jest.fn() };
      await wrapper.vm.handle_play_stop(test_event);

      expect(wrapper.vm.open_start_dropdown).toBe(false);
      expect(dispatch_spy).toHaveBeenCalledWith("stimulation/stop_stimulation");
    });

    test("Given there are no wells assigned with a protocol, When a user clicks to start a stimulation, Then no signal should be dispatched to BE", async () => {
      const wrapper = mount(StimulationControls, {
        store,
        localVue,
      });

      // direct call to bypass bootstrap component, jest can't find bootstrap elements
      const test_event = { preventDefault: jest.fn() };
      await wrapper.vm.handle_play_stop(test_event);

      expect(wrapper.vm.play_state).toBe(false);
      expect(wrapper.vm.open_start_dropdown).toBe(false);
    });

    test("When stim_status is set to STARTING, Then stim start stop button will always be disabled", async () => {
      const wrapper = mount(StimulationControls, {
        store,
        localVue,
      });

      await store.commit("stimulation/set_stim_status", STIM_STATUS.STARTING);
      expect(wrapper.vm.is_start_stop_button_enabled).toBe(false);
    });
    test("When stim_status is set to STOPPING, Then stim start stop button will always be disabled", async () => {
      const wrapper = mount(StimulationControls, {
        store,
        localVue,
      });

      await store.commit("stimulation/set_stim_status", STIM_STATUS.STOPPING);
      expect(wrapper.vm.is_start_stop_button_enabled).toBe(false);
    });

    test("Given a stimulation is inactive and there are protocol assigned wells, When a user clicks the button to turn on stimulation only, Then a signal should be dispatched to BE", async () => {
      const dispatch_spy = jest.spyOn(store, "dispatch");
      dispatch_spy.mockImplementation(
        async () => await store.commit("stimulation/set_stim_play_state", true)
      );
      await store.commit("playback/set_barcode", {
        type: "stim_barcode",
        new_value: "MS2022001000",
        is_valid: true,
      });
      store.state.stimulation.protocol_assignments = {
        test: "assignment",
      };
      await store.commit("stimulation/set_stim_status", STIM_STATUS.READY);
      const wrapper = mount(StimulationControls, {
        store,
        localVue,
        attachToDocument: true,
      });

      // direct call to bypass bootstrap component, jest can't find bootstrap elements
      const test_event = {
        preventDefault: jest.fn(),
      };

      await wrapper.vm.handle_play_stop(test_event);
      expect(wrapper.vm.open_start_dropdown).toBe(true);

      // trigger document event listener to close modal
      await wrapper.trigger("click");
      await wrapper.vm.handle_dropdown_select(0);

      expect(wrapper.vm.play_state).toBe(true);
      expect(dispatch_spy).toHaveBeenCalledWith("stimulation/create_protocol_message");
      expect(store.state.playback.start_recording_from_stim).toBe(false);
      expect(wrapper.vm.open_start_dropdown).toBe(false);
    });

    test("Given a stimulation is inactive and there are protocol assigned wells, When a user clicks the button to turn on both stimulation and recording, Then a signal should be dispatched to BE", async () => {
      store.state.stimulation.protocol_assignments = { test: "assignment" };
      await store.commit("playback/set_barcode", {
        type: "stim_barcode",
        new_value: "MS2022001000",
        is_valid: true,
      });

      await store.commit("stimulation/set_stim_status", STIM_STATUS.READY);

      const wrapper = mount(StimulationControls, {
        store,
        localVue,
        attachToDocument: true,
      });

      // trigger document event listener to close modal
      await wrapper.trigger("click");
      // direct call to bypass bootstrap component, jest can't find bootstrap elements
      await wrapper.vm.handle_dropdown_select(1);

      expect(store.state.playback.start_recording_from_stim).toBe(true);
      expect(wrapper.vm.open_start_dropdown).toBe(false);
    });

    test("When set_stim_play_state is called with different values, Then current gradient is updated correctly", async () => {
      const wrapper = mount(StimulationControls, {
        store,
        localVue,
      });

      store.commit("stimulation/set_stim_play_state", true);
      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.vm.current_gradient).toStrictEqual(wrapper.vm.active_gradient);
      store.commit("stimulation/set_stim_play_state", false);
      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.vm.current_gradient).toStrictEqual(wrapper.vm.inactive_gradient);
    });

    test.each([
      ["ERROR", "Cannot start a stimulation with error"],
      ["SHORT_CIRCUIT_ERROR", "Cannot start a stimulation with error"],
      ["CONFIG_CHECK_NEEDED", "Configuration check needed"],
      ["CONFIG_CHECK_IN_PROGRESS", "Configuration check needed"],
    ])(
      "When Vuex's stim_status changes state to %s and protocols are assigned to wells, Then the stim start tooltip will have an updated message %s",
      async (status, expected_message) => {
        const wrapper = mount(StimulationControls, {
          store,
          localVue,
        });

        await store.commit("playback/set_barcode", {
          type: "stim_barcode",
          new_value: "MS2022001000",
          is_valid: true,
        });

        store.state.stimulation.protocol_assignments = { 1: {} };

        await store.commit("stimulation/set_stim_play_state", false);
        await store.commit("stimulation/set_stim_status", STIM_STATUS[status]);

        expect(wrapper.find("#start-popover-msg").text()).toBe(expected_message);
        expect(wrapper.vm.play_state).toBe(false);
      }
    );

    test.each([
      ["ERROR", "Cannot start a stimulation with error"],
      ["SHORT_CIRCUIT_ERROR", "Cannot start a stimulation with error"],
      ["CONFIG_CHECK_NEEDED", "No protocols have been assigned"],
      ["NO_PROTOCOLS_ASSIGNED", "No protocols have been assigned"],
    ])(
      "When Vuex's stim_status changes state to %s and no protocols have been assigned, Then the stim start tooltip will have an updated message %s",
      async (status, expected_message) => {
        const wrapper = mount(StimulationControls, {
          store,
          localVue,
        });

        await store.commit("playback/set_barcode", {
          type: "stim_barcode",
          new_value: "MS2022001000",
          is_valid: true,
        });

        await store.commit("stimulation/set_stim_play_state", false);
        await store.commit("stimulation/set_stim_status", STIM_STATUS[status]);

        expect(wrapper.find("#start-popover-msg").text()).toBe(expected_message);
        expect(wrapper.vm.play_state).toBe(false);
      }
    );

    test.each([
      ["MS2022001000", true, "No protocols have been assigned"],
      ["invalid_barcode", false, "Must have a valid Stimulation Lid Barcode"],
    ])(
      "When Vuex's stim_status changes state to ready and stim barcodes value is changed to %s and validity is %s , Then the stim start tooltip will have an updated message %s",
      async (new_value, is_valid, message) => {
        const wrapper = mount(StimulationControls, {
          store,
          localVue,
        });

        await store.commit("stimulation/set_stim_play_state", false);
        await store.commit("stimulation/set_stim_status", STIM_STATUS.READY);
        await store.commit("playback/set_barcode", {
          type: "stim_barcode",
          new_value,
          is_valid,
        });

        expect(wrapper.find("#start-popover-msg").text()).toBe(message);
      }
    );

    test.each([
      ["CALIBRATING", "Cannot start stimulation while calibrating instrument"],
      ["CALIBRATED", "Start Stimulation"],
    ])(
      "Given that protocols have been assigned to wells in the stim studio, valid stim barcode present, and configuration check is complete, When Vuex's playback_state changes state to %s, Then the stim start tooltip will have an updated message %s",
      async (status, expected_message) => {
        const wrapper = mount(StimulationControls, {
          store,
          localVue,
        });

        store.state.stimulation.protocol_assignments = {
          4: {},
        };
        await store.commit("stimulation/set_stim_play_state", false);
        await store.commit("stimulation/set_stim_status", STIM_STATUS.READY);
        await store.commit("playback/set_playback_state", ENUMS.PLAYBACK_STATES[status]);
        await store.commit("playback/set_barcode", {
          type: "stim_barcode",
          new_value: "MS2022001000",
          is_valid: true,
        });

        expect(wrapper.find("#start-popover-msg").text()).toBe(expected_message);
        expect(wrapper.vm.play_state).toBe(false);
      }
    );

    test.each([["CALIBRATED", "Stop Stimulation"]])(
      "When a recording is active, Then the stim stop tooltip will have an updated message %s",
      async (status, expected_message) => {
        const wrapper = mount(StimulationControls, {
          store,
          localVue,
        });

        await store.commit("stimulation/set_stim_play_state", true);
        await store.commit("playback/set_playback_state", ENUMS.PLAYBACK_STATES[status]);

        expect(wrapper.find("#stop-popover-msg").text()).toBe(expected_message);
        expect(wrapper.vm.play_state).toBe(true);
      }
    );

    test.each([
      [true, "STIM_ACTIVE", 0],
      [false, "CONFIG_CHECK_NEEDED", 1],
    ])(
      "When stim play state is %s and user clicks on the configuration check icon to start, Then it will only get called when stimulation is inactive",
      async (play_state, stim_status, calls) => {
        const action_spy = jest.spyOn(store, "dispatch");
        const wrapper = mount(StimulationControls, {
          store,
          localVue,
        });
        store.state.stimulation.protocol_assignments = {
          4: {},
        };
        await store.commit("stimulation/set_stim_status", STIM_STATUS[stim_status]);
        await store.commit("stimulation/set_stim_play_state", play_state);
        await store.commit("playback/set_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATED);
        await store.commit("playback/set_barcode", {
          type: "stim_barcode",
          new_value: "MS2022001000",
          is_valid: true,
        });

        await wrapper.find(".svg__config-check-container").trigger("click");
        expect(action_spy).toHaveBeenCalledTimes(calls);
      }
    );
  });
});
