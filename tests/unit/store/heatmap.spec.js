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

    test("When mutating heatmap_values, Then getting heatmap_values should return mutated value", async () => {
      const test = {
        "Twitch Force": { data: [0] },
        "Twitch Period": { data: [1] },
        "Twitch Frequency": { data: [2] },
        "Twitch Width 80": { data: [3] },
        "Contraction Velocity": { data: [4] },
        "Relaxation Velocity": { data: [5] },
      };
      store.commit("heatmap/set_heatmap_values", test);
      expect(store.getters["heatmap/heatmap_values"]["Twitch Frequency"]).toStrictEqual({ data: [2] });
    });

    test("When mutating heatmap options index, Then the heatmap_values at index in state should return mutated value", async () => {
      store.commit("heatmap/set_heatmap_options_idx", 2);
      expect(store.state.heatmap.heatmap_options_idx).toBe(2);
    });

    test("When mutating heatmap data at value, Then the data at value in state should return mutated data array", async () => {
      const test = {
        "Twitch Force": { data: [[], [], [], []] },
      };
      store.commit("heatmap/set_heatmap_values", test);
      store.commit("heatmap/set_metric_data", {
        name: "Twitch Force",
        data: [1, 2, 3, 4],
      });
      store.state.heatmap.heatmap_values["Twitch Force"].data.map((well) => {
        expect(well).toHaveLength(1);
      });
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
