import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import StimulationStudioWaveformSettingModal from "@/components/stimulation/StimulationStudioWaveformSettingModal.vue";
import { StimulationStudioWaveformSettingModal as dist_StimulationStudioWaveformSettingModal } from "@/dist/mantarray.common";
import { MIN_SUBPROTOCOL_DURATION_MS } from "@/store/modules/stimulation/enums";
import Vuex from "vuex";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

describe("StimulationStudioWaveformSettingModal.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting StimulationStudioWaveformSettingModal from the build dist file, Then the title text `Biphasic Pulse Details` loads correctly and initial error messages for each input", () => {
    const expected_err_msgs = {
      phase_one_duration: "Required",
      phase_one_charge: "Required",
      interphase_interval: "Required",
      phase_two_duration: "Required",
      phase_two_charge: "Required",
      pulse_frequency: "Required",
      total_active_duration: "Required",
      num_cycles: "Must be a whole number > 0",
    };
    wrapper = mount(dist_StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propsData: {
        selected_pulse_settings: {
          phase_one_duration: "",
          phase_one_charge: "",
          interphase_interval: "",
          phase_two_duration: "",
          phase_two_charge: "",
        },
        selected_stim_settings: {
          postphase_interval: "",
          total_active_duration: {
            duration: "",
            unit: "milliseconds",
          },
        },
        frequency: 0,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });

    const target_span = wrapper.find(".span__stimulationstudio-current-settings-title");
    expect(wrapper.vm.err_msgs).toStrictEqual(expected_err_msgs);

    expect(target_span).toBeTruthy();
  });
  test("When mounting StimulationStudioWaveformSettingModal from the component file, Then it loads successfully  `Biphasic Pulse Details` as defined title text is rendered", () => {
    wrapper = shallowMount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propsData: {
        selected_pulse_settings: {
          phase_one_duration: "",
          phase_one_charge: "",
          interphase_interval: "",
          phase_two_duration: "",
          phase_two_charge: "",
        },
        selected_stim_settings: {
          postphase_interval: "",
          total_active_duration: {
            duration: "",
            unit: "milliseconds",
          },
        },
        frequency: 0,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });
    const target_span = wrapper.find(".span__stimulationstudio-current-settings-title");
    expect(target_span).toBeTruthy();
  });
  test("When clicking on either button, Then the modal successfully closes by emitting the close() function to parent component", async () => {
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propsData: {
        selected_pulse_settings: {
          phase_one_duration: "",
          phase_one_charge: "",
          interphase_interval: "",
          phase_two_duration: "",
          phase_two_charge: "",
        },
        selected_stim_settings: {
          postphase_interval: "",
          total_active_duration: {
            duration: "",
            unit: "milliseconds",
          },
        },
        frequency: 0,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });
    await wrapper.vm.close(0);
    expect(wrapper.emitted("close", "Save")).toBeTruthy();
  });
  test("When Voltage and Biphasic props is passed down, Then the correct labels should be present in modal and not default", async () => {
    const wrapper = shallowMount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propsData: {
        stimulation_type: "Voltage",
        pulse_type: "Biphasic",
        selected_pulse_settings: {
          phase_one_duration: "",
          phase_one_charge: "",
          interphase_interval: "",
          phase_two_duration: "",
          phase_two_charge: "",
        },
        selected_stim_settings: {
          postphase_interval: "",
          total_active_duration: {
            duration: "",
            unit: "milliseconds",
          },
        },
        frequency: 0,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });
    const title = wrapper.findAll("span").at(6).text();
    expect(title).toBe("Voltage");
    const interphase_label = wrapper.findAll("span").at(8);
    expect(interphase_label).toBeTruthy();
  });

  test("When a user opens the pulse settings modal, Then the user can only save the settings if all inputs pass the validity checks", async () => {
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propsData: {
        stimulation_type: "Current",
        pulse_type: "Monophasic",
        selected_pulse_settings: {
          phase_one_duration: "",
          phase_one_charge: "",
          interphase_interval: "",
          phase_two_duration: "",
          phase_two_charge: "",
        },
        selected_stim_settings: {
          postphase_interval: "",
          total_active_duration: {
            duration: "",
            unit: "milliseconds",
          },
        },
        frequency: 0,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });

    const expected_enabled_array = [true, true];
    const expected_settings = {
      phase_one_duration: 10,
      phase_one_charge: 50,
      interphase_interval: 0,
      phase_two_duration: 0,
      phase_two_charge: 0,
    };
    await wrapper.find("#input-widget-field-duration").setValue("10");
    await wrapper.find("#input-widget-field-charge").setValue("50");
    await wrapper.find("#input-widget-field-pulse-frequency").setValue("20");
    await wrapper
      .find("#input-widget-field-total-active-duration")
      .setValue(MIN_SUBPROTOCOL_DURATION_MS.toString());

    expect(wrapper.vm.all_valid).toBe(true);
    expect(wrapper.vm.is_enabled_array).toStrictEqual(expected_enabled_array);
    expect(wrapper.vm.pulse_settings).toStrictEqual(expected_settings);

    await wrapper.find("#input-widget-field-charge").setValue("-101");
    expect(wrapper.vm.all_valid).toBe(false);
  });

  test("When a user adds a value to an input field, Then the correct error message will be presented upon validity checks to input", async () => {
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propsData: {
        stimulation_type: "Voltage",
        pulse_type: "Monophasic",
        selected_pulse_settings: {
          phase_one_duration: "",
          phase_one_charge: "",
          interphase_interval: "",
          phase_two_duration: "",
          phase_two_charge: "",
        },
        selected_stim_settings: {
          postphase_interval: "",
          total_active_duration: {
            duration: "",
            unit: "milliseconds",
          },
        },
        frequency: 0,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });
    const target_input_field = wrapper.find("#input-widget-field-duration");

    await target_input_field.setValue("test");
    expect(wrapper.vm.err_msgs.phase_one_duration).toBe("Must be a positive number");

    await target_input_field.setValue("1500");
    expect(wrapper.vm.err_msgs.phase_one_duration).toBe("Duration must be <= 50ms");

    await target_input_field.setValue("");
    expect(wrapper.vm.err_msgs.phase_one_duration).toBe("Required");
  });
  test("Given that a high frequency is selected, When a user adds a value to an input field, Then the correct error message will be presented upon validity checks to input", async () => {
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propsData: {
        stimulation_type: "Voltage",
        pulse_type: "Monophasic",
        selected_pulse_settings: {
          phase_one_duration: "",
          phase_one_charge: "",
          interphase_interval: "",
          phase_two_duration: "",
          phase_two_charge: "",
        },
        selected_stim_settings: {
          postphase_interval: "",
          total_active_duration: {
            duration: "",
            unit: "milliseconds",
          },
        },
        frequency: 100,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });
    const target_input_field = wrapper.find("#input-widget-field-duration");
    await target_input_field.setValue("11");
    expect(wrapper.vm.err_msgs.phase_one_duration).toBe("Duration must be <= 10ms");
  });

  test("When a user adds a value to the total active duration, Then the value must be a number greater than the min allowed subprotocol duration", async () => {
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propsData: {
        stimulation_type: "Voltage",
        pulse_type: "Biphasic",
        selected_pulse_settings: {
          phase_one_duration: "10",
          phase_one_charge: "100",
          interphase_interval: "10",
          phase_two_duration: "10",
          phase_two_charge: "-100",
        },
        selected_stim_settings: {
          postphase_interval: "20",
          total_active_duration: {
            duration: "30",
            unit: "milliseconds",
          },
        },
        frequency: 5,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });
    const target_input_field = wrapper.find("#input-widget-field-total-active-duration");

    await target_input_field.setValue((MIN_SUBPROTOCOL_DURATION_MS - 1).toString());
    expect(wrapper.vm.err_msgs.total_active_duration).toBe(`Must be >= ${MIN_SUBPROTOCOL_DURATION_MS}ms`);

    await target_input_field.setValue((-(MIN_SUBPROTOCOL_DURATION_MS - 1)).toString());
    expect(wrapper.vm.err_msgs.total_active_duration).toBe(`Must be >= ${MIN_SUBPROTOCOL_DURATION_MS}ms`);

    await target_input_field.setValue(MIN_SUBPROTOCOL_DURATION_MS.toString());
    expect(wrapper.vm.err_msgs.total_active_duration).toBe("");

    await target_input_field.setValue("");
    expect(wrapper.vm.err_msgs.total_active_duration).toBe("Required");
  });

  test("When a user changes a the unit of time in the setting modal, Then the change will trigger a new validation check and record new selected index", async () => {
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propsData: {
        stimulation_type: "Voltage",
        pulse_type: "Biphasic",
        selected_pulse_settings: {
          phase_one_duration: "2",
          phase_one_charge: "30",
          interphase_interval: "1",
          phase_two_duration: "2",
          phase_two_charge: "-10",
        },
        selected_stim_settings: {
          postphase_interval: "2",
          total_active_duration: {
            duration: "3",
            unit: "seconds",
          },
        },
        frequency: 2,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });
    expect(wrapper.vm.all_valid).toBe(true);

    wrapper.findAll(".div__small-dropdown-controls-content-widget").at(0).trigger("click");

    await wrapper.findAll("li").at(0).trigger("click");

    expect(wrapper.vm.all_valid).toBe(false);
    expect(wrapper.vm.active_duration_idx).toBe(0);
  });

  test("When a user closes the modal on Save, Then correct repeat delay interval will get calculated from the pulse frequency", async () => {
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propsData: {
        stimulation_type: "Voltage",
        pulse_type: "Monophasic",
        selected_pulse_settings: {
          phase_one_duration: "",
          phase_one_charge: "",
          interphase_interval: "",
          phase_two_duration: "",
          phase_two_charge: "",
        },
        selected_stim_settings: {
          postphase_interval: "",
          total_active_duration: {
            duration: "",
            unit: "milliseconds",
          },
        },
        frequency: 0,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });
    wrapper.setData({
      stim_settings: {
        postphase_interval: "",
        total_active_duration: {
          duration: "1",
          unit: "seconds",
        },
      },
      pulse_settings: {
        phase_one_duration: "5",
        phase_one_charge: "300",
        interphase_interval: "0",
        phase_two_duration: "0",
        phase_two_charge: "0",
      },
      input_pulse_frequency: 10,
      active_duration_idx: 2,
      all_valid: true,
    });
    await wrapper.vm.close(0);
    expect(wrapper.vm.stim_settings.postphase_interval).toBe(95);
  });

  test.each([
    [true, ["Save", "Duplicate", "Delete", "Cancel"]],
    [false, ["Save", "Cancel"]],
  ])(
    "When a user opens the delay modal and editing is %s, Then button labels should be %s",
    async (modal_open_for_edit, expected_button_labels) => {
      const button_labels = StimulationStudioWaveformSettingModal.computed.button_labels.call({
        modal_type: "Monophasic",
        modal_open_for_edit,
      });
      expect(button_labels).toStrictEqual(expected_button_labels);
    }
  );

  test.each([
    [true, ["#19ac8a", "#19ac8a", "#bd4932", "#bd4932"]],
    [false, ["#19ac8a", "#bd4932"]],
  ])(
    "When a user opens the delay modal and editing is %s, Then button hover colors should be %s",
    async (modal_open_for_edit, expected_button_colors) => {
      const button_labels = StimulationStudioWaveformSettingModal.computed.button_hover_colors.call({
        modal_type: "Monophasic",
        modal_open_for_edit,
      });
      expect(button_labels).toStrictEqual(expected_button_colors);
    }
  );

  test("When a user clicks on a new color for a waveform pulse, Then the color will be set to state to be emitted to parent component", async () => {
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propsData: {
        stimulation_type: "Voltage",
        pulse_type: "Monophasic",
        selected_pulse_settings: {
          phase_one_duration: "",
          phase_one_charge: "",
          interphase_interval: "",
          phase_two_duration: "",
          phase_two_charge: "",
        },
        selected_stim_settings: {
          postphase_interval: "",
          total_active_duration: {
            duration: "",
            unit: "milliseconds",
          },
        },
        frequency: 0,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });

    await wrapper.find(".div__color-label").trigger("click");

    await wrapper.findAll(".individual_color_block").at(0).trigger("click");

    expect(wrapper.vm.selected_color).toBe("hsla(0, 100%, 50%, 1)");
  });
});
