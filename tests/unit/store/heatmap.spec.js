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

  const heatmap_set_display_api = {
    heatmap_display: "heatmap/set_heatmap_display_array",
  };

  const heatmap_set_display_idx = {
    heatmap_display_idx: "heatmap/set_heatmap_display_idx",
  };

  const heatmap_set_heatmap_display_min_max = {
    heatmap_display_min_max: "heatmap/set_heatmap_display_min_max",
  };

  const heatmap_set_auto_scale = {
    heatmap_auto_scale: "heatmap/set_heatmap_autoscale",
  };

  const heatmap_set_heatmap_display_user_min_max = {
    heatmap_display_user_min_max: "heatmap/set_heatmap_display_user_min_max",
  };

  const heatmap_set_heatmap_options_array = {
    heatmap_options_array: "heatmap/set_heatmap_options_array",
  };

  const heatmap_set_heatmap_option_idx = {
    heatmap_options_idx: "heatmap/set_heatmap_options_idx",
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
  test("When heatmap store is initialized, Then update display array with values and set the value heatmap_display_idx", () => {
    const display_names = [
      "Twitch Force",
      "Twitch Period",
      "Twitch Frequency",
      "Twitch Width 80",
      "Contraction Velocity",
      "Relaxation Velocity",
    ];
    const display_idx = 0;
    store.commit(heatmap_set_display_api.heatmap_display, display_names);
    store.commit(heatmap_set_display_idx.heatmap_display_idx, display_idx);

    expect(store.getters["heatmap/heatmap_display_array"]).toStrictEqual(
      display_names
    );
    expect(store.getters["heatmap/heatmap_display_idx"]).toStrictEqual(
      display_idx
    );
    expect(store.getters["heatmap/heatmap_display_option"]).toStrictEqual(
      "Twitch Force"
    );
  });
  test("When heatmap store is initialized, Then update display array(min/max) and  display", () => {
    const display_names = [
      "Twitch Force",
      "Twitch Period",
      "Twitch Frequency",
      "Twitch Width 80",
      "Contraction Velocity",
      "Relaxation Velocity",
    ];
    const display_idx = 2;
    const display_min_max = [
      {
        min: 0,
        max: 50,
      },
      {
        min: 0,
        max: 100,
      },
      {
        min: 0,
        max: 200,
      },
      {
        min: 0,
        max: 400,
      },
      {
        min: 0,
        max: 800,
      },
      {
        min: 0,
        max: 1600,
      },
    ];
    store.commit(heatmap_set_display_api.heatmap_display, display_names);
    store.commit(heatmap_set_display_idx.heatmap_display_idx, display_idx);
    store.commit(
      heatmap_set_heatmap_display_min_max.heatmap_display_min_max,
      display_min_max
    );

    expect(store.getters["heatmap/heatmap_display_min_max"]).toStrictEqual(
      display_min_max
    );
    const display_in_focus =
      store.getters["heatmap/heatmap_display_min_max_selected"];
    expect(display_in_focus.min).toStrictEqual(0);
    expect(display_in_focus.max).toStrictEqual(200);
  });
  test("When heatmap store is initialize, Then user enters min and max values validate if set", () => {
    const user_min_max = {
      min: 0,
      max: 999,
    };
    store.commit(
      heatmap_set_heatmap_display_user_min_max.heatmap_display_user_min_max,
      user_min_max
    );
    expect(store.getters["heatmap/heatmap_display_user_min_max"]).toStrictEqual(
      user_min_max
    );
    expect(store.state.heatmap.heatmap_display_user_min_max.min).toStrictEqual(
      0
    );
    expect(store.state.heatmap.heatmap_display_user_min_max.max).toStrictEqual(
      999
    );
  });
  test("When heatmap store is initialized, Then autoscale is set to true and assert", () => {
    const autoscale = true;
    store.commit(heatmap_set_auto_scale.heatmap_auto_scale, autoscale);
    expect(store.getters["heatmap/heatmap_autoscale"]).toStrictEqual(true);
  });
  test("When heatmap store is initialized, Then the radio button options array is initialized", () => {
    const radio_button_list = ["Warm", "Cool", "Blue/Red", "Purple/Green"];
    const radio_button_idx = 0;
    store.commit(
      heatmap_set_heatmap_options_array.heatmap_options_array,
      radio_button_list
    );
    store.commit(
      heatmap_set_heatmap_option_idx.heatmap_options_idx,
      radio_button_idx
    );
    expect(store.getters["heatmap/heatmap_options_array"]).toStrictEqual(
      radio_button_list
    );
    expect(store.getters["heatmap/heatmap_options_idx"]).toStrictEqual(
      radio_button_idx
    );
    expect(store.getters["heatmap/heatmap_options_on_idx"]).toStrictEqual(
      "Warm"
    );
  });
});
