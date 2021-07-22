import { mount } from "@vue/test-utils";
import XAxisControls from "@/components/playback/controls/XAxisControls.vue";
import { shallowMount } from "@vue/test-utils";
import { XAxisControls as dist_XAxisControls } from "@/dist/mantarray.common";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();
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

describe("XAxisControls.vue", () => {
  it("should be able to mount the XAxisControls when loaded from the built dist file", async () => {
    const propsData = {};
    let x_zoom_levels = [
      { x_scale: 30 * 100000 },
      { x_scale: 15 * 100000 },
      { x_scale: 5 * 100000 },
      { x_scale: 2 * 100000 },
      { x_scale: 1 * 100000 },
    ];

    store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);

    wrapper = shallowMount(XAxisControls, { propsData, store, localVue });

    await wrapper.vm.$nextTick(); // wait for update

    const target_span = wrapper.find(".span__playback-x-axis-controls-text");

    expect(target_span.text()).toEqual("X-Axis Options:");
  });

  describe("x-zoom-in", () => {
    it("should increment the x_zoom_level_idx by 1 when x-zoom plus button clicked", async () => {
      const propsData = {};
      let x_zoom_levels = [
        { x_scale: 30 * 100000 },
        { x_scale: 15 * 100000 },
        { x_scale: 5 * 100000 },
        { x_scale: 2 * 100000 },
        { x_scale: 1 * 100000 },
      ];
      let default_x_axis_zoom_idx = 0;

      wrapper = shallowMount(XAxisControls, { propsData, store, localVue });

      store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
      store.commit("waveform/set_x_axis_zoom_idx", default_x_axis_zoom_idx);

      await wrapper.vm.$nextTick(); // wait for update
      // confirm expected pre-condition
      expect(store.state.waveform.x_zoom_level_idx).toEqual(0);

      const target_button = wrapper.find(".span__playback-x-axis-controls-zoom-in-button");

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.x_zoom_level_idx).toEqual(1);
    });
    it("should not increase the internal tracker of the zoom level when maximum zoom is reached when button clicked (when 5 total levels)", async () => {
      const propsData = {};
      let x_zoom_levels = [
        { x_scale: 30 * 100000 },
        { x_scale: 15 * 100000 },
        { x_scale: 5 * 100000 },
        { x_scale: 2 * 100000 },
        { x_scale: 1 * 100000 },
      ];
      let default_x_axis_zoom_idx = 4;

      wrapper = shallowMount(XAxisControls, { propsData, store, localVue });

      store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
      store.commit("waveform/set_x_axis_zoom_idx", default_x_axis_zoom_idx);
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(".span__playback-x-axis-controls-zoom-in-button");

      // confirm pre-condition
      expect(store.state.waveform.x_zoom_level_idx).toEqual(4);

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.x_zoom_level_idx).toEqual(4);
    });
    it("should add the disabled CSS class to the button if the component initially loads already at the maximum zoom level", async () => {
      const propsData = {};
      let x_zoom_levels = [
        { x_scale: 30 * 100000 },
        { x_scale: 15 * 100000 },
        { x_scale: 5 * 100000 },
        { x_scale: 2 * 100000 },
        { x_scale: 1 * 100000 },
      ];
      let default_x_axis_zoom_idx = 4;

      wrapper = shallowMount(XAxisControls, { propsData, store, localVue });

      store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
      store.commit("waveform/set_x_axis_zoom_idx", default_x_axis_zoom_idx);
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(".span__playback-x-axis-controls-zoom-in-button");

      // confirm pre-condition
      expect(store.state.waveform.x_zoom_level_idx).toEqual(4);

      expect(target_button.classes()).toContain("div__playback-x-axis-controls--disabled");
    });
    it("should add the disabled CSS class to the button after clicking to move into the max zoom level", async () => {
      const propsData = {};
      let x_zoom_levels = [
        { x_scale: 30 * 100000 },
        { x_scale: 15 * 100000 },
        { x_scale: 5 * 100000 },
        { x_scale: 2 * 100000 },
        { x_scale: 1 * 100000 },
      ];
      let default_x_axis_zoom_idx = 3;

      wrapper = shallowMount(XAxisControls, { propsData, store, localVue });

      store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
      store.commit("waveform/set_x_axis_zoom_idx", default_x_axis_zoom_idx);
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(".span__playback-x-axis-controls-zoom-in-button");

      // confirm pre-condition
      expect(store.state.waveform.x_zoom_level_idx).toEqual(3);

      expect(target_button.classes()).not.toContain("div__playback-x-axis-controls--disabled");

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.x_zoom_level_idx).toEqual(4);

      expect(target_button.classes()).toContain("div__playback-x-axis-controls--disabled");
    });
    it("should add the disabled CSS class to the button after clicking to move into the max zoom level with 3 total zoom levels", async () => {
      const propsData = {};

      let x_zoom_levels = [{ x_scale: 30 * 100000 }, { x_scale: 15 * 100000 }, { x_scale: 5 * 100000 }];

      let default_x_axis_zoom_idx = 1;

      wrapper = shallowMount(XAxisControls, { propsData, store, localVue });

      store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
      store.commit("waveform/set_x_axis_zoom_idx", default_x_axis_zoom_idx);
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(".span__playback-x-axis-controls-zoom-in-button");

      // confirm pre-condition
      expect(store.state.waveform.x_zoom_level_idx).toEqual(1);

      expect(target_button.classes()).not.toContain("div__playback-x-axis-controls--disabled");

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.x_zoom_level_idx).toEqual(2);

      expect(target_button.classes()).toContain("div__playback-x-axis-controls--disabled");
    });

    it("should add the enabled CSS class to the button if the component initially loads not at the maximum zoom level", async () => {
      const propsData = {};

      let x_zoom_levels = [
        { x_scale: 30 * 100000 },
        { x_scale: 15 * 100000 },
        { x_scale: 5 * 100000 },
        { x_scale: 2 * 100000 },
        { x_scale: 1 * 100000 },
      ];
      let default_x_axis_zoom_idx = 1;

      wrapper = shallowMount(XAxisControls, { propsData, store, localVue });

      store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
      store.commit("waveform/set_x_axis_zoom_idx", default_x_axis_zoom_idx);
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(".span__playback-x-axis-controls-zoom-in-button");

      // confirm pre-condition
      expect(store.state.waveform.x_zoom_level_idx).toEqual(1);

      expect(target_button.classes()).toContain("div__playback-x-axis-controls--enabled");
    });
  });
  describe("x-zoom-out", () => {
    it("should decrement the x_zoom_level_idx by 1 when x-zoom out button clicked", async () => {
      const propsData = {};

      let x_zoom_levels = [
        { x_scale: 30 * 100000 },
        { x_scale: 15 * 100000 },
        { x_scale: 5 * 100000 },
        { x_scale: 2 * 100000 },
        { x_scale: 1 * 100000 },
      ];
      let default_zoom_level_idx = 1,
        wrapper = shallowMount(XAxisControls, { propsData, store, localVue });

      store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
      store.commit("waveform/set_x_axis_zoom_idx", default_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(".span__playback-x-axis-controls-zoom-out-button");

      // confirm pre-condition
      expect(store.state.waveform.x_zoom_level_idx).toEqual(1);

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.x_zoom_level_idx).toEqual(0);
    });
    it("should not decrease zoom level below 0 when x-zoom out button clicked", async () => {
      const propsData = {};
      let x_zoom_levels = [
        { x_scale: 30 * 100000 },
        { x_scale: 15 * 100000 },
        { x_scale: 5 * 100000 },
        { x_scale: 2 * 100000 },
        { x_scale: 1 * 100000 },
      ];
      let default_zoom_level_idx = 0,
        wrapper = shallowMount(XAxisControls, { propsData, store, localVue });

      store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
      store.commit("waveform/set_x_axis_zoom_idx", default_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(".span__playback-x-axis-controls-zoom-out-button");

      // confirm pre-condition
      expect(store.state.waveform.x_zoom_level_idx).toEqual(0);

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.x_zoom_level_idx).toEqual(0);
    });

    it("should add the disabled CSS class to the button if the component initially loads already at the lowest zoom level", async () => {
      const propsData = {};

      let x_zoom_levels = [
        { x_scale: 30 * 100000 },
        { x_scale: 15 * 100000 },
        { x_scale: 5 * 100000 },
        { x_scale: 2 * 100000 },
        { x_scale: 1 * 100000 },
      ];
      let default_zoom_level_idx = 0;

      wrapper = shallowMount(XAxisControls, { propsData, store, localVue });

      store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
      store.commit("waveform/set_x_axis_zoom_idx", default_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(".span__playback-x-axis-controls-zoom-out-button");

      // confirm pre-condition
      expect(store.state.waveform.x_zoom_level_idx).toEqual(0);

      expect(target_button.classes()).toContain("div__playback-x-axis-controls--disabled");
    });

    it("should add the enabled CSS class to the button if the component initially loads not at the lowest zoom level", async () => {
      const propsData = {};

      let x_zoom_levels = [
        { x_scale: 30 * 100000 },
        { x_scale: 15 * 100000 },
        { x_scale: 5 * 100000 },
        { x_scale: 2 * 100000 },
        { x_scale: 1 * 100000 },
      ];
      let default_zoom_level_idx = 1;

      wrapper = shallowMount(XAxisControls, { propsData, store, localVue });

      store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
      store.commit("waveform/set_x_axis_zoom_idx", default_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(".span__playback-x-axis-controls-zoom-out-button");

      // confirm pre-condition
      expect(store.state.waveform.x_zoom_level_idx).toEqual(1);

      expect(target_button.classes()).toContain("div__playback-x-axis-controls--enabled");
    });

    it("should add the disabled CSS class to the button after clicking to move into the min zoom level", async () => {
      const propsData = {};

      let x_zoom_levels = [
        { x_scale: 30 * 100000 },
        { x_scale: 15 * 100000 },
        { x_scale: 5 * 100000 },
        { x_scale: 2 * 100000 },
        { x_scale: 1 * 100000 },
      ];
      let default_zoom_level_idx = 1;

      wrapper = shallowMount(XAxisControls, { propsData, store, localVue });

      store.commit("waveform/set_x_axis_zoom_levels", x_zoom_levels);
      store.commit("waveform/set_x_axis_zoom_idx", default_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(".span__playback-x-axis-controls-zoom-out-button");

      // confirm pre-condition
      expect(store.state.waveform.x_zoom_level_idx).toEqual(1);

      expect(target_button.classes()).not.toContain("div__playback-x-axis-controls--disabled");

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.x_zoom_level_idx).toEqual(0);

      expect(target_button.classes()).toContain("div__playback-x-axis-controls--disabled");
    });
  });
});
