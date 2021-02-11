import { mount } from "@vue/test-utils";
import StimulationStudioWidget from "@/components/plate_based_widgets/stimulationstudio/StimulationStudioWidget.vue";
import { StimulationStudioWidget as DistComponentToTest } from "@/dist/mantarray.common";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();

const color_series_hex_codes = ["#19AC8A", "#005470", "#f9d78c", "#df6147"];

describe("StimulationStudioWidget.vue", () => {
  afterEach(() => wrapper.destroy());
  test("When mounting StimulationStudioWidget from the built dist file, Then it loads successfully", async () => {
    const propsData = {
      protocol_codes: [],
    };
    wrapper = mount(DistComponentToTest, {
      propsData,
      localVue,
    });
    const well = wrapper.findAll("circle");
    expect(well).toHaveLength(24);
  });
  test("When mounted with protocol codes 0-25, Then representative wells are all colored teal", async () => {
    const protocol_list = Array.from(Array(26).keys());

    const propsData = {
      protocol_codes: protocol_list,
    };
    wrapper = mount(StimulationStudioWidget, {
      propsData,
      localVue,
    });
    const well = wrapper.findAll("circle");
    expect(well.at(0).attributes("fill")).toStrictEqual(
      color_series_hex_codes[0]
    );
    expect(well.at(19).attributes("fill")).toStrictEqual(
      color_series_hex_codes[0]
    );
  });
  test("When mounted without an explicitly supplied protocol_code prop, Then representative wells are all colored grey and without any displayed letter", async () => {
    const propsData = {};
    wrapper = mount(StimulationStudioWidget, {
      propsData,
      localVue,
    });
    const well = wrapper.findAll("circle");
    const protocol_name = wrapper.findAll(
      ".span__simulationstudio-plate-well-protocol-location"
    );
    expect(well.at(0).attributes("fill")).toStrictEqual("#B7B7B7");
    expect(protocol_name.at(0).text()).toStrictEqual("");
    expect(well.at(23).attributes("fill")).toStrictEqual("#B7B7B7");
    expect(protocol_name.at(23).text()).toStrictEqual("");
  });

  test("When mounted with protocol codes in the range 0-23, Then representative wells are all teal in color and display the letter corresponding to the protocol code", async () => {
    const protocol_list = Array.from(Array(24).keys());

    const propsData = {
      protocol_codes: protocol_list,
    };
    wrapper = mount(StimulationStudioWidget, {
      propsData,
      localVue,
    });
    const well = wrapper.findAll("circle");
    const protocol_name = wrapper.findAll(
      ".span__simulationstudio-plate-well-protocol-location"
    );
    expect(well.at(0).attributes("fill")).toStrictEqual(
      color_series_hex_codes[0]
    );
    expect(protocol_name.at(0).text()).toStrictEqual("A");
    expect(well.at(23).attributes("fill")).toStrictEqual(
      color_series_hex_codes[0]
    );
    expect(protocol_name.at(23).text()).toStrictEqual("X");
  });
  test("When mounted with protocol codes 24-47, Then the well color should change at the code 25/26 border and the displayed letter should reset to the beginning of the alphabet", async () => {
    const protocol_list = [];

    for (let i = 24; i < 48; i++) protocol_list.push(i);
    const propsData = {
      protocol_codes: protocol_list,
    };
    wrapper = mount(StimulationStudioWidget, {
      propsData,
      localVue,
    });
    const well = wrapper.findAll("circle");
    const protocol_name = wrapper.findAll(
      ".span__simulationstudio-plate-well-protocol-location"
    );
    const index_of_last_well_in_first_color_series = protocol_list.indexOf(25);
    const index_of_first_well_in_second_color_series = protocol_list.indexOf(
      26
    );
    expect(
      well.at(index_of_last_well_in_first_color_series).attributes("fill")
    ).toStrictEqual(color_series_hex_codes[0]);
    expect(
      protocol_name.at(index_of_last_well_in_first_color_series).text()
    ).toStrictEqual("Z");
    expect(
      well.at(index_of_first_well_in_second_color_series).attributes("fill")
    ).toStrictEqual(color_series_hex_codes[1]);
    expect(
      protocol_name.at(index_of_first_well_in_second_color_series).text()
    ).toStrictEqual("A");
  });
  test("When mounted with protocol codes 48-71, Then the well color should change at the code 51/52 border and the displayed letter should reset to the beginning of the alphabet", async () => {
    const protocol_list = [];

    for (let i = 48; i < 72; i++) protocol_list.push(i);
    const propsData = {
      protocol_codes: protocol_list,
    };
    wrapper = mount(StimulationStudioWidget, {
      propsData,
      localVue,
    });
    const well = wrapper.findAll("circle");
    const protocol_name = wrapper.findAll(
      ".span__simulationstudio-plate-well-protocol-location"
    );
    const index_of_last_well_in_second_color_series = protocol_list.indexOf(51);
    const index_of_first_well_in_third_color_series = protocol_list.indexOf(52);

    expect(
      well.at(index_of_last_well_in_second_color_series).attributes("fill")
    ).toStrictEqual(color_series_hex_codes[1]);
    expect(
      protocol_name.at(index_of_last_well_in_second_color_series).text()
    ).toStrictEqual("Z");
    expect(
      well.at(index_of_first_well_in_third_color_series).attributes("fill")
    ).toStrictEqual(color_series_hex_codes[2]);
    expect(
      protocol_name.at(index_of_first_well_in_third_color_series).text()
    ).toStrictEqual("A");
  });
  test("When mounted with protocol codes 72-95, Then the well color should change at the code 77/78 border and the displayed letter should reset to the beginning of the alphabet and the final well should have the correct letter & color", async () => {
    const protocol_list = [];

    for (let i = 72; i < 96; i++) protocol_list.push(i);
    protocol_list.push(0);

    const propsData = {
      protocol_codes: protocol_list,
    };
    wrapper = mount(StimulationStudioWidget, {
      propsData,
      localVue,
    });
    const well = wrapper.findAll("circle");
    const protocol_name = wrapper.findAll(
      ".span__simulationstudio-plate-well-protocol-location"
    );
    const index_of_last_well_in_third_color_series = protocol_list.indexOf(77);
    const index_of_first_well_in_fourth_color_series = protocol_list.indexOf(
      78
    );
    expect(
      well.at(index_of_last_well_in_third_color_series).attributes("fill")
    ).toStrictEqual(color_series_hex_codes[2]);
    expect(
      protocol_name.at(index_of_last_well_in_third_color_series).text()
    ).toStrictEqual("Z");
    expect(
      well.at(index_of_first_well_in_fourth_color_series).attributes("fill")
    ).toStrictEqual(color_series_hex_codes[3]);
    expect(
      protocol_name.at(index_of_first_well_in_fourth_color_series).text()
    ).toStrictEqual("A");
    expect(well.at(23).attributes("fill")).toStrictEqual(
      color_series_hex_codes[3]
    );
    expect(protocol_name.at(23).text()).toStrictEqual("R");
  });
  test("When mounted with an empty protocol code array, Then representative wells are all colored grey and without any displayed letter", async () => {
    const protocol_list = [];

    const propsData = {
      protocol_codes: protocol_list,
    };
    wrapper = mount(StimulationStudioWidget, {
      propsData,
      localVue,
    });
    const well = wrapper.findAll("circle");
    const protocol_name = wrapper.findAll(
      ".span__simulationstudio-plate-well-protocol-location"
    );
    expect(well.at(0).attributes("fill")).toStrictEqual("#B7B7B7");
    expect(protocol_name.at(0).text()).toStrictEqual("");
    expect(well.at(6).attributes("fill")).toStrictEqual("#B7B7B7");
    expect(protocol_name.at(6).text()).toStrictEqual("");
    expect(well.at(23).attributes("fill")).toStrictEqual("#B7B7B7");
    expect(protocol_name.at(23).text()).toStrictEqual("");
  });
});
