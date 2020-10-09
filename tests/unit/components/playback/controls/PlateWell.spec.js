import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/PlateWell.vue";
import { PlateWell as DistComponentToTest } from "@/dist/mantarray.common";
// import { shallowMount } from "@vue/test-utils";

import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

describe("PlateWell.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());
  test("When mounting PlateWell from the build dist file, Then it loads successfully", async () => {
    const propsData = {
      classname: "plate",
      svg_height: 100,
      svg_width: 100,
      circle_x: 50,
      circle_y: 50,
      radius: 50,
      strk: "#ececed",
      stroke_wdth: 0,
      plate_fill: "#b7b7b7",
      index: 0,
    };
    wrapper = mount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const well = wrapper.findAll("circle");
    expect(well).toHaveLength(1);
  });
  test("When the PlateWell is mouted, Then mouseenter event on the circle would emit and event 'enter-well' with plate index range [0..23]", async () => {
    const propsData = {
      classname: "plate",
      svg_height: 100,
      svg_width: 100,
      circle_x: 50,
      circle_y: 50,
      radius: 50,
      strk: "#ececed",
      stroke_wdth: 0,
      plate_fill: "#b7b7b7",
      index: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const plate = wrapper.find(".plate");

    await plate.trigger("mouseenter");
    const enter_well_events = wrapper.emitted("enter-well");
    expect(enter_well_events).toHaveLength(1);
    expect(enter_well_events[0]).toStrictEqual([0]);
  });
  test("When the PlateWell is mouted, Then mouseleave event on the circle would emit and event 'leave-well' with plate index range [0..23]", async () => {
    const propsData = {
      classname: "plate",
      svg_height: 100,
      svg_width: 100,
      circle_x: 50,
      circle_y: 50,
      radius: 50,
      strk: "#ececed",
      stroke_wdth: 0,
      plate_fill: "#b7b7b7",
      index: 1,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const plate = wrapper.find(".plate");

    await plate.trigger("mouseleave");
    const leave_well_events = wrapper.emitted("leave-well");
    expect(leave_well_events).toHaveLength(1);
    expect(leave_well_events[0]).toStrictEqual([1]);
  });
});
