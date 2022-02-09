import { WellTitle as LabwareDefinition } from "@/js_utils/labware_calculations.js";
const twenty_four_well_plate_definition = new LabwareDefinition(4, 6);
import { post_stim_message, post_stim_status } from "../../../js_utils/axios_helpers";

const time_conversion = {
  seconds: 1000,
  milliseconds: 1,
  minutes: 60000,
};

export default {
  handle_selected_wells({ commit }, wells) {
    const well_values = [];

    wells.filter((well, idx) => {
      if (well) well_values.push(idx);
    });

    commit("set_selected_wells", well_values);
  },

  async handle_protocol_order({ commit, dispatch }, new_pulse_order) {
    const x_values = [0];
    const y_values = [0];
    const color_assignments = {};
    const pulses = [];

    const get_last = (array) => array[array.length - 1];
    const helper = (setting, remaining_pulse_dur) => {
      // Add values for phase 1
      const components_to_add = {
        x: [setting.phase_one_duration],
        y: [setting.phase_one_charge],
      };
      // If biphasic, handle remaining pulse components
      if (setting.phase_two_duration > 0) {
        // Add values for interphase interval
        components_to_add.x.push(setting.interphase_interval);
        components_to_add.y.push(0);
        // Add values for phase 2
        components_to_add.x.push(setting.phase_two_duration);
        components_to_add.y.push(setting.phase_two_charge);
      }
      // Add values for delay
      components_to_add.x.push(setting.repeat_delay_interval);
      components_to_add.y.push(0);

      const num_components_to_add = components_to_add.x.length;
      // add components until all are added or the total active duration is reached
      for (let i = 0; i < num_components_to_add; i++) {
        const component_duration = Math.min(components_to_add.x[i], remaining_pulse_dur);
        x_values.push(get_last(x_values), component_duration + get_last(x_values));
        y_values.push(components_to_add.y[i], components_to_add.y[i]);
        remaining_pulse_dur -= component_duration;
        if (remaining_pulse_dur == 0) break;
      }
      // set final value to zero in case the pulse was cut off in the middle of either phase
      x_values.push(get_last(x_values));
      y_values.push(0);
      return remaining_pulse_dur;
    };

    await new_pulse_order.map(async (pulse) => {
      const { color } = pulse.repeat;
      const { total_active_duration, repeat_delay_interval } = pulse.stim_settings;
      let setting = pulse.pulse_settings;

      const starting_repeat_idx = x_values.length - 1;
      const converted_total_active =
        total_active_duration.duration * time_conversion[total_active_duration.unit];

      setting = {
        ...setting,
        repeat_delay_interval,
        total_active_duration: converted_total_active,
      };
      pulses.push(setting);

      let remaining_pulse_dur = setting.total_active_duration;
      while (remaining_pulse_dur > 0) {
        // Tanner (11/2/21): could move this outer loop into helper so remaining_pulse_dur can be tracked more clearly
        remaining_pulse_dur = helper(setting, remaining_pulse_dur);
      }

      const ending_repeat_idx = x_values.length;
      color_assignments[color] = [starting_repeat_idx, ending_repeat_idx];
    });

    commit("set_repeat_color_assignments", color_assignments);
    commit("set_pulses", { pulses, new_pulse_order });
    dispatch("handle_rest_duration", {
      x_values,
      y_values,
    });
  },

  handle_rest_duration({ commit, state }, { x_values, y_values }) {
    const { rest_duration, time_unit } = state.protocol_editor;
    let delay_block;

    if (rest_duration !== 0) {
      const converted_delay = rest_duration * time_conversion[time_unit];
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
    const { detailed_pulses } = state.protocol_editor;

    if (time === "") time = "0";

    await commit("set_rest_duration", time);
    dispatch("handle_protocol_order", detailed_pulses);
  },

  async handle_import_protocol({ commit, state, dispatch }, file) {
    const reader = new FileReader();

    reader.onload = async function () {
      const response = JSON.parse(reader.result);
      await dispatch("add_imported_protocol", response);
    };

    reader.onerror = function () {
      console.log(reader.onerror);
      alert("Import unsuccessful");
    };

    reader.readAsText(file);
  },

  async handle_export_protocol({ state }) {
    const { protocol_editor } = state;
    const text_to_write = JSON.stringify(protocol_editor);
    const text_file_blob = new Blob([text_to_write], { type: "application/json" });
    const file_name_to_save = protocol_editor.name;

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

  async add_imported_protocol({ commit, state, getters }, protocol) {
    await commit("set_edit_mode_off");

    const assignment = await getters["get_next_protocol"];
    const { color, letter } = assignment;
    const imported_protocol = { color, letter, label: protocol.name, protocol };

    await commit("set_edit_mode", { label: protocol.name, letter });
    commit("set_imported_protocol", imported_protocol);
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

    const charge_conversion = { C: 1000, V: 1 };

    for (let well_idx = 0; well_idx < 24; well_idx++) {
      const well_name = twenty_four_well_plate_definition.get_well_name_from_well_index(well_idx, false);
      message.protocol_assignments[well_name] = null;
    }

    const unique_protocol_ids = new Set();
    for (const well in protocol_assignments) {
      if (protocol_assignments !== {}) {
        const { stimulation_type, pulses, stop_setting, detailed_pulses } = protocol_assignments[
          well
        ].protocol;
        const { letter } = protocol_assignments[well];

        const fill_color_payload = {
          stim_fill_colors: detailed_pulses.map((pulse) => pulse.repeat.color),
          well,
        };
        this.commit("data/set_fill_colors", fill_color_payload);
        // add protocol to list of unique protocols if it has not been entered yet
        if (!unique_protocol_ids.has(letter)) {
          unique_protocol_ids.add(letter);
          const converted_pulses = pulses.map((pulse) => {
            return {
              phase_one_duration: pulse.phase_one_duration * 1000, // sent in µs
              phase_one_charge: pulse.phase_one_charge * charge_conversion[stimulation_type], // sent in mV or µA
              interphase_interval: pulse.interphase_interval * 1000, // sent in µs
              phase_two_charge: pulse.phase_two_charge * charge_conversion[stimulation_type], // sent in mV or µA
              phase_two_duration: pulse.phase_two_duration * 1000, // sent in µs
              repeat_delay_interval: Math.round(pulse.repeat_delay_interval * 1000), // sent in µs, also needs to be an integer value
              total_active_duration: pulse.total_active_duration, // sent in ms
            };
          });

          const protocol_model = {
            protocol_id: letter,
            stimulation_type,
            run_until_stopped: stop_setting.includes("Stopped"),
            subprotocols: converted_pulses,
          };
          message.protocols.push(protocol_model);
        }
        // asign letter to well number
        const well_number = twenty_four_well_plate_definition.get_well_name_from_well_index(well, false);
        message.protocol_assignments[well_number] = letter;
      }
    }
    try {
      await post_stim_message(message);
      await post_stim_status(status);
    } catch (error) {
      console.log(error);
    }
  },

  async stop_stim_status() {
    const status = false;
    await post_stim_status(status);
  },

  async edit_selected_protocol({ commit, dispatch, state }, protocol) {
    const { label, letter, color } = protocol;
    const { stimulation_type, time_unit, rest_duration, detailed_pulses, stop_setting } = protocol.protocol;
    state.current_assignment = { letter, color };

    try {
      await commit("set_protocol_name", label);
      await commit("set_stimulation_type", stimulation_type);
      await commit("set_time_unit", time_unit);
      await commit("set_rest_duration", rest_duration);
      await commit("set_stop_setting", stop_setting);
      await dispatch("handle_protocol_order", detailed_pulses);
    } catch (error) {
      console.log(error);
    }

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
  handle_x_axis_unit({ commit, dispatch, state }, idx) {
    const { x_axis_values, y_axis_values } = state;
    const converted_x_values = x_axis_values.map((val) => (idx === 1 ? val * 1e-3 : val * 1e3));
    commit("set_x_axis_time_idx", idx);
    dispatch("handle_rest_duration", {
      x_values: converted_x_values,
      y_values: y_axis_values,
    });
  },
};
