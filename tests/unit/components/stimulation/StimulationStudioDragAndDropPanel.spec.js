import { mount, createLocalVue, shallowMount } from "@vue/test-utils";
import StimulationStudioDragAndDropPanel from "@/components/stimulation/StimulationStudioDragAndDropPanel.vue";
import Vuex from "vuex";
import {
  MONOPHASIC_DROP_ELEMENT,
  BIPHASIC_DROP_ELEMENT,
  TEST_PROTOCOL_LIST_2,
  TEST_PROTOCOL_ORDER_3,
  TEST_PROTOCOL_ORDER_2,
} from "@/tests/sample_stim_protocols/stim_protocols";

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

let wrapper = null;
describe("StimulationStudioDragAndDropPanel.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    store.state.stimulation.protocol_list = JSON.parse(JSON.stringify(TEST_PROTOCOL_LIST_2));
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

  test("When exiting instance, Then instance is effectively destroyed", async () => {
    const destroyed_spy = jest.spyOn(StimulationStudioDragAndDropPanel, "beforeDestroy");
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    wrapper.destroy();
    expect(destroyed_spy).toHaveBeenCalledWith();
  });

  test("When a user clicks on trash icons to delete protocol, Then the protocol order in StimulationStudioDragAndDropPanel should empty from the mutation in state", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    wrapper.vm.protocol_order = [{ type: "Biphasic" }, { type: "Monophasic" }, { type: "Delay" }];
    await store.commit("stimulation/reset_state");
    expect(wrapper.vm.protocol_order).toStrictEqual([]);
  });

  test("When a user drops a waveform to the block editor, Then the corresponding modal to should pop up", async () => {
    wrapper = shallowMount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await wrapper.vm.clone("Monophasic");
    await wrapper.vm.check_type({
      added: {
        element: MONOPHASIC_DROP_ELEMENT,
        newIndex: 4,
      },
    });
    expect(wrapper.vm.modal_type).toBe("Monophasic");

    const modal_container = wrapper.find(".modal-container");
    expect(modal_container.isVisible()).toBeTruthy();

    await wrapper.vm.on_modal_close("Cancel");
    expect(wrapper.vm.modal_type).toBeNull();

    await wrapper.vm.clone("Delay");
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

    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_3)) });
    await wrapper.vm.open_modal_for_edit("Biphasic", 0);
    expect(wrapper.vm.modal_type).toBe("Biphasic");
    expect(wrapper.vm.dbl_click_pulse_idx).toBe(0);
    expect(wrapper.find(".div__modal-overlay")).toBeTruthy();

    const modal_buttons = wrapper.findAll(".span__button-label");
    await modal_buttons.at(3).trigger("click");

    expect(wrapper.vm.protocol_order).toHaveLength(3);
    expect(wrapper.vm.modal_type).toBeNull();
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

    expect(wrapper.vm.protocol_order).toStrictEqual(expected_pulse_order);
    expect(wrapper.vm.time_units_idx).toBe(expected_idx);
  });

  test("When a user adds a new waveform to the protocol editor and cancels the addition, Then the modal should only appear when it's been cloned and should remove new waveform when cancelled", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_3)) });
    expect(wrapper.vm.protocol_order).toHaveLength(4);

    await wrapper.vm.clone("Biphasic");
    expect(wrapper.vm.cloned).toBe(true);
    await wrapper.vm.check_type({
      added: {
        element: BIPHASIC_DROP_ELEMENT,
        newIndex: 4,
      },
    });

    expect(wrapper.vm.modal_type).toBe("Biphasic");

    const cancel_button = wrapper.findAll(".span__button-label").at(1);
    await cancel_button.trigger("click");

    expect(wrapper.vm.protocol_order).toHaveLength(4);
  });
  test("When changes the order of waveform tiles in scrollable component, Then no modal should appear", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_3)) });
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
    const test_color = "#19909";
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
        pulse_settings: {},
      },
    ];

    wrapper.vm.new_cloned_idx = 0;
    wrapper.vm.modal_type = "Biphasic";

    await wrapper.vm.on_modal_close("Save", test_stim_settings, test_color);
    expect(wrapper.vm.protocol_order[0].pulse_settings).toStrictEqual(test_stim_settings);
    expect(wrapper.vm.protocol_order[0].color).toBe(test_color);
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

    expect(store.state.stimulation.hovered_pulse).toStrictEqual({ color: null, idx: null, indices: [] });

    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_3)) });
    await store.dispatch("stimulation/handle_protocol_order", TEST_PROTOCOL_ORDER_3);
    await wrapper.vm.on_pulse_enter(1);

    expect(store.state.stimulation.hovered_pulse).toStrictEqual({
      idx: 1,
      indices: [[9, 20]],
      color: "hsla(205, 100%, 50%, 1)",
    });
  });

  test("When a user hovers over a waveform tile in a loop, Then the pulse settings for each iteration will be added to state", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    expect(store.state.stimulation.hovered_pulse).toStrictEqual({ color: null, idx: null, indices: [] });

    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_2)) });
    await store.dispatch("stimulation/handle_protocol_order", TEST_PROTOCOL_ORDER_2);
    await wrapper.vm.on_pulse_enter(4, 1);

    expect(store.state.stimulation.hovered_pulse).toStrictEqual({
      idx: 4,
      indices: [
        [536, 540],
        [1039, 1043],
        [1542, 1546],
      ],
      color: "rgb(64, 80, 95)",
    });
  });

  test("When a user hovers over a waveform tile, but it's because the user is dragging a tile above, Then the pulse settings not be added", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    expect(store.state.stimulation.hovered_pulse).toStrictEqual({ color: null, idx: null, indices: [] });

    await wrapper.setData({
      protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_3)),
      is_dragging: true,
    });
    await store.dispatch("stimulation/handle_protocol_order", TEST_PROTOCOL_ORDER_3);
    await wrapper.vm.on_pulse_enter(1);

    expect(store.state.stimulation.hovered_pulse).toStrictEqual({ color: null, idx: null, indices: [] });
  });

  test("When a user leaves hover over a waveform tile, Then the pulse settings will be reset", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await store.dispatch("stimulation/handle_protocol_order", TEST_PROTOCOL_ORDER_3);
    await wrapper.vm.on_pulse_enter(1);
    expect(store.state.stimulation.hovered_pulse).toStrictEqual({
      idx: 1,
      indices: [[9, 20]],
      color: "hsla(205, 100%, 50%, 1)",
    });

    await wrapper.vm.on_pulse_leave();
    expect(store.state.stimulation.hovered_pulse).toStrictEqual({ color: null, idx: null, indices: [] });
  });

  test("When a user selects 'Duplicate' in  waveform modal, Then the current pulse settings will be added into the pulse order right after selected pulse", async () => {
    wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_3)) });
    expect(wrapper.vm.protocol_order).toHaveLength(4);
    await wrapper.vm.open_modal_for_edit("Monophasic", 3);

    const duplicate_button = wrapper.findAll(".span__button-label").at(2);
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

    await wrapper.setData({ protocol_order: TEST_PROTOCOL_ORDER_3 });
    await wrapper.vm.open_modal_for_edit("Delay", idx);
    expect(wrapper.vm.open_delay_modal).toBe(true);

    await wrapper.vm.on_modal_close("Save", delay_settings);
    expect(wrapper.vm.protocol_order[idx].pulse_settings.duration).toBe(delay_settings.duration);
  });

  test("When a user double clicks the repeat circular icon for a nested loop, Then the input modal will appear auto filled with existing value", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_2)) });
    expect(wrapper.find(".span__repeat-label").text()).toBe("3");

    await wrapper.find(".div__circle").trigger("dblclick");
    await wrapper.find("#input-widget-field-stim-input").setValue("10");

    await wrapper.findAll(".span__button-label").at(1).trigger("click");

    expect(wrapper.find(".span__repeat-label").text()).toBe("10");
  });

  test("When a user double clicks the repeat circular icon to duplicate a nested loop, Then the exact subprotocol will be inserted after the original subprotocol", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_2)) });
    expect(wrapper.vm.protocol_order).toHaveLength(5);
    expect(wrapper.vm.protocol_order[4].type).toBe("loop");

    await wrapper.find(".div__circle").trigger("dblclick");

    await wrapper.findAll(".span__button-label").at(2).trigger("click");

    expect(wrapper.vm.protocol_order).toHaveLength(6);
    expect(wrapper.vm.protocol_order[4]).toStrictEqual(wrapper.vm.protocol_order[5]);
  });

  test("When a user double clicks the repeat circular icon to delete a nested loop, Then the exact subprotocol will be inserted after the original subprotocol", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_2)) });
    expect(wrapper.vm.protocol_order).toHaveLength(5);

    await wrapper.find(".div__circle").trigger("dblclick");

    await wrapper.findAll(".span__button-label").at(3).trigger("click");

    expect(wrapper.vm.protocol_order).toHaveLength(4);
  });

  test("When a user double clicks on a nested pulse, Then the changes to values in settings will update correctly when saved", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_2)) });
    await wrapper.find("#nested-pulse-1").trigger("dblclick");

    await wrapper.find("#input-widget-field-stim-input").setValue("10000");

    await wrapper.findAll(".span__button-label").at(1).trigger("click");

    expect(wrapper.vm.protocol_order).toContainEqual({
      type: "loop",
      num_iterations: 3,
      subprotocols: [
        {
          type: "Monophasic",
          src: "placeholder",
          color: "rgb(350, 85, 90)",
          pulse_settings: {
            frequency: 10,
            num_cycles: 100,
            phase_one_charge: 10,
            phase_one_duration: 5,
            postphase_interval: 95,
            total_active_duration: {
              duration: 10,
              unit: "seconds",
            },
          },
          subprotocols: [],
        },
        {
          type: "Delay",
          src: "placeholder",
          color: "rgb(64, 80, 95)",
          pulse_settings: {
            duration: 10000,
            unit: "milliseconds",
          },
          subprotocols: [],
        },
      ],
    });
  });

  test("When a user double clicks on a nested pulse, Then the exact pulse will be inserted after the selected when duplicated", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_2)) });

    expect(wrapper.vm.protocol_order[4].subprotocols).toHaveLength(2);
    await wrapper.find("#nested-pulse-1").trigger("dblclick");

    await wrapper.findAll(".span__button-label").at(2).trigger("click");

    expect(wrapper.vm.protocol_order[4].subprotocols).toHaveLength(3);
  });

  test("When a user double clicks on a nested pulse, Then the pulse will be removed from state when deleted", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_2)) });

    expect(wrapper.vm.protocol_order[4].subprotocols).toHaveLength(2);

    // duplicating first to add an extra pulse
    await wrapper.find("#nested-pulse-1").trigger("dblclick");
    await wrapper.findAll(".span__button-label").at(2).trigger("click");

    expect(wrapper.vm.protocol_order[4].subprotocols).toHaveLength(3);

    await wrapper.find("#nested-pulse-1").trigger("dblclick");
    await wrapper.findAll(".span__button-label").at(3).trigger("click");

    expect(wrapper.vm.protocol_order[4].subprotocols).toHaveLength(2);
  });

  test("When a user deletes the second to last nested pulse in a loop, Then the pulse will be replaced with the last pulse and no longer be a loop", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_2)) });

    expect(wrapper.vm.protocol_order[4].subprotocols).toHaveLength(2);
    expect(wrapper.vm.protocol_order[4].type).toBe("loop");

    await wrapper.find("#nested-pulse-1").trigger("dblclick");

    await wrapper.findAll(".span__button-label").at(3).trigger("click");

    expect(wrapper.vm.protocol_order[4].subprotocols).toHaveLength(0);
    expect(wrapper.vm.protocol_order[4].type).toBe("Monophasic");
  });

  test("When initiates a loop with first nested pulse, Then the repeat modal will open", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    // subprotocols needs to have a length > 0
    const protocol_order = JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_2));
    protocol_order[1].subprotocols.push({});

    await wrapper.setData({ protocol_order });
    wrapper.vm.handle_protocol_loop(
      {
        added: {
          element: {
            type: "Monophasic",
            src: "placeholder",
            color: "rgb(350, 85, 90)",
            pulse_settings: {
              frequency: 10,
              num_cycles: 100,
              phase_one_charge: 10,
              phase_one_duration: 5,
              postphase_interval: 95,
              total_active_duration: {
                duration: 10,
                unit: "seconds",
              },
            },
            subprotocols: [],
          },
        },
      },
      1
    );

    expect(wrapper.vm.open_repeat_modal).toBe(true);
    expect(wrapper.vm.dbl_click_pulse_idx).toBe(1);
  });

  test("When adds a new pulse to an existing loop, Then the repeat modal will not open", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_2)) });
    wrapper.vm.handle_protocol_loop(
      {
        added: {
          element: {
            type: "Monophasic",
            src: "placeholder",
            color: "rgb(350, 85, 90)",
            pulse_settings: {
              frequency: 10,
              num_cycles: 100,
              phase_one_charge: 10,
              phase_one_duration: 5,
              postphase_interval: 95,
              total_active_duration: {
                duration: 10,
                unit: "seconds",
              },
            },
            subprotocols: [],
          },
        },
      },
      4
    );

    expect(wrapper.vm.open_repeat_modal).toBe(false);
    expect(wrapper.vm.dbl_click_pulse_idx).toBe(null);
  });

  test("When a user moves a pulse within a loop, Then changes will be dispatched to state", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    const action_spy = jest.spyOn(store, "dispatch");
    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_2)) });
    expect(action_spy).toHaveBeenCalledTimes(0);

    wrapper.vm.handle_protocol_loop(
      {
        moved: {
          element: {
            type: "Monophasic",
          },
        },
      },
      4
    );

    expect(action_spy).toHaveBeenCalledTimes(1);
  });

  test("When a user moves a pulse out of a loop, Then changes will be dispatched to state", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    const action_spy = jest.spyOn(store, "dispatch");
    await wrapper.setData({ protocol_order: JSON.parse(JSON.stringify(TEST_PROTOCOL_ORDER_2)) });
    expect(action_spy).toHaveBeenCalledTimes(0);

    wrapper.vm.protocol_order[4].subprotocols.splice(0, 1);
    wrapper.vm.handle_protocol_loop(
      {
        removed: {
          element: {
            type: "Monophasic",
          },
        },
      },
      4
    );

    expect(action_spy).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.protocol_order[4].type).toBe("Delay");
  });
});
