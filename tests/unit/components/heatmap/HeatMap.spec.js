import { mount } from "@vue/test-utils";
import HeatMap from "@/components/heatmap/HeatMap.vue";
import { HeatMap as DistComponentToTest } from "@/dist/mantarray.common";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);
let NuxtStore;
let store;

describe("HeatMap.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  // test("When mounting HeatMap from the build dist file, Then it loads successfully", async () => {
  //   const wrapper = mount(DistComponentToTest, {
  //     propsData,
  //     store,
  //     localVue,
  //   });
  // });
  // test("When mounting HeatMap with empty propdata, Then it loads successfully", async () => {
  //   const propsData = {};
  //   const wrapper = mount(PlateHeatMap, {
  //     propsData,
  //     store,
  //     localVue,
  //   });
  // });

  test("Given each well has data and a display metric is selected, When a few wells are selected, Then the mean value of the wells is computed for the selected metric", async () => {
    // const propsData = {
    //   selected: new Array(24).fill(false),
    //   platecolor: new Array(24).fill("#b7b7b7"),
    // };
    // const wrapper = mount(HeatMap, {
    //   propsData,
    //   store,
    //   localVue,
    // });
    // const init_heatmap_values = {
    //   "Twitch Force": { data: [[1], [2], [4], [5]] },
    //   "Twitch Frequency": { data: [[10], [10], [10], [10]] },
    // };
    // store.commit("data/set_heatmap_values", init_heatmap_values);
    // const test = [
    //   ["#column_1", [0, 1, 2, 3]],
    // ];
    // test.map(async (column) => {
    //   await wrapper.find(column[0]).trigger("click", { shiftKey: true });
    // });
    // expect()
  });
});
