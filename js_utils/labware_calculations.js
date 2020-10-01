"use strict";

export const WellTitle = function (row_range, column_range) {
  this.row_range = row_range;
  this.column_range = column_range;
  this.init("title");
};

WellTitle.prototype.init = function (name) {
  this.name = name;
};
WellTitle.prototype.validate_row_and_column_counts = function () {
  if (this.row_range >= 0 && this.row_range <= 18) {
    if (this.column_range >= 0 && this.column_range <= 36) {
      return { row_count: this.row_range, column_count: this.column_range };
    }
  }
  return { row_count: 0, column_count: 0 };
};

WellTitle.prototype._get_formatted_column_string = function (n, padding) {
  n = n + 1; // correction as we start from 1 anyways.
  if (padding) {
    return "0" + n;
  } else {
    return n.toString();
  }
};

WellTitle.prototype.get_well_name_from_row_and_column = function (
  row_num,
  column_num,
  padding
) {
  const row_char = String.fromCharCode(65 + row_num);
  const column_char = this._get_formatted_column_string(column_num, padding);

  return row_char + column_char;
};

WellTitle.prototype.get_row_and_column_from_well_index = function (well_idx) {
  const combo = {
    row_num: 0,
    column_num: 0,
  };
  const confirm_row_column = this.validate_row_and_column_counts();
  if (
    confirm_row_column.row_count != 0 &&
    confirm_row_column.coloumn_count != 0
  ) {
    combo.row_num = well_idx % confirm_row_column.row_count;
    combo.column_num = Math.floor(well_idx / confirm_row_column.row_count);
  }
  return combo;
};

WellTitle.prototype.get_well_name_from_well_index = function (
  well_idx,
  padding
) {
  let row_num = 0;
  let column_num = 0;
  const cell_combo = this.get_row_and_column_from_well_index(well_idx);

  row_num = cell_combo.row_num;
  column_num = cell_combo.column_num;

  return this.get_well_name_from_row_and_column(row_num, column_num, padding);
};
