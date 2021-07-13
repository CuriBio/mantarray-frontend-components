import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioCreateAndEdit from "@/components/stimulation/StimulationStudioCreateAndEdit.vue";
import NewSelectDropDown from "@/components/basic_widgets/NewSelectDropDown.vue";

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
    mount(NewSelectDropDown, {
      localVue,
      store,
      propsData: {
        options_text: ["test"],
      },
    });

    const input_height_background = NewSelectDropDown.computed.input_height_background.call({
      title_label: "",
    });
    const input_widget_top = NewSelectDropDown.computed.input_widget_top.call({
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
    const test_protocol = { label: "test", color: "#123456", letter: "B" };
    await store.commit("stimulation/set_imported_protocol", test_protocol);
    expect(updateSpy).toHaveBeenCalledWith();
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
});
