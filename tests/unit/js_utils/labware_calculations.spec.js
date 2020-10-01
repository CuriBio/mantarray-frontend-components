import { WellTitle } from "@/js_utils/labware_calculations.js";
import { WellTitle as DistWellTitle } from "@/dist/mantarray.common";

const well_title_three_cross_four = new WellTitle(3, 4);
const well_title_eight_cross_twelve = new WellTitle(8, 12);
const well_title_sixteen_cross_twentyfour = new WellTitle(16, 24);

const well_title_six_cross_twelve = new DistWellTitle(6, 12);

describe("WellTitle.get_well_name_from_well_index", () => {
  test("Given a 3x4 plate, When called at index 0 with pad_zeros set to False, Then return the well name without extra zeros", () => {
    const title = well_title_three_cross_four.get_well_name_from_well_index(
      0,
      false
    );
    expect(title).toStrictEqual("A1");
  });

  test("Given a 3x4 plate, When called at index 0 with pad_zeros set to True, Then return the well name with a padded zero", () => {
    const title = well_title_three_cross_four.get_well_name_from_well_index(
      0,
      true
    );
    expect(title).toStrictEqual("A01");
  });

  test("Given a 8x12 plate, When called at the last well with pad_zeros set to False, Then return the well name without extra zeros", () => {
    const title = well_title_eight_cross_twelve.get_well_name_from_well_index(
      95,
      false
    );
    expect(title).toStrictEqual("H12");
  });

  test("Given a 16x24 plate, When called at a well not the first or last with pad_zeros set to False, Then return the well name without extra zeros", () => {
    const title = well_title_sixteen_cross_twentyfour.get_well_name_from_well_index(
      2,
      false
    );
    expect(title).toStrictEqual("C1");
  });

  test("Given a 6x12 plate, When called at a well not the first or the last with pad_zeros set to False, Then return the well name without extra zeros", () => {
    const title = well_title_six_cross_twelve.get_well_name_from_well_index(
      18,
      false
    );
    expect(title).toStrictEqual("A4");
  });

  test("Given a 6x12 plate, When called at the first well with pad_zeros set to True, Then return the well name with extra zeros", () => {
    const title = well_title_six_cross_twelve.get_well_name_from_well_index(
      0,
      true
    );
    expect(title).toStrictEqual("A01");
  });
});
