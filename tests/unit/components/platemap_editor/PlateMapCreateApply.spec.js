import { mount } from "@vue/test-utils";
import PlateMapCreateApply from "@/components/plate_based_widgets/mapeditor/PlateMapCreateApply.vue";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);
let NuxtStore;
let store;

describe("PlateMapCreateApply.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting PlateMapCreateApply, Then the apply button should be disabled", async () => {
    const wrapper = mount(PlateMapCreateApply, {
      store,
      localVue,
    });
    const disabled_button = wrapper.find(".div__platemap-createapply-button-background-disabled");
    expect(disabled_button.isVisible()).toBe(true);
  });

  test("When selecting 'Create New Label' button, Then open modal event is emitted to parent component", async () => {
    const wrapper = mount(PlateMapCreateApply, {
      store,
      localVue,
    });

    await wrapper.find(".div__platemap-createapply-button-background-enabled").trigger("click");
    expect(wrapper.emitted("handle_modal_open")).toHaveLength(1);
  });

  test("When a new assignment gets added, Then the dropdown will auto select the newly added assignment", async () => {
    const wrapper = mount(PlateMapCreateApply, {
      store,
      localVue,
    });
    expect(wrapper.vm.well_assignment_names).toStrictEqual(["Select Label"]);
    expect(wrapper.vm.assignment_options_idx).toBe(0);

    await store.commit("platemap/set_new_label", "test_label");

    expect(wrapper.vm.well_assignment_names).toStrictEqual(["Select Label", "test_label"]);
    expect(wrapper.vm.assignment_options_idx).toBe(1);
  });
  test("When a new platemap gets added, Then the dropdown will auto select the newly added platemap", async () => {
    const wrapper = mount(PlateMapCreateApply, {
      store,
      localVue,
    });
    expect(wrapper.vm.platemap_names).toStrictEqual(["Create New Map"]);
    expect(wrapper.vm.map_options_idx).toBe(0);

    await store.commit("platemap/save_new_platemap", {
      map_name: "test_platemap",
      labels: { name: "Select Label", wells: [], color: "none" },
    });

    expect(wrapper.vm.platemap_names).toStrictEqual(["Create New Map", "test_platemap"]);
    expect(wrapper.vm.map_options_idx).toBe(1);
  });

  test("When a user selects a platemap from the dropdown, Then the change will be commited to state", async () => {
    const commit_spy = jest.spyOn(store, "commit");
    const wrapper = mount(PlateMapCreateApply, {
      store,
      localVue,
    });

    expect(wrapper.vm.map_options_idx).toBe(0);
    store.state.platemap.stored_platemaps = [
      {
        map_name: "Create New Map",
        labels: { name: "Select Label", wells: [], color: "none" },
      },
      {
        map_name: "test_platemap_one",
        labels: { name: "Select Label", wells: [], color: "none" },
      },
      {
        map_name: "test_platemap_two",
        labels: { name: "Select Label", wells: [], color: "none" },
      },
    ];

    await wrapper.find(".div__select-dropdown-controls-content-widget").trigger("click");
    const list_opts = wrapper.findAll("li");
    // try to select other option when disabled
    await list_opts.at(0).trigger("click");
    expect(wrapper.vm.map_options_idx).toBe(1);

    expect(commit_spy).toHaveBeenCalledWith("platemap/set_platemap_name", "test_platemap_one", undefined);
    expect(commit_spy).toHaveBeenCalledWith(
      "platemap/set_entire_platemap",
      {
        name: "Select Label",
        wells: [],
        color: "none",
      },
      undefined
    );
  });
  test("When a user selects a assignment from the dropdown, Then the changes will be saved to local state", async () => {
    const wrapper = mount(PlateMapCreateApply, {
      store,
      localVue,
    });

    expect(wrapper.vm.assignment_options_idx).toBe(0);

    await store.commit("platemap/set_new_label", "well_assignment_one");
    await store.commit("platemap/set_new_label", "well_assignment_two");

    await wrapper.find(".div__select-dropdown-controls-content-widget").trigger("click");
    const list_opts = wrapper.findAll("li");
    await list_opts.at(1).trigger("click");

    expect(wrapper.vm.assignment_options_idx).toBe(1);
    expect(wrapper.vm.assignment_option).toBe("well_assignment_one");
  });

  test("When a user applies assignment to selected wells, Then the wells get added to assignment in vuex state", async () => {
    const wrapper = mount(PlateMapCreateApply, {
      store,
      localVue,
    });

    expect(wrapper.vm.assignment_options_idx).toBe(0);

    await store.commit("platemap/set_new_label", "well_assignment_one");
    await store.commit("platemap/set_selected_wells", [1, 4, 7, 13]);
    expect(store.state.platemap.well_assignments[1].wells).toStrictEqual([]);

    expect(wrapper.vm.is_apply_enabled).toBe(true);

    await wrapper.findAll(".div__platemap-createapply-button-background-enabled").at(0).trigger("click");

    expect(wrapper.vm.assignment_options_idx).toBe(1);
    expect(store.state.platemap.well_assignments[1].wells).toStrictEqual([1, 4, 7, 13]);
  });

  test("When a user applies assignment to selected wells and then selects the same wells to clear them, Then the wells get removed in vuex state", async () => {
    const wrapper = mount(PlateMapCreateApply, {
      store,
      localVue,
    });

    await store.commit("platemap/set_new_label", "well_assignment_one");
    await store.commit("platemap/set_selected_wells", [1, 4, 7, 13]);
    expect(store.state.platemap.well_assignments[1].wells).toStrictEqual([]);

    await wrapper.findAll(".div__platemap-createapply-button-background-enabled").at(0).trigger("click");

    expect(store.state.platemap.well_assignments[1].wells).toStrictEqual([1, 4, 7, 13]);

    await store.commit("platemap/set_selected_wells", [7, 13]);

    await wrapper.findAll(".div__platemap-createapply-button-background-enabled").at(2).trigger("click");

    expect(store.state.platemap.well_assignments[1].wells).toStrictEqual([1, 4]);
  });
});
