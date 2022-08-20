import Waveform from "@/components/playback/waveform/Waveform.vue";
import { Waveform as dist_Waveform } from "@/dist/mantarray.common";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

import {
  get_x_axis_ticks_with_text,
  get_y_axis_ticks_with_text,
  get_waveform_line_pixel_coordinates_from_svg,
  convert_waveform_line_pixel_coordinates_to_expected_data,
} from "@curi-bio/frontend-test-utils";

import {
  convert_from_json_of_sample_idx_and_value,
  convert_x_y_arrays_to_d3_array,
} from "@/js_utils/waveform_data_formatter.js";
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

describe("Waveform.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());
  test("When mounted from the built dist file, Then it loads successfully", async () => {
    const propsData = {
      title: "A07",
    };

    wrapper = shallowMount(dist_Waveform, { store, localVue, propsData });
    expect(wrapper.find(".div__waveform-well-title").text()).toStrictEqual("A07");
  });

  test("When initially mounted, Then the text value in the DOM matches the title prop", () => {
    const expected_value = "C12";
    const propsData = {
      title: expected_value,
    };
    wrapper = shallowMount(Waveform, { store, localVue, propsData });

    expect(wrapper.find(".div__waveform-well-title").text()).toStrictEqual(expected_value);
  });

  test("When the title prop is updated, Then the text value in the DOM should update", async () => {
    const expected_value = "C12";
    const propsData = {
      title: expected_value,
    };
    wrapper = shallowMount(Waveform, { store, localVue, propsData });

    // confirm initial condition
    expect(wrapper.find(".div__waveform-well-title").text()).toStrictEqual(expected_value);
    const new_expected_value = "D12";
    wrapper.setProps({ title: new_expected_value });
    await wrapper.vm.$nextTick(); // wait for update

    expect(wrapper.find(".div__waveform-well-title").text()).toStrictEqual(new_expected_value);
  });

  test.each([true, false])(
    "When mounted with show_labels prop as %s, Then existence of axis and title elements will be %s",
    (bool) => {
      wrapper = shallowMount(Waveform, { store, localVue, propsData: { show_labels: bool } });

      expect(wrapper.find(".div__waveform-well-title").exists()).toBe(true);
      expect(wrapper.find(".div__waveform-x-axis-title").exists()).toBe(bool);
      expect(wrapper.find(".div__waveform-y-axis-title").exists()).toBe(bool);
    }
  );

  describe("x-axis", () => {
    const propsData = {
      title: "C12",
    };
    const x_axis_title_selector_text = ".div__waveform-x-axis-title";
    test("When initially mounted, Then the x-axis title matches the value provided in the prop", () => {
      const expected_value = "Lots of Time";
      propsData.x_axis_label = expected_value;
      wrapper = shallowMount(Waveform, { store, localVue, propsData });

      expect(wrapper.find(x_axis_title_selector_text).text()).toStrictEqual(expected_value);
    });

    test("When the x_axis_label prop is updated, Then the x-axis title updates", async () => {
      const expected_value = "Distance";
      propsData.x_axis_label = expected_value;
      wrapper = shallowMount(Waveform, { store, localVue, propsData });

      // confirm pre-condition
      expect(wrapper.find(x_axis_title_selector_text).text()).toStrictEqual(expected_value);

      const new_expected_value = "Frequency";
      wrapper.setProps({ x_axis_label: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.find(x_axis_title_selector_text).text()).toStrictEqual(new_expected_value);
    });

    test("When initially mounted, Then the left label of the x-axis should be 0 by default", () => {
      wrapper = shallowMount(Waveform, { store, localVue, propsData });

      const ticks_with_text = get_x_axis_ticks_with_text(wrapper);

      expect(ticks_with_text.at(0).text()).toStrictEqual("0.0");
    });

    test("When the x_axis_min prop is supplied, Then the x-axis label renders the appropriate number", async () => {
      const propsData = {
        title: "C12",
        x_axis_min: 1.1 * 1e6,
      };

      wrapper = shallowMount(Waveform, { store, localVue, propsData });

      const ticks_with_text = get_x_axis_ticks_with_text(wrapper);

      expect(ticks_with_text.at(0).text()).toStrictEqual("1.1");
    });

    test("When the x_axis_min prop is updated, Then the left label of the x-axis updates", async () => {
      const propsData = {
        title: "C12",
        x_axis_min: 0,
        tissue_data_points: [],
      };

      wrapper = shallowMount(Waveform, { store, localVue, propsData });

      const ticks_with_text_before = get_x_axis_ticks_with_text(wrapper);
      // confirm initial state
      expect(ticks_with_text_before.at(0).text()).toStrictEqual("0.0");

      wrapper.setProps({ x_axis_min: 10 * 1e6 });

      await wrapper.vm.$nextTick(); // wait for update
      const ticks_with_text_after = get_x_axis_ticks_with_text(wrapper);
      expect(ticks_with_text_after.at(0).text()).toStrictEqual("10.0");
    });

    test("When initially mounted, Then the right label of the x-axis matches the x_axis_sample_length value provided in props", () => {
      const propsData = {
        title: "C12",
        x_axis_sample_length: 4 * 1e6,
      };
      wrapper = shallowMount(Waveform, { store, localVue, propsData });

      const ticks_with_text = get_x_axis_ticks_with_text(wrapper);

      expect(ticks_with_text.at(ticks_with_text.length - 1).text()).toStrictEqual("4.0"); // Eli (2/2/20): D3 includes the comma by default...this is not stating an opinion that the comma should or should not be there...still TBD
    });

    test("When the x_axis_sample_length prop is updated, Then the right label of the x-axis is updated", async () => {
      const propsData = {
        title: "C12",
        x_axis_sample_length: 1 * 1e6,
      };
      wrapper = shallowMount(Waveform, { store, localVue, propsData });

      const ticks_with_text_before = get_x_axis_ticks_with_text(wrapper);
      // confirm initial state
      expect(ticks_with_text_before.at(ticks_with_text_before.length - 1).text()).toStrictEqual("1.0");

      wrapper.setProps({ x_axis_sample_length: 2 * 1e6 });
      await wrapper.vm.$nextTick(); // wait for update
      const ticks_with_text_after = get_x_axis_ticks_with_text(wrapper);
      expect(ticks_with_text_after.at(ticks_with_text_after.length - 1).text()).toStrictEqual("2.0");
    });
  });

  describe("y-axis", () => {
    const y_axis_title_selector_text = ".div__waveform-y-axis-title";
    test("When initially mounted, Then the y-axis title matches the value provided in the prop", () => {
      const expected_value = "Voltage";
      const propsData = { title: "C05", y_axis_label: expected_value };

      wrapper = shallowMount(Waveform, { store, localVue, propsData });

      expect(wrapper.find(y_axis_title_selector_text).text()).toStrictEqual(expected_value);
    });

    test("When the y_axis_label prop is updated, Then the y-axis title updates", async () => {
      const expected_value = "Temperature";
      const propsData = { title: "C04", y_axis_label: expected_value };
      wrapper = shallowMount(Waveform, { store, localVue, propsData });

      // confirm pre-condition
      expect(wrapper.find(y_axis_title_selector_text).text()).toStrictEqual(expected_value);

      const new_expected_value = "Frequency";
      wrapper.setProps({ y_axis_label: new_expected_value });
      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.find(y_axis_title_selector_text).text()).toStrictEqual(new_expected_value);
    });
    test("When initially mounted, Then the bottom label of the y-axis is 0 by default", () => {
      const propsData = {
        title: "C12",
      };
      wrapper = shallowMount(Waveform, { store, localVue, propsData });

      const ticks_with_text = get_y_axis_ticks_with_text(wrapper);

      expect(ticks_with_text.at(0).text()).toStrictEqual("0");
    });

    test("When initially mounted, Then the bottom label of the y-axis is set to the y_min value provided in props", () => {
      const propsData = {
        title: "C12",
        y_min: 1000,
      };
      wrapper = shallowMount(Waveform, { store, localVue, propsData });

      const ticks_with_text = get_y_axis_ticks_with_text(wrapper);

      expect(ticks_with_text.at(0).text()).toStrictEqual("1,000"); // Eli (2/2/20): D3 includes the comma by default...this is not stating an opinion that the comma should or should not be there...still TBD
    });

    test("When the y_min prop is updated, Then the bottom label of the y-axis is updated", async () => {
      const propsData = {
        title: "C12",
        y_min: 0,
      };
      wrapper = shallowMount(Waveform, { store, localVue, propsData });

      const ticks_with_text_before = get_y_axis_ticks_with_text(wrapper);
      // confirm initial state
      expect(ticks_with_text_before.at(0).text()).toStrictEqual("0");

      wrapper.setProps({ y_min: 1000 });
      await wrapper.vm.$nextTick(); // wait for update
      const ticks_with_text_after = get_y_axis_ticks_with_text(wrapper);
      expect(ticks_with_text_after.at(0).text()).toStrictEqual("1,000"); // Eli (6/16/20): D3 includes the comma by default...this is not stating an opinion that the comma should or should not be there...still TBD
    });

    test("When initially mounted, Then the top label of the y-axis is 400 by default", () => {
      const propsData = {
        title: "C12",
      };
      wrapper = shallowMount(Waveform, { store, localVue, propsData });

      const ticks_with_text = get_y_axis_ticks_with_text(wrapper);

      expect(ticks_with_text.at(ticks_with_text.length - 1).text()).toStrictEqual("400");
    });

    test("When initially mounted, Then the top label of the y-axis is set to the value of y_max provided in props", () => {
      const propsData = {
        title: "C12",
        y_max: 160,
      };
      wrapper = shallowMount(Waveform, { store, localVue, propsData });

      const ticks_with_text = get_y_axis_ticks_with_text(wrapper);

      expect(ticks_with_text.at(ticks_with_text.length - 1).text()).toStrictEqual("160");
    });

    test("When the y_max prop is updated, Then the top label of the y-axis is updated", async () => {
      const propsData = {
        title: "C12",
        y_max: 100,
      };
      wrapper = shallowMount(Waveform, { store, localVue, propsData });

      const ticks_with_text_before = get_y_axis_ticks_with_text(wrapper);
      // confirm initial state
      expect(ticks_with_text_before.at(ticks_with_text_before.length - 1).text()).toStrictEqual("100");

      wrapper.setProps({ y_max: 500 });
      await wrapper.vm.$nextTick(); // wait for update
      const ticks_with_text_after = get_y_axis_ticks_with_text(wrapper);
      expect(ticks_with_text_after.at(ticks_with_text_after.length - 1).text()).toStrictEqual("500");
    });
  });

  describe("Given x/y data are supplied that can be rendered in the waveform plot", () => {
    let propsData = null;
    let pixel_coords = null;
    let attributes_used_to_calculate_coords = null;
    const reduced_array_x = converted_array_x.slice(0, 19);
    const reduced_array_y = converted_array_y.slice(0, 19);
    const x_y_data = convert_x_y_arrays_to_d3_array(reduced_array_x, reduced_array_y);
    const stim_data = [
      [
        0,
        [
          [1000, 101000],
          [4000, 101000],
        ],
      ],
      [
        1,
        [
          [4000, 101000],
          [7000, 101000],
        ],
      ],
      [
        0,
        [
          [7000, 101000],
          [10000, 101000],
        ],
      ],
      [
        255,
        [
          [10000, 101000],
          [13000, 101000],
        ],
      ],
    ];
    const fill_colors = ["#000000", "#b7b7b7"];
    beforeEach(async () => {
      propsData = {
        title: "C12",
        tissue_data_points: x_y_data,
        stim_fill_assignments: stim_data,
        stim_fill_colors: fill_colors,
        x_axis_min: 0,
        x_axis_sample_length: 1 * 1e6,
        y_min: 0,
        y_max: 500,
        plot_area_pixel_height: 360,
        plot_area_pixel_width: 370,
        margin: { top: 10, right: 30, bottom: 30, left: 60 },
        well_idx: 3,
      };

      attributes_used_to_calculate_coords = propsData;
      attributes_used_to_calculate_coords["x_axis_min"] = 0;

      wrapper = shallowMount(Waveform, { store, localVue, propsData });
      await wrapper.vm.$nextTick(); // wait for update
      pixel_coords = get_waveform_line_pixel_coordinates_from_svg(wrapper);
    });

    test("When mounted, Then it orders the SVG elements so that any bleeding of the waveform line into the margins is covered up", async () => {
      expect(pixel_coords).toHaveLength(19);
      const svg_nodes = wrapper.findAll("#svg_of_waveform > g");

      expect(svg_nodes.wrappers[0].attributes("id")).toStrictEqual("stim_waveform_line_node");
      expect(svg_nodes.wrappers[1].attributes("id")).toStrictEqual("waveform_line_node");
      expect(svg_nodes.wrappers[2].attributes("id")).toStrictEqual("margin_blockers_node");
      expect(svg_nodes.wrappers[3].attributes("id")).toStrictEqual("x_axis_node");
      expect(svg_nodes.wrappers[4].attributes("id")).toStrictEqual("y_axis_node");
    });
    test("When mounted, Then it creates margin blockers of the appropriate size", async () => {
      expect(pixel_coords).toHaveLength(19);
      const blocker_node = wrapper.find("#margin_blockers_node");
      const blocker_nodes = blocker_node.findAll("rect");
      expect(blocker_nodes).toHaveLength(4);

      let this_blocker_node = blocker_node.find("#margin_blocker_left");
      expect(parseInt(this_blocker_node.attributes("x"))).toStrictEqual(-60);
      expect(parseInt(this_blocker_node.attributes("y"))).toStrictEqual(-10);
      expect(parseInt(this_blocker_node.attributes("width"))).toStrictEqual(60);
      expect(parseInt(this_blocker_node.attributes("height"))).toStrictEqual(400);

      this_blocker_node = blocker_node.find("#margin_blocker_right");
      expect(parseInt(this_blocker_node.attributes("x"))).toStrictEqual(371);
      expect(parseInt(this_blocker_node.attributes("y"))).toStrictEqual(-10);
      expect(parseInt(this_blocker_node.attributes("width"))).toStrictEqual(30);
      expect(parseInt(this_blocker_node.attributes("height"))).toStrictEqual(400);

      this_blocker_node = blocker_node.find("#margin_blocker_top");
      expect(parseInt(this_blocker_node.attributes("x"))).toStrictEqual(0);
      expect(parseInt(this_blocker_node.attributes("y"))).toStrictEqual(-10);
      expect(parseInt(this_blocker_node.attributes("width"))).toStrictEqual(371);
      expect(parseInt(this_blocker_node.attributes("height"))).toStrictEqual(10);

      this_blocker_node = blocker_node.find("#margin_blocker_bottom");
      expect(parseInt(this_blocker_node.attributes("x"))).toStrictEqual(-10);
      expect(parseInt(this_blocker_node.attributes("y"))).toStrictEqual(360);
      expect(parseInt(this_blocker_node.attributes("width"))).toStrictEqual(420);
      expect(parseInt(this_blocker_node.attributes("height"))).toStrictEqual(40);
    });

    test("When component is mounted, Then the line is drawn based on the initial props", async () => {
      expect(pixel_coords).toHaveLength(19);
      const calculated_data_from_pixels = convert_waveform_line_pixel_coordinates_to_expected_data(
        pixel_coords,
        wrapper.props()
      );
      expect(calculated_data_from_pixels[0]).toStrictEqual([0, 290.429978]);
      expect(calculated_data_from_pixels[18][0]).toStrictEqual(101000);
      expect(calculated_data_from_pixels[18][1]).toBeCloseTo(21.03262204, 4);
    });
    test("When the x_axis_min prop is updated, Then the plotted line is updated", async () => {
      // confirm initial condition
      expect(pixel_coords).toHaveLength(19);

      wrapper.setProps({ x_axis_min: 108002 });
      await wrapper.vm.$nextTick(); // wait for update

      const waveform_line_node = wrapper.find("#waveform_line_node");
      const waveform_line_paths = waveform_line_node.findAll("path");
      expect(waveform_line_paths).toHaveLength(1);

      pixel_coords = get_waveform_line_pixel_coordinates_from_svg(wrapper);
      expect(pixel_coords).toHaveLength(19);

      const calculated_data_from_pixels = convert_waveform_line_pixel_coordinates_to_expected_data(
        pixel_coords,
        wrapper.props()
      );

      expect(calculated_data_from_pixels[0][1]).toBeCloseTo(290.429978, 4);
      expect(calculated_data_from_pixels[14][0]).toBeCloseTo(79000.00000000001, 8);
      expect(calculated_data_from_pixels[14][1]).toBeCloseTo(84.90614533999998, 4);
    });
    test("When data_points prop is updated, Then the drawn line updates", async () => {
      // confirm initial condition
      expect(pixel_coords).toHaveLength(19);

      const reduced_array_x_2 = converted_array_x_2.slice(0, 17);
      const reduced_array_y_2 = converted_array_y_2.slice(0, 17);
      const x_y_data = convert_x_y_arrays_to_d3_array(reduced_array_x_2, reduced_array_y_2);

      await wrapper.setProps({
        tissue_data_points: x_y_data,
        x_axis_min: 500,
      });

      pixel_coords = get_waveform_line_pixel_coordinates_from_svg(wrapper);
      expect(pixel_coords).toHaveLength(17);

      const calculated_data_from_pixels = convert_waveform_line_pixel_coordinates_to_expected_data(
        pixel_coords,
        attributes_used_to_calculate_coords
      );

      expect(calculated_data_from_pixels[0][1]).toBeCloseTo(359.0517964, 4);
      expect(calculated_data_from_pixels[14][1]).toBeCloseTo(403.9590062, 4);
    });
    test("When stim data gets plotted, Then it will be filled with the color matching the corresponding subprotocol", async () => {
      const stim_waveform_line_node = wrapper.find("#stim_waveform_line_node");
      const stim_waveform_line_path = stim_waveform_line_node.findAll("path");

      expect(stim_waveform_line_path).toHaveLength(4);
      expect(stim_waveform_line_path.at(0).attributes().fill).toBe(fill_colors[0]);
      expect(stim_waveform_line_path.at(1).attributes().fill).toBe(fill_colors[1]);
      expect(stim_waveform_line_path.at(2).attributes().fill).toBe(fill_colors[0]);
      expect(stim_waveform_line_path.at(3).attributes().fill).toBe("none");
    });
    test("When there's no stim data, Then the stim waveform path will be removed", async () => {
      await wrapper.setProps({
        stim_fill_assignments: [],
        x_axis_min: 15000,
      });

      const stim_waveform_line_node = wrapper.find("#stim_waveform_line_node");
      const stim_waveform_line_path = stim_waveform_line_node.findAll("path");
      expect(stim_waveform_line_path).toHaveLength(0);
    });
  });
});
