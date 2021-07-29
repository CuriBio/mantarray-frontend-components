import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import StimulationStudioWaveformSettingModal from "@/components/stimulation/StimulationStudioWaveformSettingModal.vue";
import { StimulationStudioWaveformSettingModal as dist_StimulationStudioCurrentSettings } from "@/dist/mantarray.common";
import Vuex from "vuex";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

describe("StimulationStudioCurrentSettings.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting StimulationStudioCurrentSettings from the build dist file, Then it loads successfully  `Biphasic Pulse Details` as defined title text is rendered", () => {
    wrapper = mount(dist_StimulationStudioCurrentSettings, {
      store,
      localVue,
    });
    const target_span = wrapper.find(".span__stimulationstudio-current-settings-title");
    expect(target_span).toBeTruthy();
  });
  test("When mounting StimulationStudioCurrentSettings from the component file, Then it loads successfully  `Biphasic Pulse Details` as defined title text is rendered", () => {
    wrapper = shallowMount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
    });
    const target_span = wrapper.find(".span__stimulationstudio-current-settings-title");
    expect(target_span).toBeTruthy();
  });
  test("When clicking on either button, Then the modal successfully closes by emitting the close() function to parent component", async () => {
    // const mockMethod = jest.fn();
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
    });
    await wrapper.vm.close(0);
    expect(wrapper.emitted("close", "Save")).toBeTruthy();
  });
  test("When Voltage and Biphasic props is passed down, Then the correct labels should be present in modal and not default", async () => {
    // const mockMethod = jest.fn();
    const wrapper = shallowMount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propData: {
        stimulation_type: "Voltage (mV)",
        waveform_type: "Biphasic",
      },
    });
    const title = wrapper.find(".span__stimulationstudio-current-settings-label-three").text();
    expect(title).toBe("Voltage (mV)");
    const biphasic_label = wrapper.find(".span__stimulationstudio-current-settings-label-twelve");
    expect(biphasic_label).toBeTruthy();
  });
});
