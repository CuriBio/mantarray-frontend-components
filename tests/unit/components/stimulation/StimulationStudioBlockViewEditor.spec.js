import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioBlockViewEditor from "@/components/stimulation/StimulationStudioBlockViewEditor.vue";
import SmallDropDown from "@/components/basic_widgets/SmallDropDown.vue";
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
    expect(wrapper.vm.end_delay_duration).toBe("5");
  });

  test("When a user adds new protocol name, Then it will be checked if it is a unique name or if it already exists", async () => {
    const wrapper = mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    await wrapper.vm.check_name_validity("test");
    expect(wrapper.vm.name_validity).toBe("border: 1px solid #19ac8a");
    expect(wrapper.vm.error_message).toBe("");

    await wrapper.vm.check_name_validity("Tester");
    expect(wrapper.vm.name_validity).toBe("border: 1px solid #bd3532");
    expect(wrapper.vm.error_message).toBe("*Protocol name already exists");
  });

  test("When a user selects from the stimulation type dropdown, Then the corresponding selection is stored", async () => {
    const wrapper = mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    await wrapper.findAll("li").at(1).trigger("click");
    expect(store.state.stimulation.new_protocol.stimulation_type).toBe("C");
  });

  test("When a user imports a new protocol, Then the the next available protocol letter/color assignment will get updated", async () => {
    const updateSpy = jest.spyOn(StimulationStudioBlockViewEditor.methods, "update_protocols");
    mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    const test_protocol = { label: "test", color: "#123456", letter: "B" };
    await store.commit("stimulation/set_imported_protocol", test_protocol);
    expect(updateSpy).toHaveBeenCalledWith();
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
    expect(destroyed_spy).toHaveBeenCalledWith();
  });

  test("When a user clicks the Clear All button, Then the dropdowns will reset to default value", async () => {
    const wrapper = mount(SmallDropDown, {
      store,
      localVue,
      propsData: {
        options_text: ["test", "test_1"],
      },
    });
    const expected_obj = { id: 0, name: "test" };
    await store.commit("stimulation/reset_state");
    expect(wrapper.vm.chosen_option).toStrictEqual(expected_obj);
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
