import { WellTitle } from "@/js_utils/labware_calculations.js";
import { WellTitle as LabwareDefinition } from "@/js_utils/labware_calculations.js"; // creating alias now for eventual transition to calling it LabwareDefinition (to match Python)
import { WellTitle as DistWellTitle } from "@/dist/mantarray.common";

const well_title_three_cross_four = new WellTitle(3, 4);
const well_title_eight_cross_twelve = new WellTitle(8, 12);
const well_title_sixteen_cross_twentyfour = new WellTitle(16, 24);

const well_title_six_cross_twelve = new DistWellTitle(6, 12);
describe("LabwareDefinition", () => {
  test("Given a 3x4 plate, When called at index 0 with pad_zeros set to False, Then return the well name without extra zeros", () => {
    const title = well_title_three_cross_four.get_well_name_from_well_index(0, false);
    expect(title).toStrictEqual("A1");
  });

  test("Given a 3x4 plate, When called at index 0 with pad_zeros set to True, Then return the well name with a padded zero", () => {
    const title = well_title_three_cross_four.get_well_name_from_well_index(0, true);
    expect(title).toStrictEqual("A01");
  });

  test("Given a 8x12 plate, When called at the last well with pad_zeros set to False, Then return the well name without extra zeros", () => {
    const title = well_title_eight_cross_twelve.get_well_name_from_well_index(95, false);
    expect(title).toStrictEqual("H12");
  });

  test("Given a 16x24 plate, When called at a well not the first or last with pad_zeros set to False, Then return the well name without extra zeros", () => {
    const title = well_title_sixteen_cross_twentyfour.get_well_name_from_well_index(2, false);
    expect(title).toStrictEqual("C1");
  });

  test("Given a 6x12 plate, When called at a well not the first or the last with pad_zeros set to False, Then return the well name without extra zeros", () => {
    const title = well_title_six_cross_twelve.get_well_name_from_well_index(18, false);
    expect(title).toStrictEqual("A4");
  });

  test("Given a 6x12 plate, When called at the first well with pad_zeros set to True, Then return the well name with extra zeros", () => {
    const title = well_title_six_cross_twelve.get_well_name_from_well_index(0, true);
    expect(title).toStrictEqual("A01");
  });

  test.each([
    [4, 6, 0, 0, 0],
    [4, 6, 23, 3, 5],
    [4, 6, 10, 2, 2],
    [8, 12, 0, 0, 0],
    [8, 12, 95, 7, 11],
    [8, 12, 27, 3, 3],
  ])(
    "Given a LabwareDefinition with %s rows and %s columns, When get_row_and_column_from_well_index is called with well index %s, Then the correct well rows and columns are returned",
    async (labware_num_rows, labware_num_columns, well_idx_to_test, expected_row, expected_column) => {
      const test_definition = new LabwareDefinition(labware_num_rows, labware_num_columns);
      const actual_return = test_definition.get_row_and_column_from_well_index(well_idx_to_test);
      expect(actual_return.row_num).toStrictEqual(expected_row);
      expect(actual_return.column_num).toStrictEqual(expected_column);
    }
  );

  test.each([
    [0, 6, "Invalid number of rows: 0"],
    [-1, 9, "Invalid number of rows: -1"],
    [3, 0, "Invalid number of columns: 0"],
    [19, 2, "Invalid number of rows: 19"],
    [4, 37, "Invalid number of columns: 37"],
  ])(
    "Given a LabwareDefinition with %s rows and %s columns, When validate_row_and_column_counts is called, Then it throws an error",
    async (labware_num_rows, labware_num_columns, expected_error_match) => {
      const test_definition = new LabwareDefinition(labware_num_rows, labware_num_columns);
      expect(() => {
        test_definition.validate_row_and_column_counts();
      }).toThrow(expected_error_match);
    }
  );

  test.each([
    [4, 6, 0, 0, 0],
    [4, 6, 3, 5, 23],
    [4, 6, 2, 2, 10],
    [8, 12, 0, 0, 0],
    [8, 12, 7, 11, 95],
    [8, 12, 3, 3, 27],
  ])(
    "Given a LabwareDefinition with %s rows and %s columns, When get_well_idx_from_row_and_column is called with row %s and column %s, Then the correct well index is returned",
    async (labware_num_rows, labware_num_columns, row_to_test, column_to_test, expected_idx) => {
      const test_definition = new LabwareDefinition(labware_num_rows, labware_num_columns);
      const actual = test_definition.get_well_idx_from_row_and_column(row_to_test, column_to_test);
      expect(actual).toStrictEqual(expected_idx);
    }
  );
});
