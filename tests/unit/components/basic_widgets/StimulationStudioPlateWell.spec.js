import { mount } from "@vue/test-utils";
import StimulationStudioPlateWell from "@/components/basic_widgets/StimulationStudioPlateWell.vue";
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
      stroke: "'#1C1C1C'",
      protocol_fill: "'#B7B7B7'",
      stroke_width: 0,
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
      stroke: "'#FFFFFF'",
      protocol_fill: "'#19AC8A'",
      stroke_width: 4,
      index: 0,
    };
    wrapper = mount(StimulationStudioPlateWell, {
      propsData,
      localVue,
    });
    const protocol_name = wrapper.find(".span__simulationstudio-plate-well-protocol-location");
    const well_circle = wrapper.find("circle");

    expect(protocol_name.text()).toStrictEqual("'A'");
    expect(well_circle.attributes("fill")).toStrictEqual("'#19AC8A'");
    expect(well_circle.attributes("stroke")).toStrictEqual("'#FFFFFF'");
  });
  test.each([
    ["too small", -1],
    ["too large", 24],
  ])(
    "When the index prop validator is called on a value that is %s (%s), Then it declares it invalid",
    async (test_description, test_index) => {
      // adapted from https://vueschool.io/articles/vuejs-tutorials/how-to-test-custom-prop-validators-in-vuejs/
      const validator = StimulationStudioPlateWell.props.index.validator;
      expect(validator(test_index)).toBe(false);
    }
  );

  test("Given the current well is not selected, When hovering over and leaving the well, Then events will be emitted to parent component", async () => {
    const propsData = {
      protocol_type: "''",
      stroke: "'#1C1C1C'",
      protocol_fill: "'#B7B7B7'",
      stroke_width: 0,
      index: 0,
    };
    wrapper = mount(StimulationStudioPlateWell, {
      propsData,
      localVue,
    });
    await wrapper.vm.on_enter_well(0);
    expect(wrapper.emitted("enter-well")).toBeTruthy();
    await wrapper.vm.on_leave_well(0);
    expect(wrapper.emitted("leave-well")).toBeTruthy();
  });

  test("Given the current well is not selected, When clicking or shift+clicking the well, Then events will be emitted to parent component", async () => {
    const propsData = {
      protocol_type: "''",
      stroke: "'#1C1C1C'",
      protocol_fill: "'#B7B7B7'",
      stroke_width: 0,
      index: 0,
    };
    wrapper = mount(StimulationStudioPlateWell, {
      propsData,
      localVue,
    });
    await wrapper.vm.on_click_exact(0);
    expect(wrapper.emitted("click-exact")).toBeTruthy();
    await wrapper.vm.on_click_shift_exact(0);
    expect(wrapper.emitted("click-shift-exact")).toBeTruthy();
  });

  test.each([
    [26, [0, 4, 8, 12, 16, 20]],
    [86, [1, 5, 9, 13, 17, 21]],
    [146, [2, 6, 10, 14, 18, 22]],
    [206, [3, 7, 11, 15, 19, 23]],
  ])(
    "When StimulationStudioPlateWell is mounted, Then the correct computed top placement should be assigned to each well",
    async (placement, wells) => {
      wells.map(async (well) => {
        const wrapper = mount(StimulationStudioPlateWell, {
          propsData: {
            index: well,
          },
          localVue,
        });
        expect(wrapper.vm.computed_top).toBe(placement);
      });
    }
  );

  test.each([
    [29, [0, 1, 2, 3]],
    [91, [4, 5, 6, 7]],
    [153, [8, 9, 10, 11]],
    [215, [12, 13, 14, 15]],
    [277, [16, 17, 18, 19]],
    [339, [20, 21, 22, 23]],
  ])(
    "When StimulationStudioPlateWell is mounted, Then the correct computed left placement should be assigned to each well",
    async (placement, wells) => {
      wells.map(async (well) => {
        const wrapper = mount(StimulationStudioPlateWell, {
          propsData: {
            index: well,
          },
          localVue,
        });
        expect(wrapper.vm.computed_left).toBe(placement);
      });
    }
  );
});
