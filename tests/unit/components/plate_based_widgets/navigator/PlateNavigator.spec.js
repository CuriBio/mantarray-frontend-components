import ComponentToTest from "@/components/plate_based_widgets/navigator/PlateNavigator.vue";
import { PlateNavigator as DistComponentToTest } from "@/dist/mantarray.common";
import { shallowMount } from "@vue/test-utils";

import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

beforeAll(async () => {
  // note the store will mutate across tests, so make sure to re-create it in beforeEach
  const storePath = `${process.env.buildDir}/store.js`;
  NuxtStore = await import(storePath);
});

beforeEach(async () => {
  store = await NuxtStore.createStore();
});

afterEach(() => wrapper.destroy());

const quadrants = {
  TOP_LEFT: [0, 1, 4, 5, 8, 9],
  TOP_RIGHT: [12, 13, 16, 17, 20, 21],
  BOTTOM_LEFT: [2, 3, 6, 7, 10, 11],
  BOTTOM_RIGHT: [14, 15, 18, 19, 22, 23],
};

describe("PlateNavigator.vue", () => {
  test("When mounting PlateNavigator from the build dist file, it loads successfully", () => {
    const propsData = {};
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const all_wells = wrapper.findAll("circle");

    expect(all_wells).toHaveLength(24);
  });
  test.each([
    [0, "TOP_LEFT"],
    [1, "TOP_LEFT"],
    [4, "TOP_LEFT"],
    [5, "TOP_LEFT"],
    [8, "TOP_LEFT"],
    [9, "TOP_LEFT"],
    [12, "TOP_RIGHT"],
    [13, "TOP_RIGHT"],
    [16, "TOP_RIGHT"],
    [17, "TOP_RIGHT"],
    [20, "TOP_RIGHT"],
    [21, "TOP_RIGHT"],
    [2, "BOTTOM_LEFT"],
    [3, "BOTTOM_LEFT"],
    [6, "BOTTOM_LEFT"],
    [7, "BOTTOM_LEFT"],
    [10, "BOTTOM_LEFT"],
    [11, "BOTTOM_LEFT"],
    [14, "BOTTOM_RIGHT"],
    [15, "BOTTOM_RIGHT"],
    [18, "BOTTOM_RIGHT"],
    [19, "BOTTOM_RIGHT"],
    [22, "BOTTOM_RIGHT"],
    [23, "BOTTOM_RIGHT"],
  ])(
    "When mouse enters well index %i, Then the internal data hovered_quadrant_wells becomes the indices in the %s quadrant, When mouse leaves then hover_quadrant_wells becomes empty array",
    async (well_index, expected_quadrant_name) => {
      const propsData = {};
      wrapper = shallowMount(ComponentToTest, {
        propsData,
        store,
        localVue,
      });
      expect(wrapper.vm.hovered_quadrant_wells).toEqual([]);
      const well_to_enter = wrapper.find("#well_" + well_index);
      well_to_enter.trigger("mouseenter");
      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.vm.hovered_quadrant_wells).toEqual(quadrants[expected_quadrant_name]);
      well_to_enter.trigger("mouseleave");
      await wrapper.vm.$nextTick(); // wait for update
      expect(wrapper.vm.hovered_quadrant_wells).toEqual([]);
    }
  );

  test.each([
    ["TOP_RIGHT", 0, "TOP_LEFT"],
    ["TOP_RIGHT", 1, "TOP_LEFT"],
    ["TOP_RIGHT", 4, "TOP_LEFT"],
    ["TOP_RIGHT", 5, "TOP_LEFT"],
    ["TOP_RIGHT", 8, "TOP_LEFT"],
    ["TOP_RIGHT", 9, "TOP_LEFT"],
    ["BOTTOM_LEFT", 12, "TOP_RIGHT"],
    ["BOTTOM_LEFT", 13, "TOP_RIGHT"],
    ["BOTTOM_LEFT", 16, "TOP_RIGHT"],
    ["BOTTOM_LEFT", 17, "TOP_RIGHT"],
    ["BOTTOM_LEFT", 20, "TOP_RIGHT"],
    ["BOTTOM_LEFT", 21, "TOP_RIGHT"],
    ["TOP_LEFT", 2, "BOTTOM_LEFT"],
    ["TOP_LEFT", 3, "BOTTOM_LEFT"],
    ["TOP_LEFT", 6, "BOTTOM_LEFT"],
    ["TOP_LEFT", 7, "BOTTOM_LEFT"],
    ["TOP_LEFT", 10, "BOTTOM_LEFT"],
    ["TOP_LEFT", 11, "BOTTOM_LEFT"],
    ["TOP_LEFT", 14, "BOTTOM_RIGHT"],
    ["TOP_LEFT", 15, "BOTTOM_RIGHT"],
    ["TOP_LEFT", 18, "BOTTOM_RIGHT"],
    ["TOP_LEFT", 19, "BOTTOM_RIGHT"],
    ["TOP_LEFT", 22, "BOTTOM_RIGHT"],
    ["TOP_LEFT", 23, "BOTTOM_RIGHT"],
  ])(
    "Given the Vuex state is set to quadrant %s, When clicking on well index %i, Then the Vuex store mutates to contain the indices in the %s quadrant",
    async (starting_quadrant_name, well_index, expected_quadrant_name) => {
      store.commit("twentyfourcontrols/set_is_quadrant", quadrants[starting_quadrant_name]);
      const propsData = {};
      wrapper = shallowMount(ComponentToTest, {
        propsData,
        store,
        localVue,
      });
      const well_to_click = wrapper.find("#well_" + well_index);
      well_to_click.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update
      expect(store.state.twentyfourcontrols.is_quadrant).toEqual(quadrants[expected_quadrant_name]);
    }
  );

  test.each([
    ["TOP_LEFT", 0, false, "TOP_LEFT"],
    ["TOP_RIGHT", 1, true, "TOP_LEFT"],
    ["BOTTOM_LEFT", 3, false, "BOTTOM_LEFT"],
    ["BOTTOM_LEFT", 23, true, "BOTTOM_RIGHT"],
  ])(
    "Given the Vuex state is set to quadrant %s, When mouseenter on well index %i, Then '%s' that all the wells in the %s quadrant should update contain the CSS class for hovering",
    async (starting_quadrant_name, well_index, expected_to_have_hover_attributes, hovering_quadrant_name) => {
      store.commit("twentyfourcontrols/set_is_quadrant", quadrants[starting_quadrant_name]);
      const propsData = {};
      wrapper = shallowMount(ComponentToTest, {
        propsData,
        store,
        localVue,
      });
      const hovering_quadrant = quadrants[hovering_quadrant_name];
      const well_to_enter = wrapper.find("#well_" + well_index);
      well_to_enter.trigger("mouseenter");
      await wrapper.vm.$nextTick(); // wait for update
      const expected_selected_class_name = "circle__plate-navigator-well--selected";
      const expected_hover_class_name = "circle__plate-navigator-well--unselected-hover";
      if (expected_to_have_hover_attributes) {
        for (let i = 0; i < hovering_quadrant.length; i++) {
          const well_to_check = wrapper.find("#well_" + hovering_quadrant[i]);
          expect(well_to_check.classes()).toContain(expected_hover_class_name);
          expect(well_to_check.classes()).not.toContain(expected_selected_class_name);
        }
      } else {
        for (let i = 0; i < hovering_quadrant.length; i++) {
          const well_to_check = wrapper.find("#well_" + hovering_quadrant[i]);
          expect(well_to_check.classes()).not.toContain(expected_hover_class_name);
          expect(well_to_check.classes()).toContain(expected_selected_class_name);
        }
      }
    }
  );

  test("Applies the 'selected' CSS class to wells in the quadrant specified in the Vuex store initially when the component mounts", async () => {
    const expected_selected_wells = quadrants.TOP_RIGHT;
    store.commit("twentyfourcontrols/set_is_quadrant", expected_selected_wells);
    const propsData = {};
    wrapper = shallowMount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const expected_class_name = "circle__plate-navigator-well--selected";

    let this_well_wrapper = wrapper.find("#well_12");
    expect(this_well_wrapper.classes()).toContain(expected_class_name);

    this_well_wrapper = wrapper.find("#well_13");
    expect(this_well_wrapper.classes()).toContain(expected_class_name);

    this_well_wrapper = wrapper.find("#well_16");
    expect(this_well_wrapper.classes()).toContain(expected_class_name);

    this_well_wrapper = wrapper.find("#well_17");
    expect(this_well_wrapper.classes()).toContain(expected_class_name);

    this_well_wrapper = wrapper.find("#well_20");
    expect(this_well_wrapper.classes()).toContain(expected_class_name);

    this_well_wrapper = wrapper.find("#well_21");
    expect(this_well_wrapper.classes()).toContain(expected_class_name);

    // check in another well to confirm it is not active in all wells
    this_well_wrapper = wrapper.find("#well_0");
    expect(this_well_wrapper.classes()).not.toContain(expected_class_name);
  });

  test("updates the wells that have the CSS 'selected' class when Vuex store changes after component has been mounted", async () => {
    const propsData = {};
    wrapper = shallowMount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const expected_class_name = "circle__plate-navigator-well--selected";

    // confirm they are not selected initially

    let this_well_wrapper = wrapper.find("#well_2");
    expect(this_well_wrapper.classes()).not.toContain(expected_class_name);

    // and that a well in top-left quadrant is selected
    this_well_wrapper = wrapper.find("#well_0");
    expect(this_well_wrapper.classes()).toContain(expected_class_name);

    store.commit("twentyfourcontrols/set_is_quadrant", quadrants.BOTTOM_LEFT);
    await wrapper.vm.$nextTick(); // wait for update

    // confirm that the well in top-left quadrant is no longer selected
    this_well_wrapper = wrapper.find("#well_0");
    expect(this_well_wrapper.classes()).not.toContain(expected_class_name);

    // confirm that all the wells in expected quadrant are selected
    this_well_wrapper = wrapper.find("#well_2");
    expect(this_well_wrapper.classes()).toContain(expected_class_name);

    this_well_wrapper = wrapper.find("#well_3");
    expect(this_well_wrapper.classes()).toContain(expected_class_name);

    this_well_wrapper = wrapper.find("#well_6");
    expect(this_well_wrapper.classes()).toContain(expected_class_name);

    this_well_wrapper = wrapper.find("#well_7");
    expect(this_well_wrapper.classes()).toContain(expected_class_name);

    this_well_wrapper = wrapper.find("#well_10");
    expect(this_well_wrapper.classes()).toContain(expected_class_name);

    this_well_wrapper = wrapper.find("#well_11");
    expect(this_well_wrapper.classes()).toContain(expected_class_name);
  });
});
