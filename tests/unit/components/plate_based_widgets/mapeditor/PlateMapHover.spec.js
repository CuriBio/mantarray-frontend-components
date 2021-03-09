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
  test("Given that none of the wells are selected, minus button should not be visible and stroke outlines should be zero on all wells, When hovers the plus button, Then all 24 wells should have a stroke hover outline", async () => {
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
      expect(well2.attributes("stroke-width")).toBe("4");
      expect(well2.attributes("stroke")).toBe("#ececed");
    }
    await icon_btn.trigger("mouseleave");
    for (let count = 0; count < 24; count++) {
      const well2 = wrapper.find(".plate_" + count);
      expect(well2.attributes("stroke-width")).toBe("0");
      expect(well2.attributes("stroke")).toBe("#ececed");
    }
  });
  test("Given that all of the wells are selected, plus button should not be visible and stroke outlines should be present on all wells, When user hovers the minus button, Then all 24 wells should no longer have a hover stroke outline", async () => {
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
});
