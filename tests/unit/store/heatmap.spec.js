import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

describe("store/heatmap", () => {
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

  describe("mutations/getters", () => {
    test("When mutating heatmap_idx, Then getting heatmap_idx should return mutated value", async () => {
      store.commit("heatmap/set_heatmap_idx", 2);
      expect(store.state.heatmap.heatmap_idx).toBe(2);
    });

    test("When mutating heatmap options index, Then the heatmap_options_index in state should return mutated value", async () => {
      store.commit("heatmap/set_heatmap_options_idx", 2);
      expect(store.state.heatmap.heatmap_options_idx).toBe(2);
    });

    test("When autoscale box is checked, Then getting the autoscale boolean should should return mutated boolean", async () => {
      const test = true;
      store.commit("heatmap/set_heatmap_autoscale", test);
      expect(store.getters["heatmap/heatmap_autoscale"]).toBe(true);
    });

    test("When mutating the heatmap options gradient, Then getting array should should return mutated values", async () => {
      const test = [1, 2, 3, 4];
      store.commit("heatmap/set_heatmap_options_gradient", test);
      expect(store.getters["heatmap/heatmap_options_gradient"]).toStrictEqual([1, 2, 3, 4]);
    });
  });
});
