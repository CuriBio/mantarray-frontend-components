import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioCreateAndEdit from "@/components/stimulation/StimulationStudioCreateAndEdit.vue";
import SelectDropDown from "@/components/basic_widgets/SelectDropDown.vue";

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
      subprotocols: [
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
      detailed_subprotocols: [
        {
          type: "Delay",
          src: "/delay-tile.png",
          nested_protocols: [],
          repeat: { color: "d822f9", number_of_repeats: 1 },
          settings: {
            phase_one_duration: 15000,
            phase_one_charge: 0,
            interphase_interval: 0,
            phase_two_duration: 0,
            phase_two_charge: 0,
          },
          stim_settings: {
            postphase_interval: 0,
            total_active_duration: {
              unit: "milliseconds",
              duration: 15000,
            },
          },
        },
      ],
    },
  },
];

describe("StimulationStudioCreateAndEdit.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    store.state.stimulation.protocol_list = JSON.parse(JSON.stringify(test_protocol_list));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("When mounting StimulationStudioCreateAndEdit from the component file, Then the correct number of protocols from state should appear in the drop down selection", () => {
    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });
    const labeled_protocols = store.state.stimulation.protocol_list.length - 1;
    const target_span = wrapper.findAll("li");
    expect(target_span).toHaveLength(labeled_protocols);
  });

  test("When a user clicks on apply selection, Then selected protocol should be applied to all wells in selected wells state and added to protocol assignments", async () => {
    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });
    await store.dispatch("stimulation/handle_selected_wells", [false, true, false, true]);
    const options = wrapper.findAll("li");
    await options.at(0).trigger("click");
    await wrapper.vm.handle_click(0);
    const expected_value = store.state.stimulation.protocol_list[wrapper.vm.selected_protocol_idx];
    store.state.stimulation.selected_wells.map((well) => {
      expect(store.state.stimulation.protocol_assignments[well]).toBe(expected_value);
    });
  });

  test("When a user clicks on clear selection, Then selected protocol should be removed from protocol assignments", async () => {
    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });
    await store.dispatch("stimulation/handle_selected_wells", [false, true, false, true]);
    const options = wrapper.findAll("li");
    await options.at(0).trigger("click");
    await wrapper.vm.handle_click(0);
    expect(store.state.stimulation.protocol_assignments[1]).toBeTruthy();
    await wrapper.vm.handle_click(1);
    expect(store.state.stimulation.protocol_assignments[1]).toBeFalsy();
  });

  test("When the dropdown is rendered to the page in the StimulationStudioCreateAndEdit component, Then there should be no title", () => {
    mount(SelectDropDown, {
      localVue,
      store,
      propsData: {
        options_text: ["test"],
      },
    });

    const input_height_background = SelectDropDown.computed.input_height_background.call({
      title_label: "",
    });
    const input_widget_top = SelectDropDown.computed.input_widget_top.call({
      title_label: "",
    });
    expect(input_height_background).toBe(60);
    expect(input_widget_top).toBe(0);
  });

  test("When a user imports a new protocol, Then the the available protocol list in dropdown will get updated", async () => {
    const updateSpy = jest.spyOn(StimulationStudioCreateAndEdit.methods, "update_protocols");
    mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });
    const test_protocol = store.state.stimulation.protocol_list[1];
    await store.commit("stimulation/set_new_protocol", test_protocol);
    expect(updateSpy).toHaveBeenCalledWith();
  });

  test("When a user selects Create New in the protocol dropdown, Then the protocol editor will reset to be empty", async () => {
    const reset_spy = jest.spyOn(StimulationStudioCreateAndEdit.methods, "reset_protocol_editor");
    const edit_spy = jest.spyOn(StimulationStudioCreateAndEdit.methods, "edit_selected_protocol");

    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });

    await wrapper.findAll("li").at(0).trigger("click");

    expect(edit_spy).toHaveBeenCalledTimes(1);

    await wrapper.findAll("li").at(0).trigger("click");

    expect(reset_spy).toHaveBeenCalledTimes(1);
  });

  test("When a user selects Use Active Stim Settings button to edit a selected protocol, Then the protocol will be dispatched to fill the protocol editor and sent to parent component", async () => {
    const action_spy = jest.spyOn(store, "dispatch");
    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });
    await wrapper.findAll("li").at(0).trigger("click");

    expect(action_spy).toHaveBeenCalledTimes(1);
  });

  test("When exiting instance, Then instance is effectively destroyed", async () => {
    const destroyed_spy = jest.spyOn(StimulationStudioCreateAndEdit, "beforeDestroy");
    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });
    wrapper.destroy();
    expect(destroyed_spy).toHaveBeenCalledWith();
  });

  test("When clicks on export protocol button, Then action will be dispatched to store", async () => {
    const export_spy = jest.spyOn(StimulationStudioCreateAndEdit.methods, "handle_export");
    window.webkitURL.createObjectURL = function () {};

    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });
    await wrapper.vm.handle_import_export(1);
    await wrapper.vm.handle_import_export(0);

    expect(export_spy).toHaveBeenCalledTimes(1);
  });

  test("When clicks on import protocol button, Then action will be dispatched to store", async () => {
    const import_spy = jest
      .spyOn(FileReader.prototype, "readAsText")
      .mockImplementation(() => "test successful");
    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });

    await wrapper.findAll("input").at(0).trigger("change");

    expect(import_spy).toHaveBeenCalledTimes(1);
  });

  test("When a user clicks on Clear All to reset new protocol, Then the dropdown should reset to default option", async () => {
    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });
    await store.commit("stimulation/reset_state");
    expect(wrapper.vm.selected_protocol_idx).toBe(0);
  });

  test("When a user imports a new protocol, Then the dropdown will default to that new protocol", async () => {
    const imported_option_idx = 2;
    const mock_protocol = {
      label: "test",
      protocol: {
        stimulation_type: "C",
        detailed_subprotocols: [],
        subprotocols: [],
      },
    };
    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });

    await store.commit("stimulation/set_imported_protocol", mock_protocol);
    expect(wrapper.vm.selected_protocol_idx).toBe(imported_option_idx);
  });
});
