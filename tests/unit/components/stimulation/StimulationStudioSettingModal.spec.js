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
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
    });
    await wrapper.vm.close(0);
    expect(wrapper.emitted("close", "Save")).toBeTruthy();
  });
  test("When Voltage and Biphasic props is passed down, Then the correct labels should be present in modal and not default", async () => {
    const wrapper = shallowMount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propData: {
        stimulation_type: "Voltage (V)",
        waveform_type: "Biphasic",
      },
    });
    const title = wrapper.find(".span__stimulationstudio-current-settings-label-three").text();
    expect(title).toBe("Voltage (V)");
    const biphasic_label = wrapper.find(".span__stimulationstudio-current-settings-label-twelve");
    expect(biphasic_label).toBeTruthy();
  });
  test("When a user opens the pulse settings modal, Then the user can only save the settings if all inputs pass the validity checks", async () => {
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propData: {
        stimulation_type: "Voltage (V)",
        waveform_type: "Monophasic",
      },
    });

    const expected_enabled_array = [true, true, true];
    const expected_settings = {
      phase_one_duration: 1500,
      phase_one_charge: -500,
      interpulse_duration: 0,
      phase_two_duration: 0,
      phase_two_charge: 0,
    };
    await wrapper.find("#input-widget-field-duration").setValue("1500");
    await wrapper.find("#input-widget-field-charge").setValue("-500");

    expect(wrapper.vm.all_valid).toBe(true);
    expect(wrapper.vm.is_enabled_array).toStrictEqual(expected_enabled_array);
    expect(wrapper.vm.waveform_settings).toStrictEqual(expected_settings);

    await wrapper.find("#input-widget-field-charge").setValue("test");
    expect(wrapper.vm.all_valid).toBe(false);
  });

  test("When a user adds a value to an input field, Then the correct error message will be presented upon validity checks to input", async () => {
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propData: {
        stimulation_type: "Voltage (V)",
        waveform_type: "Monophasic",
      },
    });
    const target_input_field = wrapper.find("#input-widget-field-duration");

    await target_input_field.setValue("test");
    expect(wrapper.vm.err_msg.phase_one_duration).toBe("Must be a number");

    await target_input_field.setValue("1500");
    expect(wrapper.vm.err_msg.phase_one_duration).toBe("");

    await target_input_field.setValue("");
    expect(wrapper.vm.err_msg.phase_one_duration).toBe("Required");
  });
});
