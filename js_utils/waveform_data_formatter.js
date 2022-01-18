"use strict";

/**
 * Function to convert json object to indexed array
 * @param   {Object} the_json The json object
 * @return  {Array}  The array of two numbers
 */
function convert_from_json_of_sample_idx_and_value(the_json) {
  // javascript array of arrays takes up much more memory than numbers, so just have two separate arrays https://www.mattzeunert.com/2016/07/24/javascript-array-object-sizes.html
  const sample_idx_arr = new Array(the_json.length);
  const value_arr = new Array(the_json.length);
  the_json.forEach((this_json_data, this_json_idx) => {
    const this_sample_idx = parseInt(this_json_data.sample_idx);
    const this_value = parseFloat(this_json_data.value);

    sample_idx_arr[this_json_idx] = this_sample_idx;
    value_arr[this_json_idx] = this_value;
  });

  return { sample_indices: sample_idx_arr, values: value_arr };
}

/**
 * Function to convert json object to indexed array
 * @param   {array} arr the array
 * @param   {int}  sample_idx_to_match nearst matching idx
 * @return  {int}   closest idx value
 */
function find_closest_array_idx(arr, sample_idx_to_match) {
  // Modeled from https://stackoverflow.com/questions/22697936/binary-search-in-javascript
  // finds the array idx that has a sample idx >= the one searched for
  const max_idx = arr.findIndex((x_value) => x_value >= sample_idx_to_match);
  return max_idx;
}

/**
 * Function to convert json object to indexed array
 * @param   {array} x_array the array
 * @param   {array} y_array the array
 * @return  {array}  output_array combined array
 */
function convert_x_y_arrays_to_d3_array(x_array, y_array) {
  const output_array = [];
  for (let i = 0; i < x_array.length; i++) {
    output_array.push([x_array[i], y_array[i]]);
  }
  return output_array;
}

/**
 * Function to convert json object to indexed array
 * @param   {array} sample_indices the array
 * @param   {array} measured_values the array
 * @param   {int}  starting_sample_idx
 * @param   {int}  sample_duration_to_display combined array
 * @param   {int}  well_idx index
 * @return  {array} converted d3 array
 */
function get_array_slice_to_display(sample_indices, measured_values, starting_sample_idx) {
  const max_idx = sample_indices.findIndex((x_value) => x_value >= starting_sample_idx);

  const sliced_x_data_points = sample_indices.slice(max_idx);
  const sliced_y_data_points = measured_values.slice(max_idx);
  return { x_data_points: sliced_x_data_points, y_data_points: sliced_y_data_points };
}

/**
 * Function to convert json object to indexed array
 * @param   {Object} the_well_json the array
 * @param   {int}   well_num number
 * @return  {array} converted  array
 */
function convert_from_json_of_well_indices_and_x_y_arrays(the_well_json, well_num) {
  const first_simple_json_waveform = the_well_json["waveform_data_points"][well_num];

  const well_idx_arr = first_simple_json_waveform["x_data_points"];
  const well_value_arr = first_simple_json_waveform["y_data_points"];

  return { sample_indices: well_idx_arr, values: well_value_arr };
}

/**
 * Function to convert json object to indexed array
 * @param   {Object} the_well_json the array
 * @param   {int}   well_num number
 * @return  {array} converted  array
 */
function convert_from_json_of_well_indices_to_sparse_arrays(the_well_json, well_num) {
  const first_simple_json_waveform = the_well_json["waveform_data_points"][well_num];

  const temp_well_idx_arr = first_simple_json_waveform["x_data_points"];
  const temp_well_value_arr = first_simple_json_waveform["y_data_points"];

  const last_element_x_scale = temp_well_idx_arr[temp_well_idx_arr.length - 1];

  const well_value_sparse_arr = new Array(last_element_x_scale).fill(undefined);

  let count = 0;
  let i = 0;
  for (i = 0; i <= last_element_x_scale; i++) {
    const this_value = parseFloat(temp_well_value_arr[count]);
    const sparse_idx = parseInt(temp_well_idx_arr[count]);

    if (i == sparse_idx) {
      well_value_sparse_arr[sparse_idx] = this_value;
      count = count + 1;
    }
  }
  return { values: well_value_sparse_arr };
}

/**
 * Function to convert json object to indexed array
 * @param   {array} arr the array
 * @param   {int}   sample_idx_to_match number
 * @return  {int}   closest array index
 */
function find_closest_well_idx(arr, sample_idx_to_match) {
  return find_closest_array_idx(arr, sample_idx_to_match);
}

/**
 * Function to convert json object to indexed array
 * @param   {array} sample_indices the array
 * @param   {array} measured_values the array
 * @param   {int}  starting_sample_idx
 * @param   {int}  sample_duration_to_display combined array
 * @return  {array} converted d3 array
 */
function get_well_slice_to_display(
  sample_indices,
  measured_values,
  starting_sample_idx,
  sample_duration_to_display
) {
  return get_array_slice_to_display(
    sample_indices,
    measured_values,
    starting_sample_idx,
    sample_duration_to_display
  );
}

/**
 * Function to append an array
 * @param   {array} arr the array
 * @param   {array} new_arr the array
 * @return  {array} arr appended
 */
function append_well_data(arr, new_arr) {
  // const inner_object_waveform_data = new_arr.waveform_data;
  // const inner_object_basic_data = inner_object_waveform_data.basic_data;
  // const inner_object_waveform_data_points = inner_object_basic_data.waveform_data_points;
  const { waveform_data_points } = new_arr.waveform_data.basic_data;
  /* lint identifyies this as potential crash point as we not verifying if the
     inner_object_waveform_data_points is not null
     so with only if condition it allows so including the if condition as guard-for-in
     */

  for (const str_well_idx in waveform_data_points) {
    if (waveform_data_points != undefined) {
      const int_well_idx = parseInt(str_well_idx);
      Array.prototype.push.apply(
        arr[int_well_idx].x_data_points,
        waveform_data_points[str_well_idx].x_data_points
      );
      Array.prototype.push.apply(
        arr[int_well_idx].y_data_points,
        waveform_data_points[str_well_idx].y_data_points
      );
    }
  }

  return arr;
}

/**
 * Function to that returns a random, high-contrast color.
 * @return  {string} string hsla value
 */
function generate_random_color() {
  const random_hue = 1 + Math.floor(359 * Math.random());
  const random_sat = 90 + Math.floor(10 * Math.random());
  const random_light = 40 + Math.floor(20 * Math.random());

  // Random non-green with high saturation, around 50% lightness to remove black and whites, and 100% opacity.
  return `hsla(${random_hue}, ${random_sat}%, ${random_light}%, 1)`;
}

exports.convert_from_json_of_sample_idx_and_value = convert_from_json_of_sample_idx_and_value;
exports.find_closest_array_idx = find_closest_array_idx;
exports.get_array_slice_to_display = get_array_slice_to_display;
exports.convert_from_json_of_well_indices_and_x_y_arrays = convert_from_json_of_well_indices_and_x_y_arrays;
exports.convert_from_json_of_well_indices_to_sparse_arrays = convert_from_json_of_well_indices_to_sparse_arrays;
exports.find_closest_well_idx = find_closest_well_idx;
exports.get_well_slice_to_display = get_well_slice_to_display;
exports.convert_x_y_arrays_to_d3_array = convert_x_y_arrays_to_d3_array;
exports.append_well_data = append_well_data;
exports.generate_random_color = generate_random_color;
