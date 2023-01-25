import { mount } from "@vue/test-utils";
import StimulationStudioWidget from "@/components/plate_based_widgets/stimulationstudio/StimulationStudioWidget.vue";
import { StimulationStudioWidget as ComponentToTest } from "@/dist/mantarray.common";
import { createLocalVue } from "@vue/test-utils";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);
let NuxtStore;
let store;

describe("StimulationStudioWidget.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting StimulationStudioWidget from the built dist file, Then it loads successfully", async () => {
    const propsData = {
      protocol_codes: [],
    };
    const wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    expect(wrapper.exists()).toBe(true);
  });

  test("When mounted without an explicitly supplied protocol_code prop, Then representative wells are all colored grey and without any displayed letter", async () => {
    const propsData = {};
    const wrapper = mount(StimulationStudioWidget, {
      propsData,
      store,
      localVue,
    });
    const well = wrapper.findAll("circle");
    const protocol_name = wrapper.findAll(".span__simulationstudio-plate-well-protocol-location");
    expect(well.at(0).attributes("fill")).toStrictEqual("#B7B7B7");
    expect(protocol_name.at(0).text()).toStrictEqual("");
    expect(well.at(23).attributes("fill")).toStrictEqual("#B7B7B7");
    expect(protocol_name.at(23).text()).toStrictEqual("");
  });

  test("When mounted with an empty protocol code array, Then representative wells are all colored grey and without any displayed letter", async () => {
    const protocol_list = [];

    const propsData = {
      protocol_codes: protocol_list,
    };
    const wrapper = mount(StimulationStudioWidget, {
      propsData,
      store,
      localVue,
    });
    const well = wrapper.findAll("circle");
    const protocol_name = wrapper.findAll(".span__simulationstudio-plate-well-protocol-location");
    expect(well.at(0).attributes("fill")).toStrictEqual("#B7B7B7");
    expect(protocol_name.at(0).text()).toStrictEqual("");
    expect(well.at(6).attributes("fill")).toStrictEqual("#B7B7B7");
    expect(protocol_name.at(6).text()).toStrictEqual("");
    expect(well.at(23).attributes("fill")).toStrictEqual("#B7B7B7");
    expect(protocol_name.at(23).text()).toStrictEqual("");
  });

  test("Given that none of the wells are selected, minus button should not be visible and stroke outlines should be zero on all wells, When user clicks the plus button, Then all 24 wells should have a stroke outline", async () => {
    const propsData = {
      protocol_codes: [],
    };
    const wrapper = mount(StimulationStudioWidget, {
      propsData,
      store,
      localVue,
    });
    const icon_btn = wrapper.find(".span__stimulationstudio-toggle-plus-minus-icon");
    const svg_plus = wrapper.find("#plus");
    const svg_minus = wrapper.find("#minus");
    expect(svg_plus.isVisible()).toBe(true);
    wrapper.vm.stroke_width.map((well) => {
      expect(well).toBe(0);
    });
    expect(svg_minus.isVisible()).toBe(false);
    await icon_btn.trigger("click");
    expect(svg_plus.isVisible()).toBe(false);
    wrapper.vm.stroke_width.map((well) => {
      expect(well).toBe(4);
    });
    expect(svg_minus.isVisible()).toBe(true);
  });

  test("Given all wells are selected, When well, column, or row is unselected, Then minus icon should toggle to plus", async () => {
    const propsData = {
      protocol_codes: [],
    };
    const wrapper = mount(StimulationStudioWidget, {
      propsData,
      store,
      localVue,
    });
    await wrapper.find(".span__stimulationstudio-toggle-plus-minus-icon").trigger("click");
    expect(wrapper.find("#plus").isVisible()).toBe(false);
    await wrapper.vm.basic_select(4);
    expect(wrapper.find("#plus").isVisible()).toBe(true);
    await wrapper.find(".span__stimulationstudio-toggle-plus-minus-icon").trigger("click");
    await wrapper.find("#column_3").trigger("click");
    expect(wrapper.find("#plus").isVisible()).toBe(true);
    await wrapper.find(".span__stimulationstudio-toggle-plus-minus-icon").trigger("click");
    await wrapper.find("#row_3").trigger("click");
    expect(wrapper.find("#plus").isVisible()).toBe(true);
  });

  // test("Given all wells become selected, Then plus icon should toggle to minus", async () => {});

  test("Given no wells are selected in a row/column, When user hovers over row/column label, Then corresponding unselected wells will show stroke-width of 2px", async () => {
    const propsData = {
      protocol_codes: [],
    };
    const wrapper = mount(StimulationStudioWidget, {
      propsData,
      store,
      localVue,
    });
    Object.keys(wrapper.vm.column_values).map(async (column) => {
      await wrapper.find("#column_" + column).trigger("mouseenter");
      wrapper.vm.column_values[column].map((well) => expect(wrapper.vm.stroke_width[well]).toBe(2));
    });
    ["A", "B", "C", "D"].map(async (row, i) => {
      await wrapper.find("#row_" + i).trigger("mouseenter");
      wrapper.vm.row_values[row].map((well) => expect(wrapper.vm.stroke_width[well]).toBe(2));
    });
  });

  test("Given no wells are selected in a row/column, When user leaves a row/column label, Then corresponding unselected wells will show stroke-width of 0px", async () => {
    const propsData = {
      protocol_codes: [],
    };
    const wrapper = mount(StimulationStudioWidget, {
      propsData,
      store,
      localVue,
    });
    Object.keys(wrapper.vm.column_values).map(async (column) => {
      await wrapper.find("#column_" + column).trigger("mouseleave");
      wrapper.vm.column_values[column].map((well) => expect(wrapper.vm.stroke_width[well]).toBe(0));
    });
    ["A", "B", "C", "D"].map(async (row, i) => {
      await wrapper.find("#row_" + i).trigger("mouseleave");
      wrapper.vm.row_values[row].map((well) => expect(wrapper.vm.stroke_width[well]).toBe(0));
    });
  });

  test("Given no wells are selected, When user shift+clicks a row label, Then corresponding unselected wells will toggle stroke-width of 4px and 0px", async () => {
    const wrapper = mount(StimulationStudioWidget, {
      store,
      localVue,
    });
    const test = [
      ["#row_0", [0, 4, 8, 12, 16, 20]],
      ["#row_1", [1, 5, 9, 13, 17, 21]],
      ["#row_2", [2, 6, 10, 14, 18, 22]],
      ["#row_3", [3, 7, 11, 15, 19, 23]],
    ];
    test.map(async (row) => {
      await wrapper.find(row[0]).trigger("click", { shiftKey: true });
      row[1].map((well) => expect(wrapper.vm.stroke_width[well]).toBe(4));
    });
  });

  test("Given no wells are selected, When user shift+clicks a column label, Then corresponding unselected wells will toggle stroke-width of 4px and 0px", async () => {
    const wrapper = mount(StimulationStudioWidget, {
      store,
      localVue,
    });
    const test = [
      ["#column_1", [0, 1, 2, 3]],
      ["#column_2", [4, 5, 6, 7]],
      ["#column_3", [8, 9, 10, 11]],
      ["#column_4", [12, 13, 14, 15]],
      ["#column_5", [16, 17, 18, 19]],
      ["#column_6", [20, 21, 22, 23]],
    ];
    test.map(async (column) => {
      await wrapper.find(column[0]).trigger("click", { shiftKey: true });
      column[1].map((well) => expect(wrapper.vm.stroke_width[well]).toBe(4));
    });
  });

  test("When there is a change to all_selected wells, Then commit the mutation to state to the store", async () => {
    const wrapper = mount(StimulationStudioWidget, {
      store,
      localVue,
    });
    await wrapper.vm.basic_select(3);
    expect(store.state.stimulation.selected_wells).toStrictEqual([3]);
  });

  test("When an unselected well is hovered over and left, Then the events should emit functions to parent components", async () => {
    const wrapper = mount(StimulationStudioWidget, {
      store,
      localVue,
    });
    const test = wrapper.findAll("circle");
    for (let i = 0; i < 24; i++) {
      expect(test.at(i).trigger("mouseenter")).toBeTruthy();
      expect(test.at(i).trigger("mouseleave")).toBeTruthy();
    }
  });

  test("Given that no wells are selected, When user Shift+Click on the well, Then then events should emit functions to parent components", async () => {
    const wrapper = mount(StimulationStudioWidget, {
      store,
      localVue,
    });
    const test = wrapper.findAll("circle");

    for (let i = 0; i < 24; i++) {
      expect(test.at(i).trigger("click", { shiftKey: true })).toBeTruthy();
      expect(test.at(i).trigger("click", { shiftKey: true })).toBeTruthy();
    }
  });

  test("Given any number of wells, but all are selected, When plus-minus icon is hovered over and left, Then all unselected wells should have a stroke width of 2", async () => {
    const wrapper = mount(StimulationStudioWidget, {
      store,
      localVue,
    });
    await wrapper.find(".span__stimulationstudio-toggle-plus-minus-icon").trigger("mouseenter");
    wrapper.vm.stroke_width.map((well) => {
      expect(well).toBe(2);
    });
    await wrapper.find(".span__stimulationstudio-toggle-plus-minus-icon").trigger("mouseleave");
    wrapper.vm.stroke_width.map((well) => {
      expect(well).toBe(0);
    });
  });

  test("When mutation occurs to clear or apply protocols, Then the assignments in StimulationStudioWidget will change and rerender immediately", async () => {
    const wrapper = mount(StimulationStudioWidget, {
      store,
      localVue,
    });
    await store.dispatch("stimulation/handle_selected_wells", [false, true, false, false]);
    await store.commit("stimulation/apply_selected_protocol", 2);
    expect(wrapper.vm.protocol_assignments).toBe(store.state.stimulation.protocol_assignments);
  });
  test("When stim's stim_status gets updated to SHORT_CIRCUIT_ERROR, Then StimulationStudioWidget will become disabled", async () => {
    const wrapper = mount(StimulationStudioWidget, {
      store,
      localVue,
    });
    await store.commit("stimulation/set_stim_status", STIM_STATUS.SHORT_CIRCUIT_ERROR);
    expect(wrapper.find(".div__simulationstudio-disable-overlay").isVisible()).toBe(true);
  });

  test("When exiting instance, Then instance is effectively destroyed", async () => {
    const destroyed_spy = jest.spyOn(StimulationStudioWidget, "beforeDestroy");
    const wrapper = mount(StimulationStudioWidget, {
      store,
      localVue,
    });
    wrapper.destroy();
    expect(destroyed_spy).toHaveBeenCalled();
  });
});
