import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import StimulationStudioControls from "@/components/playback/controls/StimulationStudioControls.vue";
import { stackOrderDescending } from "d3";

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

  describe("StimulationStudioControls", () => {
    test("When StimulationStudioControls mounts, Then the initial play state should be false", () => {
      const wrapper = mount(StimulationStudioControls, {
        store,
        localVue,
      });

      expect(wrapper.vm.play_state).toBe(false);
    });

    test("When exiting instance, Then instance is effectively destroyed", async () => {
      const destroyed_spy = jest.spyOn(StimulationStudioControls, "beforeDestroy");
      const wrapper = mount(StimulationStudioControls, {
        store,
        localVue,
      });
      wrapper.destroy();
      expect(destroyed_spy).toHaveBeenCalledWith();
    });
    test("Given a stimulation is active, When a user clicks the button to turn off stimulation, Then a signal should be dispatched to BE", async () => {
      jest
        .spyOn(store, "dispatch")
        .mockImplementation(async () => await store.commit("stimulation/set_stim_status", false)); // TODO figure out if this mock implementation is necessary in following tests
      const wrapper = mount(StimulationStudioControls, {
        store,
        localVue,
      });
      store.state.stimulation.protocol_assignments = { test: "assignment" };
      wrapper.vm.play_state = true;
      await wrapper.find(".span__stimulation-controls-play-stop-button--active").trigger("click");
      expect(wrapper.vm.play_state).toBe(false);
      // expect(wrapper.vm.current_gradient).toStrictEqual(wrapper.vm.inactive_gradient);
    });

    test("Given there are no wells assigned with a protocol, When a user clicks to start a stimulation, Then no signal should be dispatched to BE", async () => {
      const wrapper = mount(StimulationStudioControls, {
        store,
        localVue,
      });

      wrapper.vm.play_state = false;
      await wrapper.find(".span__stimulation-controls-play-stop-button--inactive").trigger("click");
      expect(wrapper.vm.play_state).toBe(false);
      // expect(wrapper.vm.current_gradient).toStrictEqual(wrapper.vm.inactive_gradient);
    });

    test("Given a stimulation is inactive and there are protocol assigned wells, When a user clicks the button to turn on stimulation, Then a signal should be dispatched to BE", async () => {
      jest
        .spyOn(store, "dispatch")
        .mockImplementation(async () => await store.commit("stimulation/set_stim_status", true));

      const wrapper = mount(StimulationStudioControls, {
        store,
        localVue,
      });

      store.state.stimulation.protocol_assignments = { test: "assignment" };
      await wrapper.find(".span__stimulation-controls-play-stop-button--active").trigger("click");
      expect(wrapper.vm.play_state).toBe(true);
      // expect(wrapper.vm.current_gradient).toStrictEqual(wrapper.vm.active_gradient);
    });
    // TODO add tests for play button being active/inactive correctly
    // TODO add tests for colored icon
  });
});
