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

  test("When the stim_play_state is false, Then the StatusWarningWidget is not visible", async () => {
    store.commit("stimulation/set_stim_play_state", false);
    const wrapper = mount(StimulationRunningWidget, { store, localVue });
    await Vue.nextTick();

    const status_warning = wrapper.find("#warning-modal");
    expect(status_warning.exists()).toBe(false);
  });

  test("When the stim_play_state transitions from true to false, Then the StatusWarningWidget is visible", async () => {
    store.commit("stimulation/set_stim_play_state", true);
    const wrapper = mount(StimulationRunningWidget, { store, localVue });
    await Vue.nextTick();

    store.commit("stimulation/set_stim_play_state", false);
    await Vue.nextTick();

    const status_warning = wrapper.find("#warning-modal");
    expect(status_warning.exists()).toBe(true);
  });

  test("When the stim_play_state transitions from true to false and the 'Close' button in the warning modal is clicked, Then the StatusWarningWidget is no longer visible", async () => {
    store.commit("stimulation/set_stim_play_state", true);
    const wrapper = mount(StimulationRunningWidget, { store, localVue });
    await Vue.nextTick();

    store.commit("stimulation/set_stim_play_state", false);
    await Vue.nextTick();

    const status_warning = wrapper.find("#warning-modal");
    expect(status_warning.exists()).toBe(true);

    wrapper.vm.close_warning_modal();

    await Vue.nextTick();
    expect(status_warning.exists()).toBe(false);
  });
});
