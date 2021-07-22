import {
  convert_from_json_of_sample_idx_and_value,
  find_closest_array_idx,
  get_array_slice_to_display,
  append_well_data,
} from "@/js_utils/waveform_data_formatter.js";

import data_store_module from "@/store/modules/data";

const mantarray_single_well_simulated_45_seconds_json = require("@/tests/sample_waveform_data/mantarray/single_well/simulated_45_seconds.json");

const converted_values = convert_from_json_of_sample_idx_and_value(
  mantarray_single_well_simulated_45_seconds_json
);
const converted_array_x = converted_values.sample_indices;
const converted_array_y = converted_values.values;
import { arry, new_arry } from "./waveform_data_provider.js";

const ar = arry;
const nr = new_arry;

describe("waveform_data_formatter.js", () => {
  test("When calling convert_from_json_of_sample_idx_and_value on JSON data, Then the output should be a 2D array of int/float", () => {
    expect(converted_array_x).toHaveLength(767);
    expect(converted_array_y).toHaveLength(767);
    expect(converted_array_y[0]).toStrictEqual(290.429978);
    expect(converted_array_x[0]).toStrictEqual(0);
    expect(converted_array_y[766]).toStrictEqual(265.7930649);
    expect(converted_array_x[766]).toStrictEqual(3994000);
  });

  describe("find_closest_array_idx", () => {
    test("When called at the exact value at the beginning of the array (0), Then it returns the index zero", () => {
      const idx = find_closest_array_idx(converted_array_x, 0);
      expect(idx).toStrictEqual(0);
    });

    test("When called at the exact highest value in the array, Then it returns the last index in the array", () => {
      const idx = find_closest_array_idx(converted_array_x, 3994000);
      expect(idx).toStrictEqual(766);
    });

    test("When called at a value near the beginning of the array in between two samples, Then it returns the next index in the array", () => {
      const idx = find_closest_array_idx(converted_array_x, 3001);
      expect(idx).toStrictEqual(2);
    });
    test("When called at a value near the end of the array in between two samples, Then it returns the next index in the array", () => {
      const idx = find_closest_array_idx(converted_array_x, 3950999);
      expect(idx).toStrictEqual(755);
    });
    test("When called at a value higher than the highest value in the array, Then it returns the last index in the array", () => {
      const idx = find_closest_array_idx(converted_array_x, 3994001);
      expect(idx).toStrictEqual(766);
    });
  });

  describe("get_array_slice_to_display", () => {
    test("When called with starting and ending values exactly matching values in the array, Then it returns a slice inclusive of those indices", () => {
      const arr = get_array_slice_to_display(converted_array_x, converted_array_y, 0, 70000);
      expect(arr).toHaveLength(13);
      expect(arr[0][0]).toStrictEqual(0);
      expect(arr[arr.length - 1][0]).toStrictEqual(70000);
    });
    test("When called with an end value higher than the highest value in the array, Then it returns a slice ending at the last index in the array", () => {
      const arr = get_array_slice_to_display(converted_array_x, converted_array_y, 3981000, 3995000);
      expect(arr).toHaveLength(4);
      expect(arr[0][0]).toStrictEqual(3981000);
      expect(arr[arr.length - 1][0]).toStrictEqual(3994000);
    });
    test("When called with a starting value in between two elements in the array, Then it returns a slice beginning with the index of the value lower than the starting value", () => {
      const arr = get_array_slice_to_display(converted_array_x, converted_array_y, 1, 69999);
      expect(arr).toHaveLength(13);
      expect(arr[0][0]).toStrictEqual(0);
      expect(arr[arr.length - 1][0]).toStrictEqual(70000);
    });

    test("When called with starting and ending values in between elements in the array, Then it returns extra elements on both sides of the slice", () => {
      const arr = get_array_slice_to_display(converted_array_x, converted_array_y, 1, 69998);
      expect(arr).toHaveLength(13);
      expect(arr[0][0]).toStrictEqual(0);
      expect(arr[arr.length - 1][0]).toStrictEqual(70000);
    });
    test("When the starting search space is negative but reaches zero, Then it still returns the first element", () => {
      const arr = get_array_slice_to_display([0, 50], [200, 300], -70000, 70000);
      expect(arr).toHaveLength(1);
      expect(arr[0][0]).toStrictEqual(0);
      expect(arr[0][1]).toStrictEqual(200);
    });
    test("When waveform data object is appended with existing waveform data object, Then the returned value is the correct length", () => {
      const lar = append_well_data(ar, nr);
      expect(lar[0].x_data_points).toHaveLength(8);
    });
    test("When append_well_data is called to add new data to the Vuex store initial state, Then the Response data is appended to the correct well indices", () => {
      const initial_vuex_state = data_store_module.state().plate_waveforms;
      const new_array = append_well_data(initial_vuex_state, nr);

      expect(new_array[0].x_data_points).toHaveLength(4);
      expect(new_array[0].x_data_points[3]).toStrictEqual(52000);
      expect(new_array[0].y_data_points[3]).toStrictEqual(138.4825657);

      expect(new_array[3].x_data_points[2]).toStrictEqual(36000);
      expect(new_array[3].y_data_points[2]).toStrictEqual(118.6318554);
    });
  });
});
