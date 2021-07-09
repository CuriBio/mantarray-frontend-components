import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioBlockViewEditor from "@/components/stimulation/StimulationStudioBlockViewEditor.vue";
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

  test("When mounting StimulationStudioDragAndDropPanel from the component file, Then default tab displayed should be basic, but can toggle with clicking each tab", async () => {
    const wrapper = mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    expect(wrapper.vm.active_tab).toBe("Basic");
    await wrapper.find("#Advanced").trigger("click");
    expect(wrapper.vm.active_tab).toBe("Advanced");
    await wrapper.find("#Basic").trigger("click");
    expect(wrapper.vm.active_tab).toBe("Basic");
  });

  test("When a user adds input to frequency input, Then the change will be recorded in data", async () => {
    const wrapper = mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    const input = wrapper.find(".number_input");
    input.element.value = "5";
    await input.trigger("change");
    expect(wrapper.vm.frequency).toBe("5");
  });

  test("When a user adds new protocol name, Then it will be checked if it is a unique name or if it already exists", async () => {
    const wrapper = mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    await wrapper.vm.check_name_validity("test");
    expect(wrapper.vm.name_validity).toBe("border: 1px solid #19ac8a");
    expect(wrapper.vm.error_message).toBe("");

    await wrapper.vm.check_name_validity("test_A");
    expect(wrapper.vm.name_validity).toBe("border: 1px solid #bd3532");
    expect(wrapper.vm.error_message).toBe("*Protocol name already exists");
  });

  test("When a user selects from the stimulation type dropdown, Then the corresponding selection is stored", async () => {
    const wrapper = mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    await wrapper.findAll("li").at(1).trigger("click");
    expect(wrapper.vm.stimulation_type).toBe("Current Controlled Stimulation");
  });

  test("When a user selects from the stop requirement dropdown, Then the corresponding selection is stored", async () => {
    const wrapper = mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    await wrapper.findAll("li").at(3).trigger("click");
    expect(wrapper.vm.stop_requirement).toBe("Repeat");
  });

  test("When exiting instance, Then instance is effectively destroyed", async () => {
    const destroyed_spy = jest.spyOn(StimulationStudioBlockViewEditor, "beforeDestroy");
    const wrapper = mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    wrapper.destroy();
    expect(destroyed_spy).toHaveBeenCalled();
  });

  test("When a user clicks the Clear All button, Then the dropdowns will reset to default value", async () => {
    const wrapper = mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    wrapper.vm.stimulation_type = "Current Controlled Stimulation";
    await store.commit("stimulation/reset_state");
    expect(wrapper.vm.stimulation_type).toBe("Voltage Controlled Stimulation");
  });

  test("When a user clicks the trash icon and deletes the protocol, Then it should reset local data and mutate state", async () => {
    const wrapper = mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    await wrapper.find("#trash_icon").trigger("click");
    expect(wrapper.vm.show_confirmation).toBe(true);
    await wrapper.vm.handle_delete();
    expect(wrapper.vm.show_confirmation).toBe(false);
  });
});
