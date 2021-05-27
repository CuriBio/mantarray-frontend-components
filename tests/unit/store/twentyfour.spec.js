import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

describe("store/twentyfourcontrols", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;

  const quadrant_options = {
    QUADRANT_ONE: [0, 1, 4, 5, 8, 9],
    QUADRANT_TWO: [12, 13, 16, 17, 20, 21],
  };

  const quadrant_options_api_set = {
    QUADRANT: "twentyfourcontrols/set_is_quadrant",
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

  test("When twentyfourcontrols store is initialized, Then by default it should be QUADRANT_ONE", () => {
    expect(store.state.twentyfourcontrols.is_quadrant).toStrictEqual(quadrant_options.QUADRANT_ONE);
  });

  test("When twentyfourcontrols store is mutated with QUADRANT_TWO, Then assert the QUADRANT_TWO is updated", () => {
    store.commit(quadrant_options_api_set.QUADRANT, quadrant_options.QUADRANT_TWO);
    expect(store.state.twentyfourcontrols.is_quadrant).toBe(quadrant_options.QUADRANT_TWO);
  });
});
