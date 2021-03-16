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
    "Given that none of the wells are selected, When user clicks the Row/Column button, Then wells corresponding to that row is seleced with outline of 4px;",
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

      const selector = wrapper.find(selector_str);

      await selector.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      for (let count = 0; count < array_of_well_indices.length; count++) {
        const well_index = array_of_well_indices[count];
        const well = wrapper.find(".plate_" + well_index);
        expect(well.attributes("stroke-width")).toBe("4");
      }
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
    "Given that none of the wells are selected, When user Shift+clicks the Row/Column button, Then wells corresponding to that row is seleced with outline of 4px;",
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

      const selector = wrapper.find(selector_str);

      await selector.trigger("click", {
        shiftKey: true, // For testing @click.shift handlers
      });
      await wrapper.vm.$nextTick(); // wait for update

      for (let count = 0; count < array_of_well_indices.length; count++) {
        const well_index = array_of_well_indices[count];
        const well = wrapper.find(".plate_" + well_index);
        expect(well.attributes("stroke-width")).toBe("4");
      }
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
    "Given that none of the wells are selected, When user Ctrl+clicks the Row/Column button, Then wells corresponding to that row is seleced with outline of 4px;",
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

      const selector = wrapper.find(selector_str);

      await selector.trigger("click", {
        ctrlKey: true, // For testing @click.shift handlers
      });
      await wrapper.vm.$nextTick(); // wait for update

      for (let count = 0; count < array_of_well_indices.length; count++) {
        const well_index = array_of_well_indices[count];
        const well = wrapper.find(".plate_" + well_index);
        expect(well.attributes("stroke-width")).toBe("4");
      }
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
    "Given that odd numbered  wells are selected, When user Shift+clicks the Row/Column button, Then wells corresponding to even numbered is seleced with outline of 4px;",
    async (string_name_of_button, array_of_well_indices, selector_str) => {
      const select = [];
      for (let i = 0; i < 24; i++) {
        if (i % 2 == 0) {
          select.push(false);
        } else {
          select.push(true);
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

      const selector = wrapper.find(selector_str);

      await selector.trigger("click", {
        shiftKey: true, // For testing @click.shift handlers
      });
      await wrapper.vm.$nextTick(); // wait for update

      for (let count = 0; count < array_of_well_indices.length; count++) {
        const well_index = array_of_well_indices[count];
        const well = wrapper.find(".plate_" + well_index);
        if (
          string_name_of_button == "Row B" ||
          string_name_of_button == "Row D"
        ) {
          expect(well.attributes("stroke-width")).toBe("0");
        } else {
          expect(well.attributes("stroke-width")).toBe("4");
        }
      }
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
    "Given that even numbered  wells are selected, When user Shift+clicks the Row/Column button, Then wells corresponding to odd numbered is seleced with outline of 4px;",
    async (string_name_of_button, array_of_well_indices, selector_str) => {
      const select = [];
      for (let i = 0; i < 24; i++) {
        if (i % 3 == 0) {
          select.push(false);
        } else {
          select.push(true);
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

      const selector = wrapper.find(selector_str);

      await selector.trigger("click", {
        shiftKey: true, // For testing @click.shift handlers
      });
      await wrapper.vm.$nextTick(); // wait for update

      for (let count = 0; count < array_of_well_indices.length; count++) {
        const well_index = array_of_well_indices[count];
        const well = wrapper.find(".plate_" + well_index);
        expect(well.attributes("stroke-width")).toBe("4");
      }
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
    "Given that all the wells are selected, When user Shift+clicks the Row/Column button, Then wells corresponding row/columns get deselected and with outline of 0px;",
    async (string_name_of_button, array_of_well_indices, selector_str) => {
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

      const selector = wrapper.find(selector_str);

      await selector.trigger("click", {
        shiftKey: true, // For testing @click.shift handlers
      });
      await wrapper.vm.$nextTick(); // wait for update

      for (let count = 0; count < array_of_well_indices.length; count++) {
        const well_index = array_of_well_indices[count];
        const well = wrapper.find(".plate_" + well_index);
        expect(well.attributes("stroke-width")).toBe("0");
      }
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
    "Given that none of the wells are selected, When user Ctrl+clicks the Row/Column button, Then wells corresponding to that row is seleced with outline of 4px;",
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

      const selector = wrapper.find(selector_str);

      await selector.trigger("click", {
        ctrlKey: true, // For testing @click.shift handlers
      });
      await wrapper.vm.$nextTick(); // wait for update

      for (let count = 0; count < array_of_well_indices.length; count++) {
        const well_index = array_of_well_indices[count];
        const well = wrapper.find(".plate_" + well_index);
        expect(well.attributes("stroke-width")).toBe("4");
      }
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
    "Given that odd numbered  wells are selected, When user Shift+clicks the Row/Column button, Then wells corresponding to even numbered is seleced with outline of 4px;",
    async (string_name_of_button, array_of_well_indices, selector_str) => {
      const select = [];
      for (let i = 0; i < 24; i++) {
        if (i % 2 == 0) {
          select.push(false);
        } else {
          select.push(true);
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

      const selector = wrapper.find(selector_str);

      await selector.trigger("click", {
        ctrlKey: true, // For testing @click.shift handlers
      });
      await wrapper.vm.$nextTick(); // wait for update

      for (let count = 0; count < array_of_well_indices.length; count++) {
        const well_index = array_of_well_indices[count];
        const well = wrapper.find(".plate_" + well_index);
        if (
          string_name_of_button == "Row B" ||
          string_name_of_button == "Row D"
        ) {
          expect(well.attributes("stroke-width")).toBe("0");
        } else {
          expect(well.attributes("stroke-width")).toBe("4");
        }
      }
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
    "Given that even numbered  wells are selected, When user Shift+clicks the Row/Column button, Then wells corresponding to odd numbered is seleced with outline of 4px;",
    async (string_name_of_button, array_of_well_indices, selector_str) => {
      const select = [];
      for (let i = 0; i < 24; i++) {
        if (i % 3 == 0) {
          select.push(false);
        } else {
          select.push(true);
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

      const selector = wrapper.find(selector_str);

      await selector.trigger("click", {
        ctrlKey: true, // For testing @click.shift handlers
      });
      await wrapper.vm.$nextTick(); // wait for update

      for (let count = 0; count < array_of_well_indices.length; count++) {
        const well_index = array_of_well_indices[count];
        const well = wrapper.find(".plate_" + well_index);
        expect(well.attributes("stroke-width")).toBe("4");
      }
    }
  );
  test("Given that all the wells are pre-selected, When user clicks on Row A, Then only the Wells in the Row A are selected and icon (-) is updated to (+)", async () => {
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
    const svg_plus = wrapper.find("#plus");
    const svg_minus = wrapper.find("#minus");

    expect(svg_minus.isVisible()).toBe(true);
    expect(svg_plus.isVisible()).toBe(false);
    const row_a = wrapper.find("#row_1");
    await row_a.trigger("click");
    expect(svg_minus.isVisible()).toBe(false);
    expect(svg_plus.isVisible()).toBe(true);
  });
  test("Given that all the wells are pre-selected, When user clicks on Column 1, Then only the Wells in the Column 1 are selected and icon (-) is updated to (+)", async () => {
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
    const svg_plus = wrapper.find("#plus");
    const svg_minus = wrapper.find("#minus");

    expect(svg_minus.isVisible()).toBe(true);
    expect(svg_plus.isVisible()).toBe(false);
    const column_one = wrapper.find("#column_1");
    await column_one.trigger("click");
    expect(svg_minus.isVisible()).toBe(false);
    expect(svg_plus.isVisible()).toBe(true);
  });
});
