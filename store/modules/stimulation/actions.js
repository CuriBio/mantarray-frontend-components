import { WellTitle as LabwareDefinition } from "@/js_utils/labware_calculations.js";
const twenty_four_well_plate_definition = new LabwareDefinition(4, 6);
import { call_axios_post_from_vuex } from "@/js_utils/axios_helpers";
import { are_valid_pulses, check_pulse_compatibility } from "@/js_utils/protocol_validation";
import { STIM_STATUS, TIME_CONVERSION_TO_MILLIS, COLOR_PALETTE } from "./enums";
import { get_protocol_editor_letter } from "./getters";

export default {
  handle_selected_wells({ commit }, wells) {
    const well_values = [];

    wells.filter((well, idx) => {
      if (well) well_values.push(idx);
    });

    commit("set_selected_wells", well_values);
  },

  async handle_protocol_order({ commit, dispatch, state }, new_subprotocol_order) {
    const x_values = [0];
    const y_values = [0];
    const color_assignments = [];
    const subprotocols = [];
    const get_last = (array) => array[array.length - 1];
    const helper = (setting, type) => {
      let components_to_add = [];
      if (type === "Delay") {
        components_to_add = {
          x: [setting.duration * TIME_CONVERSION_TO_MILLIS[setting.unit]],
          y: [0],
        };
      } else {
        // Add values for phase 1
        components_to_add = {
          x: [setting.phase_one_duration],
          y: [setting.phase_one_charge],
        };
        // If biphasic, handle remaining pulse components
        if (setting.phase_two_duration != null) {
          // Add values for interphase interval
          components_to_add.x.push(setting.interphase_interval);
          components_to_add.y.push(0);
          // Add values for phase 2
          components_to_add.x.push(setting.phase_two_duration);
          components_to_add.y.push(setting.phase_two_charge);
        }
        // Add values for delay
        components_to_add.x.push(setting.postphase_interval);
        components_to_add.y.push(0);
      }
      const num_components_to_add = components_to_add.x.length;
      // add components until all are added or the total active duration is reached
      for (let i = 0; i < num_components_to_add; i++) {
        const component_duration = components_to_add.x[i];

        x_values.push(get_last(x_values), component_duration + get_last(x_values));
        y_values.push(components_to_add.y[i], components_to_add.y[i]);
      }
      // set final value to zero in case the pulse was cut off in the middle of either phase
      x_values.push(get_last(x_values));
      y_values.push(0);
    };

    await new_subprotocol_order.map(async (pulse) => {
      if (pulse.type !== "loop") {
        const { color } = pulse;
        let settings = pulse.pulse_settings;
        const starting_repeat_idx = x_values.length - 1;

        settings = {
          type: pulse.type,
          ...settings,
        };

        subprotocols.push(settings);

        // num_cycles defaults to 0 and delay will never update unless run through once
        let remaining_pulse_cycles = pulse.type === "Delay" ? 1 : settings.num_cycles;

        while (remaining_pulse_cycles > 0) {
          helper(settings, pulse.type);
          remaining_pulse_cycles--;
        }

        const ending_repeat_idx = x_values.length;
        color_assignments.push([color, [starting_repeat_idx, ending_repeat_idx]]);
      } else {
        const pulse_copy = JSON.parse(JSON.stringify(pulse));

        // eslint-disable-next-line  no-unused-vars
        for (const _ of Array(pulse.num_iterations).fill()) {
          pulse_copy.subprotocols.map((inner_pulse) => {
            const { color } = inner_pulse;
            let settings = inner_pulse.pulse_settings;
            const starting_repeat_idx = x_values.length - 1;

            settings = {
              type: inner_pulse.type,
              ...settings,
            };

            let remaining_pulse_cycles = inner_pulse.type === "Delay" ? 1 : settings.num_cycles;

            while (remaining_pulse_cycles > 0) {
              helper(settings, inner_pulse.type);
              remaining_pulse_cycles--;
            }

            const ending_repeat_idx = x_values.length;
            color_assignments.push([color, [starting_repeat_idx, ending_repeat_idx]]);
          });
        }

        pulse_copy.subprotocols = pulse_copy.subprotocols.map((looped_pulse) => {
          const settings = looped_pulse.pulse_settings;
          return {
            type: looped_pulse.type,
            ...settings,
          };
        });

        subprotocols.push(pulse_copy);
      }
    });

    // convert x_values to correct unit
    x_values.forEach((val, idx) => {
      x_values[idx] = val / TIME_CONVERSION_TO_MILLIS[state.x_axis_unit_name];
    });

    commit("set_repeat_color_assignments", color_assignments);
    commit("set_subprotocols", { subprotocols, new_subprotocol_order });
    dispatch("handle_rest_duration", {
      x_values,
      y_values,
    });
  },

  handle_rest_duration({ commit, state }, { x_values, y_values }) {
    const { rest_duration, time_unit } = state.protocol_editor;
    const { x_axis_time_idx } = state;
    const x_axis_unit = x_axis_time_idx === 0 ? "milliseconds" : "seconds";
    let delay_block;

    if (rest_duration !== 0) {
      // find the time unit by taking rest duration unit and dividing by the graph x axis unit
      const converted_delay =
        rest_duration * (TIME_CONVERSION_TO_MILLIS[time_unit] / TIME_CONVERSION_TO_MILLIS[x_axis_unit]);

      const last_x_value = x_values[x_values.length - 1];
      const next_x_value = last_x_value + converted_delay;
      delay_block = [last_x_value, next_x_value];
    }

    if (rest_duration == 0) {
      delay_block = [NaN, NaN];
    }

    commit("set_delay_axis_values", delay_block);
    commit("set_axis_values", { x_values, y_values });
  },

  async handle_new_rest_duration({ dispatch, state, commit }, time) {
    // need to grab these values before committing set_rest_duration
    let { detailed_subprotocols } = state.protocol_editor;
    detailed_subprotocols = detailed_subprotocols || [];

    if (time === "") time = "0";
    await commit("set_rest_duration", time);

    // commit this after committing set_rest_duration
    dispatch("handle_protocol_order", detailed_subprotocols);
  },

  async handle_import_protocol({ dispatch }, file) {
    const reader = new FileReader();

    reader.onload = async function () {
      const response = JSON.parse(reader.result);
      await dispatch("check_import_compatibility", response);
    };

    reader.onerror = function () {
      console.log(reader.onerror);
    };

    reader.readAsText(file);
  },

  async handle_export_protocol({ state }) {
    const { protocol_assignments, protocol_list } = state;
    const protocol_copy = JSON.parse(JSON.stringify(protocol_list));
    const message = { protocols: protocol_copy.slice(1), protocol_assignments: {} };

    for (const well_idx of Array(24).keys()) {
      const letter = protocol_assignments[well_idx] ? protocol_assignments[well_idx].letter : null;

      // asign letter to well number
      const well_number = twenty_four_well_plate_definition.get_well_name_from_well_index(well_idx, false);
      message.protocol_assignments[well_number] = letter;
    }

    const text_to_write = JSON.stringify(message);
    const text_file_blob = new Blob([text_to_write], { type: "application/json" });
    // get new file name of datetime
    const current_date = new Date();
    const datetime =
      current_date.getFullYear() +
      "_" +
      (current_date.getMonth() + 1) +
      "_" +
      current_date.getDate() +
      "__" +
      current_date.getHours() +
      current_date.getMinutes() +
      current_date.getSeconds();

    const file_name_to_save = "stim_settings__" + datetime;
    const download_link = document.createElement("a");
    download_link.download = file_name_to_save;
    download_link.innerHTML = "Download File";

    if (window.webkitURL != null) {
      download_link.href = window.webkitURL.createObjectURL(text_file_blob);
    } else {
      download_link.href = window.URL.createObjectURL(text_file_blob);
      download_link.style.display = "none";
      document.body.appendChild(download_link);
    }

    download_link.click();
    download_link.remove();
  },
  check_import_compatibility({ dispatch }, imported_response) {
    // first interation only exported single protocols, not array of multiple
    const protocols_to_use = imported_response.protocols || [{ protocol: imported_response }];
    const compatible_protocols = protocols_to_use.map(({ protocol }) => check_pulse_compatibility(protocol));
    dispatch("add_imported_protocol", compatible_protocols);
  },
  async add_imported_protocol({ commit, state }, protocols) {
    const invalid_imported_protocols = [];
    // helps clean up which protocol to view once import is complete
    // reset stim studio
    await commit("reset_protocol_editor");

    for (const [idx, protocol] of Object.entries(protocols)) {
      const invalid_pulses = are_valid_pulses(protocol.subprotocols);

      if (!invalid_pulses) {
        await commit("set_edit_mode_off");
        // needs to be set to off every iteration because an action elsewhere triggers it on
        const letter = get_protocol_editor_letter(state.protocol_list);
        const color = COLOR_PALETTE[state.protocol_list.length % 26];
        const imported_protocol = { color, letter, label: protocol.name, protocol };
        await commit("set_new_protocol", imported_protocol);
      } else {
        // if protocol is unnamed, assign generic name with place in list, +1 to index
        const name_to_use = protocol.name && protocol.name.length > 0 ? protocol.name : `protocol_${idx + 1}`;
        invalid_imported_protocols.push(name_to_use);
      }
    }

    if (invalid_imported_protocols.length > 0) {
      await commit("set_invalid_imported_protocols", invalid_imported_protocols);
    }
  },
  async add_saved_protocol({ commit, state, dispatch }) {
    const { protocol_editor, edit_mode, protocol_list } = state;
    const { letter, color } = state.current_assignment;
    const updated_protocol = { color, letter, label: protocol_editor.name, protocol: protocol_editor };

    if (!edit_mode.status) {
      commit("set_new_protocol", updated_protocol);
    } else if (edit_mode.status) {
      protocol_list.map((protocol, idx) => {
        if (protocol.letter === edit_mode.letter)
          protocol_list[idx] = {
            ...protocol,
            label: protocol_editor.name,
            protocol: protocol_editor,
          };
      });

      await commit("set_edit_mode_off");
      await dispatch("update_protocol_assignments", updated_protocol);
    }
  },

  update_protocol_assignments({ state }, updated_protocol) {
    const { protocol_assignments } = state;

    for (const assignment in protocol_assignments) {
      if (protocol_assignments[assignment].letter === updated_protocol.letter) {
        protocol_assignments[assignment] = updated_protocol;
      }
    }
  },

  async create_protocol_message({ commit, state }) {
    const status = true;
    const message = { protocols: [], protocol_assignments: {} };

    const { protocol_assignments } = state;
    const { stimulator_circuit_statuses } = this.state.data;

    for (let well_idx = 0; well_idx < 24; well_idx++) {
      const well_name = twenty_four_well_plate_definition.get_well_name_from_well_index(well_idx, false);
      message.protocol_assignments[well_name] = null;
    }

    const unique_protocol_ids = new Set();
    for (const well in protocol_assignments) {
      // remove open circuit wells
      if (!stimulator_circuit_statuses.includes(Number(well))) {
        const {
          stimulation_type,
          subprotocols,
          run_until_stopped,
          detailed_subprotocols,
        } = protocol_assignments[well].protocol;

        const { letter } = protocol_assignments[well];

        const fill_color_payload = {
          stim_fill_colors: detailed_subprotocols
            .map((pulse) =>
              pulse.type === "loop" ? pulse.subprotocols.map((nestedPulse) => nestedPulse.color) : pulse.color
            )
            .flat(),
          well,
        };

        this.commit("data/set_fill_colors", fill_color_payload);
        // add protocol to list of unique protocols if it has not been entered yet
        if (!unique_protocol_ids.has(letter)) {
          unique_protocol_ids.add(letter);
          // this needs to be converted before sent because stim type changes independently of pulse settings
          const converted_subprotocols = await _get_converted_settings(subprotocols);
          const protocol_model = {
            protocol_id: letter,
            stimulation_type,
            run_until_stopped,
            subprotocols: converted_subprotocols,
          };

          message.protocols.push(protocol_model);
        }
        // assign letter to well number
        const well_number = twenty_four_well_plate_definition.get_well_name_from_well_index(well, false);
        message.protocol_assignments[well_number] = letter;
      }
    }

    const message_url = `/set_protocols`;
    const body = { data: JSON.stringify(message) };
    await call_axios_post_from_vuex(message_url, body);

    const status_url = `/set_stim_status?running=${status}`;
    await call_axios_post_from_vuex(status_url);
    commit("set_stim_status", STIM_STATUS.STARTING);
  },

  async stop_stimulation({ commit }) {
    const status_url = `/set_stim_status?running=${false}`;
    await call_axios_post_from_vuex(status_url);
    commit("set_stim_status", STIM_STATUS.STOPPING);
  },

  async edit_selected_protocol({ commit, dispatch, state }, protocol) {
    const { label, letter, color } = protocol;

    const {
      stimulation_type,
      time_unit,
      rest_duration,
      detailed_subprotocols,
      run_until_stopped,
    } = protocol.protocol;

    state.current_assignment = { letter, color };

    await commit("set_protocol_name", label);
    await commit("set_stimulation_type", stimulation_type);
    await commit("set_time_unit", time_unit);
    await commit("set_rest_duration", rest_duration);
    await commit("set_stop_setting", run_until_stopped);
    await dispatch("handle_protocol_order", detailed_subprotocols);

    commit("set_edit_mode", protocol);
  },

  async handle_protocol_editor_reset({ commit, state }) {
    const { protocol_list, edit_mode, protocol_assignments } = state;
    const { status, label } = edit_mode;

    if (status) {
      protocol_list.map((protocol, idx) => {
        if (protocol.label === label) protocol_list.splice(idx, 1);
      });
      for (const well in protocol_assignments) {
        if (protocol_assignments[well].label === label) delete protocol_assignments[well];
      }
      await commit("set_edit_mode_off");
    }
    commit("reset_protocol_editor");
  },
  handle_x_axis_unit({ commit, dispatch, state }, { idx, unit_name }) {
    state.x_axis_unit_name = unit_name;
    const { x_axis_values, y_axis_values, x_axis_time_idx } = state;

    if (idx !== x_axis_time_idx) {
      const converted_x_values = x_axis_values.map((val) => (idx === 1 ? val * 1e-3 : val * 1e3));
      commit("set_x_axis_time_idx", idx);
      if (converted_x_values.length > 0)
        dispatch("handle_rest_duration", {
          x_values: converted_x_values,
          y_values: y_axis_values,
        });
    }
  },
  async start_stim_configuration({ commit, state }) {
    const url = `/start_stim_checks`;
    const well_indices = Object.keys(state.protocol_assignments);
    const { barcodes } = this.state.playback;
    const plate_barcode = barcodes.plate_barcode.value;
    const stim_barcode = barcodes.stim_barcode.value;

    const res = await call_axios_post_from_vuex(url, { well_indices, plate_barcode, stim_barcode });

    if (res && res.status !== 200) {
      commit("set_stim_status", STIM_STATUS.ERROR);
    } else {
      commit("set_stim_status", STIM_STATUS.CONFIG_CHECK_IN_PROGRESS);
    }
  },
  async on_pulse_mouseenter({ state }, { idx, nested_idx }) {
    const original_pulse = state.protocol_editor.detailed_subprotocols[idx];

    if (nested_idx >= 0 && original_pulse.type == "loop") {
      // find the starting index by expanding any loops to find corresponding index in repeat_colors
      const starting_idx = state.protocol_editor.detailed_subprotocols
        // filter any unnecessary indices after hovered over index
        .filter((_, i) => i < idx)
        // reduce to get index
        .reduce((acc, pulse) => {
          const val = pulse.type === "loop" ? pulse.subprotocols.length * pulse.num_iterations : 1;
          return acc + val;
        }, 0);

      // loop through subprotocols x amount of times to highlight every instance in a loop
      const indices_to_use = [...Array(original_pulse.num_iterations).keys()].map((i) => {
        const num_subprotocols = original_pulse.subprotocols.length;
        const idx_to_use = starting_idx + nested_idx + i * num_subprotocols;
        return state.repeat_colors[idx_to_use][1];
      });

      state.hovered_pulse = {
        idx,
        indices: indices_to_use,
        color: state.repeat_colors[starting_idx + nested_idx][0],
      };
    } else {
      //  find the index by expanding any loops to find corresponding index in repeat_colors
      const idx_to_use = state.protocol_editor.detailed_subprotocols
        .filter((_, i) => i <= idx)
        .reduce((acc, pulse, i) => {
          let val = pulse.type === "loop" ? pulse.subprotocols.length * pulse.num_iterations : 1;
          if (i === 0) val = val-- < 0 ? 0 : val--;
          return acc + val;
        }, 0);

      state.hovered_pulse = {
        idx,
        indices: [state.repeat_colors[idx_to_use][1]],
        color: state.repeat_colors[idx_to_use][0],
      };
    }
  },
};

const _get_converted_settings = (subprotocols) => {
  const milli_to_micro = 1e3;
  const charge_conversion = milli_to_micro;

  return subprotocols.map((pulse) => {
    let type_specific_settings = {};
    if (pulse.type === "loop") {
      type_specific_settings = {
        num_iterations: pulse.num_iterations,
        subprotocols: _get_converted_settings(pulse.subprotocols),
      };
    } else if (pulse.type === "Delay")
      type_specific_settings.duration =
        pulse.duration * TIME_CONVERSION_TO_MILLIS[pulse.unit] * milli_to_micro;
    else
      type_specific_settings = {
        num_cycles: pulse.num_cycles,
        postphase_interval: Math.round(pulse.postphase_interval * milli_to_micro), // sent in µs, also needs to be an integer value
        phase_one_duration: pulse.phase_one_duration * milli_to_micro, // sent in µs
        phase_one_charge: pulse.phase_one_charge * charge_conversion, // sent in mV
      };

    if (pulse.type === "Biphasic")
      type_specific_settings = {
        ...type_specific_settings,
        interphase_interval: pulse.interphase_interval * milli_to_micro, // sent in µs
        phase_two_charge: pulse.phase_two_charge * charge_conversion, // sent in mV or µA
        phase_two_duration: pulse.phase_two_duration * milli_to_micro, // sent in µs
      };

    return {
      type: pulse.type,
      ...type_specific_settings,
    };
  });
};
