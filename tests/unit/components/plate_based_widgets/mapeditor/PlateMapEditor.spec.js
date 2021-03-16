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
  test("When mounting PlateMapEditor with empty propdata, Then it loads successfully", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
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
    const svg_plus = wrapper.find("#plus");
    const svg_minus = wrapper.find("#minus");

    expect(svg_plus.isVisible()).toBe(true);
    for (let count = 0; count < 24; count++) {
      const well1 = wrapper.find(".plate_" + count);
      expect(well1.attributes("stroke-width")).toBe("0");
    }
    expect(svg_minus.isVisible()).toBe(false);

    await icon_btn.trigger("click");
    expect(svg_plus.isVisible()).toBe(false);
    for (let count = 0; count < 24; count++) {
      const well2 = wrapper.find(".plate_" + count);
      expect(well2.attributes("stroke-width")).toBe("4");
    }
    expect(svg_minus.isVisible()).toBe(true);
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
    const svg_plus = wrapper.find("#plus");
    const svg_minus = wrapper.find("#minus");

    expect(svg_minus.isVisible()).toBe(true);
    for (let count = 0; count < 24; count++) {
      const well1 = wrapper.find(".plate_" + count);
      expect(well1.attributes("stroke-width")).toBe("4");
    }
    expect(svg_plus.isVisible()).toBe(false);

    await icon_btn.trigger("click");
    for (let count = 0; count < 24; count++) {
      const well2 = wrapper.find(".plate_" + count);
      expect(well2.attributes("stroke-width")).toBe("0");
      expect(svg_minus.isVisible()).toBe(false);
      expect(svg_plus.isVisible()).toBe(true);
    }
  });
  test.each([
    [".well_0", 0, ".plate_0", "Click"],
    [".well_1", 1, ".plate_1", "Click"],
    [".well_2", 2, ".plate_2", "Click"],
    [".well_3", 3, ".plate_3", "Click"],
    [".well_4", 4, ".plate_4", "Click"],
    [".well_5", 5, ".plate_5", "Click"],
    [".well_6", 6, ".plate_6", "Click"],
    [".well_7", 7, ".plate_7", "Click"],
    [".well_8", 8, ".plate_8", "Click"],
    [".well_9", 9, ".plate_9", "Click"],
    [".well_10", 10, ".plate_10", "Click"],
    [".well_11", 11, ".plate_11", "Click"],
    [".well_12", 12, ".plate_12", "Click"],
    [".well_13", 13, ".plate_13", "Click"],
    [".well_14", 14, ".plate_14", "Click"],
    [".well_15", 15, ".plate_15", "Click"],
    [".well_16", 16, ".plate_16", "Click"],
    [".well_17", 17, ".plate_17", "Click"],
    [".well_18", 18, ".plate_18", "Click"],
    [".well_19", 19, ".plate_19", "Click"],
    [".well_20", 20, ".plate_20", "Click"],
    [".well_21", 21, ".plate_21", "Click"],
    [".well_22", 22, ".plate_22", "Click"],
    [".well_23", 23, ".plate_23", "Click"],
  ])(
    "Given that no wells are selected, When user on %s, Then then well %s due to user action %s visually become selected (have the stroke outline)",
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

      const plate = wrapper.find(selector_str);
      await plate.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(wrapper.find(selector_str).attributes("stroke-width")).toBe("4");
    }
  );
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

      const plate = wrapper.find(selector_str);
      await plate.trigger("click", {
        ctrlKey: true, // For testing @click.ctrl handlers
      });
      await wrapper.vm.$nextTick(); // wait for update

      expect(
        wrapper.find(".plate_" + well_indices).attributes("stroke-width")
      ).toBe("4");
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

      const plate = wrapper.find(selector_str);
      await plate.trigger("click", {
        shiftKey: true, // For testing @click.ctrl handlers
      });
      await wrapper.vm.$nextTick(); // wait for update

      expect(
        wrapper.find(".plate_" + well_indices).attributes("stroke-width")
      ).toBe("4");
    }
  );

  test("Given that no wells are selected, When user Shift+Click on all the wells from 1 to 24, Then the icon (+) changes to (-)", async () => {
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

    const svg_plus = wrapper.find("#plus");
    const svg_minus = wrapper.find("#minus");
    expect(svg_plus.isVisible()).toBe(true);
    expect(svg_minus.isVisible()).toBe(false);

    const well_indices = Array.from(Array(24).keys());

    for (let i = 0; i < 24; i++) {
      const plate = wrapper.find(".plate_" + well_indices[i]);
      await plate.trigger("click", {
        shiftKey: true, // For testing @click.ctrl handlers
      });
    }
    expect(svg_plus.isVisible()).toBe(false);
    expect(svg_minus.isVisible()).toBe(true);
  });
  test("Given that all wells are pre-selected, When user Click on well 0, Then the icon (-) changes to (+)", async () => {
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
    for (let count = 0; count < 24; count++) {
      const well1 = wrapper.find(".plate_" + count);
      expect(well1.attributes("stroke-width")).toBe("4");
    }

    const svg_plus = wrapper.find("#plus");
    const svg_minus = wrapper.find("#minus");
    expect(svg_plus.isVisible()).toBe(false);
    expect(svg_minus.isVisible()).toBe(true);

    const well_indices = 0;
    const plate = wrapper.find(".plate_" + well_indices);
    await plate.trigger("click", {
      shiftKey: true, // For testing @click.ctrl handlers
    });
    await wrapper.vm.$nextTick(); // wait for update

    expect(svg_plus.isVisible()).toBe(true);
    expect(svg_minus.isVisible()).toBe(false);
  });
});
