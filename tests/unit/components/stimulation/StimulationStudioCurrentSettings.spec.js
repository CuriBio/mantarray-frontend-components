import { mount } from "@vue/test-utils";
import StimulationStudioCurrentSettings from "@/components/stimulation/StimulationStudioCurrentSettings.vue";
import { shallowMount } from "@vue/test-utils";
import { StimulationStudioCurrentSettings as dist_StimulationStudioCurrentSettings } from "@/dist/mantarray.common";
// import Vue from "vue";

import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();

describe("StimulationStudioCurrentSettings.vue", () => {
  test("When mounting StimulationStudioCurrentSettings from the build dist file, Then it loads successfully  `Biphasic Pulse Details` as defined title text is rendered", () => {
    wrapper = mount(dist_StimulationStudioCurrentSettings, {
      localVue,
    });
    const target_span = wrapper.find(".span__stimulationstudio-current-settings-title");
    expect(target_span.text()).toStrictEqual("Biphasic Pulse Details");
  });
  test("When mounting StimulationStudioCurrentSettings from the component file, Then it loads successfully  `Biphasic Pulse Details` as defined title text is rendered", () => {
    wrapper = shallowMount(StimulationStudioCurrentSettings, {
      localVue,
    });
    const target_span = wrapper.find(".span__stimulationstudio-current-settings-title");
    expect(target_span.text()).toStrictEqual("Biphasic Pulse Details");
  });
});
