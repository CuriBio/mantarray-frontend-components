import { mount } from "@vue/test-utils";
import StimulationStudioVoltageSettings from "@/components/stimulation/StimulationStudioVoltageSettings.vue";
import { shallowMount } from "@vue/test-utils";
import { StimulationStudioVoltageSettings as dist_StimulationStudioVoltageSettings } from "@/dist/mantarray.common";
// import Vue from "vue";

import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();

describe("StimulationStudioVoltageSettings.vue", () => {
  test("When mounting StimulationStudioVoltageSettings from the build dist file, Then it loads successfully  `Biphasic Pulse Details` as defined title text is rendered", () => {
    wrapper = mount(dist_StimulationStudioVoltageSettings, {
      localVue,
    });
    const target_span = wrapper.find(
      ".span__stimulationstudio-voltage-settings-title"
    );
    expect(target_span.text()).toStrictEqual("Biphasic Pulse Details");
  });
  test("When mounting StimulationStudioVoltageSettings from the component file, Then it loads successfully  `Biphasic Pulse Details` as defined title text is rendered", () => {
    wrapper = shallowMount(StimulationStudioVoltageSettings, {
      localVue,
    });
    const target_span = wrapper.find(
      ".span__stimulationstudio-voltage-settings-title"
    );
    expect(target_span.text()).toStrictEqual("Biphasic Pulse Details");
  });
});
