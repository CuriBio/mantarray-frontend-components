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
    wrapper.find(".div__heatmap-layout-background").isVisible(true);
    const twitch_label = wrapper.find(
      ".div__heatmap-layout-twitch-force-label"
    );
    expect(twitch_label.text()).toStrictEqual("Twitch Force (μN)");
  });
  test("When mounting from the component, Then it loads successfully and assert all the elements of the HeatMap Layout is rendered", () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    wrapper.find(".div__heatmap-layout-background").isVisible(true);
    const twitch_label = wrapper.find(
      ".div__heatmap-layout-twitch-force-label"
    );
    expect(twitch_label.text()).toStrictEqual("Twitch Force (μN)");
  });
});
