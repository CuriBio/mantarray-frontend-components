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

describe("ContinuousWaveform.vue", () => {
  beforeEach(async () => {
    store = await NuxtStore.createStore();
    const x_zoom_levels = [
      { x_scale: 30 * 1e6 },
      { x_scale: 15 * 1e6 },
      { x_scale: 5 * 1e6 },
      { x_scale: 2 * 1e6 },
      { x_scale: 1 * 1e6 },
    ];
    const default_x_zoom_level_idx = 1;
    store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
    store.commit("waveform/set_x_axis_zoom_idx", default_x_zoom_level_idx);
  });

  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  afterEach(() => wrapper.destroy());

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
      const expected_value = -15000000;
      const quadrant = [2, 3, 6, 7, 10, 11];
      store.commit("twentyfourcontrols/set_is_quadrant", quadrant);
      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);
      expect(waveform_wrapper.props("x_axis_min")).toBe(expected_value);
    });
    test("When x_time_index updates in Vuex, Then the x_axis_min prop passed to the child Waveform is the x_time_index minus the x_axis_sample_length", async () => {
      const expected_value = -15000000;
      const x_axis_sample_length = -1 * expected_value;

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);
      // confirm pre-condition
      expect(waveform_wrapper.props("x_axis_min")).toBe(expected_value);

      const new_expected_value = 2500;
      store.commit("playback/set_x_time_index", new_expected_value + x_axis_sample_length);
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("x_axis_min")).toBe(new_expected_value);
    });
    test("When first mounted, Then the data_points Vuex passed to the child Waveform contains the data prior to the current x_time_index", async () => {
      store.commit("playback/set_x_time_index", 100001);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);
      const temp_datapoints = new Array(6);
      store.state.data.stim_fill_colors[0] = ["hsla(100, 80%, 80%, .5)"];

      const temp_stim_data = {
        0: [[50000], [0]],
      };
      await store.dispatch("data/append_stim_waveforms", temp_stim_data);

      const temp_stim_data_2 = {
        0: [[150000], [0]],
      };
      await store.dispatch("data/append_stim_waveforms", temp_stim_data_2);

      temp_datapoints[0] = {
        x_data_points: [0, 30, 50000, 100000, 125000, 150000],
        y_data_points: [55, 75, 95, 88, 92, 84],
      };

      store.commit("data/set_plate_waveforms", temp_datapoints);
      await wrapper.vm.$nextTick(); // wait for update

      expect(waveform_wrapper.props("tissue_data_points")).toStrictEqual([
        [0, 55],
        [30, 75],
        [50000, 95],
        [100000, 88],
        [125000, 92],
      ]);
    });
    test("Given some data existing in the store and the x_time_index set forward so that data should be displayed and the ContinuousWaveform is mounted, When append_plate_waveforms is committed, Then the data_points prop passed to the child Waveform is updated to contain both the old and the new appended data", async () => {
      store.commit("playback/set_x_time_index", 60000);

      const temp_datapoints = new Array(6).fill({ x_data_points: [], y_data_points: [] });

      temp_datapoints[0] = {
        x_data_points: [0, 30, 500, 1000, 1250, 1500],
        y_data_points: [55, 75, 95, 88, 92, 84],
      };

      store.commit("data/set_plate_waveforms", temp_datapoints);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      await wrapper.vm.$nextTick(); // wait for update
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm pre-condition
      expect(waveform_wrapper.props("tissue_data_points")).toStrictEqual([
        [0, 55],
        [30, 75],
        [500, 95],
        [1000, 88],
        [1250, 92],
        [1500, 84],
      ]);

      store.dispatch("data/append_plate_waveforms", cr);

      await wrapper.vm.$nextTick(); // wait for update
      // confirm the values updated in Vuex

      const waveform_data_points = waveform_wrapper.props("tissue_data_points");

      expect(waveform_data_points).toStrictEqual([
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
    test("Given there is data past the zero timepoint, When first mounted, Then all timepoints are set for the data_points prop passed to the child Waveform", async () => {
      const temp_datapoints = new Array(6);

      temp_datapoints[0] = {
        x_data_points: [0, 30, 50000, 100000, 125000, 150000],
        y_data_points: [54, 75, 95, 88, 92, 84],
      };

      store.commit("data/set_plate_waveforms", temp_datapoints);
      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      await wrapper.vm.$nextTick(); // wait for update
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("tissue_data_points")).toStrictEqual([[0, 54]]);
    });
  });
  test("When well title is supplied as a internal well_title function using display_waveform_idx value, Then the child Waveform displays it", async () => {
    const expected_value = "B06";
    const propsData = {
      display_waveform_idx: 5 /* the value of B06 is in the quadrant 2  [12, 13, 16, 17, 20, 21] */,
    };

    const quadrant = [12, 13, 16, 17, 20, 21];
    store.commit("twentyfourcontrols/set_is_quadrant", quadrant);
    wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
    await wrapper.vm.$nextTick(); // wait for update

    expect(wrapper.find(".div__waveform-well-title").text()).toBe(expected_value);
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
    expect(waveform_wrapper.props("title")).toBe(expected_value);

    const new_expected_value = "C04";
    quadrant = [14, 15, 18, 19, 22, 23]; /* the value of C04 is in the quadrant 4  [14, 15, 18, 19, 22, 23] */
    store.commit("twentyfourcontrols/set_is_quadrant", quadrant);
    wrapper.setProps({ display_waveform_idx: 0 });

    await wrapper.vm.$nextTick(); // wait for update

    expect(waveform_wrapper.props("title")).toBe(new_expected_value);
  });

  describe("misc props passing to child waveform", () => {
    const propsData = { display_waveform_idx: 0 };
    test("When initially mounted, Then the line_color is passed as a prop to the child Waveform, Then When prop is updated Then the child prop also updates", async () => {
      const expected_value = "#FF00FF";
      propsData.tissue_line_color = expected_value;

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("tissue_line_color")).toBe(expected_value);

      const new_expected_value = "#F0F0F0";
      wrapper.setProps({ tissue_line_color: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("tissue_line_color")).toBe(new_expected_value);
    });
    test("When initially mounted, Then the plot_area_pixel_height is passed as a prop to the child Waveform, Then When prop is updated Then the child prop also updates", async () => {
      const expected_value = 351;
      propsData.plot_area_pixel_height = expected_value;

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("plot_area_pixel_height")).toBe(expected_value);

      const new_expected_value = 357;
      wrapper.setProps({ plot_area_pixel_height: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("plot_area_pixel_height")).toBe(new_expected_value);
    });
    test("When initially mounted, Then the plot_area_pixel_width is passed as a prop to the child Waveform, Then When prop is updated Then the child prop also updates", async () => {
      const expected_value = 401;
      propsData.plot_area_pixel_width = expected_value;

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("plot_area_pixel_width")).toBe(expected_value);

      const new_expected_value = 399;
      wrapper.setProps({ plot_area_pixel_width: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("plot_area_pixel_width")).toBe(new_expected_value);
    });
    test("When initially mounted, Then the samples_per_second is passed as a prop to the child Waveform, Then When prop is updated Then the child prop also updates", async () => {
      const expected_value = 100001;
      propsData.samples_per_second = expected_value;

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("samples_per_second")).toBe(expected_value);

      const new_expected_value = 999999;
      wrapper.setProps({ samples_per_second: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("samples_per_second")).toBe(new_expected_value);
    });
    test("When initially mounted, Then the margin is passed as a prop to the child Waveform, Then When prop is updated Then the child prop also updates", async () => {
      const expected_value = { top: 11, right: 19, bottom: 29, left: 61 };
      propsData.margin = expected_value;

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("margin")).toBe(expected_value);

      const new_expected_value = { top: 9, right: 21, bottom: 31, left: 59 };
      wrapper.setProps({ margin: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("margin")).toBe(new_expected_value);
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
      const expected_value = 5 * 1e6;
      store.commit("playback/set_x_time_index", expected_value);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("x_axis_min")).toBe(expected_value);
    });

    test("When x_time_index is updated in Vuex, Then the x_axis_min prop in the child Waveform is updated", async () => {
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };
      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm initial state
      expect(waveform_wrapper.props("x_axis_min")).toBe(0);

      const expected_value = 10 * 1e6;
      store.commit("playback/set_x_time_index", expected_value);

      await wrapper.vm.$nextTick(); // wait for update

      expect(waveform_wrapper.props("x_axis_min")).toBe(expected_value);
    });

    test("When initially mounted, Then the x_axis_sample_length from Vuex is passed as a prop to the child Waveform", () => {
      const expected_value = 2 * 1e6;
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };
      const default_x_zoom_level_idx = 3;
      store.commit("waveform/set_x_axis_zoom_idx", default_x_zoom_level_idx);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("x_axis_sample_length")).toBe(expected_value);
    });

    test("When the x_axis_sample_length from Vuex is updated, Then the x_axis_sample_length prop of the child Waveform is updated", async () => {
      const expected_value = 1 * 1e6;
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };

      let default_x_zoom_level_idx = 4;
      store.commit("waveform/set_x_axis_zoom_idx", default_x_zoom_level_idx);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);
      // confirm initial state
      expect(waveform_wrapper.props("x_axis_sample_length")).toBe(expected_value);
      const new_expected_value = 2 * 1e6;

      default_x_zoom_level_idx = 3;
      store.commit("waveform/set_x_axis_zoom_idx", default_x_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("x_axis_sample_length")).toBe(new_expected_value);
    });

    test("When initially mounted, Then the x_label prop is passed to the x_axis_label prop of the child Waveform", () => {
      const expected_value = "Miles";
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
        x_label: expected_value,
      };

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });

      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("x_axis_label")).toBe(expected_value);
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
      expect(waveform_wrapper.props("x_axis_label")).toBe(expected_value);

      const new_expected_value = "My X Axis";
      wrapper.setProps({ x_label: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("x_axis_label")).toBe(new_expected_value);
    });
  });

  describe("y-axis", () => {
    test("When initially mounted, Then the y_min Vuex is sent as prop of the child Waveform should be 0 by default", () => {
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };
      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("y_min")).toBe(0);
    });

    test("When initially mounted, Then the y_min Vuex is sent as prop to the child Waveform", () => {
      const expected_value = 0;
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });

      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("y_min")).toBe(expected_value);
    });

    test("When the y_min prop is updated, Then the y_min Vuex value should remain above -200 and is sent as prop of the child Waveform should update", async () => {
      const expected_value = 0;
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm initial state
      expect(waveform_wrapper.props("y_min")).toBe(expected_value);

      const new_range = { min: 100, max: 200, midpoint: 150 };
      store.commit("waveform/set_y_axis", new_range);
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("y_min")).toBe(new_range.min);

      const min_range = { min: -300, max: 200, midpoint: -50 };
      store.commit("waveform/set_y_axis", min_range);
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("y_min")).toBe(-200);
    });

    test("When initially mounted, Then the y_max Vuex is sent as prop of the child Waveform is 300 by default", () => {
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("y_max")).toBe(300);
    });

    test("When the y_max prop is updated, Then the y_max Vuex value will remain below 100000 and is passed as  prop to the child Waveform updates", async () => {
      const expected_value = 300;
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm initial state
      expect(waveform_wrapper.props("y_max")).toBe(expected_value);

      const new_expected_value = 200;

      const new_range = { min: 100, max: 200, midpoint: 100000 };
      store.commit("waveform/set_y_axis", new_range);
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("y_max")).toBe(new_expected_value);

      const max_range = { min: 90000, max: 110000, midpoint: 150 };
      store.commit("waveform/set_y_axis", max_range);
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("y_max")).toBe(100000);
    });

    test("When the y_min and y_max props are update to decimal numbers, Then the axis bounds should update correctly", async () => {
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm initial state
      expect(waveform_wrapper.props("y_min")).toBe(0);
      expect(waveform_wrapper.props("y_max")).toBe(300);

      const new_range = { min: 10, max: 10.1, midpoint: 10.05 };
      store.commit("waveform/set_y_axis", new_range);
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("y_min")).toBe(new_range.min);
      expect(waveform_wrapper.props("y_max")).toBe(new_range.max);
    });

    test("When initially mounted, Then the y_label prop is passed to the y_axis_label prop of the child Waveform", () => {
      const expected_value = "Tubular";
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
        y_label: expected_value,
      };

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });

      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("y_axis_label")).toBe(expected_value);
    });

    test("When the y_label prop is updated, Then the y_axis_label value of the prop in the child Waveform updates", async () => {
      const expected_value = "Why Axis";
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
        y_label: expected_value,
      };

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm initial state
      expect(waveform_wrapper.props("y_axis_label")).toBe(expected_value);

      const new_expected_value = "My Y Axis";
      wrapper.setProps({ y_label: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update
      expect(waveform_wrapper.props("y_axis_label")).toBe(new_expected_value);
    });
  });

  describe("computing data to plot", () => {
    test("When Vuex has an empty array, Then an empty array is passed to the data_points prop of the child Waveform", () => {
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };

      const temp_datapoints = new Array(6);
      for (let i = 0; i < 6; i++) {
        temp_datapoints[i] = { x_data_points: [], y_data_points: [] };
      }

      store.commit("data/set_plate_waveforms", temp_datapoints);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);
      expect(waveform_wrapper.props("tissue_data_points")).toStrictEqual([]);
    });

    test("When Vuex updates to have data, Then that data is passed to the data_points prop of the child Waveform", async () => {
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      const waveform_wrapper = wrapper.findComponent(Waveform);
      // confirm pre-condition
      expect(waveform_wrapper.props("tissue_data_points")).toStrictEqual([]);

      const temp_datapoints = new Array(6);

      temp_datapoints[0] = {
        x_data_points: [0, 30, 40],
        y_data_points: [55, 75, 95],
      };

      store.commit("data/set_plate_waveforms", temp_datapoints);
      await wrapper.vm.$nextTick(); // wait for update

      expect(waveform_wrapper.props("tissue_data_points")).toStrictEqual([
        [0, 55],
        [30, 75],
        [40, 95],
      ]);
    });
    test("Given Vuex has data and the Component is Mounted, When the plate_waveforms data is mutated to empty arrays, then an empty array is passed as a prop to the child Waveform", async () => {
      const propsData = {
        display_waveform_idx: 0 /* pointing to A01 */,
      };
      let temp_datapoints = new Array(6).fill({ x_data_points: [], y_data_points: [] });

      temp_datapoints[0] = {
        x_data_points: [0, 30, 40],
        y_data_points: [55, 75, 95],
      };
      store.commit("data/set_plate_waveforms", temp_datapoints);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      await wrapper.vm.$nextTick(); // wait for update
      const waveform_wrapper = wrapper.findComponent(Waveform);
      // confirm pre-condition
      expect(waveform_wrapper.props("tissue_data_points")).toStrictEqual([
        [0, 55],
        [30, 75],
        [40, 95],
      ]);

      temp_datapoints = new Array(6).fill({ x_data_points: [], y_data_points: [] });

      temp_datapoints[0] = {
        x_data_points: [],
        y_data_points: [],
      };
      store.commit("data/set_plate_waveforms", temp_datapoints);
      await wrapper.vm.$nextTick(); // wait for update

      expect(waveform_wrapper.props("tissue_data_points")).toStrictEqual([]);
    });
    test("When Vuex has data for that waveform and the waveform index is not 0, Then that data is passed to the data_points prop of the child Waveform", async () => {
      const propsData = {
        display_waveform_idx: 1,
      };

      const temp_datapoints = new Array(6).fill({ x_data_points: [], y_data_points: [] });

      temp_datapoints[1] = {
        x_data_points: [0, 25, 90],
        y_data_points: [60, 22, 44],
      };

      store.commit("data/set_plate_waveforms", temp_datapoints);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      await wrapper.vm.$nextTick(); // wait for update
      const waveform_wrapper = wrapper.findComponent(Waveform);

      expect(waveform_wrapper.props("tissue_data_points")).toStrictEqual([
        [0, 60],
        [25, 22],
        [90, 44],
      ]);
    });
    test("When the current quadrant switches in Vuex, Then that data is passed to the data_points prop of the child Waveform", async () => {
      const propsData = {
        display_waveform_idx: 0,
      };

      const temp_datapoints = new Array(6).fill({ x_data_points: [], y_data_points: [] });

      temp_datapoints[1] = {
        x_data_points: [0, 22, 95],
        y_data_points: [61, 29, 102],
      };

      store.commit("data/set_plate_waveforms", temp_datapoints);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      await wrapper.vm.$nextTick(); // wait for update
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm pre-condition
      expect(waveform_wrapper.props("tissue_data_points")).toStrictEqual([]);

      const new_quadrant = [1, 5, 3, 2, 4, 0];
      store.commit("twentyfourcontrols/set_is_quadrant", new_quadrant);
      await wrapper.vm.$nextTick(); // wait for update

      expect(waveform_wrapper.props("tissue_data_points")).toStrictEqual([
        [0, 61],
        [22, 29],
        [95, 102],
      ]);
    });
    test("When the x_time_index changes in Vuex, Then that slice of data is passed to the data_points prop of the child Waveform", async () => {
      const propsData = {
        display_waveform_idx: 0,
      };

      const temp_datapoints = new Array(6).fill({ x_data_points: [], y_data_points: [] });

      temp_datapoints[0] = {
        x_data_points: [0, 22, 95],
        y_data_points: [61, 29, 102],
      };

      store.commit("data/set_plate_waveforms", temp_datapoints);

      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      await wrapper.vm.$nextTick(); // wait for update
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm pre-condition
      store.commit("playback/set_x_time_index", 25);
      await wrapper.vm.$nextTick(); // wait for update

      expect(waveform_wrapper.props("tissue_data_points")).toStrictEqual([
        [22, 29],
        [95, 102],
      ]);
    });
    test("When the x_axis_sample_length prop changes, Then that slice of data is passed to the data_points prop of the child Waveform", async () => {
      const propsData = {
        display_waveform_idx: 0,
      };

      const temp_datapoints = new Array(6).fill({ x_data_points: [], y_data_points: [] });

      temp_datapoints[0] = {
        x_data_points: [0, 22, 95],
        y_data_points: [61, 29, 102],
      };

      store.commit("data/set_plate_waveforms", temp_datapoints);
      wrapper = mount(ContinuousWaveform, { propsData, store, localVue });
      await wrapper.vm.$nextTick(); // wait for update
      const waveform_wrapper = wrapper.findComponent(Waveform);

      // confirm pre-condition
      wrapper.setProps({ x_axis_sample_length: 20 });
      await wrapper.vm.$nextTick(); // wait for update

      expect(waveform_wrapper.props("tissue_data_points")).toStrictEqual([
        [0, 61],
        [22, 29],
        [95, 102],
      ]);
    });
  });
});
