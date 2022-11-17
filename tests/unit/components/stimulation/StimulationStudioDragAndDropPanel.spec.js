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
    run_until_stopped: false,
    color: "hsla(15, 100%, 50%, 1)",
    pulse_settings: {
      phase_one_duration: 20,
      phase_one_charge: 2,
      interphase_interval: 10,
      phase_two_duration: 20,
      phase_two_charge: -5,
      postphase_interval: 0,
      total_active_duration: {
        duration: 1000,
        unit: "milliseconds",
      },
      num_cycles: 1,
      frequency: 3,
    },
  },
  {
    type: "Monophasic",
    src: "placeholder",
    run_until_stopped: false,
    color: "hsla(205, 100%, 50%, 1)",
    pulse_settings: {
      phase_one_duration: 20,
      phase_one_charge: 3,
      postphase_interval: 0,
      total_active_duration: {
        duration: 2000,
        unit: "milliseconds",
      },
      num_cycles: 2,
      frequency: 1,
    },
  },
  {
    type: "Delay",
    src: "placeholder",
    run_until_stopped: false,
    color: "hsla(5, 100%, 50%, 1)",
    pulse_settings: {
      duration: 300,
      unit: "seconds",
    },
  },
  {
    type: "Monophasic",
    src: "placeholder",
    run_until_stopped: false,
    color: "hsla(190, 100%, 50%, 1)",
    pulse_settings: {
      phase_one_duration: 10,
      phase_one_charge: 2,
      postphase_interval: 0,
      total_active_duration: {
        duration: 4000,
        unit: "milliseconds",
      },
      num_cycles: 4,
      frequency: 5,
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
      run_until_stopped: false,
      rest_duration: 20,
      time_unit: "milliseconds",
      subprotocols: [
        {
          type: "Delay",
          duration: 15000,
          unit: "milliseconds",
        },
        {
          type: "Delay",
          duration: 20,
          unit: "seconds",
        },
      ],
      detailed_subprotocols: [
        {
          type: "Delay",
          src: "/delay-tile.png",
          run_until_stopped: false,
          color: "hsla(65, 100%, 50%, 1)",
          pulse_settings: {
            pduration: 15000,
            unit: "milliseconds",
          },
        },
      ],
    },
  },
];
const new_mono_test_element = {
  type: "Monophasic",
  color: "",
  pulse_settings: {
    phase_one_duration: "",
    phase_one_charge: "",
    postphase_interval: "",
    total_active_duration: {
      duration: "",
      unit: "milliseconds",
    },
    num_cycles: 0,
    frequency: "",
  },
};
const new_bi_test_element = {
  type: "Biphasic",
  color: "",
  pulse_settings: {
    phase_one_duration: "",
    phase_one_charge: "",
    interphase_interval: "",
    phase_two_duration: "",
    phase_two_charge: "",
    postphase_interval: "",
    total_active_duration: {
      duration: "",
      unit: "milliseconds",
    },
    num_cycles: 0,
    frequency: "",
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

    await wrapper.vm.clone({ type: "Delay", src: "test" });
    await wrapper.vm.check_type({
      added: {
        element: {
          type: "Delay",
          color: "hsla(45, 100%, 50%, 1)",
          pulse_settings: { duration: "", unit: "milliseconds" },
        },
        newIndex: 4,
      },
    });

    expect(wrapper.vm.selected_pulse_settings).toStrictEqual({ duration: "", unit: "milliseconds" });
    expect(wrapper.vm.open_delay_modal).toBe(true);

    const delay_container = wrapper.find(".delay-container");
    expect(delay_container.isVisible()).toBeTruthy();

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
    await modal_buttons.at(3).trigger("click");

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
    const expected_pulse_order = store.state.stimulation.protocol_list[1].protocol.detailed_subprotocols;
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
      postphase_interval: "",
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
        color: "b7b7b7",
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
      indices: [9, 20],
      color: "hsla(205, 100%, 50%, 1)",
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
      indices: [9, 20],
      color: "hsla(205, 100%, 50%, 1)",
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

    const duplicate_button = wrapper.findAll(".span__button_label").at(2);
    await duplicate_button.trigger("click");

    expect(wrapper.vm.protocol_order).toHaveLength(5);
  });

  test("When a selects the Stimulate Until Complete option in the protocol editor, Then the time unit dropdown should become disabled", async () => {
    const test_settings = {
      complete: false,
      stopped: true,
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

    const idx = 2;

    const delay_settings = {
      duration: 5,
      unit: "seconds",
    };

    await wrapper.setData({ protocol_order: test_protocol_order });
    await wrapper.vm.open_modal_for_edit("Delay", idx);
    expect(wrapper.vm.open_delay_modal).toBe(true);

    await wrapper.vm.on_modal_close("Save", delay_settings);
    expect(wrapper.vm.protocol_order[idx].pulse_settings.duration).toBe(delay_settings.duration);
  });
});
