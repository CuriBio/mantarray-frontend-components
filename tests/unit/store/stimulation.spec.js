import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import * as axios_helpers from "@/js_utils/axios_helpers.js";
import { WellTitle as LabwareDefinition } from "@/js_utils/labware_calculations.js";
const twenty_four_well_plate_definition = new LabwareDefinition(4, 6);
import { COLOR_PALETTE, STIM_STATUS, ALPHABET } from "../../../store/modules/stimulation/enums";

describe("store/stimulation", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let NuxtStore;
  let store;
  const test_wells = {
    SELECTED: [true, true, false, false, false],
    UNSELECTED: [false, true, false, false, false],
  };

  const test_stim_json = JSON.stringify({
    protocols: [
      {
        color: "hsla(51, 90%, 40%, 1)",
        letter: "A",
        label: "",
        protocol: {
          name: "test_proto_1",
          run_until_stopped: true,
          stimulation_type: "C",
          rest_duration: 0,
          time_unit: "milliseconds",
          subprotocols: [
            {
              type: "Delay",
              duration: 333,
              unit: "milliseconds",
            },
          ],
          detailed_subprotocols: [
            {
              type: "Delay",
              color: "hsla(69, 92%, 45%, 1)",
              pulse_settings: {
                duration: 333,
                unit: "milliseconds",
              },
            },
          ],
        },
      },
      {
        color: "hsla(334, 95%, 53%, 1)",
        letter: "B",
        label: "",
        protocol: {
          name: "test_proto_2",
          run_until_stopped: true,
          stimulation_type: "C",
          rest_duration: 0,
          time_unit: "milliseconds",
          subprotocols: [
            {
              type: "Delay",
              duration: 15000,
              unit: "milliseconds",
            },
          ],
          detailed_subprotocols: [
            {
              type: "Delay",
              color: "hsla(69, 92%, 45%, 1)",
              pulse_settings: {
                duration: 15000,
                unit: "milliseconds",
              },
            },
          ],
        },
      },
    ],
    protocol_assignments: {
      A1: null,
      B1: null,
      C1: null,
      D1: null,
      A2: null,
      B2: null,
      C2: null,
      D2: null,
      A3: null,
      B3: null,
      C3: null,
      D3: null,
      A4: "B",
      B4: "B",
      C4: "B",
      D4: "B",
      A5: "A",
      B5: "A",
      C5: "A",
      D5: "A",
      A6: null,
      B6: null,
      C6: null,
      D6: null,
    },
  });

  const test_protocol_order = [
    {
      type: "Biphasic",
      src: "test",
      color: "b7b7b7",
      pulse_settings: {
        phase_one_duration: 100,
        phase_one_charge: 200,
        interphase_interval: 10,
        phase_two_duration: 3,
        phase_two_charge: 200,
        postphase_interval: 5,
        total_active_duration: {
          duration: 1000,
          unit: "milliseconds",
        },
        num_cycles: 1,
      },
      nested_protocols: [],
    },
  ];

  const test_protocol_list = [
    { letter: "", color: "", label: "Create New" },
    {
      letter: "A",
      color: "#118075",
      label: "Tester",
      protocol: {
        name: "Tester",
        stimulation_type: "V",
        rest_duration: 20,
        time_unit: "milliseconds",
        subprotocols: [
          {
            type: "Delay",
            duration: 15,
            unit: "seconds",
          },
          {
            type: "Delay",
            duration: 20,
            unit: "milliseconds",
          },
        ],
        detailed_subprotocols: [
          {
            type: "Delay",
            src: "/delay-tile.png",
            nested_protocols: [],
            color: "hsla(99, 60%, 40%, 1)",
            pulse_settings: { duration: 15, unit: "seconds" },
          },
        ],
      },
    },
  ];

  describe("stimulation/getters", () => {
    beforeAll(async () => {
      const storePath = `${process.env.buildDir}/store.js`;
      NuxtStore = await import(storePath);
    });

    beforeEach(async () => {
      store = await NuxtStore.createStore();
      store.state.stimulation.protocol_list = JSON.parse(JSON.stringify(test_protocol_list));
    });

    test("When the protocol dropdown displays available protocols, Then only only protocols with defined label should return", async () => {
      const protocols = store.getters["stimulation/get_protocols"];
      const labeled_protocols = store.state.stimulation.protocol_list.filter(
        (protocol) => protocol.label.length != 0
      ).length;
      expect(protocols).toHaveLength(labeled_protocols);
    });
    test("When requesting the next available protocol assignment(color, letter), Then the protocol recieved should be unused and unique", async () => {
      store.state.stimulation.protocol_list = [{ letter: "", color: "", label: "Create New" }];

      [...Array(26)].map((_, i) => {
        const { color, letter } = store.getters["stimulation/get_next_protocol"];

        store.state.stimulation.protocol_list.push({ color, letter });
        expect(color).toBe(COLOR_PALETTE[i % 26 === 25 ? 0 : (i % 26) + 1]);
      });

      // expect that double letters will be chosen after initial 26 are used as single characters
      // reuse color palette every 26
      [...Array(26)].map((_, i) => {
        const { color, letter } = store.getters["stimulation/get_next_protocol"];
        store.state.stimulation.protocol_list.push({ color, letter });
        expect(color).toBe(COLOR_PALETTE[i % 26 === 25 ? 0 : (i % 26) + 1]);
        expect(letter).toBe(ALPHABET[i] + ALPHABET[i]);
      });
      // just ensure it continues to add a letter
      [...Array(26)].map((_, i) => {
        const { color, letter } = store.getters["stimulation/get_next_protocol"];

        store.state.stimulation.protocol_list.push({ color, letter });

        expect(color).toBe(COLOR_PALETTE[i % 26 === 25 ? 0 : (i % 26) + 1]);
        expect(letter).toBe(ALPHABET[i] + ALPHABET[i] + ALPHABET[i]);
      });
    });

    test("When there are no saved protocols, Then the letter assigned to new protocol will be A", async () => {
      store.state.stimulation.protocol_list = [{ letter: "", color: "", label: "Create New" }];
      const { letter } = await store.getters["stimulation/get_next_protocol"];
      expect(letter).toBe("A");
    });

    test("When a protocol is selected to be editted, Then the letter and color assignment should be that of the selected protocol", async () => {
      const selected_protocol = store.state.stimulation.protocol_list[1];
      await store.dispatch("stimulation/edit_selected_protocol", selected_protocol);

      const { letter, color } = store.getters["stimulation/get_next_protocol"];

      expect(letter).toBe("A");
      expect(color).toBe("#118075");
    });

    test("When requesting the next stimulation type, Then it should return what user has selected in dropdown", async () => {
      const voltage = "Voltage";
      const current = "Current";

      const default_type = store.getters["stimulation/get_stimulation_type"];
      expect(default_type).toBe(current);

      store.state.stimulation.protocol_editor.stimulation_type = "V";
      const voltage_selection = store.getters["stimulation/get_stimulation_type"];
      expect(voltage_selection).toBe(voltage);

      store.state.stimulation.protocol_editor.stimulation_type = "C";
      const current_selection = store.getters["stimulation/get_stimulation_type"];
      expect(current_selection).toBe(current);
    });

    test("When requesting the name and rest duration to edit existing protocol in the editor, Then it should return specified pulse order", async () => {
      const selected_protocol = store.state.stimulation.protocol_list[1];
      const { name, rest_duration } = selected_protocol.protocol;
      await store.dispatch("stimulation/edit_selected_protocol", selected_protocol);

      const actual_name = store.getters["stimulation/get_protocol_name"];
      expect(actual_name).toBe(name);

      const actual_delay = store.getters["stimulation/get_rest_duration"];
      expect(actual_delay).toBe(rest_duration);
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
    beforeAll(async () => {
      const storePath = `${process.env.buildDir}/store.js`;
      NuxtStore = await import(storePath);
    });

    beforeEach(async () => {
      store = await NuxtStore.createStore();
      store.state.stimulation.protocol_list = JSON.parse(JSON.stringify(test_protocol_list));
    });
    afterEach(() => {
      jest.resetAllMocks();
    });

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
      store.commit("stimulation/set_rest_duration", delay);
      expect(store.state.stimulation.protocol_editor.rest_duration).toBe(int_delay);
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
      expect(store.state.stimulation.stim_status).toBe(STIM_STATUS.CONFIG_CHECK_NEEDED);
    });
    test("When changes the stim studios x-axis unit, Then the coordinate values in the store will be changed accordingly", async () => {
      const test_ms_coordinates = {
        x_values: [0, 5000, 10000, 15000],
        y_values: [50, 55, 60, 65],
      };
      const test_sec_coordinates = {
        x_values: [0, 5, 10, 15],
        y_values: [50, 55, 60, 65],
      };

      const ms_obj = { idx: 0, unit_name: "milliseconds" };
      const sec_obj = { idx: 1, unit_name: "seconds" };

      await store.commit("stimulation/set_axis_values", test_ms_coordinates);

      await store.dispatch("stimulation/handle_x_axis_unit", sec_obj);
      expect(store.state.stimulation.x_axis_values).toStrictEqual(test_sec_coordinates.x_values);
      expect(store.state.stimulation.y_axis_values).toStrictEqual(test_sec_coordinates.y_values);

      // test to ensure it won't happen twice in a row, will only occur when the index value is changed
      await store.dispatch("stimulation/handle_x_axis_unit", sec_obj);
      expect(store.state.stimulation.x_axis_values).toStrictEqual(test_sec_coordinates.x_values);
      expect(store.state.stimulation.y_axis_values).toStrictEqual(test_sec_coordinates.y_values);

      await store.dispatch("stimulation/handle_x_axis_unit", ms_obj);
      expect(store.state.stimulation.x_axis_values).toStrictEqual(test_ms_coordinates.x_values);
      expect(store.state.stimulation.y_axis_values).toStrictEqual(test_ms_coordinates.y_values);

      // test to ensure it won't happen twice in a row, will only occur when the index value is changed
      await store.dispatch("stimulation/handle_x_axis_unit", ms_obj);
      expect(store.state.stimulation.x_axis_values).toStrictEqual(test_ms_coordinates.x_values);
      expect(store.state.stimulation.y_axis_values).toStrictEqual(test_ms_coordinates.y_values);
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
        result: test_stim_json,
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
      const parsed_stim_data = JSON.parse(test_stim_json);
      await store.dispatch("stimulation/add_imported_protocol", parsed_stim_data);

      const expected_name = store.state.stimulation.protocol_list[2].label;
      const expected_letter = store.state.stimulation.protocol_list[2].letter;
      expect(expected_name).toBe(parsed_stim_data.protocols[0].protocol.name);
      expect(expected_letter).toBe("B"); // imported letter assignments won't be used, will always be next in line
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
      expect(store.state.stimulation.protocol_editor.subprotocols).toStrictEqual([]);
    });

    test("When a user requests to delete the all of their current changes to entire stim studio, Then it should reset the entire state", async () => {
      store.state.stimulation.protocol_assignments = { test: "test" };
      store.state.stimulation.protocol_editor.subprotocols = ["test", "test1"];

      await store.commit("stimulation/reset_state");

      expect(store.state.stimulation.protocol_assignments).toStrictEqual({});
      expect(store.state.stimulation.protocol_editor.subprotocols).toStrictEqual([]);
    });

    test("When a user selects a new stimulation type to Current Stimulation Type, Then it should mutate state Current", async () => {
      expect(store.state.stimulation.protocol_editor.stimulation_type).toBe("C");
      await store.commit("stimulation/set_stimulation_type", "Voltage Controlled Stimulation");
      expect(store.state.stimulation.protocol_editor.stimulation_type).toBe("V");
      await store.commit("stimulation/set_stimulation_type", "Current Controlled Stimulation");
      expect(store.state.stimulation.protocol_editor.stimulation_type).toBe("C");
    });

    test("When a user changes the time unit to seconds, Then it should mutate state to seconds", async () => {
      expect(store.state.stimulation.protocol_editor.time_unit).toBe("milliseconds");
      await store.commit("stimulation/set_time_unit", "seconds");
      expect(store.state.stimulation.protocol_editor.time_unit).toBe("seconds");
    });

    test("When a user wants to zoom in on a the y-axis in the Protocol Viewer, Then the scale will divide by 10", async () => {
      expect(store.state.stimulation.y_axis_scale).toBe(120);
      await store.commit("stimulation/set_zoom_in", "y-axis");
      expect(store.state.stimulation.y_axis_scale).toBe(80);
    });

    test("When a user wants to zoom out on the y-axis, Then the scale will multiple by a power of 10", async () => {
      expect(store.state.stimulation.y_axis_scale).toBe(120);
      await store.commit("stimulation/set_zoom_out", "y-axis");
      expect(store.state.stimulation.y_axis_scale).toBe(180);
    });

    test("When a user makes changes to the protocol order, Then new x and y coordinates will be established and mutated to state", async () => {
      const x_values = [0, 0, 100, 100, 110, 110, 113, 113, 118, 118];
      const y_values = [0, 200, 200, 0, 0, 200, 200, 0, 0, 0];
      const colors = [["b7b7b7", [0, 10]]];

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

    test("When a user wants to save changes to an existing protocol by clicking on Save Changes button, Then the edited protocol will be updated in protocol assignments if assigned", async () => {
      const protocol_list = store.state.stimulation.protocol_list;
      const selected_protocol = protocol_list[1];
      const old_name = "Tester";
      const new_name = "New_name";

      await store.dispatch("stimulation/handle_selected_wells", test_wells.SELECTED);
      await store.commit("stimulation/apply_selected_protocol", selected_protocol);

      const previous_status = store.state.stimulation.stim_status;
      let protocol_assignments = store.state.stimulation.protocol_assignments;
      const pre_assignment_name = protocol_assignments[0].protocol.name;
      expect(pre_assignment_name).toBe(old_name);

      await store.dispatch("stimulation/edit_selected_protocol", selected_protocol);
      await store.commit("stimulation/set_protocol_name", new_name);
      await store.dispatch("stimulation/add_saved_protocol");

      protocol_assignments = store.state.stimulation.protocol_assignments; // have to get this value again since it is reassigned inside the store
      const post_assignment_name = protocol_assignments[0].protocol.name;
      expect(post_assignment_name).toBe(new_name);
      expect(previous_status).toBe(store.state.stimulation.stim_status); // shouldn't change if only editing existing assignment
    });

    test("When a user wants to delete an existing protocol by clicking on trash icon, Then the selected protocol will be removed from the list of available protocols, removed from any assigned wells, and the editor will be reset", async () => {
      const protocol_list = store.state.stimulation.protocol_list;
      const selected_protocol = protocol_list[1];

      await store.dispatch("stimulation/handle_selected_wells", test_wells.SELECTED);
      await store.commit("stimulation/apply_selected_protocol", selected_protocol);
      await store.dispatch("stimulation/edit_selected_protocol", selected_protocol);
      await store.dispatch("stimulation/handle_protocol_editor_reset");

      expect(store.state.stimulation.protocol_assignments).toStrictEqual({});
      expect(protocol_list).toHaveLength(1);
    });

    test("When a user starts a stimulation, Then the protocol message should be created and then posted to the BE", async () => {
      const axios_spy = jest.spyOn(axios_helpers, "call_axios_post_from_vuex").mockImplementation(() => null);

      const test_well_protocol_pairs = {};
      for (let well_idx = 0; well_idx < 24; well_idx++) {
        const well_name = twenty_four_well_plate_definition.get_well_name_from_well_index(well_idx, false);
        test_well_protocol_pairs[well_name] = null;
      }
      test_well_protocol_pairs["A2"] = "B";
      test_well_protocol_pairs["C2"] = "D";
      test_well_protocol_pairs["D3"] = "D";

      const test_protocol_B = {
        letter: "B",
        color: "#000000",
        label: "test_1",
        protocol: {
          stimulation_type: "C",
          run_until_stopped: true,
          subprotocols: [
            {
              type: "Monophasic",
              phase_one_duration: 15,
              phase_one_charge: 500,
              postphase_interval: 3,
              num_cycles: 1,
            },
          ],
          detailed_subprotocols: [
            {
              color: "hsla(45, 90%, 40%, 1)",
            },
          ],
        },
      };
      const test_protocol_D = {
        letter: "D",
        color: "#000001",
        label: "test_2",
        protocol: {
          stimulation_type: "V",
          run_until_stopped: false,
          subprotocols: [
            {
              type: "Biphasic",
              phase_one_duration: 20,
              phase_one_charge: 400,
              interphase_interval: 10,
              phase_two_charge: -400,
              phase_two_duration: 20,
              postphase_interval: 0,
              num_cycles: 2,
            },
          ],
          detailed_subprotocols: [
            {
              color: "hsla(309, 50%, 60%, 1)",
            },
          ],
        },
      };
      const test_assignment = {
        4: test_protocol_B,
        6: test_protocol_D,
        11: test_protocol_D,
      };

      const expected_message = {
        protocols: [
          {
            protocol_id: "B",
            stimulation_type: "C",
            run_until_stopped: true,
            subprotocols: [
              {
                type: "Monophasic",
                num_cycles: 1,
                postphase_interval: 3000,
                phase_one_duration: 15000,
                phase_one_charge: 500000,
              },
            ],
          },
          {
            protocol_id: "D",
            stimulation_type: "V",
            run_until_stopped: false,
            subprotocols: [
              {
                type: "Biphasic",
                num_cycles: 2,
                postphase_interval: 0,
                phase_one_duration: 20000,
                phase_one_charge: 400,
                interphase_interval: 10000,
                phase_two_charge: -400,
                phase_two_duration: 20000,
              },
            ],
          },
        ],
        protocol_assignments: test_well_protocol_pairs,
      };

      store.state.stimulation.protocol_assignments = test_assignment;
      // send message once
      await store.dispatch("stimulation/create_protocol_message");
      expect(axios_spy).toHaveBeenCalledWith("/set_protocols", {
        data: JSON.stringify(expected_message),
      });
      expect(axios_spy).toHaveBeenCalledWith("/set_stim_status?running=true");
      // send message again and make sure nothing was modified. Tanner (11/3/21): there was an issue where the protocols were modified inside of create_protocol_message, so sending message twice to catch that issue if present
      await store.dispatch("stimulation/create_protocol_message");
      expect(axios_spy).toHaveBeenCalledWith("/set_protocols", {
        data: JSON.stringify(expected_message),
      });
      expect(axios_spy).toHaveBeenCalledWith("/set_stim_status?running=true");
    });
    test("When a user stops a stimulation, Then the protocol message should be created and then posted to the BE", async () => {
      const axios_status_spy = jest
        .spyOn(axios_helpers, "call_axios_post_from_vuex")
        .mockImplementation(() => null);
      await store.dispatch("stimulation/stop_stimulation");
      expect(axios_status_spy).toHaveBeenCalledWith("/set_stim_status?running=false");
    });

    test("When a user adds a repeat delay into the input of the settings panel, Then it will appear at the end of the waveform in the graph", async () => {
      const test_delay = 10;
      const expected_block = [[0, 10]];
      await store.dispatch("stimulation/handle_new_rest_duration", test_delay);
      const { delay_blocks } = store.state.stimulation;
      expect(delay_blocks).toStrictEqual(expected_block);
    });

    test.each([
      [{ status: 400 }, "ERROR"],
      [{ status: 200 }, "CONFIG_CHECK_IN_PROGRESS"],
    ])(
      "When a user clicks icon to start a stim configuration check, Then action will post to BE and update stim_status",
      async (response, status) => {
        const axios_status_spy = jest
          .spyOn(axios_helpers, "call_axios_post_from_vuex")
          .mockImplementation(() => response);

        store.state.stimulation.protocol_assignments = { 1: {} };
        await store.dispatch("stimulation/start_stim_configuration");

        expect(axios_status_spy).toHaveBeenCalledWith("/start_stim_checks", { well_indices: ["1"] });
        expect(store.state.stimulation.stim_status).toBe(STIM_STATUS[status]);
      }
    );
  });
});
