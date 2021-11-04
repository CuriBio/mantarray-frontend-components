import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

describe("store/waveform", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When the x-zoom levels and x-zoom-idx are updated in Vuex, Then assert that the values are retained", async () => {
    const samples_per_second = 1e6;
    const x_zoom_levels = [
      { x_scale: 30 * samples_per_second },
      { x_scale: 15 * samples_per_second },
      { x_scale: 5 * samples_per_second },
      { x_scale: 2 * samples_per_second },
      { x_scale: 1 * samples_per_second },
    ];
    const default_x_axis_zoom_idx = 2;
    store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
    store.commit("waveform/set_x_axis_zoom_idx", default_x_axis_zoom_idx);

    expect(store.getters["waveform/x_zoom_level_idx"]).toStrictEqual(default_x_axis_zoom_idx);
    expect(store.getters["waveform/x_zoom_levels"]).toStrictEqual(x_zoom_levels);
  });
});
