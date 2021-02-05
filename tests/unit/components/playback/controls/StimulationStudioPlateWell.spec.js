import { mount } from "@vue/test-utils";
import StimulationStudioPlateWell from "@/components/playback/controls/StimulationStudioPlateWell.vue";
import { StimulationStudioPlateWell as DistComponentToTest } from "@/dist/mantarray.common";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

describe("StimulationStudioPlateWell.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());
  test("When mounting StimulationStudioPlateWell from the build dist file, Then it loads successfully", async () => {
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
      store,
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
      store,
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
});
