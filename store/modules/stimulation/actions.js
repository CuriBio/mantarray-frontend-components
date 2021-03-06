import { WellTitle as LabwareDefinition } from "@/js_utils/labware_calculations.js";
const twenty_four_well_plate_definition = new LabwareDefinition(4, 6);
import { post_stim_message, post_stim_status } from "../../../js_utils/axios_helpers";

export default {
  handle_selected_wells({ commit }, wells) {
    const well_values = [];
    wells.filter((well, idx) => {
      if (well) well_values.push(idx);
    });
    this.commit("stimulation/set_selected_wells", well_values);
  },

  handle_protocol_order({ commit, dispatch }, new_pulse_order) {
    const x_values = [0];
    const y_values = [0];
    const color_assignments = {};
    const pulses = [];

    const helper = (setting) => {
      pulses.push(setting);
      x_values.push(
        x_values[x_values.length - 1],
        setting.phase_one_duration + x_values[x_values.length - 1]
      );
      y_values.push(setting.phase_one_charge, setting.phase_one_charge);
      if (setting.interpulse_duration > 0) {
        x_values.push(
          x_values[x_values.length - 1],
          setting.interpulse_duration + x_values[x_values.length - 1]
        );
        y_values.push(0, 0);
        x_values.push(
          x_values[x_values.length - 1],
          setting.phase_two_duration + x_values[x_values.length - 1]
        );
        y_values.push(setting.phase_two_charge, setting.phase_two_charge);
      }
    };
    new_pulse_order.map((pulse) => {
      const number_of_repeats = pulse.repeat.number_of_repeats;
      const repeat_color = pulse.repeat.color;
      const starting_repeat_idx = x_values.length - 1;
      const setting = pulse.settings;
      for (let k = 0; k <= number_of_repeats; k++) {
        const nested_protocols = pulse.nested_protocols;
        helper(setting);
        if (nested_protocols.length > 0) {
          nested_protocols.map((protocol) => {
            const nested_setting = protocol.settings;
            helper(nested_setting);
          });
        }
        const ending_repeat_idx = x_values.length;
        if (nested_protocols.length > 0)
          color_assignments[repeat_color] = [starting_repeat_idx, ending_repeat_idx];
        if (k === number_of_repeats - 1 && number_of_repeats !== 0) {
          break;
        }
      }
    });
    this.commit("stimulation/set_repeat_color_assignments", color_assignments);
    this.commit("stimulation/set_pulses", { pulses, new_pulse_order });
    this.dispatch("stimulation/handle_repeat_frequency", {
      x_values,
      y_values,
    });
  },
  handle_repeat_frequency({ commit, state }, { x_values, y_values }) {
    const { end_delay_duration } = this.state.stimulation.protocol_editor;
    let delay_block;
    if (end_delay_duration !== 0) {
      const last_x_value = x_values[x_values.length - 1];
      const next_x_value = last_x_value + end_delay_duration;
      delay_block = [last_x_value, next_x_value];
    }
    if (end_delay_duration === 0) {
      delay_block = [NaN, NaN];
    }
    this.commit("stimulation/set_delay_axis_values", delay_block);
    this.commit("stimulation/set_axis_values", { x_values, y_values });
  },
  async handle_new_repeat_frequency({ dispatch, state, commit }, time) {
    const { detailed_pulses } = this.state.stimulation.protocol_editor;
    if (time === "") time = "0";
    await this.commit("stimulation/set_repeat_frequency", time);
    this.dispatch("stimulation/handle_protocol_order", detailed_pulses);
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
  async handle_export_protocol({ commit, state }) {
    const { protocol_editor } = this.state.stimulation;
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
    const assignment = await this.getters["stimulation/get_next_protocol"];
    const { color, letter } = assignment;
    const updated_protocol = { color, letter, label: protocol.name, protocol };
    this.commit("stimulation/set_imported_protocol", updated_protocol);
  },
  add_saved_protocol({ commit, state, dispatch }) {
    const { protocol_editor, edit_mode, protocol_list } = this.state.stimulation;
    const { letter, color } = this.state.stimulation.current_assignment;
    const updated_protocol = { color, letter, label: protocol_editor.name, protocol: protocol_editor };
    if (!edit_mode.status) {
      this.commit("stimulation/set_imported_protocol", updated_protocol);
    } else if (edit_mode.status) {
      protocol_list.map((protocol, idx) => {
        if (protocol.letter === edit_mode.letter)
          protocol_list[idx] = {
            ...protocol,
            label: protocol_editor.name,
            protocol: protocol_editor,
          };
      });
      this.commit("stimulation/set_edit_mode_off");
      this.dispatch("stimulation/update_protocol_assignments", updated_protocol);
    }
  },
  update_protocol_assignments({ state }, updated_protocol) {
    const { protocol_assignments } = this.state.stimulation;
    for (const assignment in protocol_assignments) {
      if (protocol_assignments[assignment].letter === updated_protocol.letter) {
        protocol_assignments[assignment] = updated_protocol;
      }
    }
  },
  async create_protocol_message({ commit, state }) {
    const status = true;
    const message = { protocol: [] };
    const { protocol_assignments } = this.state.stimulation;
    for (const well in protocol_assignments) {
      if (protocol_assignments !== {}) {
        const { stimulation_type, pulses } = protocol_assignments[well].protocol;
        const well_number = twenty_four_well_plate_definition.get_well_name_from_well_index(well, true);
        const protocol_model = {
          stimulation_type,
          well_number,
          pulses,
        };
        message.protocol.push(protocol_model);
      }
    }
    await post_stim_message(message);
    await post_stim_status(status);
    this.commit("stimulation/set_stim_status", status);
    console.log(message);
  },
  async stop_stim_status() {
    const status = false;
    await post_stim_status(status);
    this.commit("stimulation/set_stim_status", status);
  },
  async edit_selected_protocol({ commit, dispatch, state }, protocol) {
    const { label, letter, color } = protocol;
    const { stimulation_type, time_unit, end_delay_duration, detailed_pulses } = protocol.protocol;
    this.state.stimulation.current_assignment = { letter, color };
    try {
      await this.commit("stimulation/set_protocol_name", label);
      await this.commit("stimulation/set_stimulation_type", stimulation_type);
      await this.commit("stimulation/set_time_unit", time_unit);
      await this.commit("stimulation/set_repeat_frequency", end_delay_duration);
      await this.dispatch("stimulation/handle_protocol_order", detailed_pulses);
    } catch (error) {
      console.log(error);
    }
    this.commit("stimulation/set_edit_mode", { label, letter });
  },
  async handle_protocol_editor_reset({ commit, state }) {
    const { protocol_list, edit_mode, protocol_assignments } = this.state.stimulation;
    const { status, label } = edit_mode;

    if (status) {
      // TODO change to not directly mutate state in action
      protocol_list.map((protocol, idx) => {
        if (protocol.label === label) protocol_list.splice(idx, 1);
      });
      for (const well in protocol_assignments) {
        if (protocol_assignments[well].label === label) delete protocol_assignments[well];
      }
      await this.commit("stimulation/set_edit_mode_off");
    }
    this.commit("stimulation/reset_protocol_editor");
  },
};
