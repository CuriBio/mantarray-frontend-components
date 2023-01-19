import { mount } from "@vue/test-utils";
import PlateMapTreatmentTable from "@/components/plate_based_widgets/mapeditor/PlateMapTreatmentTable.vue";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);
let NuxtStore;
let store;

describe("PlateMapTreatmentTable.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting PlateMapTreatmentTable, Then the table headers will be present", async () => {
    const wrapper = mount(PlateMapTreatmentTable, {
      store,
      localVue,
    });
    const header_labels = wrapper.findAll("th");
    for (const [idx, expected_header] of Object.entries(["Treatment Name", "Wells", "Color", ""])) {
      expect(header_labels.at(idx).text()).toBe(expected_header);
    }
  });

  test("When clicking the trash icon next to a treatment assignment, Then the wells will be cleared from state for that treatment and removed from the table", async () => {
    const wrapper = mount(PlateMapTreatmentTable, {
      store,
      localVue,
    });

    // mock applying and assigning wells to a treatment
    await store.commit("platemap/set_new_well_treatment", "well_treatment_one");
    await store.commit("platemap/set_selected_wells", [1, 4, 7]);
    await store.commit("platemap/apply_well_treatment", "well_treatment_one");

    expect(store.state.platemap.well_treatments[1].wells).toStrictEqual([1, 4, 7]);
    expect(wrapper.findAll("td").at(1).text()).toBe("B1, A2, D2");

    await wrapper.find(".fontawesome__trash-icon").trigger("click");
    expect(store.state.platemap.well_treatments[1].wells).toStrictEqual([]);
  });
});
