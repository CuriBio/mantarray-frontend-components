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
      stubs: {
        NuxtLink: true, // Add this line to stub NuxtLink
      },
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
      stubs: {
        NuxtLink: true, // Add this line to stub NuxtLink
      },
    });
    await wrapper.find("#input-widget-field-platemap-name").setValue("test_platemap_name");
    // mock applying and assigning wells to a assignment
    await store.commit("platemap/set_new_label", "well_assignment_one");
    await store.commit("platemap/set_selected_wells", [1, 4, 7]);
    await store.commit("platemap/apply_well_assignment", "well_assignment_one");

    await wrapper.findAll(".div__platemap-button-background-enabled").at(1).trigger("click");

    expect(action_spy).toHaveBeenCalledWith("platemap/handle_export_platemap", "test_platemap_name");
  });

  test("When user clicks on import button, Then action will be dispatched to store", async () => {
    const filereader_spy = jest
      .spyOn(FileReader.prototype, "readAsText")
      .mockImplementation(() => "test successful");

    const action_spy = jest.spyOn(store, "dispatch");

    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
      stubs: {
        NuxtLink: true, // Add this line to stub NuxtLink
      },
    });

    await wrapper.findAll(".div__platemap-button-background-enabled").at(0).trigger("click");

    const test_file = new File([new ArrayBuffer(1)], "file.jpg");
    await wrapper.vm.handle_import([test_file]);

    expect(action_spy).toHaveBeenCalledWith("platemap/handle_file_import", test_file);
    expect(filereader_spy).toHaveBeenCalledTimes(1);
  });

  test("When user clicks plate column, Then the well indices selected will be added to state", async () => {
    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
      stubs: {
        NuxtLink: true, // Add this line to stub NuxtLink
      },
    });

    await wrapper.find("#row_1").trigger("click");

    expect(store.state.platemap.selected_wells).toStrictEqual([1, 5, 9, 13, 17, 21]);
  });

  test("When the platemap name is changed from importing a file or selecting from map dropdown, Then platemap name input will autofill if different", async () => {
    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
      stubs: {
        NuxtLink: true, // Add this line to stub NuxtLink
      },
    });

    expect(wrapper.vm.input_platemap_name).toBeNull();
    expect(wrapper.vm.invalid_text).toBe("Required");

    await store.commit("platemap/set_platemap_name", "new_name");

    expect(wrapper.vm.input_platemap_name).toBe("new_name");
    expect(wrapper.vm.invalid_text).toBe("");
  });

  test("When user selects 'Save Changes' button, Then the current platemap configuration will be saved to state", async () => {
    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
      stubs: {
        NuxtLink: true, // Add this line to stub NuxtLink
      },
    });

    await wrapper.find("#input-widget-field-platemap-name").setValue("new_platemap");
    await wrapper.find("#row_0").trigger("click");
    await store.commit("platemap/set_new_label", "well_assignment_one");
    await store.commit("platemap/apply_well_assignment", "well_assignment_one");
    await wrapper.findAll(".div__platemap-button-background-enabled").at(2).trigger("click");

    expect(store.state.platemap.stored_platemaps[1].map_name).toBe("new_platemap");
  });

  test("When user selects 'Save Changes' to a previously saved platemap, Then the changes to will added to original platemap and not add a new one", async () => {
    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
      stubs: {
        NuxtLink: true, // Add this line to stub NuxtLink
      },
    });

    await wrapper.find("#input-widget-field-platemap-name").setValue("new_platemap");
    await wrapper.find("#column_1").trigger("click");
    await store.commit("platemap/set_new_label", "well_assignment_one");
    await store.commit("platemap/apply_well_assignment", "well_assignment_one");
    await wrapper.findAll(".div__platemap-button-background-enabled").at(2).trigger("click");

    const { stored_platemaps } = store.state.platemap;
    expect(stored_platemaps[1].map_name).toBe("new_platemap");
    expect(stored_platemaps[1].labels[1].wells).toStrictEqual([0, 1, 2, 3]);
    expect(stored_platemaps).toHaveLength(2);

    await wrapper.find("#input-widget-field-platemap-name").setValue("updated_platemap_name");
    await wrapper.find("#column_2").trigger("click");
    await store.commit("platemap/apply_well_assignment", "well_assignment_one");

    await wrapper.findAll(".div__platemap-button-background-enabled").at(2).trigger("click");

    expect(stored_platemaps[1].map_name).toBe("updated_platemap_name");
    expect(stored_platemaps[1].labels[1].wells).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(stored_platemaps).toHaveLength(2);
  });

  test("When user selects 'Clear/Reset All' button, Then the current platemap configuration reset entire platemap", async () => {
    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
      stubs: {
        NuxtLink: true, // Add this line to stub NuxtLink
      },
    });

    await wrapper.find("#input-widget-field-platemap-name").setValue("new_platemap");
    await wrapper.find("#row_0").trigger("click");
    await store.commit("platemap/set_new_label", "well_assignment_one");
    await store.commit("platemap/apply_well_assignment", "well_assignment_one");

    await wrapper.findAll(".div__platemap-button-background-enabled").at(2).trigger("click");

    expect(store.state.platemap.well_assignments[1].wells).toStrictEqual([0, 4, 8, 12, 16, 20]);
    expect(store.state.platemap.well_assignments).toHaveLength(2);
    expect(store.state.platemap.stored_platemaps).toHaveLength(2);

    await wrapper.findAll(".div__platemap-button-background-enabled").at(3).trigger("click");

    expect(store.state.platemap.well_assignments).toHaveLength(1);
    expect(store.state.platemap.stored_platemaps).toHaveLength(1);
  });

  test("When user selects 'Edit Label' button, Then assigment modal will open with name passed as props", async () => {
    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
      stubs: {
        NuxtLink: true, // Add this line to stub NuxtLink
      },
    });

    await store.commit("platemap/set_new_label", "well_assignment_one");

    await wrapper.findAll(".div__platemap-createapply-button-background-enabled").at(1).trigger("click");

    expect(wrapper.vm.editable_name).toBe("well_assignment_one");

    await wrapper.vm.handle_modal_close();
    expect(wrapper.vm.editable_name).toBeNull();
  });

  test("When user selects 'Discard Changes' button, Then the platemap will reset to most recent saved state", async () => {
    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
      stubs: {
        NuxtLink: true, // Add this line to stub NuxtLink
      },
    });

    await wrapper.find("#input-widget-field-platemap-name").setValue("new_platemap");
    await wrapper.find("#row_0").trigger("click");
    await store.commit("platemap/set_new_label", "well_assignment_one");
    await store.commit("platemap/apply_well_assignment", "well_assignment_one");
    // save changes
    await wrapper.findAll(".div__platemap-button-background-enabled").at(2).trigger("click");

    // declare previously saved state
    expect(store.state.platemap.well_assignments[1].wells).toStrictEqual([0, 4, 8, 12, 16, 20]);
    expect(store.state.platemap.current_platemap_name).toBe("new_platemap");

    await wrapper.find("#input-widget-field-platemap-name").setValue("different_platemap_name");
    await wrapper.find("#row_1").trigger("click");
    await store.commit("platemap/set_new_label", "well_assignment_two");
    await store.commit("platemap/apply_well_assignment", "well_assignment_two");

    expect(store.state.platemap.well_assignments[2].wells).toStrictEqual([1, 5, 9, 13, 17, 21]);

    // click discard
    await wrapper.findAll(".div__platemap-button-background-enabled").at(4).trigger("click");

    expect(store.state.platemap.well_assignments[1].wells).toStrictEqual([0, 4, 8, 12, 16, 20]);
    expect(store.state.platemap.current_platemap_name).toBe("new_platemap");
    expect(store.state.platemap.well_assignments[2].wells).toStrictEqual([]);
  });
  test("When user selects 'Discard Changes' button when no changes have ever been saved, Then the platemap will reset to most recent to empty state", async () => {
    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
      stubs: {
        NuxtLink: true, // Add this line to stub NuxtLink
      },
    });

    await wrapper.find("#input-widget-field-platemap-name").setValue("new_platemap");
    await wrapper.find("#row_0").trigger("click");
    await store.commit("platemap/set_new_label", "well_assignment_one");
    await store.commit("platemap/apply_well_assignment", "well_assignment_one");

    // declare previously saved state
    expect(store.state.platemap.well_assignments).toHaveLength(2);
    expect(store.state.platemap.well_assignments[1].wells).toStrictEqual([0, 4, 8, 12, 16, 20]);

    // click discard
    await wrapper.findAll(".div__platemap-button-background-enabled").at(4).trigger("click");

    expect(store.state.platemap.well_assignments[1].wells).toStrictEqual([]);
    expect(store.state.platemap.current_platemap_name).toBe("");
    expect(wrapper.find("#input-widget-field-platemap-name").text()).toBe("");
  });
});
