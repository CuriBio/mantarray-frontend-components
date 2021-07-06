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

  const test_protocol_order = [
    {
      type: "Monophasic",
      src: "test",
      repeat: {
        color: "b7b7b7",
        number_of_repeats: 1,
      },
      settings: {
        phase_one_duration: 100,
        phase_one_charge: 2,
      },
      nested_protocols: [
        {
          type: "Biphasic",
          src: "test",
          repeat: {
            color: "123456",
            number_of_repeats: 1,
          },
          settings: {
            phase_one_duration: 100,
            phase_one_charge: 2,
            interpulse_duration: 200,
            phase_two_duration: 100,
            phase_two_charge: -2,
          },
          nested_protocols: [],
        },
      ],
    },
  ];

  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  describe("stimulation/getters", () => {
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
      const voltage = "Voltage (V)";
      const current = "Current (A)";

      const default_type = store.getters["stimulation/get_stimulation_type"];
      expect(default_type).toBe(voltage);

      store.state.stimulation.new_protocol.stimulation_type = "Current Controlled Stimulation";
      const current_selection = store.getters["stimulation/get_stimulation_type"];
      expect(current_selection).toBe(current);

      store.state.stimulation.new_protocol.stimulation_type = "Voltage Controlled Stimulation";
      const voltage_selection = store.getters["stimulation/get_stimulation_type"];
      expect(voltage_selection).toBe(voltage);
    });

    test("When requesting the time unit, Then it should return what user has selected in dropdown", async () => {
      const seconds = "Time (s)";
      const milliseconds = "Time (ms)";

      const default_unit = store.getters["stimulation/get_time_unit"];
      expect(default_unit).toBe(seconds);

      store.state.stimulation.new_protocol.time_unit = "milliseconds";
      const ms_unit = store.getters["stimulation/get_time_unit"];
      expect(ms_unit).toBe(milliseconds);

      store.state.stimulation.new_protocol.time_unit = "seconds";
      const s_unit = store.getters["stimulation/get_time_unit"];
      expect(s_unit).toBe(seconds);
    });
  });

  describe("stimulation/mutations", () => {
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
      const test_assignment = {
        0: { letter: "B", color: "#45847b", label: "test_B" },
        1: { letter: "B", color: "#45847b", label: "test_B" },
      };
      await store.commit("stimulation/handle_selected_wells", test_wells.SELECTED);
      await store.commit("stimulation/apply_selected_protocol", 2);

      expect(store.state.stimulation.protocol_assignments).toStrictEqual(test_assignment);
    });

    test("When a user selects wells with a protocol applied, Then the selected wells should be cleared of any protocol assignments with specified protocol", async () => {
      const test_assigment = {
        0: { letter: "A", color: "#83c0b3", label: "test_A" },
      };

      await store.commit("stimulation/handle_selected_wells", test_wells.SELECTED);
      await store.commit("stimulation/apply_selected_protocol", 1);
      await store.commit("stimulation/handle_selected_wells", test_wells.UNSELECTED);
      await store.commit("stimulation/clear_selected_protocol");

      expect(store.state.stimulation.protocol_assignments).toStrictEqual(test_assigment);
    });

    test("When a user requests to delete the current stimulation by using the trash icon, Then it should mutate state to true", async () => {
      await store.commit("stimulation/reset_state");
      expect(store.state.stimulation.x_axis_points).toStrictEqual([]);
    });

    test("When a user selects a new stimulation type to Current Stimulation Type, Then it should mutate state Current", async () => {
      expect(store.state.stimulation.new_protocol.stimulation_type).toBe("Voltage Controlled Stimulation");
      await store.commit("stimulation/handle_stimulation_type", "Current Controlled Stimulation");
      expect(store.state.stimulation.new_protocol.stimulation_type).toBe("Current Controlled Stimulation");
    });

    test("When a user changes the time unit to milliseconds, Then it should mutate state to milliseconds", async () => {
      expect(store.state.stimulation.new_protocol.time_unit).toBe("seconds");
      await store.commit("stimulation/handle_time_unit", "milliseconds");
      expect(store.state.stimulation.new_protocol.time_unit).toBe("milliseconds");
    });

    test("When a user wants to zoom in on an axis in the Protocol Viewer, Then the scale will divide by 10", async () => {
      expect(store.state.stimulation.x_axis_scale).toBe(100);
      await store.commit("stimulation/handle_zoom_in", "x-axis");
      expect(store.state.stimulation.x_axis_scale).toBe(10);
    });

    test("When a user wants to zoom out on an axis, Then the scale will multiple by a power of 10", async () => {
      expect(store.state.stimulation.x_axis_scale).toBe(100);
      await store.commit("stimulation/handle_zoom_out", "x-axis");
      expect(store.state.stimulation.x_axis_scale).toBe(1000);
    });

    test("When a user makes changes to the protocol order, Then new x and y coordinates will be established and mutated to state", async () => {
      const x_values = [0, 0, 100, 100, 200, 200, 400, 400, 500];
      const y_values = [0, 2, 2, 2, 2, 0, 0, -2, -2];
      const colors = { b7b7b7: [0, 9] };

      await store.commit("stimulation/handle_protocol_order", test_protocol_order);
      expect(store.state.stimulation.x_axis_points).toStrictEqual(x_values);
      expect(store.state.stimulation.y_axis_points).toStrictEqual(y_values);
      expect(store.state.stimulation.repeat_colors).toStrictEqual(colors);
    });
  });
});
