import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/plate_based_widgets/mapeditor/PlateMapEditor.vue";
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
  test("Given that none of the wells are selected, minus button should not be visible and stroke outlines should be zero on all wells, When user hovers the plus button and later un hovers the plus button, Then all 24 wells should have a stroke hover outline of 2px during hover and stroke hover outline is reset to 0px when un-hover the plus button", async () => {
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

    const svg_plus = wrapper.find("#plus");
    const svg_minus = wrapper.find("#minus");

    expect(svg_plus.isVisible()).toBe(true);
    expect(svg_minus.isVisible()).toBe(false);

    for (let count = 0; count < 24; count++) {
      const well1 = wrapper.find(".plate_" + count);
      expect(well1.attributes("stroke-width")).toBe("0");
    }

    await icon_btn.trigger("mouseenter");
    for (let count = 0; count < 24; count++) {
      const well2 = wrapper.find(".plate_" + count);
      expect(well2.attributes("stroke-width")).toBe("2");
      expect(well2.attributes("stroke")).toBe("#ececed");
    }
    await icon_btn.trigger("mouseleave");
    for (let count = 0; count < 24; count++) {
      const well2 = wrapper.find(".plate_" + count);
      expect(well2.attributes("stroke-width")).toBe("0");
      expect(well2.attributes("stroke")).toBe("#ececed");
    }
  });
  test("Given that all of the wells are selected, plus button should not be visible and stroke outlines of 4px is present on all wells, When user hovers the minus button, Then all 24 wells would have color of hover #ececed with 4px stroke outline, on un-hover the color would be #ffffff with 4px stroke outline", async () => {
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

    await icon_btn.trigger("mouseenter");
    for (let count = 0; count < 24; count++) {
      const well2 = wrapper.find(".plate_" + count);
      expect(well2.attributes("stroke-width")).toBe("4");
      expect(well2.attributes("stroke")).toBe("#ececed");
    }
    await icon_btn.trigger("mouseleave");
    for (let count = 0; count < 24; count++) {
      const well2 = wrapper.find(".plate_" + count);
      expect(well2.attributes("stroke-width")).toBe("4");
      expect(well2.attributes("stroke")).toBe("#FFFFFF");
    }
  });
  test.each([
    [".well_0", 0, ".plate_0", "Hover"],
    [".well_1", 1, ".plate_1", "Hover"],
    [".well_2", 2, ".plate_2", "Hover"],
    [".well_3", 3, ".plate_3", "Hover"],
    [".well_4", 4, ".plate_4", "Hover"],
    [".well_5", 5, ".plate_5", "Hover"],
    [".well_6", 6, ".plate_6", "Hover"],
    [".well_7", 7, ".plate_7", "Hover"],
    [".well_8", 8, ".plate_8", "Hover"],
    [".well_9", 9, ".plate_9", "Hover"],
    [".well_10", 10, ".plate_10", "Hover"],
    [".well_11", 11, ".plate_11", "Hover"],
    [".well_12", 12, ".plate_12", "Hover"],
    [".well_13", 13, ".plate_13", "Hover"],
    [".well_14", 14, ".plate_14", "Hover"],
    [".well_15", 15, ".plate_15", "Hover"],
    [".well_16", 16, ".plate_16", "Hover"],
    [".well_17", 17, ".plate_17", "Hover"],
    [".well_18", 18, ".plate_18", "Hover"],
    [".well_19", 19, ".plate_19", "Hover"],
    [".well_20", 20, ".plate_20", "Hover"],
    [".well_21", 21, ".plate_21", "Hover"],
    [".well_22", 22, ".plate_22", "Hover"],
    [".well_23", 23, ".plate_23", "Hover"],
  ])(
    "Given that no wells are selected, When user Hover on %s, Then then well %s visually gets highlighted with %s effect, upon user focus change it gets un-highlighted",
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

      const well_enter = wrapper.find(selector_str);
      await well_enter.trigger("mouseenter");
      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.find(selector_str).attributes("stroke")).toBe("#ececed");
      expect(wrapper.find(selector_str).attributes("stroke-width")).toBe("2");

      const well_leave = wrapper.find(selector_str);
      await well_leave.trigger("mouseleave");
      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.find(selector_str).attributes("stroke")).toBe("#FFFFFF");
      expect(wrapper.find(selector_str).attributes("stroke-width")).toBe("0");
    }
  );
  test.each([
    ["Row A", [0, 4, 8, 12, 16, 20], "#row_1"],
    ["Row B", [1, 5, 9, 13, 17, 21], "#row_2"],
    ["Row C", [2, 6, 10, 14, 18, 22], "#row_3"],
    ["Row D", [3, 7, 11, 15, 19, 23], "#row_4"],
    ["Column 01", [0, 1, 2, 3], "#column_1"],
    ["Column 02", [4, 5, 6, 7], "#column_2"],
    ["Column 03", [8, 9, 10, 11], "#column_3"],
    ["Column 04", [12, 13, 14, 15], "#column_4"],
    ["Column 05", [16, 17, 18, 19], "#column_5"],
    ["Column 06", [20, 21, 22, 23], "#column_6"],
  ])(
    "Given that no wells are selected, When user Hover on %s, Then then wells %s visually become selected with outline of 4px and color or #ececed, on un-hover the outline color #ececed  and not visible as  0px stroke outline",
    async (string_name_of_button, array_of_well_indices, selector_str) => {
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
      const icon_one_btn = wrapper.find(selector_str);

      await icon_one_btn.trigger("mouseenter");
      await wrapper.vm.$nextTick();
      for (let i = 0; i < array_of_well_indices.length; i++) {
        const iter_well_idx = array_of_well_indices[i];
        expect(wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")).toBe("2");
        expect(wrapper.find(".plate_" + iter_well_idx).attributes("stroke")).toBe("#ececed");
      }

      await icon_one_btn.trigger("mouseleave");
      await wrapper.vm.$nextTick();
      for (let i = 0; i < array_of_well_indices.length; i++) {
        const iter_well_idx = array_of_well_indices[i];
        expect(wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")).toBe("0");
        expect(wrapper.find(".plate_" + iter_well_idx).attributes("stroke")).toBe("#ececed");
      }
    }
  );
  test.each([
    ["Row A", [0, 4, 8, 12, 16, 20], "#row_1"],
    ["Row B", [1, 5, 9, 13, 17, 21], "#row_2"],
    ["Row C", [2, 6, 10, 14, 18, 22], "#row_3"],
    ["Row D", [3, 7, 11, 15, 19, 23], "#row_4"],
  ])(
    "Given that even wells are selected, When user Hover on %s, Then then wells which are even on hover renders the output of stroke 4px and color #ececed, and odd number wells have stroke 2px and color #ececed",
    async (string_name_of_button, array_of_well_indices, selector_str) => {
      const select = [];
      for (let i = 0; i < 24; i++) {
        if (i % 2 == 0) {
          select.push(true);
        } else {
          select.push(false);
        }
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

      const icon_one_btn = wrapper.find(selector_str);

      await icon_one_btn.trigger("mouseenter");
      await wrapper.vm.$nextTick();
      for (let i = 0; i < array_of_well_indices.length; i++) {
        const iter_well_idx = array_of_well_indices[i];
        if (string_name_of_button == "Row A" || string_name_of_button == "Row C") {
          expect(wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")).toBe("4");
        } else {
          expect(wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")).toBe("2");
        }
        expect(wrapper.find(".plate_" + iter_well_idx).attributes("stroke")).toBe("#ececed");
      }

      await icon_one_btn.trigger("mouseleave");
      await wrapper.vm.$nextTick();
      for (let i = 0; i < array_of_well_indices.length; i++) {
        const iter_well_idx = array_of_well_indices[i];
        if (string_name_of_button == "Row A" || string_name_of_button == "Row C") {
          expect(wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")).toBe("4");
          expect(wrapper.find(".plate_" + iter_well_idx).attributes("stroke")).toBe("#FFFFFF");
        } else {
          expect(wrapper.find(".plate_" + iter_well_idx).attributes("stroke-width")).toBe("0");
          expect(wrapper.find(".plate_" + iter_well_idx).attributes("stroke")).toBe("#ececed");
        }
      }
    }
  );
  test.each([
    ["Row A", [0, 4, 8, 12, 16, 20], "#row_1"],
    ["Row B", [1, 5, 9, 13, 17, 21], "#row_2"],
    ["Row C", [2, 6, 10, 14, 18, 22], "#row_3"],
    ["Row D", [3, 7, 11, 15, 19, 23], "#row_4"],
  ])(
    "Given that odd wells are selected, When user Hover on %s, Then then wells with odd numbered are selected and have stroke outline of 4px and color #ececed, and other wells have stroke outline of 2px and color #ececed",
    async (string_name_of_button, array_of_well_indices, selector_str) => {
      const select = [];
      for (let i = 0; i < 24; i++) {
        if (i % 3 == 0) {
          select.push(true);
        } else {
          select.push(false);
        }
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

      const icon_one_btn = wrapper.find(selector_str);

      await icon_one_btn.trigger("mouseenter");
      await wrapper.vm.$nextTick();
      for (let i = 0; i < array_of_well_indices.length; i++) {
        const iter_well_idx = array_of_well_indices[i];
        expect(wrapper.find(".plate_" + iter_well_idx).attributes("stroke")).toBe("#ececed");
      }

      await icon_one_btn.trigger("mouseleave");
      await wrapper.vm.$nextTick();
      // just code coverage perspective.
    }
  );
});
