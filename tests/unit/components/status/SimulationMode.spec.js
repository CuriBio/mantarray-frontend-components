import { mount } from "@vue/test-utils";
import SimulationMode from "@/components/status/SimulationMode.vue";
import { SimulationMode as dist_SimulationMode } from "@/dist/mantarray.common";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { STATUS } from "../../../../store/modules/flask/enums";
import { mapGetters } from "vuex";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

beforeAll(async () => {
  // note the store will mutate across tests, so make sure to re-create it in beforeEach
  const storePath = `${process.env.buildDir}/store.js`;
  NuxtStore = await import(storePath);
});

beforeEach(async () => {
  store = await NuxtStore.createStore();
});

afterEach(() => wrapper.destroy());

describe("SimulationMode.vue", () => {
  it("initially the simulation_mode is set to false ", async () => {
    const propsData = {};
    wrapper = shallowMount(SimulationMode, { propsData, store, localVue });

    const target_button = wrapper.find(".div__simulationmode");

    expect(target_button.isVisible()).toBe(false);
  });
  it("Vuex mutation of simulation_mode is set to true component becomes visible ", async () => {
    const propsData = {};
    wrapper = shallowMount(SimulationMode, { propsData, store, localVue });

    store.commit("flask/set_simulation_status", true);
    await wrapper.vm.$nextTick(); // wait for update
    const target_button = wrapper.find(".div__simulationmode");

    expect(target_button.isVisible()).toBe(true);
  });
  it("Vuex mutation of simulation_mode is set to false component becomes hidden ", async () => {
    const propsData = {};
    wrapper = shallowMount(SimulationMode, { propsData, store, localVue });

    store.commit("flask/set_simulation_status", false);
    await wrapper.vm.$nextTick(); // wait for update
    const target_button = wrapper.find(".div__simulationmode");

    expect(target_button.isVisible()).toBe(false);
  });
});
