import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/heatmap/HeatMap.vue";
import { HeatMap as DistComponentToTest } from "@/dist/mantarray.common";

import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();

describe("HeatMap.vue", () => {
  afterEach(() => wrapper.destroy());
  test("When mounting from the built dist file, Then it loads successfully and assert all the elements of the HeatMap Layout is rendered", () => {
    const propsData = {};
    wrapper = mount(DistComponentToTest, {
      propsData,
      localVue,
    });
    wrapper
      .find(".span__heatmap-layout-heatmap-settings-label")
      .isVisible(true);
    const twitch_label = wrapper.find(
      ".span__heatmap-layout-heatmap-settings-label"
    );
    expect(twitch_label.text()).toStrictEqual("Heatmap Settings");
  });
  test("When mounting from the component, Then it loads successfully and assert all the elements of the HeatMap Layout is rendered", () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    wrapper
      .find(".span__heatmap-layout-heatmap-settings-label")
      .isVisible(true);
    const twitch_label = wrapper.find(
      ".span__heatmap-layout-heatmap-settings-label"
    );
    expect(twitch_label.text()).toStrictEqual("Heatmap Settings");
  });
});
