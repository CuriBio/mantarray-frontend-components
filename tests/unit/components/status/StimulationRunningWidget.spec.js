import { mount } from "@vue/test-utils";
import StimulationRunningWidget from "@/components/status/StimulationRunningWidget";
import Vuex from "vuex";
import Vue from "vue";
import { createLocalVue } from "@vue/test-utils";

const localVue = createLocalVue();
localVue.use(Vuex);

let nuxt_store;
let store;

describe("StimulationRunningWidget", () => {
  beforeAll(async () => {
    const store_path = `${process.env.buildDir}/store.js`;
    nuxt_store = await import(store_path);
  });

  beforeEach(async () => {
    store = await nuxt_store.createStore();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("When the stim_play_state is true, Then the 'Stimulation is Running' is visible and flashing", async () => {
    store.commit("stimulation/set_stim_play_state", true);
    const wrapper = mount(StimulationRunningWidget, { store, localVue });
    await Vue.nextTick();

    const running_text = wrapper.find(".flash");
    expect(running_text.isVisible()).toBe(true);
    expect(running_text.text()).toBe("Stimulation is Running");
  });

  test("When the stim_play_state is false, Then the 'Stimulation is Running'  is not visible", async () => {
    store.commit("stimulation/set_stim_play_state", false);
    const wrapper = mount(StimulationRunningWidget, { store, localVue });
    await Vue.nextTick();

    const running_text = wrapper.find(".flash");
    expect(running_text.exists()).toBe(false);
  });
});
