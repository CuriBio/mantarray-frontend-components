import { mount } from "@vue/test-utils";
import PlateHeatMap from "@/components/plate_based_widgets/mapeditor/PlateHeatMap.vue";
import { PlateHeatMap as DistComponentToTest } from "@/dist/mantarray.common";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);
let NuxtStore;
let store;

describe("PlateHeatMap.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting PlateHeatMap from the build dist file, Then it loads successfully", async () => {
    const select = new Array(24).fill(false);
    const color = new Array(24).fill("#b7b7b7");

    const propsData = {
      selected: select,
      platecolor: color,
    };
    const wrapper = mount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const all_wells = wrapper.findAll("circle");
    expect(all_wells).toHaveLength(24);
  });

  test("When mounting PlateHeatMap with empty propdata, Then it loads successfully", async () => {
    const propsData = {};
    const wrapper = mount(PlateHeatMap, {
      propsData,
      store,
      localVue,
    });
    const all_wells = wrapper.findAll("circle");
    expect(all_wells).toHaveLength(24);
  });

  test("Given that none of the wells are selected, minus button should not be visible and stroke outlines should be zero on all wells, When user clicks the plus button, Then all 24 wells should have a stroke outline", async () => {
    const select = new Array(24).fill(false);
    const color = new Array(24).fill("#b7b7b7");

    const propsData = {
      selected: select,
      platecolor: color,
    };
    const wrapper = mount(PlateHeatMap, {
      propsData,
      store,
      localVue,
    });

    const icon_btn = wrapper.find(".span__heatmap-toggle-plus-minus-icon");
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
    await icon_btn.trigger("click");
    expect(svg_minus.isVisible()).toBe(false);
  });

  test("Given that no wells are selected, When user Shift+Click on all the wells from 1 to 24, Then all 24 wells have stroke width of 4px", async () => {
    const select = new Array(24).fill(false);
    const color = new Array(24).fill("#b7b7b7");

    const propsData = {
      selected: select,
      platecolor: color,
    };
    const wrapper = mount(PlateHeatMap, {
      propsData,
      store,
      localVue,
    });
    new Array(24).map(async (well) => {
      wrapper.find("#well_" + well);
      expect(wrapper.vm.sroke_width[well]).toBe(0);
    });

    const svg_plus = wrapper.find("#plus");
    const svg_minus = wrapper.find("#minus");
    expect(svg_plus.isVisible()).toBe(true);
    expect(svg_minus.isVisible()).toBe(false);

    new Array(24).map(async (well) => {
      await wrapper.find("#well_" + well).trigger("click", {
        shiftKey: true,
      });
    });
    new Array(24).map(async (well) => {
      wrapper.find("#well_" + well);
      expect(wrapper.vm.sroke_width[well]).toBe(4);
    });
  });

  test("Given all wells are selected, When well, column, or row is unselected, Then minus icon should toggle to plus", async () => {
    const select = new Array(24).fill(false);
    const color = new Array(24).fill("#b7b7b7");

    const propsData = {
      selected: select,
      platecolor: color,
    };
    const wrapper = mount(PlateHeatMap, {
      propsData,
      store,
      localVue,
    });
    await wrapper.find(".span__heatmap-toggle-plus-minus-icon").trigger("click");
    expect(wrapper.find("#plus").isVisible()).toBe(false);
    await wrapper.vm.basic_select(4);
    expect(wrapper.find("#plus").isVisible()).toBe(true);
    await wrapper.find(".span__heatmap-toggle-plus-minus-icon").trigger("click");
    await wrapper.vm.on_column_select(3);
    expect(wrapper.find("#plus").isVisible()).toBe(true);
    await wrapper.find(".span__heatmap-toggle-plus-minus-icon").trigger("click");
    await wrapper.vm.on_row_select("D");
    expect(wrapper.find("#plus").isVisible()).toBe(true);
  });

  test("Given any number of wells, but all are selected, When plus-minus icon is hovered over and left, Then all unselected wells should have a stroke width of 2", async () => {
    const wrapper = mount(PlateHeatMap, {
      store,
      localVue,
    });
    await wrapper.find(".span__heatmap-toggle-plus-minus-icon").trigger("mouseenter");
    wrapper.vm.stroke_width.map((well) => {
      expect(well).toBe(2);
    });
    await wrapper.find(".span__heatmap-toggle-plus-minus-icon").trigger("mouseleave");
    wrapper.vm.stroke_width.map((well) => {
      expect(well).toBe(0);
    });
    await wrapper.find(".span__heatmap-toggle-plus-minus-icon").trigger("click");
    await wrapper.find(".span__heatmap-toggle-plus-minus-icon").trigger("mouseenter");
    wrapper.vm.stroke_width.map((well) => {
      expect(well).toBe(4);
    });
    await wrapper.find(".span__heatmap-toggle-plus-minus-icon").trigger("mouseleave");
  });

  test("When an unselected well is hovered over and left, Then it should toggle a stroke with of 2px and 0px", async () => {
    const wrapper = mount(PlateHeatMap, {
      store,
      localVue,
    });

    new Array(24).map(async (well) => {
      await wrapper.find("#well_" + well).trigger("enter-well");
      expect(wrapper.vm.stroke_width[well]).toBe(2);
      expect(wrapper.vm.hover_color[well]).toBe("#ececed");
      await wrapper.find("#well_" + well).trigger("leave-well");
      expect(wrapper.vm.stroke_width[well]).toBe(0);
      expect(wrapper.vm.hover_color[well]).toBe("#b7b7b7");
    });
  });

  test.each([
    ["#column_1", [0, 1, 2, 3]],
    ["#column_2", [4, 5, 6, 7]],
    ["#column_3", [8, 9, 10, 11]],
    ["#column_4", [12, 13, 14, 15]],
    ["#column_5", [16, 17, 18, 19]],
    ["#column_6", [20, 21, 22, 23]],
    ["#row_1", [0, 4, 8, 12, 16, 20]],
    ["#row_2", [1, 5, 9, 13, 17, 21]],
    ["#row_3", [2, 6, 10, 14, 18, 22]],
    ["#row_4", [3, 7, 11, 15, 19, 23]],
  ])(
    "Given no wells are selected, When user selects a row/column label, Then corresponding unselected wells will have a stroke_width of 4",
    async (id, wells) => {
      const propsData = {
        selected: new Array(24).fill(false),
        platecolor: new Array(24).fill("#b7b7b7"),
      };
      const wrapper = mount(PlateHeatMap, {
        propsData,
        store,
        localVue,
      });

      await wrapper.find(id).trigger("click");
      wells.map((well) => expect(wrapper.vm.stroke_width[well]).toBe(4));
    }
  );

  test.each([
    ["#column_1", [0, 1, 2, 3]],
    ["#column_2", [4, 5, 6, 7]],
    ["#column_3", [8, 9, 10, 11]],
    ["#column_4", [12, 13, 14, 15]],
    ["#column_5", [16, 17, 18, 19]],
    ["#column_6", [20, 21, 22, 23]],
    ["#row_1", [0, 4, 8, 12, 16, 20]],
    ["#row_2", [1, 5, 9, 13, 17, 21]],
    ["#row_3", [2, 6, 10, 14, 18, 22]],
    ["#row_4", [3, 7, 11, 15, 19, 23]],
  ])(
    "Given no wells are selected, When user enters and leaves a row/column label, Then corresponding unselected wells will toggle stroke-width of 2px and 0px",
    async (id, wells) => {
      const propsData = {
        selected: new Array(24).fill(false),
        platecolor: new Array(24).fill("#b7b7b7"),
      };
      const wrapper = mount(PlateHeatMap, {
        propsData,
        store,
        localVue,
      });

      await wrapper.find(id).trigger("mouseenter");
      wells.map((well) => expect(wrapper.vm.stroke_width[well]).toBe(2));
      await wrapper.find(id).trigger("mouseleave");
      wells.map((well) => expect(wrapper.vm.stroke_width[well]).toBe(0));
    }
  );

  test("Given no wells are selected, When user shift+clicks a column label, Then corresponding unselected wells will toggle stroke-width of 4px and 0px", async () => {
    const propsData = {
      selected: new Array(24).fill(false),
      platecolor: new Array(24).fill("#b7b7b7"),
    };
    const wrapper = mount(PlateHeatMap, {
      propsData,
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
      await wrapper.find(column[0]).trigger("click", { shiftKey: true });
      column[1].map((well) => expect(wrapper.vm.stroke_width[well]).toBe(0));
    });
  });

  test("Given no wells are selected, When user shift+clicks a row label, Then corresponding unselected wells will toggle stroke-width of 4px and 0px", async () => {
    const propsData = {
      selected: new Array(24).fill(false),
      platecolor: new Array(24).fill("#b7b7b7"),
    };
    const wrapper = mount(PlateHeatMap, {
      propsData,
      store,
      localVue,
    });
    const test = [
      ["#row_1", [0, 4, 8, 12, 16, 20]],
      ["#row_2", [1, 5, 9, 13, 17, 21]],
      ["#row_3", [2, 6, 10, 14, 18, 22]],
      ["#row_4", [3, 7, 11, 15, 19, 23]],
    ];
    test.map(async (row) => {
      await wrapper.find(row[0]).trigger("click", { shiftKey: true });
      row[1].map((well) => expect(wrapper.vm.stroke_width[well]).toBe(4));
      await wrapper.find(row[0]).trigger("click", { shiftKey: true });
      row[1].map((well) => expect(wrapper.vm.stroke_width[well]).toBe(0));
    });
  });
});
