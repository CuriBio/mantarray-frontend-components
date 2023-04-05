import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import { COLOR_PALETTE } from "@/store/modules/stimulation/enums";

describe("store/platemap", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;

  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    jest.restoreAllMocks();
  });

  describe("actions", () => {
    test("When a user imports a file, Then this will happen", async () => {
      const test_labels = [
        { name: "Select Label", wells: [], color: "none" },
        { name: "import_label_one", wells: [], color: COLOR_PALETTE.reverse()[0] },
        { name: "import_label_two", wells: [], color: COLOR_PALETTE.reverse()[1] },
      ];
      const test_platemap = {
        map_name: "test/map*name?",
        labels: test_labels,
      };
      await store.dispatch("platemap/handle_platemap_from_import", test_platemap);
      expect(store.state.platemap.stored_platemaps).toHaveLength(2);
      expect(store.state.platemap.stored_platemaps[0]).toStrictEqual({
        map_name: "Create New Map",
        labels: test_labels,
      });
      expect(store.state.platemap.stored_platemaps[1]).toStrictEqual({
        ...test_platemap,
        map_name: "testmapname",
      });
    });
  });
  describe("mutations", () => {
    test("When edited name gets saved, Then the new will get changed in stored platemaps and the current", async () => {
      ["import_label_one", "import_label_two"].map(async (label) => {
        await store.commit("platemap/set_new_label", label);
      });

      await store.commit("platemap/change_existing_name", {
        new_name: "new_name",
        old_name: "import_label_one",
      });

      expect(store.state.platemap.stored_platemaps[0].labels[1].name).toBe("new_name");
      expect(store.state.platemap.well_assignments[1].name).toBe("new_name");
    });
  });
});
