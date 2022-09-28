import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
import StimulationStudioDragAndDropPanel from "@/components/stimulation/StimulationStudioDragAndDropPanel.vue";
import Vuex from "vuex";
import Vue from "vue";
const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;
const test_protocol_order = [
  {
    type: "Biphasic",
    src: "placeholder",
    stop_setting: "Stimulate Until Complete",
    repeat: {
      number_of_repeats: 2,
      color: "#fffff",
    },
    pulse_settings: {
      phase_one_duration: 20,
      phase_one_charge: 2,
      interphase_interval: 10,
      phase_two_duration: 20,
      phase_two_charge: -5,
    },
    stim_settings: {
      delay_interval: 0,
      total_active_duration: {
        duration: 100,
        unit: "milliseconds",
      },
    },
  },
  {
    type: "Monophasic",
    src: "placeholder",
    stop_setting: "Stimulate Until Complete",
    repeat: {
      number_of_repeats: 10,
      color: "#ffff1",
    },
    pulse_settings: {
      phase_one_duration: 20,
      phase_one_charge: 3,
    },
    stim_settings: {
      delay_interval: 0,
      total_active_duration: {
        duration: 200,
        unit: "milliseconds",
      },
    },
  },
  {
    type: "Delay",
    src: "placeholder",
    stop_setting: "Stimulate Until Complete",
    repeat: {
      number_of_repeats: 1,
      color: "#ffff2",
    },
    pulse_settings: {
      phase_one_duration: 300,
      phase_one_charge: 0,
      interphase_interval: 0,
      phase_two_duration: 0,
      phase_two_charge: 0,
    },
    stim_settings: {
      delay_interval: 0,
      total_active_duration: {
        duration: 300,
        unit: "seconds",
      },
    },
  },
  {
    type: "Monophasic",
    src: "placeholder",
    stop_setting: "Stimulate Until Complete",
    repeat: {
      number_of_repeats: 40,
      color: "#ffff3",
    },
    pulse_settings: {
      phase_one_duration: 10,
      phase_one_charge: 2,
    },
    stim_settings: {
      delay_interval: 0,
      total_active_duration: {
        duration: 400,
        unit: "milliseconds",
      },
    },
  },
];

const test_protocol_list = [
  { letter: "", color: "", label: "Create New" },
  {
    letter: "A",
    color: "#118075",
    label: "Tester",
    protocol: {
      name: "Tester",
      stimulation_type: "V",
      stop_setting: "Stimulate Until Complete",
      rest_duration: 20,
      time_unit: "milliseconds",
      pulses: [
        {
          phase_one_duration: 15,
          phase_one_charge: 0,
          interphase_interval: 0,
          phase_two_duration: 0,
          phase_two_charge: 0,
        },
        {
          phase_one_duration: 20,
          phase_one_charge: 0,
          interphase_interval: 0,
          phase_two_duration: 0,
          phase_two_charge: 0,
        },
      ],
      detailed_pulses: [
        {
          type: "Delay",
          src: "/delay-tile.png",
          stop_setting: "Stimulate Until Complete",
          repeat: { color: "d822f9", number_of_repeats: 1 },
          pulse_settings: {
            phase_one_duration: 15,
            phase_one_charge: 0,
            interphase_interval: 0,
            phase_two_duration: 0,
            phase_two_charge: 0,
          },
          stim_settings: {
            delay_interval: 3,
            total_active_duration: {
              duration: 20,
              unit: "milliseconds",
            },
          },
        },
      ],
    },
  },
];
const new_mono_test_element = {
  type: "Monophasic",
  repeat: { color: "", number_of_repeats: 0 },
  pulse_settings: {
    phase_one_duration: "",
    phase_one_charge: "",
    interphase_interval: "",
    phase_two_duration: "",
    phase_two_charge: "",
  },
  stim_settings: {
    delay_interval: "",
    total_active_duration: {
      duration: "",
      unit: "milliseconds",
    },
  },
};
const new_bi_test_element = {
  type: "Biphasic",
  repeat: { color: "", number_of_repeats: 0 },
  pulse_settings: {
    phase_one_duration: "",
    phase_one_charge: "",
    interphase_interval: "",
    phase_two_duration: "",
    phase_two_charge: "",
  },
  stim_settings: {
    delay_interval: "",
    total_active_duration: {
      duration: "",
      unit: "milliseconds",
    },
  },
};

let wrapper = null;
describe("StimulationStudioDragAndDropPanel.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    store.state.stimulation.protocol_list = JSON.parse(JSON.stringify(test_protocol_list));
  });

  afterEach(() => {
    wrapper.destroy();
    jest.clearAllMocks();
  });
  test("When mounting StimulationStudioDragAndDropPanel from the component file, Then there should be no waveforms in the new protocol container", () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    const protocol_list = wrapper.vm.protocol_order;
    expect(protocol_list).toStrictEqual([]);
  });

  test("When a user clicks on trash icons to delete protocol, Then the protocol order in StimulationStudioDragAndDropPanel should empty from the mutation in state", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    wrapper.vm.protocol_order = ["Biphasic", "Monophasic", "Monophasic"];
    await store.commit("stimulation/reset_state");
    expect(wrapper.vm.protocol_order).toStrictEqual([]);
  });

  test("When a user drops a waveform to the block editor, Then the corresponding modal to should pop up", async () => {
    wrapper = shallowMount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await wrapper.vm.clone({ type: "Monophasic", src: "test" });
    await wrapper.vm.check_type({
      added: {
        element: new_mono_test_element,
        newIndex: 4,
      },
    });
    expect(wrapper.vm.modal_type).toBe("Monophasic");

    const modal_container = wrapper.find(".modal-container");
    expect(modal_container.isVisible()).toBeTruthy();

    await wrapper.vm.on_modal_close("Cancel");
    expect(wrapper.vm.modal_type).toBeNull();
  });

  test("When a user opens a modal to delete waveform, Then when delete is clicked, it will delete", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(test_protocol_order)) });
    await wrapper.vm.open_modal_for_edit("Biphasic", 0);
    expect(wrapper.vm.modal_type).toBe("Biphasic");
    expect(wrapper.vm.shift_click_img_idx).toBe(0);
    expect(wrapper.find(".modal_overlay")).toBeTruthy();

    const modal_buttons = wrapper.findAll(".span__button_label");
    await modal_buttons.at(2).trigger("click");

    expect(wrapper.vm.protocol_order).toHaveLength(3);
    expect(wrapper.vm.modal_type).toBeNull();
  });

  test("When exiting instance, Then instance is effectively destroyed", async () => {
    const destroyed_spy = jest.spyOn(StimulationStudioDragAndDropPanel, "beforeDestroy");
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    wrapper.destroy();
    expect(destroyed_spy).toHaveBeenCalledWith();
  });

  test("When a user selects a protocol to edit, Then the DragAndDropPanel component should get the selected pulse order and unit of time to display for edit", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    const expected_idx = 0;
    const selected_protocol = store.state.stimulation.protocol_list[1];
    const expected_pulse_order = store.state.stimulation.protocol_list[1].protocol.detailed_pulses;
    await store.dispatch("stimulation/edit_selected_protocol", selected_protocol);

    expect(wrapper.vm.time_units_idx).toBe(expected_idx);
    expect(wrapper.vm.protocol_order).toStrictEqual(expected_pulse_order);
  });

  test("When a user adds a new waveform to the protocol editor and cancels the addition, Then the modal should only appear when it's been cloned and should remove new waveform when cancelled", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(test_protocol_order)) });
    expect(wrapper.vm.protocol_order).toHaveLength(4);

    await wrapper.vm.clone({ type: "Biphasic", src: "test" });
    expect(wrapper.vm.cloned).toBe(true);
    await wrapper.vm.check_type({
      added: {
        element: new_bi_test_element,
        newIndex: 4,
      },
    });

    expect(wrapper.vm.modal_type).toBe("Biphasic");

    const cancel_button = wrapper.findAll(".span__button_label").at(1);
    await cancel_button.trigger("click");

    expect(wrapper.vm.protocol_order).toHaveLength(4);
  });
  test("When changes the order of waveform tiles in scrollable component, Then no modal should appear", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(test_protocol_order)) });
    expect(wrapper.vm.protocol_order).toHaveLength(4);

    await wrapper.vm.check_type({
      moved: {
        element: {},
        newIndex: 2,
      },
    });

    expect(wrapper.vm.modal_type).toBeNull();
  });

  test("When a user clicks save on the settings for a waveform, Then the setting should save to the corresponding index depending on if it is a new waveform or an edited", async () => {
    const test_settings = "test";
    const test_stim_settings = {
      delay_interval: "",
      total_active_duration: {
        duration: "",
        unit: "milliseconds",
      },
    };
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    wrapper.vm.protocol_order = [
      {
        type: "Biphasic",
        src: "test",
        repeat: { color: "b7b7b7", number_of_repeats: 0 },
        nested_protocols: [],
      },
    ];
    wrapper.vm.new_cloned_idx = 0;
    wrapper.vm.modal_type = "Biphasic";

    await wrapper.vm.on_modal_close("Save", test_settings, test_stim_settings);
    expect(wrapper.vm.protocol_order[0].pulse_settings).toBe(test_settings);
  });

  test("When a user switch time unit in drop down, Then the x-axis scale should change accordingly", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await wrapper.findAll("li").at(1).trigger("click");

    expect(wrapper.vm.time_units_idx).toBe(1);
  });

  test("When a user hovers over a waveform tile, Then the pulse settings will be added to state", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    expect(store.state.stimulation.hovered_pulse).toStrictEqual({
      idx: null,
      indices: [],
      color: null,
    });

    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(test_protocol_order)) });
    await store.dispatch("stimulation/handle_protocol_order", test_protocol_order);
    await wrapper.vm.on_pulse_enter(1);

    expect(store.state.stimulation.hovered_pulse).toStrictEqual({
      idx: 1,
      indices: [9, 15],
      color: "#ffff1",
    });
  });

  test("When a user hovers over a waveform tile, but it's because the user is dragging a tile above, Then the pulse settings not be added", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    const default_state = {
      idx: null,
      indices: [],
      color: null,
    };
    expect(store.state.stimulation.hovered_pulse).toStrictEqual(default_state);

    await wrapper.setData({
      protocol_order: JSON.parse(JSON.stringify(test_protocol_order)),
      is_dragging: true,
    });
    await store.dispatch("stimulation/handle_protocol_order", test_protocol_order);
    await wrapper.vm.on_pulse_enter(1);

    expect(store.state.stimulation.hovered_pulse).toStrictEqual(default_state);
  });

  test("When a user leaves hover over a waveform tile, Then the pulse settings will be reset", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await store.dispatch("stimulation/handle_protocol_order", test_protocol_order);
    await wrapper.vm.on_pulse_enter(1);
    expect(store.state.stimulation.hovered_pulse).toStrictEqual({
      idx: 1,
      indices: [9, 15],
      color: "#ffff1",
    });

    await wrapper.vm.on_pulse_leave();
    expect(store.state.stimulation.hovered_pulse).toStrictEqual({
      idx: null,
      indices: [],
      color: null,
    });
  });

  test("When a user selects 'Duplicate' in  waveform modal, Then the current pulse settings will be added into the pulse order right after selected pulse", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(test_protocol_order)) });
    expect(wrapper.vm.protocol_order).toHaveLength(4);
    await wrapper.vm.open_modal_for_edit("Monophasic", 3);

    const duplicate_button = wrapper.findAll(".span__button_label").at(1);
    await duplicate_button.trigger("click");

    expect(wrapper.vm.protocol_order).toHaveLength(5);
  });

  test("When a selects the Stimulate Until Complete option in the protocol editor, Then the time unit dropdown should become disabled", async () => {
    const test_settings = {
      complete: "Stimulate Until Complete",
      stopped: "Stimulate Until Stopped",
    };
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await store.commit("stimulation/set_stop_setting", test_settings.complete);
    expect(wrapper.vm.disable_dropdown).toBe(true);
    await store.commit("stimulation/set_stop_setting", test_settings.stopped);
    expect(wrapper.vm.disable_dropdown).toBe(false);
  });

  test("When a user double clicks a delay block to edit duration, Then the new value should be saved upon close", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    const idx = 1;

    const delay_settings = {
      phase_one_duration: 5000,
      phase_one_charge: 0,
      interphase_interval: 0,
      phase_two_duration: 0,
      phase_two_charge: 0,
    };

    const stim_settings = {
      delay_interval: {
        duration: 0,
        unit: "milliseconds",
      },
      total_active_duration: {
        duration: 5,
        unit: "seconds",
      },
    };

    await wrapper.setData({ protocol_order: test_protocol_order });
    await wrapper.vm.open_modal_for_edit("Delay", idx);
    expect(wrapper.vm.open_delay_modal).toBe(true);

    await wrapper.vm.on_modal_close("Save", delay_settings, stim_settings);
    expect(wrapper.vm.protocol_order[idx].pulse_settings.phase_one_duration).toBe(
      delay_settings.phase_one_duration
    );
  });
});
