import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

describe("store/stimulation", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;

  const test_wells = {
    SELECTED: [true, true, false, false, false],
    UNSELECTED: [false, true, false, false, false],
  };

  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When stimulation store is initialized, Then default selected wells should be an empty array", () => {
    expect(store.state.stimulation.selected_wells).toStrictEqual([]);
  });

  test("When stimulation store is mutated to add or remove selected wells, Then selected wells in state should update according to wells", () => {
    store.commit("stimulation/handle_selected_wells", test_wells.SELECTED);
    expect(store.state.stimulation.selected_wells).toStrictEqual([0, 1]);

    store.commit("stimulation/handle_selected_wells", test_wells.UNSELECTED);
    expect(store.state.stimulation.selected_wells).toStrictEqual([1]);
  });
});
