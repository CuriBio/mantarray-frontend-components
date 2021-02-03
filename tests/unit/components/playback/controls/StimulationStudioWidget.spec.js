import { mount } from "@vue/test-utils";
import StimulationStudioWidget from "@/components/playback/controls/StimulationStudioWidget.vue";
import { StimulationStudioWidget as DistComponentToTest } from "@/dist/mantarray.common";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

describe("StimulationStudioWidget.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());
  test("When mounting StimulationStudioWidget from the build dist file, Then it loads successfully", async () => {
    const propsData = {
      protocol_code: [],
    };
    wrapper = mount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const well = wrapper.findAll("circle");
    expect(well).toHaveLength(24);
  });
  test("Given the StimulationStudioWidget is in the range of 0 - 25, When mounted successfully, Then verify that Stimulation Plate Well is teal color and Alphabets A-X is visible", async () => {
    const protocol_list = Array.from(Array(26).keys());

    const propsData = {
      protocol_code: protocol_list,
    };
    wrapper = mount(StimulationStudioWidget, {
      propsData,
      store,
      localVue,
    });
    const well = wrapper.findAll("circle");
    expect(well.at(0).attributes("fill")).toStrictEqual("#19AC8A");
  });
  test("Given the StimulationStudioWidget is in the range of 0 - 23, When mounted successfully, Then verify that Stimulation Plate Well is teal color and Alphabets A-X is visible", async () => {
    const protocol_list = Array.from(Array(24).keys());

    const propsData = {
      protocol_code: protocol_list,
    };
    wrapper = mount(StimulationStudioWidget, {
      propsData,
      store,
      localVue,
    });
    const well = wrapper.findAll("circle");
    const protocol_name = wrapper.findAll(
      ".span__simulationstudio-plate-well-protocol-location"
    );
    expect(well.at(0).attributes("fill")).toStrictEqual("#19AC8A");
    expect(protocol_name.at(0).text()).toStrictEqual("A");
    expect(well.at(23).attributes("fill")).toStrictEqual("#19AC8A");
    expect(protocol_name.at(23).text()).toStrictEqual("X");
  });
  test("Given the StimulationStudioWidget is in the range of 24 - 48, When mounted successfully, Then verify that Stimulation Plate Well is teal color(at 0) and blue color(at 23) and Alphabets Y-V is visible", async () => {
    const protocol_list = [];

    for (let i = 24; i < 48; i++) protocol_list.push(i);
    const propsData = {
      protocol_code: protocol_list,
    };
    wrapper = mount(StimulationStudioWidget, {
      propsData,
      store,
      localVue,
    });
    const well = wrapper.findAll("circle");
    const protocol_name = wrapper.findAll(
      ".span__simulationstudio-plate-well-protocol-location"
    );
    expect(well.at(0).attributes("fill")).toStrictEqual("#19AC8A");
    expect(protocol_name.at(0).text()).toStrictEqual("Y");
    expect(well.at(23).attributes("fill")).toStrictEqual("#005470");
    expect(protocol_name.at(23).text()).toStrictEqual("V");
  });
  test("Given the StimulationStudioWidget is in the range of 48 - 71, When mounted successfully, Then verify that Stimulation Plate Well is blue color(at 0) and yellow color(at 23) and Alphabets W-V is visible", async () => {
    const protocol_list = [];

    for (let i = 48; i < 72; i++) protocol_list.push(i);
    const propsData = {
      protocol_code: protocol_list,
    };
    wrapper = mount(StimulationStudioWidget, {
      propsData,
      store,
      localVue,
    });
    const well = wrapper.findAll("circle");
    const protocol_name = wrapper.findAll(
      ".span__simulationstudio-plate-well-protocol-location"
    );
    expect(well.at(0).attributes("fill")).toStrictEqual("#005470");
    expect(protocol_name.at(0).text()).toStrictEqual("W");
    expect(well.at(23).attributes("fill")).toStrictEqual("#f9d78c");
    expect(protocol_name.at(23).text()).toStrictEqual("T");
  });
  test("Given the StimulationStudioWidget is in the range of 72 - 96, When mounted successfully, Then verify that Stimulation Plate Well is yellow color(at 0) and orange color(at 23) and Alphabets W-V is visible", async () => {
    const protocol_list = [];

    for (let i = 72; i < 95; i++) protocol_list.push(i);
    protocol_list.push(0);

    const propsData = {
      protocol_code: protocol_list,
    };
    wrapper = mount(StimulationStudioWidget, {
      propsData,
      store,
      localVue,
    });
    const well = wrapper.findAll("circle");
    const protocol_name = wrapper.findAll(
      ".span__simulationstudio-plate-well-protocol-location"
    );
    expect(well.at(0).attributes("fill")).toStrictEqual("#f9d78c");
    expect(protocol_name.at(0).text()).toStrictEqual("U");
    expect(well.at(6).attributes("fill")).toStrictEqual("#df6147");
    expect(protocol_name.at(6).text()).toStrictEqual("A");
    expect(well.at(23).attributes("fill")).toStrictEqual("#19AC8A");
    expect(protocol_name.at(23).text()).toStrictEqual("A");
  });
  test("Given the StimulationStudioWidget is null, When mounted successfully, Then verify that Stimulation Plate Well is grey color(at 0)  and No Alphabets are visible", async () => {
    const protocol_list = [];

    const propsData = {
      protocol_code: protocol_list,
    };
    wrapper = mount(StimulationStudioWidget, {
      propsData,
      store,
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
