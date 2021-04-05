import { mount } from "@vue/test-utils";
import YAxisControls from "@/components/playback/controls/YAxisControls.vue";
import { shallowMount } from "@vue/test-utils";
import { YAxisControls as dist_YAxisControls } from "@/dist/mantarray.common";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { mapGetters } from "vuex";

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

describe("YAxisControls.vue", () => {
  it("should be able to mount the YAxisControls when loaded from the built dist file", async () => {
    const propsData = {};

    let y_zoom_levels = [
      { y_min: 0, y_max: 0.1 },
      { y_min: 0.03, y_max: 0.08 },
      { y_min: 0.04, y_max: 0.07 },
      { y_min: 0.05, y_max: 0.07 },
      { y_min: 0.05, y_max: 0.06 },
    ];

    store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);

    wrapper = shallowMount(dist_YAxisControls, { propsData, store, localVue });
    await wrapper.vm.$nextTick(); // wait for update

    const target_span = wrapper.find(".span__playback-y-axis-controls-text");

    expect(target_span.text()).toEqual("Y-Axis Options:");
  });

  it("should pass prop values for height/top/left to the style of the main div", async () => {
    const propsData = {
      css_top_anchor: "23px",
      css_left_anchor: "99px",
      height: "971px",
    };

    let y_zoom_levels = [
      { y_min: 0, y_max: 0.1 },
      { y_min: 0.03, y_max: 0.08 },
      { y_min: 0.04, y_max: 0.07 },
      { y_min: 0.05, y_max: 0.07 },
      { y_min: 0.05, y_max: 0.06 },
    ];

    wrapper = shallowMount(YAxisControls, { propsData, store, localVue });
    store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);
    await wrapper.vm.$nextTick(); // wait for update

    const main_div = wrapper.find(".div__playback-y-axis-controls");
    const main_div_style = main_div.attributes("style");
    expect(main_div_style).toEqual("top: 23px; left: 99px; height: 971px;");
  });

  describe("y-zoom-in", () => {
    it("should increment the y_zoom_level_idx by 1 when y-zoom plus button clicked", async () => {
      const propsData = {};

      let y_zoom_levels = [
        { y_min: 0, y_max: 0.1 },
        { y_min: 0.03, y_max: 0.08 },
        { y_min: 0.04, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.06 },
      ];
      let default_zoom_level_idx = 1;
      wrapper = shallowMount(YAxisControls, { propsData, store, localVue });
      store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update

      // confirm expected pre-condition
      expect(store.state.waveform.y_zoom_level_idx).toEqual(1);

      const target_button = wrapper.find(
        ".span__playback-y-axis-controls-zoom-in-button"
      );

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.y_zoom_level_idx).toEqual(2);
    });
    it("should not increase the internal tracker of the zoom level when maximum zoom is reached when button clicked (when 5 total zoom levels)", async () => {
      const expected_zoom_idx = 4;
      const propsData = {};

      let y_zoom_levels = [
        { y_min: 0, y_max: 0.1 },
        { y_min: 0.03, y_max: 0.08 },
        { y_min: 0.04, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.06 },
      ];
      let default_zoom_level_idx = expected_zoom_idx;

      wrapper = shallowMount(YAxisControls, { propsData, store, localVue });
      store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(
        ".span__playback-y-axis-controls-zoom-in-button"
      );

      // confirm pre-condition
      expect(store.state.waveform.y_zoom_level_idx).toEqual(expected_zoom_idx);

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.y_zoom_level_idx).toEqual(expected_zoom_idx);
    });
    it("should add the disabled CSS class to the button if the component initially loads already at the maximum zoom level", async () => {
      const expected_zoom_idx = 4;
      const propsData = {};

      let y_zoom_levels = [
        { y_min: 0, y_max: 0.1 },
        { y_min: 0.03, y_max: 0.08 },
        { y_min: 0.04, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.06 },
      ];
      let default_zoom_level_idx = expected_zoom_idx;

      wrapper = shallowMount(YAxisControls, { propsData, store, localVue });
      store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(
        ".span__playback-y-axis-controls-zoom-in-button"
      );

      // confirm pre-condition
      expect(store.state.waveform.y_zoom_level_idx).toEqual(expected_zoom_idx);

      expect(target_button.classes()).toContain(
        "div__playback-y-axis-controls--disabled"
      );
    });
    it("should add the disabled CSS class to the button after clicking to move into the max zoom level", async () => {
      const propsData = {};
      let y_zoom_levels = [
        { y_min: 0, y_max: 0.1 },
        { y_min: 0.03, y_max: 0.08 },
        { y_min: 0.04, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.06 },
      ];
      let default_zoom_level_idx = 3;

      wrapper = shallowMount(YAxisControls, { propsData, store, localVue });
      store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(
        ".span__playback-y-axis-controls-zoom-in-button"
      );

      // confirm pre-condition
      expect(store.state.waveform.y_zoom_level_idx).toEqual(3);

      expect(target_button.classes()).not.toContain(
        "div__playback-y-axis-controls--disabled"
      );

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.y_zoom_level_idx).toEqual(4);

      expect(target_button.classes()).toContain(
        "div__playback-y-axis-controls--disabled"
      );
    });
    it("should add the disabled CSS class to the button after clicking to move into the max zoom level with 3 total zoom levels", async () => {
      const propsData = {};

      let y_zoom_levels = [
        { y_min: 0, y_max: 500 },
        { y_min: 100, y_max: 400 },
        { y_min: 200, y_max: 300 },
      ];
      let default_zoom_level_idx = 0;

      wrapper = shallowMount(YAxisControls, { propsData, store, localVue });
      store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(
        ".span__playback-y-axis-controls-zoom-in-button"
      );

      // confirm pre-condition
      expect(store.state.waveform.y_zoom_level_idx).toEqual(0);

      expect(target_button.classes()).not.toContain(
        "div__playback-y-axis-controls--disabled"
      );

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.y_zoom_level_idx).toEqual(1);

      expect(target_button.classes()).not.toContain(
        "div__playback-y-axis-controls--disabled"
      );

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.y_zoom_level_idx).toEqual(2);

      expect(target_button.classes()).toContain(
        "div__playback-y-axis-controls--disabled"
      );
    });
  });
  describe("y-zoom-out", () => {
    it("should decrement the y_zoom_level_idx by 1 when y-zoom out button clicked", async () => {
      const propsData = {};

      let y_zoom_levels = [
        { y_min: 0, y_max: 0.1 },
        { y_min: 0.03, y_max: 0.08 },
        { y_min: 0.04, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.06 },
      ];
      let default_zoom_level_idx = 1;

      wrapper = shallowMount(YAxisControls, { propsData, store, localVue });
      store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update
      await wrapper.vm.$nextTick(); // wait for update
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(
        ".span__playback-y-axis-controls-zoom-out-button"
      );

      // confirm pre-condition
      expect(store.state.waveform.y_zoom_level_idx).toEqual(1);

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.y_zoom_level_idx).toEqual(0);
    });
    it("should not decrease zoom level below 0 when y-zoom out button clicked", async () => {
      const expected_zoom_idx = 0;
      const propsData = {};

      let y_zoom_levels = [
        { y_min: 0, y_max: 0.1 },
        { y_min: 0.03, y_max: 0.08 },
        { y_min: 0.04, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.06 },
      ];
      let default_zoom_level_idx = expected_zoom_idx;

      wrapper = shallowMount(YAxisControls, { propsData, store, localVue });
      store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update
      await wrapper.vm.$nextTick(); // wait for update
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(
        ".span__playback-y-axis-controls-zoom-out-button"
      );

      // confirm pre-condition
      expect(store.state.waveform.y_zoom_level_idx).toEqual(expected_zoom_idx);

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.y_zoom_level_idx).toEqual(expected_zoom_idx);
    });

    it("should add the disabled CSS class to the button if the component initially loads already at the lowest zoom level", async () => {
      const propsData = {};
      let y_zoom_levels = [
        { y_min: 0, y_max: 0.1 },
        { y_min: 0.03, y_max: 0.08 },
        { y_min: 0.04, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.06 },
      ];
      let default_zoom_level_idx = 0;

      wrapper = shallowMount(YAxisControls, { propsData, store, localVue });
      store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update
      await wrapper.vm.$nextTick(); // wait for update
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(
        ".span__playback-y-axis-controls-zoom-out-button"
      );

      // confirm pre-condition
      expect(store.state.waveform.y_zoom_level_idx).toEqual(0);

      expect(target_button.classes()).toContain(
        "div__playback-y-axis-controls--disabled"
      );
    });

    it("should add the disabled CSS class to the button after clicking to move into the min zoom level", async () => {
      const propsData = {};
      let y_zoom_levels = [
        { y_min: 0, y_max: 0.1 },
        { y_min: 0.03, y_max: 0.08 },
        { y_min: 0.04, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.07 },
        { y_min: 0.05, y_max: 0.06 },
      ];
      let default_zoom_level_idx = 2;

      wrapper = shallowMount(YAxisControls, { propsData, store, localVue });
      store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);
      await wrapper.vm.$nextTick(); // wait for update
      await wrapper.vm.$nextTick(); // wait for update
      await wrapper.vm.$nextTick(); // wait for update

      const target_button = wrapper.find(
        ".span__playback-y-axis-controls-zoom-out-button"
      );

      // confirm pre-condition
      expect(store.state.waveform.y_zoom_level_idx).toEqual(2);

      expect(target_button.classes()).not.toContain(
        "div__playback-y-axis-controls--disabled"
      );

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.y_zoom_level_idx).toEqual(1);

      expect(target_button.classes()).not.toContain(
        "div__playback-y-axis-controls--disabled"
      );

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update

      expect(store.state.waveform.y_zoom_level_idx).toEqual(0);

      expect(target_button.classes()).toContain(
        "div__playback-y-axis-controls--disabled"
      );
    });
    it("should modify the values of the y_zoom_level_to the new max and min value, as an event 'y-axis-new-range' event was emitted ", async () => {
      const propsData = {};

      let y_zoom_levels = [
        { y_min: 0, y_max: 500 },
        { y_min: 100, y_max: 400 },
        { y_min: 200, y_max: 300 },
      ];
      let default_zoom_level_idx = 0;

      wrapper = shallowMount(YAxisControls, { propsData, store, localVue });
      store.commit("waveform/set_y_axis_zoom_levels", y_zoom_levels);
      store.commit("waveform/set_y_axis_zoom_idx", default_zoom_level_idx);

      const maximum = 10000;
      const minimum = 0;

      let new_min_max = { y_min: minimum, y_max: maximum };
      wrapper.vm.y_axis_controls_commit(new_min_max);

      expect(store.getters["waveform/y_axis_zoom_idx"]).toStrictEqual(
        default_zoom_level_idx
      );
      let new_range = store.getters["waveform/y_axis_zoom_levels"];
      expect(new_range[default_zoom_level_idx].y_min).toStrictEqual(minimum);
      expect(new_range[default_zoom_level_idx].y_max).toStrictEqual(maximum);
    });
  });
});
