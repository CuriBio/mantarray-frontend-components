import { mount } from "@vue/test-utils";
import YAxisControlsSettings from "@/components/playback/controls/YAxisControlsSettings.vue";
import { shallowMount } from "@vue/test-utils";
import { YAxisControlsSettings as dist_YAxisControlsSettings } from "@/dist/mantarray.common";

import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();

describe("YAxisControlsSettings.vue", () => {
  test("When mounting YAxisControlsSettings from the build dist file, Then it loads successfully  `Y-Axis Display Mode` as defined title text is rendered", () => {
    wrapper = mount(dist_YAxisControlsSettings, {
      localVue,
    });
    const target_span = wrapper.find(".span__y-axis-control-settings-label");
    expect(target_span.text()).toStrictEqual("Y-Axis Display Mode");
  });
  test("When mounting YAxisControlsSettings from the component file, Then it loads successfully  `Y-Axis Display Mode` as defined title text is rendered", () => {
    wrapper = shallowMount(YAxisControlsSettings, {
      localVue,
    });
    const target_span = wrapper.find(".span__y-axis-control-settings-label");
    expect(target_span.text()).toStrictEqual("Y-Axis Display Mode");
  });
});
