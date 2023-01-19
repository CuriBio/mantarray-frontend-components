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

  test("When selecting 'Create New Treatment' button, Then open modal event is emitted to parent component", async () => {
    const wrapper = mount(PlateMapCreateApply, {
      store,
      localVue,
    });

    await wrapper.find(".div__platemap-createapply-button-background-enabled").trigger("click");
    expect(wrapper.emitted("handle_modal_open")).toHaveLength(1);
  });

  test("When a new treatment gets added, Then the dropdown will auto select the newly added treatment", async () => {
    const wrapper = mount(PlateMapCreateApply, {
      store,
      localVue,
    });
    expect(wrapper.vm.well_treatment_names).toStrictEqual(["Select Treatment"]);
    expect(wrapper.vm.treatment_options_idx).toBe(0);

    await store.commit("platemap/set_new_well_treatment", "test_treatment");

    expect(wrapper.vm.well_treatment_names).toStrictEqual(["Select Treatment", "test_treatment"]);
    expect(wrapper.vm.treatment_options_idx).toBe(1);
  });
  test("When a new platemap gets added, Then the dropdown will auto select the newly added platemap", async () => {
    const wrapper = mount(PlateMapCreateApply, {
      store,
      localVue,
    });
    expect(wrapper.vm.platemap_names).toStrictEqual(["Create New Map"]);
    expect(wrapper.vm.map_options_idx).toBe(0);

    await store.commit("platemap/save_new_platemap", {
      name: "test_platemap",
      map: { name: "Select Treatment", wells: [], color: "none" },
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
        name: "Create New Map",
        map: { name: "Select Treatment", wells: [], color: "none" },
      },
      {
        name: "test_platemap_one",
        map: { name: "Select Treatment", wells: [], color: "none" },
      },
      {
        name: "test_platemap_two",
        map: { name: "Select Treatment", wells: [], color: "none" },
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
        name: "Select Treatment",
        wells: [],
        color: "none",
      },
      undefined
    );
  });
});
