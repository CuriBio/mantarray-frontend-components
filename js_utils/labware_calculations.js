"use strict";

/**
 * Add an extra leading zero when needed to the number (for use in the well name)
 *
 * @param {int} column_idx - The column index within the labware
 * @param {bool} padding - Whether to zero-pad the number in the well name
 * @return {string}
 */
function _get_formatted_column_string(column_idx, padding) {
  const column_number = column_idx + 1;
  if (padding) {
    return "0" + column_number;
  } else {
    return column_number.toString();
  }
}

/** Allows calculations to convert between row, column, well index, and well name for Labware Definitions */
export class WellTitle {
  /**
   * Take pixel coordinates from a drawing and convert it back to the x/y numerical values that should have been used to generate those pixel coordinates.
   *
   * @param {int} num_rows - The number of rows in the labware/plate
   * @param {int} num_columns - The number of columns in the labware/plate
   */
  constructor(num_rows, num_columns) {
    this.num_rows = num_rows;
    this.num_columns = num_columns;
  }

  /**
   * Take pixel coordinates from a drawing and convert it back to the x/y numerical values that should have been used to generate those pixel coordinates.
   *
   * @throws {Error} If row or column index outside acceptable range (0-36 and 0-18) up to a 1536 well plate.
   */
  validate_row_and_column_counts() {
    if (this.num_rows < 1 || this.num_rows > 18) {
      throw new Error(`Invalid number of rows: ${this.num_rows}`);
    }
    if (this.num_columns < 1 || this.num_columns > 36) {
      throw new Error(`Invalid number of columns: ${this.num_columns}`);
    }
  }

  /**
   * Get the well name from the row and column indices
   *
   * @param {int} row_idx - The row index within the labware
   * @param {int} column_idx - The column index within the labware
   * @param {bool} padding - Whether to zero-pad the number in the well name
   * @return {string}
   */
  get_well_name_from_row_and_column(row_idx, column_idx, padding) {
    const row_char = String.fromCharCode(65 + row_idx);
    const column_char = _get_formatted_column_string(column_idx, padding);
    return row_char + column_char;
  }

  /**
   * Get the row and column indices from the well index
   *
   * @param {int} well_idx - The well index within the labware
   * @return {Object} containing both the row index and well index (integers)
   */
  get_row_and_column_from_well_index(well_idx) {
    const combo = {
      row_num: 0,
      column_num: 0,
    };
    this.validate_row_and_column_counts();
    combo.row_num = well_idx % this.num_rows;
    combo.column_num = Math.floor(well_idx / this.num_rows);
    return combo;
  }

  /**
   * Get the alphanumeric well name from the well index
   *
   * @param {int} well_idx - The well index within the labware
   * @param {bool} padding - Whether to zero-pad the number in the well name
   * @return {string} containing both the row index and well index (integers)
   */
  get_well_name_from_well_index(well_idx, padding) {
    let row_idx = 0;
    let column_idx = 0;
    const cell_combo = this.get_row_and_column_from_well_index(well_idx);

    row_idx = cell_combo.row_num;
    column_idx = cell_combo.column_num;

    return this.get_well_name_from_row_and_column(row_idx, column_idx, padding);
  }

  /**
   * Get the well index from the row and column indices
   *
   * @param {int} row_idx - The row index within the labware
   * @param {int} column_idx - The column index within the labware
   * @return {int}
   */
  get_well_idx_from_row_and_column(row_idx, column_idx) {
    return column_idx * this.num_rows + row_idx;
  }
}
