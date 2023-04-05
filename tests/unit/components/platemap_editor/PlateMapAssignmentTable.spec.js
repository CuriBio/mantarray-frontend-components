import { mount } from "@vue/test-utils";
import PlateMapAssignmentTable from "@/components/plate_based_widgets/mapeditor/PlateMapAssignmentTable.vue";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);
let NuxtStore;
let store;

describe("PlateMapAssignmentTable.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting PlateMapAssignmentTable, Then the table headers will be present", async () => {
    const wrapper = mount(PlateMapAssignmentTable, {
      store,
      localVue,
    });
    const header_labels = wrapper.findAll("th");
    for (const [idx, expected_header] of Object.entries(["Label", "Wells", "Color", ""])) {
      expect(header_labels.at(idx).text()).toBe(expected_header);
    }
  });

  test("When clicking the trash icon next to a label assignment, Then the wells will be cleared from state for that assignment and removed from the table", async () => {
    const wrapper = mount(PlateMapAssignmentTable, {
      store,
      localVue,
    });

    // mock applying and assigning wells to an assigment
    await store.commit("platemap/set_new_label", "well_assignment_one");
    await store.commit("platemap/set_selected_wells", [1, 4, 7]);
    await store.commit("platemap/apply_well_assignment", "well_assignment_one");

    expect(store.state.platemap.well_assignments[1].wells).toStrictEqual([1, 4, 7]);
    expect(wrapper.findAll("td").at(1).text()).toBe("B1, A2, D2");

    await wrapper.find(".fontawesome__trash-icon").trigger("click");
    expect(store.state.platemap.well_assignments[1].wells).toStrictEqual([]);
  });
});
