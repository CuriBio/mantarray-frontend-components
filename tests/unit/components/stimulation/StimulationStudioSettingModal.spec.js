import { mount, shallowMount, createLocalVue } from "@vue/test-utils";
import StimulationStudioWaveformSettingModal from "@/components/stimulation/StimulationStudioWaveformSettingModal.vue";
import { StimulationStudioWaveformSettingModal as dist_StimulationStudioWaveformSettingModal } from "@/dist/mantarray.common";
import { MIN_SUBPROTOCOL_DURATION_MS } from "@/store/modules/stimulation/enums";
import Vuex from "vuex";
import {
  TEST_MONOPHASIC_PULSE_SETTINGS,
  TEST_BIPHASIC_PULSE_SETTINGS,
} from "@/tests/sample_stim_protocols/stim_protocols";

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

  afterEach(() => {
    wrapper.destroy();
    jest.restoreAllMocks();
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
        selected_pulse_settings: TEST_BIPHASIC_PULSE_SETTINGS,
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
        selected_pulse_settings: TEST_BIPHASIC_PULSE_SETTINGS,
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
        selected_pulse_settings: TEST_BIPHASIC_PULSE_SETTINGS,
        frequency: 0,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });
    await wrapper.vm.close(0);
    expect(wrapper.emitted("close", "Save")).toBeTruthy();
  });

  test.each([
    ["phase_one_duration", "duration", "test", "Must be a number"],
    ["phase_one_duration", "duration", "1500", "Duration must be <= 50ms"],
    ["phase_one_duration", "duration", "", "Required"],
    ["phase_one_duration", "duration", "0.01", "Duration must be >= 25μs"],
    ["phase_one_duration", "duration", "50", ""],
    ["interphase_interval", "interphase", "0.01", "Duration must be 0ms or >= 25μs"],
    ["interphase_interval", "interphase", "test", "Must be a number"],
    ["interphase_interval", "interphase", "0.025", ""],
    ["interphase_interval", "interphase", "0", ""],
    ["interphase_interval", "interphase", "", "Required"],
    ["interphase_interval", "interphase", "100", "Duration must be <= 50ms"],
    ["phase_one_charge", "charge", "test", "Must be a number"],
    ["phase_one_charge", "charge", "", "Required"],
    ["phase_one_charge", "charge", "0", "Must be within [-1, -100] or [1, 100]"],
    ["phase_one_charge", "charge", "101", "Must be within [-1, -100] or [1, 100]"],
    ["phase_one_charge", "charge", "50", ""],
  ])(
    "When a user adds a value to an input field for %s, Then the correct error message will be presented upon validity checks to input",
    async (input_type, suffix, value, error_msg) => {
      const wrapper = mount(StimulationStudioWaveformSettingModal, {
        store,
        localVue,
        propsData: {
          pulse_type: "Biphasic",
          selected_pulse_settings: TEST_BIPHASIC_PULSE_SETTINGS,
          current_color: "hsla(100, 100%, 50%, 1)",
        },
      });
      const target_input_field = wrapper.find(`#input-widget-field-${suffix}`);
      await target_input_field.setValue(value);
      expect(wrapper.vm.err_msgs[input_type]).toBe(error_msg);
    }
  );
  test("When a user opens the pulse settings modal, Then the user can only save the settings if all inputs pass the validity checks", async () => {
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propsData: {
        pulse_type: "Monophasic",
        selected_pulse_settings: TEST_MONOPHASIC_PULSE_SETTINGS,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });

    const expected_enabled_array = [true, true];
    const expected_settings = {
      phase_one_duration: 10,
      phase_one_charge: 50,
    };
    await wrapper.find("#input-widget-field-duration").setValue("10");
    await wrapper.find("#input-widget-field-charge").setValue("50");
    await wrapper.find("#input-widget-field-pulse-frequency").setValue("20");
    await wrapper
      .find("#input-widget-field-total-active-duration")
      .setValue(MIN_SUBPROTOCOL_DURATION_MS.toString());

    expect(wrapper.vm.all_valid).toBe(true);
    expect(wrapper.vm.is_enabled_array).toStrictEqual(expected_enabled_array);
    expect(wrapper.vm.active_duration_idx).toBe(0);
    expect(wrapper.vm.pulse_settings.phase_one_duration).toBe(expected_settings.phase_one_duration);
    expect(wrapper.vm.pulse_settings.phase_one_charge).toBe(expected_settings.phase_one_charge);

    await wrapper.find("#input-widget-field-charge").setValue("-101");
    expect(wrapper.vm.all_valid).toBe(false);
  });
  test("Given that a high frequency is selected, When a user adds a value to an input field, Then the correct error message will be presented upon validity checks to input", async () => {
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propsData: {
        pulse_type: "Monophasic",
        selected_pulse_settings: TEST_MONOPHASIC_PULSE_SETTINGS,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });

    await wrapper.setData({ input_pulse_frequency: 100 });

    const target_input_field = wrapper.find("#input-widget-field-duration");
    await target_input_field.setValue("11");
    expect(wrapper.vm.err_msgs.phase_one_duration).toBe("Duration must be <= 8ms");
  });

  test("When a user adds a value to the total active duration, Then the value must be a number greater than the min allowed subprotocol duration", async () => {
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propsData: {
        pulse_type: "Biphasic",
        selected_pulse_settings: {
          phase_one_duration: 10,
          phase_one_charge: 100,
          interphase_interval: 10,
          phase_two_duration: 10,
          phase_two_charge: -100,
          postphase_interval: 20,
          total_active_duration: {
            duration: 30,
            unit: "milliseconds",
          },
          num_cycles: 10,
          frequency: 5,
        },
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
        pulse_type: "Biphasic",
        selected_pulse_settings: {
          phase_one_duration: 5,
          phase_one_charge: 30,
          interphase_interval: 5,
          phase_two_duration: 5,
          phase_two_charge: -10,
          postphase_interval: 485,
          total_active_duration: {
            duration: 1,
            unit: "seconds",
          },
          num_cycles: 2,
          frequency: 2,
        },
        current_color: "hsla(100, 100%, 50%, 1)",
        modal_open_for_edit: true,
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
        pulse_type: "Monophasic",
        selected_pulse_settings: TEST_MONOPHASIC_PULSE_SETTINGS,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });
    wrapper.setData({
      pulse_settings: {
        phase_one_duration: "5",
        phase_one_charge: "300",
        interphase_interval: "0",
        phase_two_duration: "0",
        phase_two_charge: "0",
        postphase_interval: "",
        total_active_duration: {
          duration: "1",
          unit: "seconds",
        },
        num_cycles: 10,
        frequency: 10,
      },
      input_pulse_frequency: 10,
      active_duration_idx: 2,
      all_valid: true,
    });
    await wrapper.vm.close(0);
    expect(wrapper.vm.pulse_settings.postphase_interval).toBe(95);
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
        pulse_type: "Monophasic",
        selected_pulse_settings: TEST_MONOPHASIC_PULSE_SETTINGS,
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });

    await wrapper.find(".div__color-label").trigger("click");

    await wrapper.findAll(".individual_color_block").at(0).trigger("click");

    expect(wrapper.vm.selected_color).toBe("hsla(0, 100%, 50%, 1)");
  });

  test("When selects to use number of cycles instead of total active duration, Then total active duration will get updated as user changes number of cycles", async () => {
    const wrapper = mount(StimulationStudioWaveformSettingModal, {
      store,
      localVue,
      propsData: {
        pulse_type: "Biphasic",
        selected_pulse_settings: {
          phase_one_duration: 5,
          phase_one_charge: 30,
          interphase_interval: 5,
          phase_two_duration: 5,
          phase_two_charge: -10,
          postphase_interval: 485,
          total_active_duration: {
            duration: 1,
            unit: "seconds",
          },
          num_cycles: 2,
          frequency: 2,
        },
        current_color: "hsla(100, 100%, 50%, 1)",
        modal_open_for_edit: true,
      },
    });

    expect(wrapper.vm.all_valid).toBe(true);
    expect(wrapper.vm.calculated_active_dur).toBe(1);

    const target_checkbox_btn = wrapper.findAll('input[type="checkbox"]');
    await target_checkbox_btn.at(0).setChecked(true);

    await wrapper.find("#input-widget-field-num-cycles").setValue("5");
    expect(wrapper.vm.calculated_active_dur).toBe(2.5);
  });
});
