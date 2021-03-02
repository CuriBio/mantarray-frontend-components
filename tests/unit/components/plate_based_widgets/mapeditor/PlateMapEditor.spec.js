import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/plate_based_widgets/mapeditor/PlateMapEditor.vue";
import { PlateMapEditor as DistComponentToTest } from "@/dist/mantarray.common";
// import { shallowMount } from "@vue/test-utils";

import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

describe("PlateMapEditor.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());
  test("When mounting PlateMapEditor from the build dist file, Then it loads successfully", async () => {
    const select = [];
    for (let i = 0; i < 24; i++) {
      select.push(false);
    }
    const color = new Array(24).fill("#b7b7b7");

    const propsData = {
      selected: select,
      platecolor: color,
    };
    wrapper = mount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const all_wells = wrapper.findAll("circle");
    expect(all_wells).toHaveLength(24);
  });
  test("Given that none of the wells are selected, minus button should not be visible and stroke outlines should be zero on all wells, When user clicks the plus button, Then all 24 wells should have a stroke outline", async () => {
    const select = [];
    for (let i = 0; i < 24; i++) {
      select.push(false);
    }
    const color = new Array(24).fill("#b7b7b7");

    const propsData = {
      selected: select,
      platecolor: color,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });

    const icon_btn = wrapper.find(".span__platemap-toggle-plus-minus-icon");

    for (let count = 0; count < 24; count++) {
      const well1 = wrapper.find(".plate_" + count);
      expect(well1.attributes("stroke-width")).toBe("0");
    }

    await icon_btn.trigger("click");
    for (let count = 0; count < 24; count++) {
      const well2 = wrapper.find(".plate_" + count);
      expect(well2.attributes("stroke-width")).toBe("4");
    }
  });
  test("Given that all of the wells are selected, plus button should not be visible and stroke outlines should be present on all wells, When user clicks the minus button, Then all 24 wells should no longer have a stroke outline", async () => {
    const select = [];
    for (let i = 0; i < 24; i++) {
      select.push(true);
    }
    const color = new Array(24).fill("#b7b7b7");

    const propsData = {
      selected: select,
      platecolor: color,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });

    const icon_btn = wrapper.find(".span__platemap-toggle-plus-minus-icon");

    for (let count = 0; count < 24; count++) {
      const well1 = wrapper.find(".plate_" + count);
      expect(well1.attributes("stroke-width")).toBe("4");
    }

    await icon_btn.trigger("click");
    for (let count = 0; count < 24; count++) {
      const well2 = wrapper.find(".plate_" + count);
      expect(well2.attributes("stroke-width")).toBe("0");
    }
  });
  // test("Given that none of the wells are selected, minus button should not be visible and stroke outlines should be zero on all wells, When hovers the plus button, Then all 24 wells should have a stroke hover outline", async () => {
  //   const select = [];
  //   for (let i = 0; i < 24; i++) {
  //     select.push(false);
  //   }
  //   const color = new Array(24).fill("#b7b7b7");

  //   const propsData = {
  //     selected: select,
  //     platecolor: color,
  //   };
  //   wrapper = mount(ComponentToTest, {
  //     propsData,
  //     store,
  //     localVue,
  //   });

  //   const icon_minus_btn = wrapper.find(".span__platemap-toggle-minus-icon");
  //   expect(icon_minus_btn.isVisible()).toBe(false);

  //   for (let count = 0; count < 24; count++) {
  //     const well1 = wrapper.find(".plate_" + count);
  //     expect(well1.attributes("stroke-width")).toBe("0");
  //   }
  //   const icon_plus_btn = wrapper.find(".span__platemap-toggle-plus-icon");
  //   await icon_plus_btn.trigger("mouseenter");
  //   for (let count = 0; count < 24; count++) {
  //     const well2 = wrapper.find(".plate_" + count);
  //     expect(well2.attributes("stroke-width")).toBe("4");
  //     expect(well2.attributes("stroke")).toBe("#ececed");
  //   }
  //   await icon_plus_btn.trigger("mouseleave");
  //   for (let count = 0; count < 24; count++) {
  //     const well2 = wrapper.find(".plate_" + count);
  //     expect(well2.attributes("stroke-width")).toBe("0");
  //     expect(well2.attributes("stroke")).toBe("#FFFFFF");
  //   }
  // });
  // test("Given that all of the wells are selected, plus button should not be visible and stroke outlines should be present on all wells, When user hovers the minus button, Then all 24 wells should no longer have a hover stroke outline", async () => {
  //   const select = [];
  //   for (let i = 0; i < 24; i++) {
  //     select.push(true);
  //   }
  //   const color = new Array(24).fill("#b7b7b7");

  //   const propsData = {
  //     selected: select,
  //     platecolor: color,
  //   };
  //   wrapper = mount(ComponentToTest, {
  //     propsData,
  //     store,
  //     localVue,
  //   });

  //   const icon_minus_btn = wrapper.find(".span__platemap-toggle-minus-icon");
  //   //  const icon_plus_btn = wrapper.find(".span__platemap-toggle-plus-icon");

  //   await icon_minus_btn.trigger("mouseenter");
  //   for (let count = 0; count < 24; count++) {
  //     const well2 = wrapper.find(".plate_" + count);
  //     expect(well2.attributes("stroke-width")).toBe("4");
  //     expect(well2.attributes("stroke")).toBe("#ececed");
  //   }
  //   await icon_minus_btn.trigger("mouseleave");
  //   for (let count = 0; count < 24; count++) {
  //     const well2 = wrapper.find(".plate_" + count);
  //     expect(well2.attributes("stroke-width")).toBe("4");
  //     expect(well2.attributes("stroke")).toBe("#FFFFFF");
  //   }
  // });

  // test.each([
  //   ["Row A", [0, 4, 8, 12, 16, 20], ".span__platemap-editor-row-index-A"],
  //   ["Row B", [1, 5, 9, 13, 17, 21], ".span__platemap-editor-row-index-B"],
  //   ["Row C", [2, 6, 10, 14, 18, 22], ".span__platemap-editor-row-index-C"],
  //   ["Row D", [3, 7, 11, 15, 19, 23], ".span__platemap-editor-row-index-D"],
  //   ["Column 01", [0, 1, 2, 3], ".span__platemap-editor-column-index-one"],
  //   ["Column 02", [4, 5, 6, 7], ".span__platemap-editor-column-index-two"],
  //   ["Column 03", [8, 9, 10, 11], ".span__platemap-editor-column-index-three"],
  //   ["Column 04", [12, 13, 14, 15], ".span__platemap-editor-column-index-four"],
  //   ["Column 05", [16, 17, 18, 19], ".span__platemap-editor-column-index-five"],
  //   ["Column 06", [20, 21, 22, 23], ".span__platemap-editor-column-index-six"],
  // ])(
  //   "Given that no wells are selected, When user Shift-Clicks on %s, Then then wells %s visually become selected on a 'click' action (have the stroke outline)",
  //   async (string_name_of_button, array_of_well_indices, selector_str) => {
  //     const select = [];
  //     for (let i = 0; i < 24; i++) {
  //       select.push(false);
  //     }
  //     const color = new Array(24).fill("#b7b7b7");

  //     const propsData = {
  //       selected: select,
  //       platecolor: color,
  //     };
  //     wrapper = mount(ComponentToTest, {
  //       propsData,
  //       store,
  //       localVue,
  //     });
  //     for (let count = 0; count < 24; count++) {
  //       const well1 = wrapper.find(".plate_" + count);
  //       expect(well1.attributes("stroke-width")).toBe("0");
  //     }
  //     const icon_one_btn = wrapper.find(selector_str);

  //     await icon_one_btn.trigger("click", {
  //       shiftKey: true, // For testing @click.shift handlers
  //     });
  //     await wrapper.vm.$nextTick(); // wait for update
  //     for (let i = 0; i < array_of_well_indices.length; i++) {
  //       const iter_well_idx = array_of_well_indices[i];
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")
  //       ).toBe("4");
  //     }
  //   }
  // );

  // test.each([
  //   [
  //     "Row A negate",
  //     [0, 4, 8, 12, 16, 20],
  //     ".span__platemap-editor-row-index-A",
  //   ],
  //   [
  //     "Row B negate",
  //     [1, 5, 9, 13, 17, 21],
  //     ".span__platemap-editor-row-index-B",
  //   ],
  //   [
  //     "Row C negate",
  //     [2, 6, 10, 14, 18, 22],
  //     ".span__platemap-editor-row-index-C",
  //   ],
  //   [
  //     "Row D negate",
  //     [3, 7, 11, 15, 19, 23],
  //     ".span__platemap-editor-row-index-D",
  //   ],
  //   [
  //     "Column 01 negate",
  //     [0, 1, 2, 3],
  //     ".span__platemap-editor-column-index-one",
  //   ],
  //   [
  //     "Column 02 negate",
  //     [4, 5, 6, 7],
  //     ".span__platemap-editor-column-index-two",
  //   ],
  //   [
  //     "Column 03 negate",
  //     [8, 9, 10, 11],
  //     ".span__platemap-editor-column-index-three",
  //   ],
  //   [
  //     "Column 04 negate",
  //     [12, 13, 14, 15],
  //     ".span__platemap-editor-column-index-four",
  //   ],
  //   [
  //     "Column 05 negate",
  //     [16, 17, 18, 19],
  //     ".span__platemap-editor-column-index-five",
  //   ],
  //   [
  //     "Column 06 negate",
  //     [20, 21, 22, 23],
  //     ".span__platemap-editor-column-index-six",
  //   ],
  // ])(
  //   "Given that no wells are selected, When user Shift-Clicks on %s, Then then wells %s visually become selected on a 'click' action (have the stroke outline) and 'second click' action (have no stroke outline)",
  //   async (string_name_of_button, array_of_well_indices, selector_str) => {
  //     const select = [];
  //     for (let i = 0; i < 24; i++) {
  //       select.push(false);
  //     }
  //     const color = new Array(24).fill("#b7b7b7");

  //     const propsData = {
  //       selected: select,
  //       platecolor: color,
  //     };
  //     wrapper = mount(ComponentToTest, {
  //       propsData,
  //       store,
  //       localVue,
  //     });
  //     for (let count = 0; count < 24; count++) {
  //       const well1 = wrapper.find(".plate_" + count);
  //       expect(well1.attributes("stroke-width")).toBe("0");
  //     }
  //     const icon_one_btn = wrapper.find(selector_str);

  //     await icon_one_btn.trigger("click", {
  //       shiftKey: true, // For testing @click.shift handlers
  //     });
  //     await wrapper.vm.$nextTick(); // wait for update
  //     for (let i = 0; i < array_of_well_indices.length; i++) {
  //       const iter_well_idx = array_of_well_indices[i];
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")
  //       ).toBe("4");
  //     }

  //     const icon_one_btn_negate = wrapper.find(selector_str + "-negate");
  //     await icon_one_btn_negate.trigger("click", {
  //       shiftKey: true, // For testing @click.shift handlers
  //     });
  //     await wrapper.vm.$nextTick(); // wait for update
  //     for (let i = 0; i < array_of_well_indices.length; i++) {
  //       const iter_well_idx = array_of_well_indices[i];
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")
  //       ).toBe("0");
  //     }
  //   }
  // );

  // test.each([
  //   [".well_0", 0, ".plate_0", "Click"],
  //   [".well_1", 1, ".plate_1", "Click"],
  //   [".well_2", 2, ".plate_2", "Click"],
  //   [".well_3", 3, ".plate_3", "Click"],
  //   [".well_4", 4, ".plate_4", "Click"],
  //   [".well_5", 5, ".plate_5", "Click"],
  //   [".well_6", 6, ".plate_6", "Click"],
  //   [".well_7", 7, ".plate_7", "Click"],
  //   [".well_8", 8, ".plate_8", "Click"],
  //   [".well_9", 9, ".plate_9", "Click"],
  //   [".well_10", 10, ".plate_10", "Click"],
  //   [".well_11", 11, ".plate_11", "Click"],
  //   [".well_12", 12, ".plate_12", "Click"],
  //   [".well_13", 13, ".plate_13", "Click"],
  //   [".well_14", 14, ".plate_14", "Click"],
  //   [".well_15", 15, ".plate_15", "Click"],
  //   [".well_16", 16, ".plate_16", "Click"],
  //   [".well_17", 17, ".plate_17", "Click"],
  //   [".well_18", 18, ".plate_18", "Click"],
  //   [".well_19", 19, ".plate_19", "Click"],
  //   [".well_20", 20, ".plate_20", "Click"],
  //   [".well_21", 21, ".plate_21", "Click"],
  //   [".well_22", 22, ".plate_22", "Click"],
  //   [".well_23", 23, ".plate_23", "Click"],
  // ])(
  //   "Given that no wells are selected, When user on %s, Then then well %s due to user action %s visually become selected (have the stroke outline)",
  //   async (string_name_of_button, well_indices, selector_str, event) => {
  //     const select = [];
  //     for (let i = 0; i < 24; i++) {
  //       select.push(false);
  //     }
  //     const color = new Array(24).fill("#b7b7b7");

  //     const propsData = {
  //       selected: select,
  //       platecolor: color,
  //     };
  //     wrapper = mount(ComponentToTest, {
  //       propsData,
  //       store,
  //       localVue,
  //     });
  //     for (let count = 0; count < 24; count++) {
  //       const well1 = wrapper.find(".plate_" + count);
  //       expect(well1.attributes("stroke-width")).toBe("0");
  //     }

  //     const buttonclicked = wrapper.find(string_name_of_button);
  //     await buttonclicked.trigger("click");
  //     await wrapper.vm.$nextTick(); // wait for update
  //     expect(wrapper.find(selector_str).attributes("stroke-width")).toBe("4");
  //   }
  // );
  test.each([
    [".well_0", 0, ".plate_0", "ctrl+click"],
    [".well_1", 1, ".plate_1", "ctrl+click"],
    [".well_2", 2, ".plate_2", "ctrl+click"],
    [".well_3", 3, ".plate_3", "ctrl+click"],
    [".well_4", 4, ".plate_4", "ctrl+click"],
    [".well_5", 5, ".plate_5", "ctrl+click"],
    [".well_6", 6, ".plate_6", "ctrl+click"],
    [".well_7", 7, ".plate_7", "ctrl+click"],
    [".well_8", 8, ".plate_8", "ctrl+click"],
    [".well_9", 9, ".plate_9", "ctrl+click"],
    [".well_10", 10, ".plate_10", "ctrl+click"],
    [".well_11", 11, ".plate_11", "ctrl+click"],
    [".well_12", 12, ".plate_12", "ctrl+click"],
    [".well_13", 13, ".plate_13", "ctrl+click"],
    [".well_14", 14, ".plate_14", "ctrl+click"],
    [".well_15", 15, ".plate_15", "ctrl+click"],
    [".well_16", 16, ".plate_16", "ctrl+click"],
    [".well_17", 17, ".plate_17", "ctrl+click"],
    [".well_18", 18, ".plate_18", "ctrl+click"],
    [".well_19", 19, ".plate_19", "ctrl+click"],
    [".well_20", 20, ".plate_20", "ctrl+click"],
    [".well_21", 21, ".plate_21", "ctrl+click"],
    [".well_22", 22, ".plate_22", "ctrl+click"],
    [".well_23", 23, ".plate_23", "ctrl+click"],
  ])(
    "Given that no wells are selected, When user Ctrl+Click on %s, Then then well %s visually become selected due %s (have the stroke outline)",
    async (string_name_of_button, well_indices, selector_str, event) => {
      const select = [];
      for (let i = 0; i < 24; i++) {
        select.push(false);
      }
      const color = new Array(24).fill("#b7b7b7");

      const propsData = {
        selected: select,
        platecolor: color,
      };
      wrapper = mount(ComponentToTest, {
        propsData,
        store,
        localVue,
      });
      for (let count = 0; count < 24; count++) {
        const well1 = wrapper.find(".plate_" + count);
        expect(well1.attributes("stroke-width")).toBe("0");
      }

      const buttonclicked = wrapper.find(string_name_of_button);

      await buttonclicked.trigger("click", {
        ctrlKey: true, // For testing @click.ctrl handlers
      });

      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.find(selector_str).attributes("stroke-width")).toBe("4");
    }
  );
  test.each([
    [".well_0", 0, ".plate_0", "shift+click"],
    [".well_1", 1, ".plate_1", "shift+click"],
    [".well_2", 2, ".plate_2", "shift+click"],
    [".well_3", 3, ".plate_3", "shift+click"],
    [".well_4", 4, ".plate_4", "shift+click"],
    [".well_5", 5, ".plate_5", "shift+click"],
    [".well_6", 6, ".plate_6", "shift+click"],
    [".well_7", 7, ".plate_7", "shift+click"],
    [".well_8", 8, ".plate_8", "shift+click"],
    [".well_9", 9, ".plate_9", "shift+click"],
    [".well_10", 10, ".plate_10", "shift+click"],
    [".well_11", 11, ".plate_11", "shift+click"],
    [".well_12", 12, ".plate_12", "shift+click"],
    [".well_13", 13, ".plate_13", "shift+click"],
    [".well_14", 14, ".plate_14", "shift+click"],
    [".well_15", 15, ".plate_15", "shift+click"],
    [".well_16", 16, ".plate_16", "shift+click"],
    [".well_17", 17, ".plate_17", "shift+click"],
    [".well_18", 18, ".plate_18", "shift+click"],
    [".well_19", 19, ".plate_19", "shift+click"],
    [".well_20", 20, ".plate_20", "shift+click"],
    [".well_21", 21, ".plate_21", "shift+click"],
    [".well_22", 22, ".plate_22", "shift+click"],
    [".well_23", 23, ".plate_23", "shift+click"],
  ])(
    "Given that no wells are selected, When user Shift+Click on %s, Then then well %s visually become selected due to %s (have the stroke outline)",
    async (string_name_of_button, well_indices, selector_str, event) => {
      const select = [];
      for (let i = 0; i < 24; i++) {
        select.push(false);
      }
      const color = new Array(24).fill("#b7b7b7");

      const propsData = {
        selected: select,
        platecolor: color,
      };
      wrapper = mount(ComponentToTest, {
        propsData,
        store,
        localVue,
      });
      for (let count = 0; count < 24; count++) {
        const well1 = wrapper.find(".plate_" + count);
        expect(well1.attributes("stroke-width")).toBe("0");
      }

      const buttonclicked = wrapper.find(string_name_of_button);

      await buttonclicked.trigger("click", {
        shiftKey: true, // For testing @click.shift handlers
      });
      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.find(selector_str).attributes("stroke-width")).toBe("4");
    }
  );
  // test.each([
  //   [".well_0", 0, ".plate_0", "Hover"],
  //   [".well_1", 1, ".plate_1", "Hover"],
  //   [".well_2", 2, ".plate_2", "Hover"],
  //   [".well_3", 3, ".plate_3", "Hover"],
  //   [".well_4", 4, ".plate_4", "Hover"],
  //   [".well_5", 5, ".plate_5", "Hover"],
  //   [".well_6", 6, ".plate_6", "Hover"],
  //   [".well_7", 7, ".plate_7", "Hover"],
  //   [".well_8", 8, ".plate_8", "Hover"],
  //   [".well_9", 9, ".plate_9", "Hover"],
  //   [".well_10", 10, ".plate_10", "Hover"],
  //   [".well_11", 11, ".plate_11", "Hover"],
  //   [".well_12", 12, ".plate_12", "Hover"],
  //   [".well_13", 13, ".plate_13", "Hover"],
  //   [".well_14", 14, ".plate_14", "Hover"],
  //   [".well_15", 15, ".plate_15", "Hover"],
  //   [".well_16", 16, ".plate_16", "Hover"],
  //   [".well_17", 17, ".plate_17", "Hover"],
  //   [".well_18", 18, ".plate_18", "Hover"],
  //   [".well_19", 19, ".plate_19", "Hover"],
  //   [".well_20", 20, ".plate_20", "Hover"],
  //   [".well_21", 21, ".plate_21", "Hover"],
  //   [".well_22", 22, ".plate_22", "Hover"],
  //   [".well_23", 23, ".plate_23", "Hover"],
  // ])(
  //   "Given that no wells are selected, When user Hover on %s, Then then well %s visually gets highlighted with %s effect, upon user focus change it gets un-highlighted",
  //   async (string_name_of_button, well_indices, selector_str, event) => {
  //     const select = [];
  //     for (let i = 0; i < 24; i++) {
  //       select.push(false);
  //     }
  //     const color = new Array(24).fill("#b7b7b7");

  //     const propsData = {
  //       selected: select,
  //       platecolor: color,
  //     };
  //     wrapper = mount(ComponentToTest, {
  //       propsData,
  //       store,
  //       localVue,
  //     });
  //     for (let count = 0; count < 24; count++) {
  //       const well1 = wrapper.find(".plate_" + count);
  //       expect(well1.attributes("stroke-width")).toBe("0");
  //     }

  //     const well_enter = wrapper.find(selector_str);
  //     await well_enter.trigger("mouseenter");
  //     await wrapper.vm.$nextTick(); // wait for update
  //     expect(wrapper.find(selector_str).attributes("stroke")).toBe("#ececed");
  //     expect(wrapper.find(selector_str).attributes("stroke-width")).toBe("4");

  //     const well_leave = wrapper.find(selector_str);
  //     await well_leave.trigger("mouseleave");
  //     await wrapper.vm.$nextTick(); // wait for update
  //     expect(wrapper.find(selector_str).attributes("stroke")).toBe("#FFFFFF");
  //     expect(wrapper.find(selector_str).attributes("stroke-width")).toBe("0");
  //   }
  // );
  // test.each([
  //   [
  //     "Row A",
  //     [0, 4, 8, 12, 16, 20],
  //     ".span__platemap-editor-row-index-A",
  //     "Column 01",
  //     [0, 1, 2, 3],
  //     ".span__platemap-editor-column-index-one",
  //     0,
  //     "click",
  //   ],
  //   [
  //     "Row A",
  //     [0, 4, 8, 12, 16, 20],
  //     ".span__platemap-editor-row-index-A",
  //     "Column 02",
  //     [4, 5, 6, 7],
  //     ".span__platemap-editor-column-index-two",
  //     4,
  //     "shift",
  //   ],
  //   [
  //     "Row A",
  //     [0, 4, 8, 12, 16, 20],
  //     ".span__platemap-editor-row-index-A",
  //     "Column 02",
  //     [8, 9, 10, 11],
  //     ".span__platemap-editor-column-index-three",
  //     8,
  //     "click",
  //   ],
  // ])(
  //   "Given that no wells are selected, When user Clicks or Shift-Clicks on %s, Then then wells %s visually become selected (have the stroke outline) Additionally, When user Shift-Clicks on %s, Then the welss on %s visually become selected (have the stroke outline), Observe that intersection well(01) is having a stroke outline",
  //   async (
  //     string_name_of_button,
  //     array_of_well_indices,
  //     selector_str,
  //     string_name_of_button_two,
  //     array_of_well_indices_two,
  //     selector_str_two,
  //     index,
  //     event
  //   ) => {
  //     const select = [];
  //     for (let i = 0; i < 24; i++) {
  //       select.push(false);
  //     }
  //     const color = new Array(24).fill("#b7b7b7");

  //     const propsData = {
  //       selected: select,
  //       platecolor: color,
  //     };
  //     wrapper = mount(ComponentToTest, {
  //       propsData,
  //       store,
  //       localVue,
  //     });
  //     for (let count = 0; count < 24; count++) {
  //       const well1 = wrapper.find(".plate_" + count);
  //       expect(well1.attributes("stroke-width")).toBe("0");
  //     }
  //     const icon_one_btn = wrapper.find(selector_str);

  //     if (event === "click") {
  //       await icon_one_btn.trigger("click");
  //     }
  //     if (event === "shift") {
  //       await icon_one_btn.trigger("click", {
  //         shiftKey: true, // For testing @click.shift handlers
  //       });
  //     }

  //     for (let i = 0; i < array_of_well_indices.length; i++) {
  //       const iter_well_idx = array_of_well_indices[i];
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")
  //       ).toBe("4");
  //     }

  //     const icon_two_btn = wrapper.find(selector_str_two);
  //     if (event === "click") {
  //       await icon_two_btn.trigger("click");
  //     }
  //     if (event === "shift") {
  //       await icon_two_btn.trigger("click", {
  //         shiftKey: true, // For testing @click.shift handlers
  //       });
  //     }
  //     for (let i = 0; i < array_of_well_indices_two.length; i++) {
  //       const iter_well_idx = array_of_well_indices_two[i];
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")
  //       ).toBe("4");
  //     }
  //     const plate = wrapper.find(".plate_" + index);
  //     expect(plate.attributes("stroke-width")).toBe("4");
  //   }
  // );

  // test.each([
  //   ["Row A", [0, 4, 8, 12, 16, 20], ".span__platemap-editor-row-index-A"],
  //   ["Row B", [1, 5, 9, 13, 17, 21], ".span__platemap-editor-row-index-B"],
  //   ["Row C", [2, 6, 10, 14, 18, 22], ".span__platemap-editor-row-index-C"],
  //   ["Row D", [3, 7, 11, 15, 19, 23], ".span__platemap-editor-row-index-D"],
  //   ["Column 01", [0, 1, 2, 3], ".span__platemap-editor-column-index-one"],
  //   ["Column 02", [4, 5, 6, 7], ".span__platemap-editor-column-index-two"],
  //   ["Column 03", [8, 9, 10, 11], ".span__platemap-editor-column-index-three"],
  //   ["Column 04", [12, 13, 14, 15], ".span__platemap-editor-column-index-four"],
  //   ["Column 05", [16, 17, 18, 19], ".span__platemap-editor-column-index-five"],
  //   ["Column 06", [20, 21, 22, 23], ".span__platemap-editor-column-index-six"],
  // ])(
  //   "Given that no wells are selected, When user Shift-Clicks on %s, Then then wells %s visually become selected (have the stroke outline), user does a hover on rows and columns (have the hover stroke outline)",
  //   async (string_name_of_button, array_of_well_indices, selector_str) => {
  //     const select = [];
  //     for (let i = 0; i < 24; i++) {
  //       select.push(false);
  //     }
  //     const color = new Array(24).fill("#b7b7b7");

  //     const propsData = {
  //       selected: select,
  //       platecolor: color,
  //     };
  //     wrapper = mount(ComponentToTest, {
  //       propsData,
  //       store,
  //       localVue,
  //     });
  //     for (let count = 0; count < 24; count++) {
  //       const well1 = wrapper.find(".plate_" + count);
  //       expect(well1.attributes("stroke-width")).toBe("0");
  //     }
  //     const icon_one_btn = wrapper.find(selector_str);

  //     await icon_one_btn.trigger("mouseenter");
  //     await wrapper.vm.$nextTick();
  //     for (let i = 0; i < array_of_well_indices.length; i++) {
  //       const iter_well_idx = array_of_well_indices[i];
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")
  //       ).toBe("4");
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke")
  //       ).toBe("#ececed");
  //     }

  //     await icon_one_btn.trigger("mouseleave");
  //     await wrapper.vm.$nextTick();
  //     for (let i = 0; i < array_of_well_indices.length; i++) {
  //       const iter_well_idx = array_of_well_indices[i];
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")
  //       ).toBe("0");
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke")
  //       ).toBe("#FFFFFF");
  //     }

  //     await icon_one_btn.trigger("click", {
  //       shiftKey: true, // For testing @click.shift handlers
  //     });
  //     await wrapper.vm.$nextTick(); // wait for update
  //     for (let i = 0; i < array_of_well_indices.length; i++) {
  //       const iter_well_idx = array_of_well_indices[i];
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")
  //       ).toBe("4");
  //     }

  //     const icon_one_btn_negate = wrapper.find(selector_str + "-negate");
  //     await icon_one_btn_negate.trigger("click", {
  //       shiftKey: true, // For testing @click.shift handlers
  //     });
  //     await wrapper.vm.$nextTick(); // wait for update
  //     for (let i = 0; i < array_of_well_indices.length; i++) {
  //       const iter_well_idx = array_of_well_indices[i];
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")
  //       ).toBe("0");
  //     }

  //     await icon_one_btn_negate.trigger("mouseenter");
  //     await wrapper.vm.$nextTick();
  //     for (let i = 0; i < array_of_well_indices.length; i++) {
  //       const iter_well_idx = array_of_well_indices[i];
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")
  //       ).toBe("4");
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke")
  //       ).toBe("#ececed");
  //     }

  //     await icon_one_btn_negate.trigger("mouseleave");
  //     await wrapper.vm.$nextTick();
  //     for (let i = 0; i < array_of_well_indices.length; i++) {
  //       const iter_well_idx = array_of_well_indices[i];
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")
  //       ).toBe("0");
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke")
  //       ).toBe("#FFFFFF");
  //     }
  //   }
  // );
  // test.each([
  //   ["Row A", [0, 4, 8, 12, 16, 20], ".span__platemap-editor-row-index-A"],
  //   ["Row B", [1, 5, 9, 13, 17, 21], ".span__platemap-editor-row-index-B"],
  //   ["Row C", [2, 6, 10, 14, 18, 22], ".span__platemap-editor-row-index-C"],
  //   ["Row D", [3, 7, 11, 15, 19, 23], ".span__platemap-editor-row-index-D"],
  //   ["Column 01", [0, 1, 2, 3], ".span__platemap-editor-column-index-one"],
  //   ["Column 02", [4, 5, 6, 7], ".span__platemap-editor-column-index-two"],
  //   ["Column 03", [8, 9, 10, 11], ".span__platemap-editor-column-index-three"],
  //   ["Column 04", [12, 13, 14, 15], ".span__platemap-editor-column-index-four"],
  //   ["Column 05", [16, 17, 18, 19], ".span__platemap-editor-column-index-five"],
  //   ["Column 06", [20, 21, 22, 23], ".span__platemap-editor-column-index-six"],
  //   ["Well 0", [0], ".well_0"],
  //   ["Well 23", [23], ".well_23"],
  // ])(
  //   "Given that no wells are selected, When user Clicks on %s, Then then wells %s visually become selected (have the stroke outline), Then an event platewell-selected is emitted with details of selected plate(true => selected/false => unselected)",
  //   async (string_name_of_button, array_of_well_indices, selector_str) => {
  //     const select = [];
  //     for (let i = 0; i < 24; i++) {
  //       select.push(false);
  //     }
  //     const color = new Array(24).fill("#b7b7b7");

  //     const propsData = {
  //       selected: select,
  //       platecolor: color,
  //     };
  //     wrapper = mount(ComponentToTest, {
  //       propsData,
  //       store,
  //       localVue,
  //     });

  //     for (let count = 0; count < 24; count++) {
  //       const well1 = wrapper.find(".plate_" + count);
  //       expect(well1.attributes("stroke-width")).toBe("0");
  //     }
  //     const icon_one_btn = wrapper.find(selector_str);

  //     await icon_one_btn.trigger("click");

  //     await wrapper.vm.$nextTick(); // wait for update
  //     for (let i = 0; i < array_of_well_indices.length; i++) {
  //       const iter_well_idx = array_of_well_indices[i];
  //       select[iter_well_idx] = true;
  //       expect(
  //         wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")
  //       ).toBe("4");
  //     }

  //     const selected_id_events = wrapper.emitted("platewell-selected");
  //     expect(selected_id_events).toHaveLength(1);
  //     expect(selected_id_events[0]).toStrictEqual([select]);
  //   }
  // );
  // test("Given that no wells are selected, When user Clicks on B Row, Then then wells B Row visually become selected (have the stroke outline), Then user selects D Row then visually D Row become selected (have the stroke outline) now swap back to B Row 'click' and validate B Row is selected (have the stroke outline)", async () => {
  //   const select = [];
  //   for (let i = 0; i < 24; i++) {
  //     select.push(false);
  //   }
  //   const color = new Array(24).fill("#b7b7b7");

  //   const propsData = {
  //     selected: select,
  //     platecolor: color,
  //   };
  //   wrapper = mount(ComponentToTest, {
  //     propsData,
  //     store,
  //     localVue,
  //   });

  //   for (let count = 0; count < 24; count++) {
  //     const well1 = wrapper.find(".plate_" + count);
  //     expect(well1.attributes("stroke-width")).toBe("0");
  //   }
  //   const B_Row = wrapper.find(".span__platemap-editor-row-index-B");
  //   await B_Row.trigger("click");
  //   const b_array = [1, 5, 9, 13, 17, 21];
  //   for (let i = 0; i < b_array.length; i++) {
  //     const well_b_row = wrapper.find(".plate_" + b_array[i]);
  //     expect(well_b_row.attributes("stroke-width")).toBe("4");
  //   }
  //   const D_Row = wrapper.find(".span__platemap-editor-row-index-D");
  //   await D_Row.trigger("click");
  //   const d_array = [3, 7, 11, 15, 19, 23];
  //   for (let j = 0; j < d_array.length; j++) {
  //     const well_d_row = wrapper.find(".plate_" + d_array[j]);
  //     const well_b_row = wrapper.find(".plate_" + b_array[j]);
  //     expect(well_d_row.attributes("stroke-width")).toBe("4");
  //     expect(well_b_row.attributes("stroke-width")).toBe("0");
  //   }

  //   await B_Row.trigger("click");
  //   for (let k = 0; k < d_array.length; k++) {
  //     const well_d_row = wrapper.find(".plate_" + d_array[k]);
  //     const well_b_row = wrapper.find(".plate_" + b_array[k]);
  //     expect(well_d_row.attributes("stroke-width")).toBe("0");
  //     expect(well_b_row.attributes("stroke-width")).toBe("4");
  //   }
  // });
  // test("Given that no wells are selected, When user Clicks on one Column, Then then wells One Column visually become selected (have the stroke outline), Then user selects Five Column then visually Five Column become selected (have the stroke outline) now swap back to One Column 'click' and validate One Column is selected (have the stroke outline)", async () => {
  //   const select = [];
  //   for (let i = 0; i < 24; i++) {
  //     select.push(false);
  //   }
  //   const color = new Array(24).fill("#b7b7b7");

  //   const propsData = {
  //     selected: select,
  //     platecolor: color,
  //   };
  //   wrapper = mount(ComponentToTest, {
  //     propsData,
  //     store,
  //     localVue,
  //   });

  //   for (let count = 0; count < 24; count++) {
  //     const well1 = wrapper.find(".plate_" + count);
  //     expect(well1.attributes("stroke-width")).toBe("0");
  //   }
  //   const One_column = wrapper.find(".span__platemap-editor-column-index-one");
  //   await One_column.trigger("click");
  //   const one_array = [0, 1, 2, 3];
  //   for (let i = 0; i < one_array.length; i++) {
  //     const well_one_column = wrapper.find(".plate_" + one_array[i]);
  //     expect(well_one_column.attributes("stroke-width")).toBe("4");
  //   }
  //   const Five_column = wrapper.find(
  //     ".span__platemap-editor-column-index-five"
  //   );
  //   await Five_column.trigger("click");
  //   const five_array = [16, 17, 18, 19];
  //   for (let j = 0; j < five_array.length; j++) {
  //     const well_five_column = wrapper.find(".plate_" + five_array[j]);
  //     const well_one_column = wrapper.find(".plate_" + one_array[j]);
  //     expect(well_five_column.attributes("stroke-width")).toBe("4");
  //     expect(well_one_column.attributes("stroke-width")).toBe("0");
  //   }

  //   await One_column.trigger("click");
  //   for (let k = 0; k < five_array.length; k++) {
  //     const well_five_column = wrapper.find(".plate_" + five_array[k]);
  //     const well_one_column = wrapper.find(".plate_" + one_array[k]);
  //     expect(well_five_column.attributes("stroke-width")).toBe("0");
  //     expect(well_one_column.attributes("stroke-width")).toBe("4");
  //   }
  // });
  // test("Given that no wells are selected, When user randomly does selects on Click or Ctrl+Click or Shift+Click on rows or columns, Then then wells One Column visually become selected (have the stroke outline), Then user selects randomly does repeately Click, Ctrl+Click, Shift+Click now intersection wells would be de-selected ( no stroke outline)", async () => {
  //   const select = [];
  //   for (let i = 0; i < 24; i++) {
  //     select.push(false);
  //   }
  //   const color = new Array(24).fill("#b7b7b7");

  //   const propsData = {
  //     selected: select,
  //     platecolor: color,
  //   };
  //   wrapper = mount(ComponentToTest, {
  //     propsData,
  //     store,
  //     localVue,
  //   });

  //   for (let count = 0; count < 24; count++) {
  //     const well1 = wrapper.find(".plate_" + count);
  //     expect(well1.attributes("stroke-width")).toBe("0");
  //   }
  //   const one_column = wrapper.find(".span__platemap-editor-column-index-one");
  //   const one_array = [0, 1, 2, 3];
  //   // JEST/no-unused-vars is creating eslint errors forces the variables to be commented
  //   // this section is not a production code,its just a pre-populated variables to include in future
  //   // for additing additonal test facilitation, now commented due to ESlint rules
  //   // There is no harm in having these variables as its not going to increase the footprint of
  //   // production code.
  //   // const two_column = wrapper.find(".span__platemap-editor-column-index-two");
  //   // const two_array = [4, 5, 6, 7];
  //   // const three_column = wrapper.find(
  //   //   ".span__platemap-editor-column-index-three"
  //   // );
  //   // const three_array = [8, 9, 10, 11];
  //   // const four_column = wrapper.find(
  //   //   ".span__platemap-editor-column-index-four"
  //   // );
  //   // const four_array = [12, 13, 14, 15];
  //   // const five_column = wrapper.find(
  //   //   ".span__platemap-editor-column-index-five"
  //   // );
  //   // const five_array = [16, 17, 18, 19];
  //   const six_column = wrapper.find(".span__platemap-editor-column-index-six");
  //   const six_array = [20, 21, 22, 23];

  //   const one_column_negate = wrapper.find(
  //     ".span__platemap-editor-column-index-one-negate"
  //   );
  //   // const two_column_negate = wrapper.find(
  //   //   ".span__platemap-editor-column-index-two-negate"
  //   // );
  //   // const three_column_negate = wrapper.find(
  //   //   ".span__platemap-editor-column-index-three-negate"
  //   // );
  //   // const four_column_negate = wrapper.find(
  //   //   ".span__platemap-editor-column-index-four-negate"
  //   // );
  //   // const five_column_negate = wrapper.find(
  //   //   ".span__platemap-editor-column-index-five-negate"
  //   // );
  //   // const six_column_negate = wrapper.find(
  //   //   ".span__platemap-editor-column-index-six-negate"
  //   // );

  //   const A_row = wrapper.find(".span__platemap-editor-row-index-A");
  //   const a_array = [0, 4, 8, 12, 16, 20];
  //   // const B_row = wrapper.find(".span__platemap-editor-row-index-B");
  //   // const b_array = [1, 5, 9, 13, 17, 21];
  //   // const C_row = wrapper.find(".span__platemap-editor-row-index-C");
  //   // const c_array = [2, 6, 10, 14, 18, 22];
  //   const D_row = wrapper.find(".span__platemap-editor-row-index-D");
  //   const d_array = [3, 7, 11, 15, 19, 23];

  //   // const A_row_negate = wrapper.find(
  //   //   ".span__platemap-editor-row-index-A-negate"
  //   // );
  //   // const B_row_negate = wrapper.find(
  //   //   ".span__platemap-editor-row-index-B-negate"
  //   // );
  //   // const C_row_negate = wrapper.find(
  //   //   ".span__platemap-editor-row-index-C-negate"
  //   // );
  //   const D_row_negate = wrapper.find(
  //     ".span__platemap-editor-row-index-D-negate"
  //   );

  //   /* Start Scenario One
  //   (a) Click            01 Column
  //   (b) Click+Shift       A Row
  //   (c) Click+Shift      01 Column
  //   Validate intersection Well 0 is not selected on verify 01 Column is deselected and remaining A Row plates are selected */

  //   await one_column.trigger("click");
  //   await A_row.trigger("click", {
  //     shiftKey: true, // For testing @click.shift handlers
  //   });
  //   for (let i = 0; i < one_array.length; i++) {
  //     const plate_well_column = wrapper.find(".plate_" + one_array[i]);
  //     expect(plate_well_column.attributes("stroke-width")).toBe("4");
  //   }
  //   for (let j = 0; j < a_array.length; j++) {
  //     const plate_well_row = wrapper.find(".plate_" + a_array[j]);
  //     expect(plate_well_row.attributes("stroke-width")).toBe("4");
  //   }
  //   await one_column_negate.trigger("click", {
  //     shiftKey: true, // For testing @click.shift handlers
  //   });
  //   let plate_intersection_column = wrapper.find(".plate_" + one_array[0]);
  //   let plate_intersection_row = wrapper.find(".plate_" + a_array[0]);
  //   // This condition affirms that the cross section of one_Column and A Row is matching its a proper way of developing test
  //   // but due to jest rule of jest/no-conditional-expect this if condition is commented
  //   // So had to comment the verification and just validate the expect part
  //   //  if (plate_intersection_column === plate_intersection_row) {
  //   expect(plate_intersection_row.attributes("stroke-width")).toBe("0");
  //   // }
  //   for (let i = 1; i < one_array.length; i++) {
  //     const plate_well_column = wrapper.find(".plate_" + one_array[i]);
  //     expect(plate_well_column.attributes("stroke-width")).toBe("0");
  //   }
  //   for (let j = 1; j < a_array.length; j++) {
  //     const plate_well_row = wrapper.find(".plate_" + a_array[j]);
  //     expect(plate_well_row.attributes("stroke-width")).toBe("4");
  //   }
  //   /* End of Scenario one */
  //   /* Start Scenario Two
  //   (a) Click             D Row
  //   (b) Click+Shift      06 Column
  //   (c) Click+Shift       D Row
  //   Validate intersection Well 23 is not selected on verify D Row is deselected and remaining 06 Column plates are selected */

  //   await D_row.trigger("click");
  //   await six_column.trigger("click", {
  //     shiftKey: true, // For testing @click.shift handlers
  //   });
  //   for (let i = 0; i < d_array.length; i++) {
  //     const plate_well_column = wrapper.find(".plate_" + d_array[i]);
  //     expect(plate_well_column.attributes("stroke-width")).toBe("4");
  //   }
  //   for (let j = 0; j < six_array.length; j++) {
  //     const plate_well_row = wrapper.find(".plate_" + six_array[j]);
  //     expect(plate_well_row.attributes("stroke-width")).toBe("4");
  //   }
  //   await D_row_negate.trigger("click", {
  //     shiftKey: true, // For testing @click.shift handlers
  //   });
  //   plate_intersection_column = wrapper.find(
  //     ".plate_" + d_array[d_array.length - 1]
  //   );
  //   plate_intersection_row = wrapper.find(
  //     ".plate_" + six_array[six_array.length - 1]
  //   );

  //   // This condition affirms that the cross section of six Column and D Row is matching its a proper way of developing test
  //   // but due to jest rule of jest/no-conditional-expect this if condition is commented
  //   // So had to comment the verification and just validate the expect part
  //   // if (plate_intersection_column === plate_intersection_row) {
  //   expect(plate_intersection_row.attributes("stroke-width")).toBe("0");
  //   expect(plate_intersection_column.attributes("stroke-width")).toBe("0");
  //   // }
  //   for (let i = 1; i < d_array.length; i++) {
  //     const plate_well_column = wrapper.find(".plate_" + d_array[i]);
  //     expect(plate_well_column.attributes("stroke-width")).toBe("0");
  //   }
  //   for (let j = 0; j < six_array.length - 1; j++) {
  //     const plate_well_row = wrapper.find(".plate_" + six_array[j]);
  //     expect(plate_well_row.attributes("stroke-width")).toBe("4");
  //   }
  //   /* End of Scenario two
  //     As we come across multiple random situations testcases can be included, as per present observation the solution works properly under all combintaions */
  // });

  //   test("Given that no wells are selected, When user randomly does selects (+) icon, Click or Ctrl+Click or Shift+Click on rows or columns, Then then wells One Column visually become selected (have the stroke outline), Then user selects randomly does repeately (-) icon, Click, Ctrl+Click, Shift+Click now intersection wells would be de-selected ( no stroke outline)", async () => {
  //     const select = [];
  //     for (let i = 0; i < 24; i++) {
  //       select.push(false);
  //     }
  //     const color = new Array(24).fill("#b7b7b7");

  //     const propsData = {
  //       selected: select,
  //       platecolor: color,
  //     };
  //     wrapper = mount(ComponentToTest, {
  //       propsData,
  //       store,
  //       localVue,
  //     });

  //     for (let count = 0; count < 24; count++) {
  //       const well1 = wrapper.find(".plate_" + count);
  //       expect(well1.attributes("stroke-width")).toBe("0");
  //     }
  //     // JEST/no-unused-vars is creating eslint errors forces the variables to be commented
  //     // this section is not a production code,its just a pre-populated variables to include in future
  //     // for additing additonal test facilitation, now commented due to ESlint rules
  //     // There is no harm in having these variables as its not going to increase the footprint of
  //     // production code.
  //     // const one_column = wrapper.find(".span__platemap-editor-column-index-one");
  //     // const one_array = [0, 1, 2, 3];
  //     // const two_column = wrapper.find(".span__platemap-editor-column-index-two");
  //     // const two_array = [4, 5, 6, 7];
  //     // const three_column = wrapper.find(
  //     //  ".span__platemap-editor-column-index-three"
  //     // );
  //     const three_array = [8, 9, 10, 11];
  //     // const four_column = wrapper.find(
  //     //   ".span__platemap-editor-column-index-four"
  //     // );
  //     // const four_array = [12, 13, 14, 15];
  //     // const five_column = wrapper.find(
  //     //   ".span__platemap-editor-column-index-five"
  //     // );
  //     // const five_array = [16, 17, 18, 19];
  //     // const six_column = wrapper.find(".span__platemap-editor-column-index-six");
  //     // const six_array = [20, 21, 22, 23];

  //     // const one_column_negate = wrapper.find(
  //     //   ".span__platemap-editor-column-index-one-negate"
  //     // );
  //     // const two_column_negate = wrapper.find(
  //     //   ".span__platemap-editor-column-index-two-negate"
  //     // );
  //     const three_column_negate = wrapper.find(
  //       ".span__platemap-editor-column-index-three-negate"
  //     );
  //     // const four_column_negate = wrapper.find(
  //     //   ".span__platemap-editor-column-index-four-negate"
  //     // );
  //     // const five_column_negate = wrapper.find(
  //     //   ".span__platemap-editor-column-index-five-negate"
  //     // );
  //     // const six_column_negate = wrapper.find(
  //     //   ".span__platemap-editor-column-index-six-negate"
  //     // );

  //     // const A_row = wrapper.find(".span__platemap-editor-row-index-A");
  //     // const a_array = [0, 4, 8, 12, 16, 20];
  //     // const B_row = wrapper.find(".span__platemap-editor-row-index-B");
  //     // const b_array = [1, 5, 9, 13, 17, 21];
  //     // const C_row = wrapper.find(".span__platemap-editor-row-index-C");
  //     const c_array = [2, 6, 10, 14, 18, 22];
  //     // const D_row = wrapper.find(".span__platemap-editor-row-index-D");
  //     // const d_array = [3, 7, 11, 15, 19, 23];

  //     // const A_row_negate = wrapper.find(
  //     //   ".span__platemap-editor-row-index-A-negate"
  //     // );
  //     // const B_row_negate = wrapper.find(
  //     //   ".span__platemap-editor-row-index-B-negate"
  //     // );
  //     const C_row_negate = wrapper.find(
  //       ".span__platemap-editor-row-index-C-negate"
  //     );
  //     // const D_row_negate = wrapper.find(
  //     //   ".span__platemap-editor-row-index-D-negate"
  //     // );

  //     const plus_icon = wrapper.find(".span__platemap-toggle-plus-icon");
  //     // const minus_icon = wrapper.find(".span__platemap-toggle-minus-icon");

  //     /* Start Scenario one
  //     (a) Click .............. (+)
  //     (b) Shift+Click..........(Column 03)
  //         Validate that except the Column 03 plate wells the rest are selected */

  //     await plus_icon.trigger("click");
  //     for (let count = 0; count < 24; count++) {
  //       const all_wells = wrapper.find(".plate_" + count);
  //       expect(all_wells.attributes("stroke-width")).toBe("4");
  //     }
  //     await three_column_negate.trigger("click", {
  //       shiftKey: true, // For testing @click.shift handlers
  //     });
  //     let three_colom_index = 0;
  //     for (let i = 0; i < 24; i++) {
  //       if (i == three_array[three_colom_index]) {
  //         const three_column_well = wrapper.find(".plate_" + i);
  //         three_colom_index = three_colom_index + 1;
  //         /* eslint-disable jest/no-conditional-expect */
  //         expect(three_column_well.attributes("stroke-width")).toBe("0");
  //       } else {
  //         const other_wells = wrapper.find(".plate_" + i);
  //         expect(other_wells.attributes("stroke-width")).toBe("4");
  //         /* eslint-enable jest/no-conditional-expect */
  //       }
  //     }
  //     /* End of Scenario one */
  //     /* Additional Second Senario
  //     (b) Shift+Click..........(Row C) */
  //     await C_row_negate.trigger("click", {
  //       ctrlKey: true,
  //     });
  //     three_colom_index = 0;
  //     let C_row_index = 0;
  //     for (let i = 0; i < 24; i++) {
  //       if (i == three_array[three_colom_index]) {
  //         const three_column_well = wrapper.find(".plate_" + i);
  //         three_colom_index = three_colom_index + 1;
  //         /* eslint-disable jest/no-conditional-expect */
  //         expect(three_column_well.attributes("stroke-width")).toBe("0");
  //       } else {
  //         if (i == c_array[C_row_index]) {
  //           const C_column_well = wrapper.find(".plate_" + i);
  //           C_row_index = C_row_index + 1;
  //           expect(C_column_well.attributes("stroke-width")).toBe("0");
  //           /* eslint-enable jest/no-conditional-expect */
  //         }
  //       }
  //     }
  //     /* As the necessary arraises the scenarios of random approach can be included as per the requirement */
  //   });
});
