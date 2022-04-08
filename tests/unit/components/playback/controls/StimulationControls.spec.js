import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import StimulationControls from "@/components/playback/controls/StimulationControls.vue";
import { ENUMS } from "@/store/modules/playback/enums";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";

describe("store/stimulation", () => {
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("StimulationControls", () => {
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

        wrapper.vm.play_state = true;
        await wrapper.find(".span__stimulation-controls-play-stop-button--active").trigger("click");
        expect(dispatch_spy).toHaveBeenCalledWith("stimulation/stop_stimulation");
      });

      test("Given there are no wells assigned with a protocol, When a user clicks to start a stimulation, Then no signal should be dispatched to BE", async () => {
        const wrapper = mount(StimulationControls, {
          store,
          localVue,
        });

        wrapper.vm.play_state = false;
        await wrapper.find(".span__stimulation-controls-play-stop-button--inactive").trigger("click");
        expect(wrapper.vm.play_state).toBe(false);
      });

      test("Given a stimulation is inactive and there are protocol assigned wells, When a user clicks the button to turn on stimulation, Then a signal should be dispatched to BE", async () => {
        const dispatch_spy = jest.spyOn(store, "dispatch");
        dispatch_spy.mockImplementation(
          async () => await store.commit("stimulation/set_stim_play_state", true)
        );

        store.state.stimulation.protocol_assignments = { test: "assignment" };
        const wrapper = mount(StimulationControls, {
          store,
          localVue,
        });

        await wrapper.find(".span__stimulation-controls-play-stop-button--active").trigger("click");
        expect(wrapper.vm.play_state).toBe(true);
        expect(dispatch_spy).toHaveBeenCalledWith("stimulation/create_protocol_message");
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

      //   test.each([
      //     ["ERROR", "Cannot start a stimulation with error"],
      //     ["SHORT_CIRCUIT_ERROR", "Cannot start a stimulation with error"],
      //     ["CONFIG_CHECK_NEEDED", "Configuration check needed"],
      //     ["CONFIG_CHECK_IN_PROGRESS", "Configuration check needed"]
      //   ])(
      //     "When Vuex's stim_status changes state to %s, Then the stim start tooltip will have an updated message %s",
      //     async (status, expected_message) => {
      //       const wrapper = mount(StimulationControls, {
      //         store,
      //         localVue
      //       });
      //       await store.commit("stimulation/set_stim_play_state", false);
      //       await store.commit("stimulation/set_stim_status", STIM_STATUS[status]);
      //       await wrapper.find("#start-stim-button").trigger("mouse");
      //       //   expect(StimulationControls.computed.start_stim_label.call()).toBe(expected_message);
      //       expect(wrapper.vm.play_state).toBe(false);
      //       expect(wrapper.text()).toContain("Start Stimulation");
      //     }
      //   );
    });
  });
});
