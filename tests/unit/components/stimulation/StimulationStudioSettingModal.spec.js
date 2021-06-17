import { mount } from "@vue/test-utils";
import WaveformSettingModal from "@/components/stimulation/WaveformSettingModal.vue";
import { shallowMount } from "@vue/test-utils";
import { WaveformSettingModal as dist_StimulationStudioCurrentSettings } from "@/dist/mantarray.common";
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
    expect(target_span).toBeTruthy();
  });
  test("When mounting StimulationStudioCurrentSettings from the component file, Then it loads successfully  `Biphasic Pulse Details` as defined title text is rendered", () => {
    wrapper = shallowMount(WaveformSettingModal, {
      localVue,
    });
    const target_span = wrapper.find(".span__stimulationstudio-current-settings-title");
    expect(target_span).toBeTruthy();
  });
  test("When clicking on either button, Then the modal successfully closes by emitting the close() function to parent component", async () => {
    // const mockMethod = jest.fn();
    const wrapper = mount(WaveformSettingModal, {
      localVue,
    });
    await wrapper.vm.close(0);
    expect(wrapper.emitted("close", "Save")).toBeTruthy();
  });
  test("When Voltage and Biphasic props is passed down, Then the correct labels should be present in modal and not default", async () => {
    // const mockMethod = jest.fn();
    const wrapper = shallowMount(WaveformSettingModal, {
      localVue,
      props: {
        stimulation_type: "Voltage",
        waveform_type: "Biphasic",
      },
    });
    const title = wrapper.find(".span__stimulationstudio-current-settings-label-three");
    expect(title.text()).toBe("Voltage (mV)");
    const biphasic_label = wrapper.find(".span__stimulationstudio-current-settings-label-twelve");
    expect(biphasic_label).toBeTruthy();
  });
});
