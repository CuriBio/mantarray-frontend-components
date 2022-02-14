import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

describe("store/gradient", () => {
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
    test("When getting the gradient range values from state, Then an object containing the two values will be returnedd", async () => {
      const expected_default_range = {
        min: store.state.gradient.gradient_range_min,
        max: store.state.gradient.gradient_range_max,
      };
      expect(store.getters["gradient/gradient_range"]).toStrictEqual(expected_default_range);
    });
  });
});
