import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioCreateAndEdit from "@/components/stimulation/StimulationStudioCreateAndEdit.vue";
import SelectDropDown from "@/components/basic_widgets/SelectDropDown.vue";
import { TEST_PROTOCOL_LIST_2 } from "@/tests/sample_stim_protocols/stim_protocols";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

describe("StimulationStudioCreateAndEdit.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    store.state.stimulation.protocol_list = JSON.parse(JSON.stringify(TEST_PROTOCOL_LIST_2));
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

  test("When new protocols get added to the list in state, Then the selected_protocol_idx will always reset to 0", async () => {
    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });
    wrapper.vm.selected_protocol_idx = 1;
    await store.commit("stimulation/set_new_protocol", {
      letter: "Z",
      label: "test_protocol",
      protocol: [],
    });

    expect(wrapper.vm.selected_protocol_idx).toBe(0);
  });

  test("When order of protocol_list changes, Then the dropdown will not reset", async () => {
    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });
    wrapper.vm.selected_protocol_idx = 1;
    await store.commit("stimulation/set_new_protocol", {
      letter: "Z",
      label: "test_protocol",
      protocol: [],
    });

    expect(wrapper.vm.selected_protocol_idx).toBe(0);
  });

  test("When edit_mode gets turned off, Then the selected_protocol_idx will always reset to 0", async () => {
    const wrapper = mount(StimulationStudioCreateAndEdit, {
      store,
      localVue,
    });
    await store.commit("stimulation/set_edit_mode", { letter: "A", label: "Tester" });

    wrapper.vm.selected_protocol_idx = 1;
    await store.commit("stimulation/set_edit_mode_off");

    expect(wrapper.vm.selected_protocol_idx).toBe(0);
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
      attachToDocument: true,
    });

    await wrapper.findAll("#import_export_button").at(0).trigger("click");

    // calling directly here because input element gets removed before it can be manually clicked here on the wrapper
    wrapper.vm.handle_import([new File([new Blob()], "test_filename")]);
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
});
