import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioDragAndDropPanel from "@/components/stimulation/StimulationStudioDragAndDropPanel.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

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
    await store.commit("stimulation/handle_delete_protocol");
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
    wrapper.vm.protocol_order = [
      { type: "Monophasic", src: "placeholder" },
      {
        type: "Biphasic",
        src: "placeholder",
        nested_protocols: [
          { type: "Biphasic", src: "placeholder" },
          { type: "Monophasic", src: "placeholder" },
        ],
      },
      { type: "Monophasic", src: "placeholder" },
    ];
    await wrapper.vm.open_modal_for_edit("Monophasic", 0);
    expect(wrapper.vm.reopen_modal).toBe("Monophasic");
    expect(wrapper.vm.shift_click_img_idx).toBe(0);
    expect(wrapper.vm.shift_click_nested_img_idx).toBeNull();
    expect(wrapper.find(".modal_overlay")).toBeTruthy();

    await wrapper.vm.on_modal_close("Delete");
    expect(wrapper.vm.protocol_order).toHaveLength(2);
    expect(wrapper.vm.reopen_modal).toBeNull();

    await wrapper.vm.open_modal_for_edit("Biphasic", 1);
    expect(wrapper.vm.reopen_modal).toBe("Biphasic");
    expect(wrapper.vm.shift_click_img_idx).toBe(1);
    expect(wrapper.vm.shift_click_nested_img_idx).toBeNull();

    await wrapper.vm.on_modal_close("Cancel");
    expect(wrapper.vm.protocol_order).toHaveLength(2);
    expect(wrapper.vm.reopen_modal).toBeNull();

    await wrapper.vm.open_modal_for_edit("Biphasic", 0, 0);
    expect(wrapper.vm.shift_click_nested_img_idx).toBe(0);

    await wrapper.vm.on_modal_close("Delete");
    expect(wrapper.vm.protocol_order).toHaveLength(2);
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
    await store.commit("stimulation/handle_delete_protocol");
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
    wrapper.vm.protocol_order = [
      { type: "Monophasic", src: "placeholder" },
      {
        type: "Biphasic",
        src: "placeholder",
        nested_protocols: [
          { type: "Biphasic", src: "placeholder" },
          { type: "Monophasic", src: "placeholder" },
        ],
      },
      { type: "Monophasic", src: "placeholder" },
    ];
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
    wrapper.vm.protocol_order = [
      { type: "Monophasic", src: "placeholder" },
      {
        type: "Biphasic",
        src: "placeholder",
        nested_protocols: [
          { type: "Biphasic", src: "placeholder" },
          { type: "Monophasic", src: "placeholder" },
        ],
        repeat: { number_of_repeats: 0 },
      },
      { type: "Monophasic", src: "placeholder" },
    ];

    await wrapper.vm.handle_repeat({ added: "test" }, 1);
    console.log(wrapper.vm.protocol_order);
    expect(wrapper.vm.repeat_modal).toBe(true);
    expect(wrapper.vm.repeat_idx).toBe(1);
    await wrapper.vm.on_repeat_modal_close({ button_label: "Save", number_of_repeats: 3 });
    expect(wrapper.find(".circle")).toBeTruthy();

    await wrapper.vm.open_repeat_modal_for_edit(3, 1);
    expect(wrapper.vm.current_number_of_repeats).toBe(3);
  });
});
