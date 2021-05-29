import { mount } from "@vue/test-utils";
import StimulationStudioWidget from "@/components/plate_based_widgets/stimulationstudio/StimulationStudioWidget.vue";
import { StimulationStudioWidget as ComponentToTest } from "@/dist/mantarray.common";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);
let NuxtStore;
let store;

// const color_series_hex_codes = ["#19AC8A", "#005470", "#f9d78c", "#df6147"];

describe("StimulationStudioWidget.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  // afterEach(() => wrapper.destroy());

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

    // const well = wrapper.findAll("circle");
    // expect(well).toHaveLength(24);
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
    await wrapper.vm.on_select(3, "column");
    expect(wrapper.find("#plus").isVisible()).toBe(true);
    await wrapper.find(".span__stimulationstudio-toggle-plus-minus-icon").trigger("click");
    await wrapper.vm.on_select("D", "row");
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

    Object.keys(wrapper.vm.row_values).map(async (row) => {
      await wrapper.find("#row_" + row).trigger("mouseenter");
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

    Object.keys(wrapper.vm.row_values).map(async (row) => {
      await wrapper.find("#row_" + row).trigger("mouseleave");
      wrapper.vm.row_values[row].map((well) => expect(wrapper.vm.stroke_width[well]).toBe(0));
    });
  });

  test.each([
    [[0, 4, 8, 12, 16, 20], "#row_A"],
    [[1, 5, 9, 13, 17, 21], "#row_B"],
    [[2, 6, 10, 14, 18, 22], "#row_C"],
    [[3, 7, 11, 15, 19, 23], "#row_D"],
    [[0, 1, 2, 3], "#column_1"],
    [[4, 5, 6, 7], "#column_2"],
    [[8, 9, 10, 11], "#column_3"],
    [[12, 13, 14, 15], "#column_4"],
    [[16, 17, 18, 19], "#column_5"],
    [[20, 21, 22, 23], "#column_6"],
  ])(
    "Given that any wells are selected, When user Shift+clicks the Row/Column button or any individual well, Then wells corresponding are seleced with outline of 4px;",
    async (array_of_well_indices, selector_str) => {
      const wrapper = mount(StimulationStudioWidget, {
        store,
        localVue,
      });

      await wrapper.find(selector_str).trigger("click", {
        shiftKey: true, // For testing @click.shift handlers
      });

      array_of_well_indices.map((well) => expect(wrapper.vm.stroke_width[well]).toBe(4));
    }
  );

  test("Given that any wells are selected, When user Shift+clicks the Row/Column button or any individual well, Then wells corresponding are seleced with outline of 4px", async () => {
    const wrapper = mount(StimulationStudioWidget, {
      store,
      localVue,
    });
    new Array(24).map(async (well) => {
      await wrapper.find().trigger("click", {
        shiftKey: true, // For testing @click.shift handlers
      });
      expect(wrapper.vm.sroke_width[well]).toBe(4);
    });
  });

  test("When there is a change to all_selected wells, Then commit the change in state to the store", async () => {
    const wrapper = mount(StimulationStudioWidget, {
      store,
      localVue,
    });
    wrapper.vm.all_select[3] = true;
    expect(store.state.stimulation.selected_wells).toStrictEqual([3]);
  });
  // test("Given no wells are selected in a row/column, When user clicks and unclicks a row/column label, Then corresponding unselected wells will toggle a stroke-width of 4px and 0px", async () => {
  //   const propsData = {
  //     protocol_codes: []
  //   };
  //   const wrapper = mount(StimulationStudioWidget, {
  //     propsData,
  //     store,
  //     localVue
  //   });
  //   const selector = {
  //     COLUMNS: [1, 2, 3, 4, 5, 6],
  //     ROWS: ["A", "B", "C", "D"]
  //   };

  //   selector.COLUMNS.map(async column => {
  //     await wrapper.find("#column_" + column).trigger("click");
  //     wrapper.vm.column_values[column].map(well => expect(wrapper.vm.stroke_width[well]).toBe(4));
  //     // await wrapper.find("#column_" + column).trigger("click");
  //     // wrapper.vm.column_values[column].map(well => expect(wrapper.vm.stroke_width[well]).toBe(0));
  //   });

  //   // Object.keys(wrapper.vm.column_values).map(async column => {
  //   //   await wrapper.find("#column_" + column).trigger("click");
  //   //   wrapper.vm.column_values[column].map(well => expect(wrapper.vm.stroke_width[well]).toBe(0));
  //   // });

  //   // Object.keys(wrapper.vm.row_values).map(async row => {
  //   //   await wrapper.find("#row_" + row).trigger("click");
  //   //   wrapper.vm.row_values[row].map(well => expect(wrapper.vm.stroke_width[well]).toBe(4));
  //   // });

  //   // Object.keys(wrapper.vm.row_values).map(async row => {
  //   //   await wrapper.find("#row_" + row).trigger("click");
  //   //   wrapper.vm.row_values[row].map(well => expect(wrapper.vm.stroke_width[well]).toBe(0));
  //   // });
  // });

  // test("", async () => {});
  // test("", async () => {});
  // test("", async () => {});
  // test("", async () => {});
  // test("When mounted with protocol codes 0-25, Then representative wells are all colored teal", async () => {
  //   const protocol_list = Array.from(Array(26).keys());

  //   const propsData = {
  //     protocol_codes: protocol_list
  //   };
  //   wrapper = mount(StimulationStudioWidget, {
  //     propsData,
  //     localVue
  //   });
  //   const well = wrapper.findAll("circle");
  //   expect(well.at(0).attributes("fill")).toStrictEqual(color_series_hex_codes[0]);
  //   expect(well.at(19).attributes("fill")).toStrictEqual(color_series_hex_codes[0]);
  // });

  // test("When mounted with protocol codes 0-25, Then representative wells are all colored teal", async () => {
  //   const protocol_list = Array.from(Array(26).keys());

  //   const propsData = {
  //     protocol_codes: protocol_list
  //   };
  //   wrapper = mount(StimulationStudioWidget, {
  //     propsData,
  //     localVue
  //   });
  //   const well = wrapper.findAll("circle");
  //   expect(well.at(0).attributes("fill")).toStrictEqual(color_series_hex_codes[0]);
  //   expect(well.at(19).attributes("fill")).toStrictEqual(color_series_hex_codes[0]);
  // });

  // test("When mounted with protocol codes in the range 0-23, Then representative wells are all teal in color and display the letter corresponding to the protocol code", async () => {
  //   const protocol_list = Array.from(Array(24).keys());

  //   const propsData = {
  //     protocol_codes: protocol_list
  //   };
  //   wrapper = mount(StimulationStudioWidget, {
  //     propsData,
  //     localVue
  //   });
  //   const well = wrapper.findAll("circle");
  //   const protocol_name = wrapper.findAll(".span__simulationstudio-plate-well-protocol-location");
  //   expect(well.at(0).attributes("fill")).toStrictEqual(color_series_hex_codes[0]);
  //   expect(protocol_name.at(0).text()).toStrictEqual("A");
  //   expect(well.at(23).attributes("fill")).toStrictEqual(color_series_hex_codes[0]);
  //   expect(protocol_name.at(23).text()).toStrictEqual("X");
  // });

  // test("When mounted with protocol codes 24-47, Then the well color should change at the code 25/26 border and the displayed letter should reset to the beginning of the alphabet", async () => {
  //   const protocol_list = [];

  //   for (let i = 24; i < 48; i++) protocol_list.push(i);
  //   const propsData = {
  //     protocol_codes: protocol_list
  //   };
  //   wrapper = mount(StimulationStudioWidget, {
  //     propsData,
  //     localVue
  //   });
  //   const well = wrapper.findAll("circle");
  //   const protocol_name = wrapper.findAll(".span__simulationstudio-plate-well-protocol-location");
  //   const index_of_last_well_in_first_color_series = protocol_list.indexOf(25);
  //   const index_of_first_well_in_second_color_series = protocol_list.indexOf(26);
  //   expect(well.at(index_of_last_well_in_first_color_series).attributes("fill")).toStrictEqual(
  //     color_series_hex_codes[0]
  //   );
  //   expect(protocol_name.at(index_of_last_well_in_first_color_series).text()).toStrictEqual("Z");
  //   expect(well.at(index_of_first_well_in_second_color_series).attributes("fill")).toStrictEqual(
  //     color_series_hex_codes[1]
  //   );
  //   expect(protocol_name.at(index_of_first_well_in_second_color_series).text()).toStrictEqual("A");
  // });

  // test("When mounted with protocol codes 48-71, Then the well color should change at the code 51/52 border and the displayed letter should reset to the beginning of the alphabet", async () => {
  //   const protocol_list = [];

  //   for (let i = 48; i < 72; i++) protocol_list.push(i);
  //   const propsData = {
  //     protocol_codes: protocol_list
  //   };
  //   wrapper = mount(StimulationStudioWidget, {
  //     propsData,
  //     localVue
  //   });
  //   const well = wrapper.findAll("circle");
  //   const protocol_name = wrapper.findAll(".span__simulationstudio-plate-well-protocol-location");
  //   const index_of_last_well_in_second_color_series = protocol_list.indexOf(51);
  //   const index_of_first_well_in_third_color_series = protocol_list.indexOf(52);

  //   expect(well.at(index_of_last_well_in_second_color_series).attributes("fill")).toStrictEqual(
  //     color_series_hex_codes[1]
  //   );
  //   expect(protocol_name.at(index_of_last_well_in_second_color_series).text()).toStrictEqual("Z");
  //   expect(well.at(index_of_first_well_in_third_color_series).attributes("fill")).toStrictEqual(
  //     color_series_hex_codes[2]
  //   );
  //   expect(protocol_name.at(index_of_first_well_in_third_color_series).text()).toStrictEqual("A");
  // });

  // test("When mounted with protocol codes 72-95, Then the well color should change at the code 77/78 border and the displayed letter should reset to the beginning of the alphabet and the final well should have the correct letter & color", async () => {
  //   const protocol_list = [];

  //   for (let i = 72; i < 96; i++) protocol_list.push(i);
  //   protocol_list.push(0);

  //   const propsData = {
  //     protocol_codes: protocol_list
  //   };
  //   wrapper = mount(StimulationStudioWidget, {
  //     propsData,
  //     localVue
  //   });
  //   const well = wrapper.findAll("circle");
  //   const protocol_name = wrapper.findAll(".span__simulationstudio-plate-well-protocol-location");
  //   const index_of_last_well_in_third_color_series = protocol_list.indexOf(77);
  //   const index_of_first_well_in_fourth_color_series = protocol_list.indexOf(78);
  //   expect(well.at(index_of_last_well_in_third_color_series).attributes("fill")).toStrictEqual(
  //     color_series_hex_codes[2]
  //   );
  //   expect(protocol_name.at(index_of_last_well_in_third_color_series).text()).toStrictEqual("Z");
  //   expect(well.at(index_of_first_well_in_fourth_color_series).attributes("fill")).toStrictEqual(
  //     color_series_hex_codes[3]
  //   );
  //   expect(protocol_name.at(index_of_first_well_in_fourth_color_series).text()).toStrictEqual("A");
  //   expect(well.at(23).attributes("fill")).toStrictEqual(color_series_hex_codes[3]);
  //   expect(protocol_name.at(23).text()).toStrictEqual("R");
  // });
});
