import Vuex from "vuex";
import { createLocalVue, mount } from "@vue/test-utils";

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

    test("When requesting the next available protocol assignment(color, letter), Then the protocol recieved should be unused and unique", async () => {
      const { protocol_list } = store.state.stimulation;
      const { letter, color } = store.getters["stimulation/get_next_protocol"];

      let check_color_duplicate = false;
      let check_letter_duplicate = false;

      protocol_list.map((protocol) => {
        const { inner_letter, inner_color } = protocol;
        if (inner_letter === letter) check_letter_duplicate = true;
        if (inner_color === color) check_color_duplicate = true;
      });

      expect(check_color_duplicate).toBe(false);
      expect(check_letter_duplicate).toBe(false);
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
  describe("stimulation/mutations/actions", () => {
    test("When stimulation store is initialized, Then default selected wells should be an empty array", () => {
      const { selected_wells } = store.state.stimulation;
      expect(selected_wells).toStrictEqual([]);
    });

    test("When stimulation store is mutated to add or remove selected wells, Then selected wells in state should update according to wells", () => {
      store.dispatch("stimulation/handle_selected_wells", test_wells.SELECTED);
      expect(store.state.stimulation.selected_wells).toStrictEqual([0, 1]);

      store.dispatch("stimulation/handle_selected_wells", test_wells.UNSELECTED);
      expect(store.state.stimulation.selected_wells).toStrictEqual([1]);
    });

    test("When stimulation store is mutated with a new protocol name, Then said name should update in state", () => {
      const name = "Test_name";
      store.commit("stimulation/set_protocol_name", name);
      expect(store.state.stimulation.new_protocol.name).toBe(name);
    });

    test("When stimulation store is mutated with a new delay frequency, Then said frequency should update in state", () => {
      const delay = "10";
      const int_delay = 10;
      store.commit("stimulation/set_repeat_frequency", delay);
      expect(store.state.stimulation.new_protocol.end_delay_duration).toBe(int_delay);
    });

    test("When a user adds a protocol to selected wells, Then the selected wells should be added to protocol assignments with specified protocol", async () => {
      const test_assignment = {
        0: { letter: "B", color: "#45847b", label: "test_B" },
        1: { letter: "B", color: "#45847b", label: "test_B" },
      };
      store.state.stimulation.protocol_list.push(test_assignment[0]);
      await store.dispatch("stimulation/handle_selected_wells", test_wells.SELECTED);
      await store.commit("stimulation/apply_selected_protocol", 2);

      expect(store.state.stimulation.protocol_assignments).toStrictEqual(test_assignment);
    });

    test("When a user imports a new protocol file, Then it will be read by the FileReader API and dispatched", async () => {
      const event = {
        target: {
          files: [
            {
              name: "protocol.json",
              size: 20000,
              type: "application/json",
            },
          ],
        },
      };
      const fileReaderSpy = jest.spyOn(FileReader.prototype, "readAsText").mockImplementation(() => null);
      await store.dispatch("stimulation/handle_import_protocol", event.target.files[0]);
      expect(fileReaderSpy).toHaveBeenCalledWith(event.target.files[0]);
    });

    test("When a user clicks to export current protocol, Then json document will be downloaded locally", async () => {
      window.webkitURL.createObjectURL = function () {};
      const mock_create_element = jest.spyOn(document, "createElement");
      await store.dispatch("stimulation/handle_export_protocol");
      expect(mock_create_element).toHaveBeenCalledTimes(1);
      expect(mock_create_element).toHaveBeenCalledWith("a");

      window.URL.createObjectURL = function () {};
      window.webkitURL = null;
      await store.dispatch("stimulation/handle_export_protocol");
      expect(mock_create_element).toHaveBeenCalledTimes(2);
    });

    test("When protocol file has been read, Then it will be given a new color/letter assignment and added to protocol list in state", async () => {
      const test_protocol = { name: "mock_name" };
      const test_letter = "B";

      await store.dispatch("stimulation/add_imported_protocol", test_protocol);

      const expected_name = store.state.stimulation.protocol_list[2].label;
      const expected_letter = store.state.stimulation.protocol_list[2].letter;
      expect(expected_name).toBe(test_protocol.name);
      expect(expected_letter).toBe(test_letter);
    });

    test("When a user selects wells with a protocol applied, Then the selected wells should be cleared of any protocol assignments with specified protocol", async () => {
      const test_assigment = {
        0: { letter: "A", color: "#118075", label: "Tester" },
      };

      await store.dispatch("stimulation/handle_selected_wells", test_wells.SELECTED);
      await store.commit("stimulation/apply_selected_protocol", 1);
      await store.dispatch("stimulation/handle_selected_wells", test_wells.UNSELECTED);
      await store.commit("stimulation/clear_selected_protocol");

      expect(store.state.stimulation.protocol_assignments).toStrictEqual(test_assigment);
    });

    test("When a user requests to delete the current stimulation by using the trash icon, Then it should reset just the Protocol Viewer and Block View Editor components", async () => {
      await store.commit("stimulation/reset_new_protocol");
      expect(store.state.stimulation.new_protocol.waveform_order).toStrictEqual([]);
    });

    test("When a user requests to delete the all of their current changes to entire stim studio, Then it should reset the entire state", async () => {
      store.state.stimulation.protocol_assignments = { test: "test" };
      store.state.stimulation.new_protocol.waveform_order = ["test", "test1"];

      await store.commit("stimulation/reset_state");

      expect(store.state.stimulation.protocol_assignments).toStrictEqual({});
      expect(store.state.stimulation.new_protocol.waveform_order).toStrictEqual([]);
    });

    test("When a user selects a new stimulation type to Current Stimulation Type, Then it should mutate state Current", async () => {
      expect(store.state.stimulation.new_protocol.stimulation_type).toBe("Voltage Controlled Stimulation");
      await store.commit("stimulation/set_stimulation_type", "Current Controlled Stimulation");
      expect(store.state.stimulation.new_protocol.stimulation_type).toBe("Current Controlled Stimulation");
    });

    test("When a user changes the time unit to milliseconds, Then it should mutate state to milliseconds", async () => {
      expect(store.state.stimulation.new_protocol.time_unit).toBe("seconds");
      await store.commit("stimulation/set_time_unit", "milliseconds");
      expect(store.state.stimulation.new_protocol.time_unit).toBe("milliseconds");
    });

    test("When a user wants to zoom in on an axis in the Protocol Viewer, Then the scale will divide by 10", async () => {
      expect(store.state.stimulation.x_axis_scale).toBe(100);
      await store.commit("stimulation/set_zoom_in", "x-axis");
      expect(store.state.stimulation.x_axis_scale).toBe(10);

      expect(store.state.stimulation.y_axis_scale).toBe(10);
      await store.commit("stimulation/set_zoom_in", "y-axis");
      expect(store.state.stimulation.y_axis_scale).toBe(1);
    });

    test("When a user wants to zoom out on an axis, Then the scale will multiple by a power of 10", async () => {
      expect(store.state.stimulation.x_axis_scale).toBe(100);
      await store.commit("stimulation/set_zoom_out", "x-axis");
      expect(store.state.stimulation.x_axis_scale).toBe(1000);

      expect(store.state.stimulation.y_axis_scale).toBe(10);
      await store.commit("stimulation/set_zoom_out", "y-axis");
      expect(store.state.stimulation.y_axis_scale).toBe(100);
    });

    test("When a user makes changes to the protocol order, Then new x and y coordinates will be established and mutated to state", async () => {
      const x_values = [0, 0, 100, 100, 200, 200, 400, 400, 500];
      const y_values = [0, 2, 2, 2, 2, 0, 0, -2, -2];
      const colors = { b7b7b7: [0, 9] };

      await store.dispatch("stimulation/handle_protocol_order", test_protocol_order);
      const { x_axis_values, y_axis_values, repeat_colors } = store.state.stimulation;
      expect(x_axis_values).toStrictEqual(x_values);
      expect(y_axis_values).toStrictEqual(y_values);
      expect(repeat_colors).toStrictEqual(colors);
    });

    test("When a user adds a repeat delay into the input of the settings panel, Then it will appear at the end of the waveform in the graph", async () => {
      const test_delay = 10;
      const expected_block = [[0, 10]];
      await store.dispatch("stimulation/handle_new_repeat_frequency", test_delay);
      const { delay_blocks } = store.state.stimulation;
      expect(delay_blocks).toStrictEqual(expected_block);
    });
  });
});
