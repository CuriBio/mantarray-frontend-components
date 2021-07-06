import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioDragAndDropPanel from "@/components/stimulation/StimulationStudioDragAndDropPanel.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;
const test_protocol_order = [
  {
    type: "Biphasic",
    src: "placeholder",
    nest_protocols: [],
    repeat: {
      number_of_repeats: 0,
      color: "fffff",
    },
    settings: {
      phase_one_duration: 300,
      phase_one_charge: 2,
      interpulse_duration: 500,
      phase_two_duration: 100,
      phase_two_charge: -5,
    },
  },
  {
    type: "Monophasic",
    src: "placeholder",
    nested_protocols: [
      {
        type: "Monophasic",
        src: "placeholder",
        nested_protocols: [],
        repeat: {
          number_of_repeats: 0,
          color: "fffff",
        },
        settings: {
          phase_one_duration: 100,
          phase_one_charge: -2,
        },
      },
      {
        type: "Monophasic",
        src: "placeholder",
        nested_protocols: [],
        repeat: {
          number_of_repeats: 0,
          color: "fffff",
        },
        settings: {
          phase_one_duration: 300,
          phase_one_charge: 6,
        },
      },
    ],
    repeat: {
      number_of_repeats: 0,
      color: "fffff",
    },
    settings: {
      phase_one_duration: 300,
      phase_one_charge: 2,
    },
  },
  {
    type: "Monophasic",
    src: "placeholder",
    nested_protocols: [],
    repeat: {
      number_of_repeats: 0,
      color: "fffff",
    },
    settings: {
      phase_one_duration: 300,
      phase_one_charge: 2,
    },
  },
  {
    type: "Monophasic",
    src: "placeholder",
    nested_protocols: [],
    repeat: {
      number_of_repeats: 0,
      color: "fffff",
    },
    settings: {
      phase_one_duration: 300,
      phase_one_charge: 2,
    },
  },
];

describe("StimulationStudioDragAndDropPanel.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting StimulationStudioDragAndDropPanel from the component file, Then there should be no waveforms in the new protocol container", () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    const protocol_list = wrapper.vm.protocol_order;
    expect(protocol_list).toStrictEqual([]);
  });

  test("When a user clicks on trash icons to delete protocol, Then the protocol order in StimulationStudioDragAndDropPanel should empty from the mutation in state", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    wrapper.vm.protocol_order = ["Biphasic", "Monophasic", "Monophasic"];
    await store.commit("stimulation/reset_state");
    expect(wrapper.vm.protocol_order).toStrictEqual([]);
  });

  test("When a user drops a waveform to the block editor, Then the corresponding modal to should pop up", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    const modal_container = wrapper.find(".modal-container");
    await wrapper.vm.clone({ type: "Monophasic", src: "test" });
    await wrapper.vm.check_type({ added: { element: { type: "Monophasic" } } });
    expect(wrapper.vm.modal_type).toBe("Monophasic");
    expect(modal_container).toBeTruthy();

    await wrapper.vm.clone({ type: "Biphasic", src: "test" });
    await wrapper.vm.check_type({ added: { element: { type: "Biphasic" } } });
    expect(wrapper.vm.modal_type).toBe("Biphasic");
    expect(modal_container).toBeTruthy();
  });

  test("When a user opens a modal to delete waveform, Then when delete is clicked, it will delete", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    wrapper.vm.protocol_order = test_protocol_order;
    await wrapper.vm.open_modal_for_edit("Monophasic", 0);
    expect(wrapper.vm.modal_type).toBe("Monophasic");
    expect(wrapper.vm.shift_click_img_idx).toBe(0);
    expect(wrapper.vm.shift_click_nested_img_idx).toBeNull();
    expect(wrapper.find(".modal_overlay")).toBeTruthy();

    await wrapper.vm.on_modal_close("Delete");
    expect(wrapper.vm.protocol_order).toHaveLength(3);
    expect(wrapper.vm.modal_type).toBeNull();

    await wrapper.vm.open_modal_for_edit("Biphasic", 1);
    expect(wrapper.vm.modal_type).toBe("Biphasic");
    expect(wrapper.vm.shift_click_img_idx).toBe(1);
    expect(wrapper.vm.shift_click_nested_img_idx).toBeNull();

    await wrapper.vm.on_modal_close("Cancel");
    expect(wrapper.vm.protocol_order).toHaveLength(3);
    expect(wrapper.vm.modal_type).toBeNull();

    await wrapper.vm.open_modal_for_edit("Biphasic", 0, 0);
    expect(wrapper.vm.shift_click_nested_img_idx).toBe(0);

    await wrapper.vm.on_modal_close("Delete");
    expect(wrapper.vm.protocol_order).toHaveLength(3);
    expect(wrapper.vm.shift_click_nested_img_idx).toBeNull();
  });

  test("When user wants to delete entire waveform protocol by using trash icon to mutate state, Then the protocol container will become empty", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    wrapper.vm.protocol_order = [
      { type: "Biphasic", src: "placeholder" },
      { type: "Monophasic", src: "placeholder" },
    ];
    await store.commit("stimulation/reset_state");
    expect(wrapper.vm.protocol_order).toHaveLength(0);
    expect(store.state.stimulation.delete_protocol).toBe(false);
  });

  test("When exiting instance, Then instance is effectively destroyed", async () => {
    const destroyed_spy = jest.spyOn(StimulationStudioDragAndDropPanel, "beforeDestroy");
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    wrapper.destroy();
    expect(destroyed_spy).toHaveBeenCalled();
  });

  test("When a user adds a new waveform to the protocol editor and cancels the addition, Then the modal should only appear when it's been cloned and should remove new waveform when cancelled", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    wrapper.vm.protocol_order = test_protocol_order;
    await wrapper.vm.clone({ type: "Monophasic", src: "test" });
    expect(wrapper.vm.cloned).toBe(true);
    await wrapper.vm.check_type({ added: { element: { type: "Monophasic" }, newIndex: 3 } });

    await wrapper.vm.on_modal_close("Cancel");
    expect(wrapper.vm.protocol_order).toHaveLength(3);

    await wrapper.vm.check_type({ added: { element: { type: "Biphasic" }, newIndex: 1 } });
    expect(wrapper.vm.modal_type).toBeNull();
  });

  test("When a user creates a repeat block, Then the repeat modal should appear and save number of repeats to state", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    wrapper.vm.protocol_order = test_protocol_order;
    await wrapper.vm.handle_repeat({ added: "test" }, 1);
    expect(wrapper.vm.repeat_delay_modal).toBe("Repeat");
    expect(wrapper.vm.repeat_idx).toBe(1);

    await wrapper.vm.on_repeat_modal_close({ button_label: "Save", number_of_repeats: 3 });
    await wrapper.vm.open_repeat_modal_for_edit(3, 1);
    expect(wrapper.vm.current_repeat_delay_input).toBe(3);

    await wrapper.vm.handle_repeat({ added: "test" }, 1);
    expect(wrapper.vm.repeat_idx).toBe(1);

    await wrapper.vm.on_repeat_modal_close({ button_label: "Cancel", number_of_repeats: 3 });
    expect(wrapper.vm.protocol_order[1].nested_protocols).toStrictEqual([]);

    wrapper.vm.repeat_delay_modal = null;
    await wrapper.vm.handle_repeat({ moved: "test" }, 1);
    expect(wrapper.vm.repeat_delay_modal).toBeNull();
  });

  test("When a user clicks save on the settings for a waveform, Then the setting should save to the corresponding index depending on if it is a new waveform or an edited", async () => {
    const test_settings = "test";
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

    await wrapper.vm.on_modal_close("Save", test_settings);
    expect(wrapper.vm.protocol_order[0].settings).toBe(test_settings);
  });

  test("When a user removes the last waveform from a repeat block, Then the colored border should be removed and mutations to state should be committed", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    wrapper.vm.protocol_order = test_protocol_order;
    await wrapper.vm.handle_repeat({ removed: "test" }, 1);
    expect(wrapper.vm.protocol_order[1].repeat.number_of_repeats).toBe(0);
  });

  test("When a user shift+clicks a delay block to edit duration, Then the new value should be saved upon close", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });

    const idx = 2;
    const delay_settings = {
      phase_one_duration: 5,
      phase_one_charge: 0,
    };

    wrapper.vm.protocol_order = test_protocol_order;
    await wrapper.vm.open_modal_for_edit("Delay", idx);
    expect(wrapper.vm.repeat_delay_modal).toBe("Delay");

    await wrapper.vm.on_modal_close("Save", delay_settings);
    expect(wrapper.vm.protocol_order[idx].settings.phase_one_duration).toBe(
      delay_settings.phase_one_duration
    );
  });
});
