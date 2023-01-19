import { mount } from "@vue/test-utils";
import PlateMapEditor from "@/components/plate_based_widgets/mapeditor/PlateMapEditor.vue";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);
let NuxtStore;
let store;

describe("PlateMapEditor.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => jest.restoreAllMocks());

  test("When mounting PlateMapEditor, Then the apply button should be disabled", async () => {
    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
    });
    const header_label = wrapper.find(".div__platemapeditor-header");
    expect(header_label.text()).toBe("Plate Map Editor");
  });

  test("When user clicks on export protocol button, Then action will be dispatched to store", async () => {
    const action_spy = jest.spyOn(store, "dispatch");
    window.webkitURL.createObjectURL = function () {};

    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
    });
    await wrapper.find("#input-widget-field-platemap-name").setValue("test_platemap_name");
    // mock applying and assigning wells to a treatment
    await store.commit("platemap/set_new_well_treatment", "well_treatment_one");
    await store.commit("platemap/set_selected_wells", [1, 4, 7]);
    await store.commit("platemap/apply_well_treatment", "well_treatment_one");

    await wrapper.findAll(".div__platemap-button-background-enabled").at(1).trigger("click");

    expect(action_spy).toHaveBeenCalledWith("platemap/handle_export_platemap", "test_platemap_name");
  });

  test("When user clicks on import protocol button, Then action will be dispatched to store", async () => {
    const import_spy = jest
      .spyOn(FileReader.prototype, "readAsText")
      .mockImplementation(() => "test successful");
    const action_spy = jest.spyOn(store, "dispatch");

    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
    });

    await wrapper.findAll(".div__platemap-button-background-enabled").at(0).trigger("click");

    const test_file = new File([new ArrayBuffer(1)], "file.jpg");
    await wrapper.vm.handle_import([test_file]);
    expect(action_spy).toHaveBeenCalledWith("platemap/handle_import_platemap", test_file);
    expect(import_spy).toHaveBeenCalledTimes(1);
  });

  test("When user clicks plate column, Then the well indices selected will be added to state", async () => {
    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
    });

    await wrapper.find("#row_2").trigger("click");

    expect(store.state.platemap.selected_wells).toStrictEqual([1, 5, 9, 13, 17, 21]);
  });

  test("When the platemap name is changed from importing a file or selecting from map dropdown, Then platemap name input will autofill if different", async () => {
    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
    });

    expect(wrapper.vm.input_platemap_name).toBe("");
    expect(wrapper.vm.invalid_text).toBe("Required");

    await store.commit("platemap/set_platemap_name", "new_name");

    expect(wrapper.vm.input_platemap_name).toBe("new_name");
    expect(wrapper.vm.invalid_text).toBe("");
  });

  test("When user selects 'Save Changes' button, Then the current platemap configuration will be saved to state", async () => {
    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
    });

    await wrapper.find("#input-widget-field-platemap-name").setValue("new_platemap");
    await wrapper.find("#row_1").trigger("click");
    await store.commit("platemap/set_new_well_treatment", "well_treatment_one");
    await store.commit("platemap/apply_well_treatment", "well_treatment_one");
    await wrapper.findAll(".div__platemap-button-background-enabled").at(2).trigger("click");

    expect(store.state.platemap.stored_platemaps[1].name).toBe("new_platemap");
  });

  test("When user selects 'Clear/Reset All' button, Then the current platemap configuration reset assigned wells only", async () => {
    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
    });

    await wrapper.find("#input-widget-field-platemap-name").setValue("new_platemap");
    await wrapper.find("#row_1").trigger("click");
    await store.commit("platemap/set_new_well_treatment", "well_treatment_one");
    await store.commit("platemap/apply_well_treatment", "well_treatment_one");

    expect(store.state.platemap.well_treatments[1].wells).toStrictEqual([0, 4, 8, 12, 16, 20]);

    await wrapper.findAll(".div__platemap-button-background-enabled").at(3).trigger("click");

    expect(store.state.platemap.well_treatments[1].wells).toStrictEqual([]);
  });

  test("When user selects 'Discard Changes' button, Then the platemap will reset to most recent saved state", async () => {
    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
    });

    await wrapper.find("#input-widget-field-platemap-name").setValue("new_platemap");
    await wrapper.find("#row_1").trigger("click");
    await store.commit("platemap/set_new_well_treatment", "well_treatment_one");
    await store.commit("platemap/apply_well_treatment", "well_treatment_one");
    // save changes
    await wrapper.findAll(".div__platemap-button-background-enabled").at(2).trigger("click");

    // declare previously saved state
    expect(store.state.platemap.well_treatments[1].wells).toStrictEqual([0, 4, 8, 12, 16, 20]);
    expect(store.state.platemap.current_platemap_name).toBe("new_platemap");

    await wrapper.find("#input-widget-field-platemap-name").setValue("different_platemap_name");
    await wrapper.find("#row_2").trigger("click");
    await store.commit("platemap/set_new_well_treatment", "well_treatment_two");
    await store.commit("platemap/apply_well_treatment", "well_treatment_two");

    expect(store.state.platemap.well_treatments[2].wells).toStrictEqual([1, 5, 9, 13, 17, 21]);

    // click discard
    await wrapper.findAll(".div__platemap-button-background-enabled").at(4).trigger("click");

    expect(store.state.platemap.well_treatments[1].wells).toStrictEqual([0, 4, 8, 12, 16, 20]);
    expect(store.state.platemap.current_platemap_name).toBe("new_platemap");
    expect(store.state.platemap.well_treatments[2].wells).toStrictEqual([]);
  });
});
