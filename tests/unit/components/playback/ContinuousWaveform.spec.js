import { mount } from "@vue/test-utils";
import ContinuousWaveform from "@/components/playback/waveform/ContinuousWaveform.vue";
import Waveform from "@/components/playback/waveform/Waveform.vue";
import { ContinuousWaveform as dist_CWaveform } from "@/dist/mantarray.common";

import * as d3 from "d3";

import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { arry, new_arry, con_arry } from "../../js_utils/waveform_data_provider.js";

const ar = arry;
const nr = new_arry;
const cr = con_arry;

import {
  get_x_axis_ticks_with_text,
  get_y_axis_ticks_with_text,
  get_waveform_line_pixel_coordinates_from_svg,
  convert_waveform_line_pixel_coordinates_to_expected_data,
} from "@curi-bio/frontend-test-utils";

import { convert_from_json_of_sample_idx_and_value } from "@/js_utils/waveform_data_formatter.js";
const parse_svg_d_path = require("d-path-parser");
const mantarray_single_well_simulated_45_seconds_json = require("@/tests/sample_waveform_data/mantarray/single_well/simulated_45_seconds.json");
const mantarray_single_well_simulated_45_seconds_json_2 = require("@/tests/sample_waveform_data/mantarray/single_well/simulated_45_seconds_2.json");
const converted_values = convert_from_json_of_sample_idx_and_value(
  mantarray_single_well_simulated_45_seconds_json
);
const converted_array_x = converted_values.sample_indices;
const converted_array_y = converted_values.values;
const converted_values_2 = convert_from_json_of_sample_idx_and_value(
  mantarray_single_well_simulated_45_seconds_json_2
);
const converted_array_x_2 = converted_values_2.sample_indices;
const converted_array_y_2 = converted_values_2.values;

let wrapper = null;

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

afterEach(() => wrapper.destroy());

describe("ContinuousWaveform.vue", () => {
  beforeEach(async () => {
    let y_zoom_levels = [
      { y_min: 0, y_max: 500 },
      { y_min: 100, y_max: 400 },
      { y_min: 200, y_max: 300 },
    ];
    let default_zoom_level_idx = 0;
    store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);
    store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);
    let x_zoom_levels = [
      { x_scale: 30 * 100000 },
      { x_scale: 15 * 100000 },
      { x_scale: 5 * 100000 },
      { x_scale: 2 * 100000 },
      { x_scale: 1 * 100000 },
    ];
    let default_x_zoom_level_idx = 1;
    store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
    store.commit("waveform/set_x_axis_zoom_idx", default_x_zoom_level_idx);
  });

  it("should be able to mount the Waveform when loaded from the built dist file from ContinuousWaveform", async () => {
    const propsData = {
      display_waveform_idx: 0,
    };
    wrapper = mount(dist_CWaveform, { propsData, store, localVue });
    expect(wrapper.findComponent(Waveform).exists()).toBe(true);
  });
  describe("Given the display_data_prior_to_current_timepoint prop is set to True", () => {
    const propsData = {
      display_data_prior_to_current_timepoint: true,
      display_waveform_idx: 0 /* the value of C01 is in the quadrant 3 [2, 3, 6, 7, 10, 11] */,
    };
    test("When first mounted, Then the x_axis_min prop passed to the child Waveform is negative", () => {
      const expected_value = -1500000;
      let quadrant = [2, 3, 6, 7, 10, 11];
      store.commit("twentyfourcontrols/set_is_quadrant", quadrant);
      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);
      expect(waveform_wrapper.props("x_axis_min")).toEqual(expected_value);
    });
    test("When x_time_index updates in Vuex, Then the x_axis_min prop passed to the child Waveform is the x_time_index minus the x_axis_sample_length", async () => {
      const expected_value = -1500000;
      let x_axis_sample_length = -1 * expected_value;

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);
      // confirm pre-condition
      expect(waveform_wrapper.props("x_axis_min")).toEqual(expected_value);

      const new_expected_value = 2500;
      store.commit("playback/set_x_time_index", new_expected_value + x_axis_sample_length);
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("x_axis_min")).toEqual(new_expected_value);
    });
    test("When first mounted, Then the data_points Vuex passed to the child Waveform contains the data prior to the current x_time_index", async () => {
      store.commit("playback/set_x_time_index", 100001);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);
      let temp_datapoints = new Array(6);

      temp_datapoints[0] = {
        x_data_points: [0, 30, 50000, 100000, 125000, 150000],
        y_data_points: [55, 75, 95, 88, 92, 84],
      };

      store.commit("data/set_plate_waveforms", temp_datapoints);
      await wrapper.vm.$nextTick(); // wait for update

      expect(waveform_wrapper.props("data_points")).toEqual([
        [0, 55],
        [30, 75],
        [50000, 95],
        [100000, 88],
        [125000, 92],
      ]);
    });
    test("Given some data existing in the store and the x_time_index set forward so that data should be displayed and the ContinuousWaveform is mounted, When append_plate_waveforms is committed, Then the data_points prop passed to the child Waveform is updated to contain both the old and the new appended data", async () => {
      store.commit("playback/set_x_time_index", 100001);

      let temp_datapoints = new Array(6);

      temp_datapoints[0] = {
        x_data_points: [0, 30, 500, 1000, 1250, 1500],
        y_data_points: [55, 75, 95, 88, 92, 84],
      };

      store.commit("data/set_plate_waveforms", temp_datapoints);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      await wrapper.vm.$nextTick(); // wait for update
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm pre-condition
      expect(waveform_wrapper.props("data_points")).toEqual([
        [0, 55],
        [30, 75],
        [500, 95],
        [1000, 88],
        [1250, 92],
        [1500, 84],
      ]);
      expect(store.state.data.plate_waveforms[0].x_data_points.length).toEqual(6);

      store.commit("data/append_plate_waveforms", cr);
      await wrapper.vm.$nextTick(); // wait for update
      // confirm the values updated in Vuex
      expect(store.state.data.plate_waveforms[0].x_data_points.length).toEqual(10);

      const waveform_data_points = waveform_wrapper.props("data_points");

      expect(waveform_data_points.length).toEqual(10);

      expect(waveform_data_points).toEqual([
        [0, 55],
        [30, 75],
        [500, 95],
        [1000, 88],
        [1250, 92],
        [1500, 84],
        [38000, 201.2063512],
        [47000, 164.5426512],
        [50000, 150.81766],
        [52000, 138.4825657],
      ]);
    });
    test("Given there is data past the zero timepoint, When first mounted, Then only the zero timepoint is set for the data_points prop passed to the child Waveform", async () => {
      let temp_datapoints = new Array(6);

      temp_datapoints[0] = {
        x_data_points: [0, 30, 50000, 100000, 125000, 150000],
        y_data_points: [54, 75, 95, 88, 92, 84],
      };

      store.commit("data/set_plate_waveforms", temp_datapoints);
      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      await wrapper.vm.$nextTick(); // wait for update
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("data_points")).toEqual([[0, 54]]);
    });
  });
  test("When well title is supplied as a internal well_title function using display_waveform_idx value, Then the child Waveform displays it", async () => {
    const expected_value = "B06";
    const propsData = {
      display_waveform_idx: 5 /* the value of B06 is in the quadrant 2  [12, 13, 16, 17, 20, 21] */,
    };

    let quadrant = [12, 13, 16, 17, 20, 21];
    store.commit("twentyfourcontrols/set_is_quadrant", quadrant);
    wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
    await wrapper.vm.$nextTick(); // wait for update

    expect(wrapper.find(".div__waveform-well-title").text()).toEqual(expected_value);
  });

  test("When the display_waveform_idx prop is updated and change in the quadrant, Then the child Waveform prop is updated", async () => {
    const expected_value = "B06";
    const propsData = {
      display_waveform_idx: 5 /* the value of B06 is in the quadrant 2  [12, 13, 16, 17, 20, 21] */,
    };

    let quadrant = [12, 13, 16, 17, 20, 21];
    store.commit("twentyfourcontrols/set_is_quadrant", quadrant);
    wrapper = mount(ContinuousWaveform, { propsData, store, localVue });

    const waveform_wrapper = wrapper.findComponent(Waveform);

    // confirm initial condition
    expect(waveform_wrapper.props("title")).toEqual(expected_value);

    const new_expected_value = "C04";
    quadrant = [14, 15, 18, 19, 22, 23]; /* the value of C04 is in the quadrant 4  [14, 15, 18, 19, 22, 23] */
    store.commit("twentyfourcontrols/set_is_quadrant", quadrant);
    wrapper.setProps({ display_waveform_idx: 0 });

    await wrapper.vm.$nextTick(); // wait for update

    expect(waveform_wrapper.props("title")).toEqual(new_expected_value);
  });

  describe("misc props passing to child waveform", () => {
    const propsData = { display_waveform_idx: 0 };
    test("When initially mounted, Then the line_color is passed as a prop to the child Waveform, Then When prop is updated Then the child prop also updates", async () => {
      const expected_value = "#FF00FF";
      propsData.line_color = expected_value;

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("line_color")).toEqual(expected_value);

      const new_expected_value = "#F0F0F0";
      wrapper.setProps({ line_color: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("line_color")).toEqual(new_expected_value);
    });
    test("When initially mounted, Then the plot_area_pixel_height is passed as a prop to the child Waveform, Then When prop is updated Then the child prop also updates", async () => {
      const expected_value = 351;
      propsData.plot_area_pixel_height = expected_value;

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("plot_area_pixel_height")).toEqual(expected_value);

      const new_expected_value = 357;
      wrapper.setProps({ plot_area_pixel_height: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("plot_area_pixel_height")).toEqual(new_expected_value);
    });
    test("When initially mounted, Then the plot_area_pixel_width is passed as a prop to the child Waveform, Then When prop is updated Then the child prop also updates", async () => {
      const expected_value = 401;
      propsData.plot_area_pixel_width = expected_value;

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("plot_area_pixel_width")).toEqual(expected_value);

      const new_expected_value = 399;
      wrapper.setProps({ plot_area_pixel_width: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("plot_area_pixel_width")).toEqual(new_expected_value);
    });
    test("When initially mounted, Then the samples_per_second is passed as a prop to the child Waveform, Then When prop is updated Then the child prop also updates", async () => {
      const expected_value = 100001;
      propsData.samples_per_second = expected_value;

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("samples_per_second")).toEqual(expected_value);

      const new_expected_value = 999999;
      wrapper.setProps({ samples_per_second: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("samples_per_second")).toEqual(new_expected_value);
    });
    test("When initially mounted, Then the margin is passed as a prop to the child Waveform, Then When prop is updated Then the child prop also updates", async () => {
      const expected_value = { top: 11, right: 19, bottom: 29, left: 61 };
      propsData.margin = expected_value;

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("margin")).toEqual(expected_value);

      const new_expected_value = { top: 9, right: 21, bottom: 31, left: 59 };
      wrapper.setProps({ margin: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("margin")).toEqual(new_expected_value);
    });
  });

  // // // TODO (Eli 2/3/20): figure out how to unit test prop validators so this can be added
  // // it("should not allow a negative time index as a prop",  () => {
  // //   const propsData = {
  // //     title: "C12", x_time_index:-1
  // //   };
  // //   wrapper = shallowMount(Waveform, { propsData, store, localVue });

  // // });

  describe("x-axis", () => {
    const propsData = {
      display_waveform_idx: 0 /* pointing to A01 */,
    };
    test("When initially mounted, Then the value of x_time_index in Vuex is passed to the x_min prop in the child Waveform", () => {
      const expected_value = 5 * 100000;
      store.commit("playback/set_x_time_index", expected_value);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("x_axis_min")).toEqual(expected_value);
    });

    test("When x_time_index is updated in Vuex, Then the x_axis_min prop in the child Waveform is updated", async () => {
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };
      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm initial state
      expect(waveform_wrapper.props("x_axis_min")).toEqual(0);

      const expected_value = 10 * 100000;
      store.commit("playback/set_x_time_index", expected_value);

      await wrapper.vm.$nextTick(); // wait for update

      expect(waveform_wrapper.props("x_axis_min")).toEqual(expected_value);
    });

    test("When initially mounted, Then the x_axis_sample_length from Vuex is passed as a prop to the child Waveform", () => {
      const expected_value = 2 * 100000;
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };
      let default_x_zoom_level_idx = 3;
      store.commit("waveform/set_x_axis_zoom_idx", default_x_zoom_level_idx);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("x_axis_sample_length")).toEqual(expected_value);
    });

    test("When the x_axis_sample_length from Vuex is updated, Then the x_axis_sample_length prop of the child Waveform is updated", async () => {
      const expected_value = 1 * 100000;
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };

      let default_x_zoom_level_idx = 4;
      store.commit("waveform/set_x_axis_zoom_idx", default_x_zoom_level_idx);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);
      // confirm initial state
      expect(waveform_wrapper.props("x_axis_sample_length")).toEqual(expected_value);
      const new_expected_value = 2 * 100000;
      /*wrapper.setProps({ x_axis_sample_length: new_expected_value }); */
      default_x_zoom_level_idx = 3;
      store.commit("waveform/set_x_axis_zoom_idx", default_x_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("x_axis_sample_length")).toEqual(new_expected_value);
    });

    test("When initially mounted, Then the x_label prop is passed to the x_axis_label prop of the child Waveform", () => {
      const expected_value = "Miles";
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
        x_label: expected_value,
      };

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });

      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("x_axis_label")).toEqual(expected_value);
    });

    test("When the x_label prop is updated, Then the x_axis_label value of the prop in the child Waveform updates", async () => {
      const expected_value = "Kilometers";
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
        x_label: expected_value,
      };

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm initial state
      expect(waveform_wrapper.props("x_axis_label")).toEqual(expected_value);

      const new_expected_value = "My X Axis";
      wrapper.setProps({ x_label: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("x_axis_label")).toEqual(new_expected_value);
    });
  });

  describe("y-axis", () => {
    test("When initially mounted, then the y_min Vuex is sent as prop of the child Waveform should be 0 by default", () => {
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };
      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("y_min")).toEqual(0);
    });

    test("When initially mounted, Then the y_min Vuex is sent as prop to the child Waveform", () => {
      const expected_value = 100;
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };
      let default_zoom_level_idx = 1; // to match the y_min as we try to assert with expected_value

      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });

      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("y_min")).toEqual(expected_value);
    });

    test("When the y_min prop is updated, Then the y_min Vuex value is sent as prop of the child Waveform should update", async () => {
      const expected_value = 100;
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };

      let default_zoom_level_idx = 1; // to match the y_min as we try to assert with expected_value
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm initial state
      expect(waveform_wrapper.props("y_min")).toEqual(expected_value);
      const new_default_zoom_level_idx = 2;
      const new_expected_value = 200;

      store.commit("waveform/set_y_axis_zoom_idx", new_default_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update

      expect(waveform_wrapper.props("y_min")).toEqual(new_expected_value);
    });

    test("When initially mounted, Then the y_max Vuex is sent as prop of the child Waveform is 400 by default", () => {
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };

      let default_zoom_level_idx = 1; // to match the y_max as we try to assert with expected_value
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("y_max")).toEqual(400);
    });

    test("When initially mounted, Then the y_max Vuex is sent as prop of the child Waveform and asserted", () => {
      const expected_value = 300;
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };
      let default_zoom_level_idx = 2; // to match the y_max as we try to assert with expected_value
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });

      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("y_max")).toEqual(expected_value);
    });

    test("When the y_max prop is updated, Then the y_max Vuex value is passed as  prop to the child Waveform updates", async () => {
      const expected_value = 500;
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm initial state
      expect(waveform_wrapper.props("y_max")).toEqual(expected_value);

      const new_expected_value = 500;
      wrapper.setProps({ y_max: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("y_max")).toEqual(new_expected_value);
    });

    test("When initially mounted, Then the y_label prop is passed to the y_axis_label prop of the child Waveform", () => {
      const expected_value = "Tubular";
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
        y_label: expected_value,
      };

      let default_zoom_level_idx = 1;
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);
      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });

      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("y_axis_label")).toEqual(expected_value);
    });

    test("When the y_label prop is updated, Then the y_axis_label value of the prop in the child Waveform updates", async () => {
      const expected_value = "Why Axis";
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
        y_label: expected_value,
      };

      let default_zoom_level_idx = 1;
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);
      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm initial state
      expect(waveform_wrapper.props("y_axis_label")).toEqual(expected_value);

      const new_expected_value = "My Y Axis";
      wrapper.setProps({ y_label: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("y_axis_label")).toEqual(new_expected_value);
    });
  });

  describe("computing data to plot", () => {
    test("When Vuex has an empty array, Then an empty array is passed to the data_points prop of the child Waveform", () => {
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };

      let temp_datapoints = new Array(6);
      for (let i = 0; i < 6; i++) {
        temp_datapoints[i] = { x_data_points: [], y_data_points: [] };
      }

      store.commit("data/set_plate_waveforms", temp_datapoints);
      let default_zoom_level_idx = 1;
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);
      expect(waveform_wrapper.props("data_points")).toEqual([]);
    });

    test("When Vuex updates to have data, Then that data is passed to the data_points prop of the child Waveform", async () => {
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };

      let default_zoom_level_idx = 1;

      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);
      // confirm pre-condition
      expect(waveform_wrapper.props("data_points")).toEqual([]);

      let temp_datapoints = new Array(6);

      temp_datapoints[0] = {
        x_data_points: [0, 30, 40],
        y_data_points: [55, 75, 95],
      };

      store.commit("data/set_plate_waveforms", temp_datapoints);
      await wrapper.vm.$nextTick(); // wait for update

      expect(waveform_wrapper.props("data_points")).toEqual([
        [0, 55],
        [30, 75],
        [40, 95],
      ]);
    });
    test("Given Vuex has data and the Component is Mounted, When the plate_waveforms data is mutated to empty arrays, then an empty array is passed as a prop to the child Waveform", async () => {
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };
      let temp_datapoints = new Array(6);

      temp_datapoints[0] = {
        x_data_points: [0, 30, 40],
        y_data_points: [55, 75, 95],
      };
      store.commit("data/set_plate_waveforms", temp_datapoints);

      let default_zoom_level_idx = 1;
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);
      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      await wrapper.vm.$nextTick(); // wait for update
      const waveform_wrapper = wrapper.findComponent(Waveform);
      // confirm pre-condition
      expect(waveform_wrapper.props("data_points")).toEqual([
        [0, 55],
        [30, 75],
        [40, 95],
      ]);

      temp_datapoints = new Array(6);

      temp_datapoints[0] = {
        x_data_points: [],
        y_data_points: [],
      };
      store.commit("data/set_plate_waveforms", temp_datapoints);
      await wrapper.vm.$nextTick(); // wait for update

      expect(waveform_wrapper.props("data_points")).toEqual([]);
    });
    test("When Vuex has data for that waveform and the waveform index is not 0, Then that data is passed to the data_points prop of the child Waveform", async () => {
      const propsData = {
        display_waveform_idx: 1,
      };

      let temp_datapoints = new Array(6);

      temp_datapoints[1] = {
        x_data_points: [0, 25, 90],
        y_data_points: [60, 22, 44],
      };

      store.commit("data/set_plate_waveforms", temp_datapoints);

      let default_zoom_level_idx = 1;
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);
      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      await wrapper.vm.$nextTick(); // wait for update
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("data_points")).toEqual([
        [0, 60],
        [25, 22],
        [90, 44],
      ]);
    });
    test("When the current quadrant switches in Vuex, Then that data is passed to the data_points prop of the child Waveform", async () => {
      const propsData = {
        display_waveform_idx: 0,
      };

      let temp_datapoints = new Array(6);

      temp_datapoints[1] = {
        x_data_points: [0, 22, 95],
        y_data_points: [61, 29, 102],
      };

      store.commit("data/set_plate_waveforms", temp_datapoints);
      let default_zoom_level_idx = 1;
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      await wrapper.vm.$nextTick(); // wait for update
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm pre-condition
      expect(waveform_wrapper.props("data_points")).toEqual([]);

      const new_quadrant = [1, 5, 3, 2, 4, 0];
      store.commit("twentyfourcontrols/set_is_quadrant", new_quadrant);
      await wrapper.vm.$nextTick(); // wait for update

      expect(waveform_wrapper.props("data_points")).toEqual([
        [0, 61],
        [22, 29],
        [95, 102],
      ]);
    });
    test("When the x_time_index changes in Vuex, Then that slice of data is passed to the data_points prop of the child Waveform", async () => {
      const propsData = {
        display_waveform_idx: 0,
      };

      let temp_datapoints = new Array(6);

      temp_datapoints[0] = {
        x_data_points: [0, 22, 95],
        y_data_points: [61, 29, 102],
      };

      store.commit("data/set_plate_waveforms", temp_datapoints);

      let default_zoom_level_idx = 1;

      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      await wrapper.vm.$nextTick(); // wait for update
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm pre-condition
      expect(waveform_wrapper.props("data_points").length).toEqual(3);

      store.commit("playback/set_x_time_index", 25);
      await wrapper.vm.$nextTick(); // wait for update

      expect(waveform_wrapper.props("data_points")).toEqual([
        [22, 29],
        [95, 102],
      ]);
    });
    test("When the x_axis_sample_length prop changes, Then that slice of data is passed to the data_points prop of the child Waveform", async () => {
      const propsData = {
        display_waveform_idx: 0,
      };

      let temp_datapoints = new Array(6);

      temp_datapoints[0] = {
        x_data_points: [0, 22, 95],
        y_data_points: [61, 29, 102],
      };

      let default_zoom_level_idx = 1;

      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);

      store.commit("data/set_plate_waveforms", temp_datapoints);
      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      await wrapper.vm.$nextTick(); // wait for update
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm pre-condition
      expect(waveform_wrapper.props("data_points").length).toEqual(3);

      wrapper.setProps({ x_axis_sample_length: 20 });
      await wrapper.vm.$nextTick(); // wait for update

      expect(waveform_wrapper.props("data_points")).toEqual([
        [0, 61],
        [22, 29],
        [95, 102],
      ]);
    });
  });
});
