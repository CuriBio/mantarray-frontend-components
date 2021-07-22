import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";
import StimulationControls from "@/components/playback/controls/StimulationControls.vue";

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

    test("When exiting instance, Then instance is effectively destroyed", async () => {
      const destroyed_spy = jest.spyOn(StimulationControls, "beforeDestroy");
      const wrapper = mount(StimulationControls, {
        store,
        localVue,
      });
      wrapper.destroy();
      expect(destroyed_spy).toHaveBeenCalledWith();
    });
    test("Given a stimulation is active, When a user clicks the button to turn off stimulation, Then the colored icon should revert to inactive color gradient and dispatch signal to BE", async () => {
      jest
        .spyOn(store, "dispatch")
        .mockImplementation(async () => await store.commit("stimulation/set_stim_status", false));
      const wrapper = mount(StimulationControls, {
        store,
        localVue,
      });
      wrapper.vm.play_state = true;
      await wrapper.find(".span__stimulation-controls-play-stop-button").trigger("click");
      expect(wrapper.vm.play_state).toBe(false);
      expect(wrapper.vm.current_gradient).toBe(wrapper.vm.inactive_gradient);
    });

    test("Given a stimulation is inactive, When a user clicks the button to turn on stimulation, Then the colored icon should change to active color gradient and dispatch signal to BE", async () => {
      jest
        .spyOn(store, "dispatch")
        .mockImplementation(async () => await store.commit("stimulation/set_stim_status", true));

      const wrapper = mount(StimulationControls, {
        store,
        localVue,
      });

      await wrapper.find(".span__stimulation-controls-play-stop-button").trigger("click");
      expect(wrapper.vm.play_state).toBe(true);
      expect(wrapper.vm.current_gradient).toBe(wrapper.vm.active_gradient);
    });
  });
});
