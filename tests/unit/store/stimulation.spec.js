import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import * as axios_helpers from "../../../js_utils/axios_helpers.js";

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
      const voltage = "Voltage (mV)";
      const current = "Current (µA)";

      const default_type = store.getters["stimulation/get_stimulation_type"];
      expect(default_type).toBe(voltage);

      store.state.stimulation.protocol_editor.stimulation_type = "C";
      const current_selection = store.getters["stimulation/get_stimulation_type"];
      expect(current_selection).toBe(current);

      store.state.stimulation.protocol_editor.stimulation_type = "V";
      const voltage_selection = store.getters["stimulation/get_stimulation_type"];
      expect(voltage_selection).toBe(voltage);
    });

    test("When requesting the detailed pulse order, name, and end delay duration to edit existing protocol in the editor, Then it should return specified pulse order", async () => {
      const selected_protocol = store.state.stimulation.protocol_list[1];
      const { detailed_pulses, name, end_delay_duration } = selected_protocol.protocol;
      await store.dispatch("stimulation/edit_selected_protocol", selected_protocol);

      const actual_detailed_pulses = store.getters["stimulation/get_detailed_pulse_order"];
      expect(actual_detailed_pulses).toStrictEqual(detailed_pulses);

      const actual_name = store.getters["stimulation/get_protocol_name"];
      expect(actual_name).toBe(name);

      const actual_delay = store.getters["stimulation/get_end_delay_duration"];
      expect(actual_delay).toBe(end_delay_duration);
    });

    test("Given a protocol has been selected for edit, When requesting the protocol assignment in the protocol editor, Then it should return the assignment of the selected protocol for edit", async () => {
      const selected_protocol = store.state.stimulation.protocol_list[1];
      const { letter, color } = selected_protocol;
      const expected_assignment = { letter, color };
      await store.dispatch("stimulation/edit_selected_protocol", selected_protocol);
      const default_type = store.getters["stimulation/get_next_protocol"];
      expect(default_type).toStrictEqual(expected_assignment);
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
      expect(store.state.stimulation.protocol_editor.name).toBe(name);
    });

    test("When stimulation store is mutated with a new delay frequency, Then said frequency should update in state", () => {
      const delay = "10";
      const int_delay = 10;
      store.commit("stimulation/set_repeat_frequency", delay);
      expect(store.state.stimulation.protocol_editor.end_delay_duration).toBe(int_delay);
    });

    test("When a user adds a protocol to selected wells, Then the selected wells should be added to protocol assignments with specified protocol", async () => {
      const test_assignment = {
        0: { letter: "B", color: "#45847b", label: "test_B" },
        1: { letter: "B", color: "#45847b", label: "test_B" },
      };
      const { protocol_list } = store.state.stimulation;
      protocol_list.push(test_assignment[0]);
      await store.dispatch("stimulation/handle_selected_wells", test_wells.SELECTED);
      await store.commit("stimulation/apply_selected_protocol", protocol_list[2]);

      expect(store.state.stimulation.protocol_assignments).toStrictEqual(test_assignment);
    });

    test("When a user imports a new protocol file, Then it will be read by the FileReader API and dispatched", async () => {
      const file = {
        name: "test.json",
        size: 450,
        type: "application/json",
      };

      const reader = {
        readAsText: jest.fn(),
        onload: jest.fn(),
        onerror: jest.fn(),
        result: JSON.stringify({ name: "TEST" }),
      };
      jest.spyOn(global, "FileReader").mockImplementation(() => reader);
      await store.dispatch("stimulation/handle_import_protocol", file);
      reader.onload();
      reader.onerror();
      expect(reader.readAsText).toHaveBeenCalledTimes(1);
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
        0: { letter: "A", color: "#118075", label: "Tester", protocol: { test: null } },
      };

      await store.dispatch("stimulation/handle_selected_wells", test_wells.SELECTED);
      await store.commit("stimulation/apply_selected_protocol", test_assigment[0]);
      await store.dispatch("stimulation/handle_selected_wells", test_wells.UNSELECTED);
      await store.commit("stimulation/clear_selected_protocol");

      expect(store.state.stimulation.protocol_assignments).toStrictEqual(test_assigment);
    });

    test("When a user requests to delete the current stimulation by using the trash icon, Then it should reset just the Protocol Viewer and Block View Editor components", async () => {
      await store.commit("stimulation/reset_protocol_editor");
      expect(store.state.stimulation.protocol_editor.pulses).toStrictEqual([]);
    });

    test("When a user requests to delete the all of their current changes to entire stim studio, Then it should reset the entire state", async () => {
      store.state.stimulation.protocol_assignments = { test: "test" };
      store.state.stimulation.protocol_editor.pulses = ["test", "test1"];

      await store.commit("stimulation/reset_state");

      expect(store.state.stimulation.protocol_assignments).toStrictEqual({});
      expect(store.state.stimulation.protocol_editor.pulses).toStrictEqual([]);
    });

    test("When a user selects a new stimulation type to Current Stimulation Type, Then it should mutate state Current", async () => {
      expect(store.state.stimulation.protocol_editor.stimulation_type).toBe("V");
      await store.commit("stimulation/set_stimulation_type", "Current Controlled Stimulation");
      expect(store.state.stimulation.protocol_editor.stimulation_type).toBe("C");
      await store.commit("stimulation/set_stimulation_type", "Voltage Controlled Stimulation");
      expect(store.state.stimulation.protocol_editor.stimulation_type).toBe("V");
    });

    test("When a user changes the time unit to milliseconds, Then it should mutate state to milliseconds", async () => {
      expect(store.state.stimulation.protocol_editor.time_unit).toBe("seconds");
      await store.commit("stimulation/set_time_unit", "milliseconds");
      expect(store.state.stimulation.protocol_editor.time_unit).toBe("milliseconds");
    });

    test("When a user wants to zoom in on an axis in the Protocol Viewer, Then the scale will divide by 10", async () => {
      expect(store.state.stimulation.x_axis_scale).toBe(100);
      await store.commit("stimulation/set_zoom_in", "x-axis");
      expect(store.state.stimulation.x_axis_scale).toBe(66.66666666666667);

      expect(store.state.stimulation.y_axis_scale).toBe(500);
      await store.commit("stimulation/set_zoom_in", "y-axis");
      expect(store.state.stimulation.y_axis_scale).toBe(333.3333333333333);
    });

    test("When a user wants to zoom out on an axis, Then the scale will multiple by a power of 10", async () => {
      expect(store.state.stimulation.x_axis_scale).toBe(100);
      await store.commit("stimulation/set_zoom_out", "x-axis");
      expect(store.state.stimulation.x_axis_scale).toBe(150);

      expect(store.state.stimulation.y_axis_scale).toBe(500);
      await store.commit("stimulation/set_zoom_out", "y-axis");
      expect(store.state.stimulation.y_axis_scale).toBe(750);
    });

    test("When a user makes changes to the protocol order, Then new x and y coordinates will be established and mutated to state", async () => {
      const x_values = [0, 0, 0.1, 0.1, 0.2, 0.2, 0.4, 0.4, 0.5];
      const y_values = [0, 2, 2, 2, 2, 0, 0, -2, -2];
      const colors = { b7b7b7: [0, 9] };

      await store.dispatch("stimulation/handle_protocol_order", test_protocol_order);
      const { x_axis_values, y_axis_values, repeat_colors } = store.state.stimulation;
      expect(x_axis_values).toStrictEqual(x_values);
      expect(y_axis_values).toStrictEqual(y_values);
      expect(repeat_colors).toStrictEqual(colors);
    });

    test("When a user wants to save the new protocol by clicking on Save Changes button, Then the new protocol will be committed to state", async () => {
      const { current_assignment, protocol_editor } = store.state.stimulation;
      current_assignment.letter = "B";
      current_assignment.color = "#000000";
      protocol_editor.name = "mock_protocol";

      const expected_protocol = {
        letter: "B",
        color: "#000000",
        label: "mock_protocol",
        protocol: protocol_editor,
      };
      await store.dispatch("stimulation/add_saved_protocol");
      expect(store.state.stimulation.protocol_list[2]).toStrictEqual(expected_protocol);
    });

    test("When a user wants to save changes to an existing protocol by clicking on Save Changes button, Then the updated protocol will be commited to state in the available protocol list", async () => {
      const { protocol_list, protocol_editor, edit_mode } = store.state.stimulation;
      const selected_protocol = protocol_list[1];
      const { protocol } = protocol_list[1];
      const old_name = "Tester";
      const new_name = "New_name";

      expect(protocol.name).toBe(old_name);
      await store.dispatch("stimulation/edit_selected_protocol", selected_protocol);
      expect(protocol_editor.name).toBe(old_name);
      expect(edit_mode.status).toBe(true);
      await store.commit("stimulation/set_protocol_name", new_name);
      await store.dispatch("stimulation/add_saved_protocol");
      const test = protocol_list[1].protocol.name;
      expect(test).toBe(new_name);
      expect(edit_mode.status).toBe(false);
    });

    test("When a user wants to save changes to an existing protocol by clicking on Save Changes button, Then the editted protocol will be updated in protocol assignments if assigned", async () => {
      const { protocol_list, protocol_assignments } = store.state.stimulation;
      const selected_protocol = protocol_list[1];
      const old_name = "Tester";
      const new_name = "New_name";

      await store.dispatch("stimulation/handle_selected_wells", test_wells.SELECTED);
      await store.commit("stimulation/apply_selected_protocol", selected_protocol);

      const pre_assignment_name = protocol_assignments[0].protocol.name;
      expect(pre_assignment_name).toBe(old_name);
      await store.dispatch("stimulation/edit_selected_protocol", selected_protocol);
      await store.commit("stimulation/set_protocol_name", new_name);
      await store.dispatch("stimulation/add_saved_protocol");
      const post_assignment_name = protocol_assignments[0].protocol.name;
      expect(post_assignment_name).toBe(new_name);
    });

    test("When a user wants to delete an existing protocol by clicking on trash icon, Then the selected protocol will be removed from the list of available protocols, removed from any assigned wells, and the editor will be reset", async () => {
      const { protocol_list, protocol_assignments } = store.state.stimulation;
      const selected_protocol = protocol_list[1];

      await store.dispatch("stimulation/handle_selected_wells", test_wells.SELECTED);
      await store.commit("stimulation/apply_selected_protocol", selected_protocol);
      await store.dispatch("stimulation/edit_selected_protocol", selected_protocol);
      await store.dispatch("stimulation/handle_protocol_editor_reset");

      expect(protocol_assignments).toStrictEqual({});
      expect(protocol_list).toHaveLength(1);
    });

    test("When a user starts a stimulation, Then the protocol message should be created and then posted to the BE", async () => {
      const axios_message_spy = jest.spyOn(axios_helpers, "post_stim_message").mockImplementation(() => null);
      const axios_status_spy = jest.spyOn(axios_helpers, "post_stim_status").mockImplementation(() => null);
      const test_assignment = {
        4: {
          letter: "C",
          color: "#000000",
          label: "test",
          protocol: {
            stimulation_type: "C",
            pulses: [
              {
                phase_one_duration: 1500,
                phase_one_charge: 500,
                interpulse_duration: 0,
                phase_two_charge: 0,
                phase_two_duration: 0,
              },
            ],
          },
        },
      };
      const expected_message = {
        protocol: [
          {
            stimulation_type: "C",
            well_number: "A02",
            pulses: [
              {
                phase_one_duration: 1500000,
                phase_one_charge: 500,
                interpulse_duration: 0,
                phase_two_charge: 0,
                phase_two_duration: 0,
              },
            ],
          },
        ],
      };
      store.state.stimulation.protocol_assignments = test_assignment;
      await store.dispatch("stimulation/create_protocol_message");
      expect(axios_message_spy).toHaveBeenCalledWith(expected_message);
      expect(axios_status_spy).toHaveBeenCalledWith(true);
    });
    test("When a user stops a stimulation, Then the protocol message should be created and then posted to the BE", async () => {
      const axios_status_spy = jest.spyOn(axios_helpers, "post_stim_status").mockImplementation(() => null);
      await store.dispatch("stimulation/stop_stim_status");
      expect(axios_status_spy).toHaveBeenCalledWith(false);
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
