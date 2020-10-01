import {
  convert_from_json_of_well_indices_and_x_y_arrays,
  convert_from_json_of_well_indices_to_sparse_arrays,
  find_closest_well_idx,
} from "@/js_utils/waveform_data_formatter.js";

const mantarray_six_well_simulated_json = require("@/tests/sample_waveform_data/mantarray/lambda_6_waveform.json");

// old method of waveform representation
const well_num = 0;
const converted_well_values = convert_from_json_of_well_indices_and_x_y_arrays(
  mantarray_six_well_simulated_json,
  well_num
);

const converted_well_array_x = converted_well_values.sample_indices;
const converted_well_array_y = converted_well_values.values;

// sparse array implementation
const converted_well_sparse_values = convert_from_json_of_well_indices_to_sparse_arrays(
  mantarray_six_well_simulated_json,
  well_num
);

const converted_well_sparse_array_y = converted_well_sparse_values.values;

describe("waveform_lambda_formatter.js", () => {
  test("When calling convert_from_json_of_well_indices_and_x_y_arrays on JSON data, Then the output should be a 2D array of int/float", () => {
    expect(converted_well_array_x).toHaveLength(2378);
    expect(converted_well_array_y).toHaveLength(2378);
    expect(converted_well_array_y[0]).toStrictEqual(230.417297);
    expect(converted_well_array_x[0]).toStrictEqual(0);
    expect(converted_well_array_y[2377]).toStrictEqual(271.8017183);
    expect(converted_well_array_x[2377]).toStrictEqual(11985000);
  });
  test("When called on the JSON data, Then the output should be a 1D array of float in the from of sparse array", () => {
    expect(converted_well_sparse_array_y).toHaveLength(11985001);
    expect(converted_well_sparse_array_y[0]).toStrictEqual(230.417297);
    expect(converted_well_sparse_array_y[1]).toBeUndefined();
    expect(converted_well_sparse_array_y[200]).toBeUndefined();
    expect(converted_well_sparse_array_y[3000]).toStrictEqual(253.2833321);
    expect(converted_well_sparse_array_y[11985000]).toStrictEqual(271.8017183); // remember the index is equal to 11985000 as its sparse array
  });
});

describe("find_closest_well_idx", () => {
  test("When called at the exact value at the beginning of the array (0), Then it returns the index zero", () => {
    const idx = find_closest_well_idx(converted_well_array_x, 0);
    expect(idx).toStrictEqual(0);
  });
});
