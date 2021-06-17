import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

describe("store/stimulation", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;

  const test_wells = {
    SELECTED: [true, true, false, false, false],
    UNSELECTED: [false, true, false, false, false],
  };

  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When stimulation store is initialized, Then default selected wells should be an empty array", () => {
    expect(store.state.stimulation.selected_wells).toStrictEqual([]);
  });

  test("When stimulation store is mutated to add or remove selected wells, Then selected wells in state should update according to wells", () => {
    store.commit("stimulation/handle_selected_wells", test_wells.SELECTED);
    expect(store.state.stimulation.selected_wells).toStrictEqual([0, 1]);

    store.commit("stimulation/handle_selected_wells", test_wells.UNSELECTED);
    expect(store.state.stimulation.selected_wells).toStrictEqual([1]);
  });

  test("When a user adds a protocol to selected wells, Then the selected wells should be added to protocol assignments with specified protocol", async () => {
    await store.commit("stimulation/handle_selected_wells", test_wells.SELECTED);
    await store.commit("stimulation/apply_selected_protocol", 2);
    expect(store.state.stimulation.protocol_assignments).toStrictEqual({
      0: { letter: "B", color: "#45847b", label: "test_B" },
      1: { letter: "B", color: "#45847b", label: "test_B" },
    });
  });

  test("When a user selects wells with a protocol applied, Then the selected wells should be cleared of any protocol assignments with specified protocol", async () => {
    await store.commit("stimulation/handle_selected_wells", test_wells.SELECTED);
    await store.commit("stimulation/apply_selected_protocol", 1);
    await store.commit("stimulation/handle_selected_wells", test_wells.UNSELECTED);
    await store.commit("stimulation/clear_selected_protocol");
    expect(store.state.stimulation.protocol_assignments).toStrictEqual({
      0: { letter: "A", color: "#83c0b3", label: "test_A" },
    });
  });

  test("When the protocol dropdown displays available protocols, Then only only protocols with defined label should return", async () => {
    const protocols = store.getters["stimulation/get_protocols"];
    const labeled_protocols = store.state.stimulation.protocol_list.filter(
      (protocol) => protocol.label.length != 0
    ).length;
    expect(protocols).toHaveLength(labeled_protocols);
  });

  test("When requesting the next available protocol assignment(color, letter), Then only the protocol recieved should be unused and unique", async () => {
    const next_available_protocol = store.getters["stimulation/get_next_protocol"];
    const checked_available_protocol = store.state.stimulation.protocol_list.filter(
      (protocol) => protocol.label.length === 0
    );
    expect(next_available_protocol).toBe(checked_available_protocol[0]);
  });

  test("When requesting the next current stimulation type, Then it should return what user has selected in dropdown", async () => {
    const default_type = store.getters["stimulation/get_stimulation_type"];
    expect(default_type).toBe("Voltage");
    store.state.stimulation.new_protocol.stimulation_type = "Current Controlled Stimulation";
    const current_type = store.getters["stimulation/get_stimulation_type"];
    expect(current_type).toBe("Current");
  });

  test("When a user requests to delete the current stimulation by using the trash icon, Then it should mutate state to true", async () => {
    expect(store.state.stimulation.delete_protocol).toBe(false);
    await store.commit("stimulation/handle_delete_protocol");
    expect(store.state.stimulation.delete_protocol).toBe(true);
  });
});
