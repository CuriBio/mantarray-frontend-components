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
    QUADRANT_THREE: [2, 3, 6, 7, 10, 11],
    QUADRANT_FOUR: [14, 15, 18, 19, 22, 23],
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

  it("should set by default QUADRANT_ONE status and retrive initially", () => {
    var name = "twentyfourcontrols/is_quadrant";

    expect(store.getters[name]).toStrictEqual(quadrant_options.QUADRANT_ONE); // Can't understand as the only way to clear the TC was to replace toBe with toStrictEqual
  });

  it("should be able to set QUADRANT_TWO and retrive the same", () => {
    var name = "twentyfourcontrols/is_quadrant";

    store.commit(
      quadrant_options_api_set.QUADRANT,
      quadrant_options.QUADRANT_TWO
    );
    expect(store.getters[name]).toBe(quadrant_options.QUADRANT_TWO);
  });

  it("should be able to set QUADRANT_TWO and retrive the same", () => {
    var name = "twentyfourcontrols/is_quadrant";

    store.commit(
      quadrant_options_api_set.QUADRANT,
      quadrant_options.QUADRANT_THREE
    );
    expect(store.getters[name]).toBe(quadrant_options.QUADRANT_THREE);
  });

  it("should be able to set QUADRANT_TWO and retrive the same", () => {
    var name = "twentyfourcontrols/is_quadrant";

    store.commit(
      quadrant_options_api_set.QUADRANT,
      quadrant_options.QUADRANT_FOUR
    );
    expect(store.getters[name]).toBe(quadrant_options.QUADRANT_FOUR);
  });
});
