import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

describe("store/heatmap", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;

  //   const heatmap_set_array_api = {
  //     heatmap_values: "store/set_heatmap_values",
  //   };

  //   const heatmap_set_array_idx = {
  //     heatmap_idx: "store/set_heatmap_idx",
  //   };

  //   const heatmap_set_on_idx = {
  //     heatmap_on_idx: "store/set_heatmap_on_idx",
  //   };

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  // Make sure the testcases are modified only if the MockFlowUI changes.
  // UT is bounded to the possible icon's different visibility.

  test("When heatmap store is initialized, Then by default it should be empty and index null", () => {
    expect(store.state.heatmap.heatmap_values).toHaveLength(0);
  });
});
