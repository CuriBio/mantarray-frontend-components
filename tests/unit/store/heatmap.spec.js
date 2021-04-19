import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

describe("store/heatmap", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;

  const heatmap_set_array_api = {
    heatmap_values: "heatmap/set_heatmap_values",
  };

  const heatmap_set_array_idx = {
    heatmap_idx: "heatmap/set_heatmap_idx",
  };

  const heatmap_set_on_idx = {
    heatmap_on_idx: "heatmap/set_heatmap_on_idx",
  };

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

  test("When heatmap store is initialized, Then update with array with values and set the value heatmap_idx", () => {
    const heatmap_data = [
      100,
      200,
      300,
      400,
      500,
      600,
      700,
      800,
      900,
      1000,
      1100,
      1200,
      1300,
      1400,
      1500,
      1600,
      1700,
      1800,
      1900,
      2000,
      2100,
      2200,
      2300,
      2400,
    ];
    const array_idx = 10;
    const new_value = 0;
    store.commit(heatmap_set_array_api.heatmap_values, heatmap_data);
    store.commit(heatmap_set_array_idx.heatmap_idx, array_idx);

    expect(store.getters["heatmap/heatmap_values"]).toStrictEqual(heatmap_data);
    expect(store.getters["heatmap/heatmap_idx"]).toStrictEqual(array_idx);
    expect(store.state.heatmap.heatmap_idx).toStrictEqual(array_idx);

    store.commit(heatmap_set_on_idx.heatmap_on_idx, new_value);
    expect(store.getters["heatmap/heatmap_on_idx"]).toStrictEqual(new_value);

    expect(
      store.state.heatmap.heatmap_values[store.state.heatmap.heatmap_idx]
    ).toStrictEqual(new_value);
  });
});
