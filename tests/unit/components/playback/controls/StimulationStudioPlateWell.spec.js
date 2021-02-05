import { mount } from "@vue/test-utils";
import StimulationStudioPlateWell from "@/components/playback/controls/StimulationStudioPlateWell.vue";
import { StimulationStudioPlateWell as DistComponentToTest } from "@/dist/mantarray.common";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();

describe("StimulationStudioPlateWell.vue", () => {
  afterEach(() => wrapper.destroy());
  test("When mounting StimulationStudioPlateWell from the built dist file, Then it loads successfully", async () => {
    const propsData = {
      classname: "'plate_0'",
      protocol_type: "''",
      svg_height: 72,
      svg_width: 72,
      circle_x: 36,
      circle_y: 36,
      radius: 28,
      strk: "'#1C1C1C'",
      protocol_fill: "'#B7B7B7'",
      stroke_wdth: 0,
      index: 0,
    };
    wrapper = mount(DistComponentToTest, {
      propsData,
      localVue,
    });
    const well = wrapper.findAll("circle");
    expect(well).toHaveLength(1);
  });
  test("Given that a protocol type is A is set index 0  and stroke_wdth = 4 as propsData, When the mounted successfully, Then validate that protocol Text A and color as provided is applied on the circle with white cirlce of 4px", async () => {
    const propsData = {
      classname: "'plate_0'",
      protocol_type: "'A'",
      svg_height: 72,
      svg_width: 72,
      circle_x: 36,
      circle_y: 36,
      radius: 28,
      strk: "'#FFFFFF'",
      protocol_fill: "'#19AC8A'",
      stroke_wdth: 4,
      index: 0,
    };
    wrapper = mount(StimulationStudioPlateWell, {
      propsData,
      localVue,
    });
    const protocol_name = wrapper.find(
      ".span__simulationstudio-plate-well-protocol-location"
    );
    const well_circle = wrapper.find("circle");

    expect(protocol_name.text()).toStrictEqual("'A'");
    expect(well_circle.attributes("fill")).toStrictEqual("'#19AC8A'");
    expect(well_circle.attributes("stroke")).toStrictEqual("'#FFFFFF'");
  });
  test("Given that a protocol type is A is set index -1  and stroke_wdth = 4 as propsData, When the mounted successfully, Then validate that protocol Text A and color as provided is applied on the circle with white cirlce of 4px", async () => {
    const propsData = {
      classname: "'plate_0'",
      protocol_type: "'A'",
      svg_height: 72,
      svg_width: 72,
      circle_x: 36,
      circle_y: 36,
      radius: 28,
      strk: "'#FFFFFF'",
      protocol_fill: "'#19AC8A'",
      stroke_wdth: 4,
      index: -1,
    };
    wrapper = mount(StimulationStudioPlateWell, {
      propsData,
      localVue,
    });
    const well = wrapper.findAll("circle");
    expect(well).toHaveLength(1);
  });
});
