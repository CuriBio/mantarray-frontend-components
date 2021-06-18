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
    await wrapper.vm.check_type({ added: { element: { type: "Monophasic" } } });
    expect(wrapper.vm.modal_type).toBe("Monophasic");
    expect(modal_container).toBeTruthy();
  });

  test("When a user opens a modal to delete waveform, Then when delete is clicked, it will delete", async () => {
    const wrapper = mount(StimulationStudioDragAndDropPanel, {
      store,
      localVue,
    });
    wrapper.vm.protocol_order = [
      { type: "Biphasic", src: "placeholder" },
      { type: "Monophasic", src: "placeholder" },
    ];
    await wrapper.vm.open_modal_for_edit("Monophasic", 1);
    expect(wrapper.vm.reopen_modal).toBe("Monophasic");
    expect(wrapper.vm.shift_click_img_idx).toBe(1);

    await wrapper.vm.on_modal_close("Delete");
    expect(wrapper.vm.protocol_order).toHaveLength(1);
    expect(wrapper.vm.reopen_modal).toBeNull();

    // expect(modal_container).toBeTruthy();
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
});
