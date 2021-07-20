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
    test("When autoscale box is checked, Then getting the autoscale boolean should should return mutated boolean", async () => {
      const test = true;
      store.commit("heatmap/set_heatmap_autoscale", test);
      expect(store.getters["heatmap/heatmap_autoscale"]).toBe(true);
    });
  });
});
