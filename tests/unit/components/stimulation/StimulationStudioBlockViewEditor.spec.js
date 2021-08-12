import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioBlockViewEditor from "@/components/stimulation/StimulationStudioBlockViewEditor.vue";
import SmallDropDown from "@/components/basic_widgets/SmallDropDown.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

const test_protocol_list = [
  { letter: "", color: "", label: "Create New" },
  {
    letter: "A",
    color: "#118075",
    label: "Tester",
    protocol: {
      name: "Tester",
      stimulation_type: "V",
      rest_duration: 20,
      time_unit: "milliseconds",
      pulses: [
        {
          phase_one_duration: 15,
          phase_one_charge: 0,
          interpulse_duration: 0,
          phase_two_duration: 0,
          phase_two_charge: 0,
        },
        {
          phase_one_duration: 20,
          phase_one_charge: 0,
          interpulse_duration: 0,
          phase_two_duration: 0,
          phase_two_charge: 0,
        },
      ],
      detailed_pulses: [
        {
          type: "Delay",
          src: "/delay-tile.png",
          nested_protocols: [],
          repeat: { color: "d822f9", number_of_repeats: 0 },
          settings: {
            phase_one_duration: 15000,
            phase_one_charge: 0,
            interpulse_duration: 0,
            phase_two_duration: 0,
            phase_two_charge: 0,
          },
        },
      ],
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
    store.state.stimulation.protocol_list = JSON.parse(JSON.stringify(test_protocol_list));
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

  test("When a user wants to open a protocol settings to edit, Then the mutation will trigger saved settings to appear in the protocol editor", async () => {
    const wrapper = mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    const v_test_param = store.state.stimulation.protocol_list[1];
    const c_test_param = {
      // for testing and building other fxns
      letter: "B",
      color: "#118075",
      label: "mock_tester",
      protocol: {
        name: "mock_tester",
        stimulation_type: "C",
        rest_duration: 40,
        time_unit: "milliseconds",
        pulses: [],
        detailed_pulses: [],
      },
    };

    await store.dispatch("stimulation/edit_selected_protocol", v_test_param);
    expect(wrapper.vm.stimulation_type_idx).toBe(0);
    expect(wrapper.vm.current_letter).toBe(v_test_param.letter);
    expect(wrapper.vm.rest_duration).toBe(20);

    await store.dispatch("stimulation/edit_selected_protocol", c_test_param);
    expect(wrapper.vm.stimulation_type_idx).toBe(1);
    expect(wrapper.vm.current_letter).toBe(c_test_param.letter);
    expect(wrapper.vm.rest_duration).toBe(40);
  });

  test("When a user adds input to frequency input, Then the change will be recorded in data", async () => {
    const wrapper = mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    const input = wrapper.find(".number_input");
    input.element.value = "5";
    await input.trigger("change");
    expect(wrapper.vm.rest_duration).toBe("5");
  });

  test("When a user adds new protocol name, Then it will be checked if it is a unique name or if it already exists", async () => {
    const wrapper = mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    await wrapper.vm.check_name_validity("test");
    expect(wrapper.vm.name_validity).toBe("border: 1px solid #19ac8a");
    expect(wrapper.vm.error_message).toBe("");

    await wrapper.vm.check_name_validity("");
    expect(wrapper.vm.name_validity).toBe("");
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
    expect(store.state.stimulation.protocol_editor.stimulation_type).toBe("C");
  });

  test("When a user imports a new protocol, Then the the next available protocol letter/color assignment will get updated", async () => {
    const updateSpy = jest.spyOn(StimulationStudioBlockViewEditor.methods, "update_protocols");
    mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    const test_protocol = { label: "test", color: "#123456", letter: "B" };
    await store.commit("stimulation/set_new_protocol", test_protocol);
    expect(updateSpy).toHaveBeenCalledWith();
  });

  test("When a user selects from the stop requirement dropdown, Then the corresponding selection is stored", async () => {
    const wrapper = mount(StimulationStudioBlockViewEditor, {
      store,
      localVue,
    });
    await wrapper.findAll("li").at(3).trigger("click");
    expect(wrapper.vm.stop_option_idx).toBe(1);
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
