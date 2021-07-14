export default {
  handle_selected_wells({ commit }, wells) {
    const well_values = [];
    wells.filter((well, idx) => {
      if (well) well_values.push(idx);
    });
    this.commit("stimulation/set_selected_wells", well_values);
  },

  handle_protocol_order({ commit, dispatch }, array) {
    // TODO: clean up function, must be a more concise way of performing
    const x_values = [0];
    const y_values = [0];
    const color_assignments = {};
    const helper = (setting) => {
      x_values.push(
        x_values[x_values.length - 1],
        setting.phase_one_duration + x_values[x_values.length - 1]
      );
      y_values.push(setting.phase_one_charge, setting.phase_one_charge);
      if (setting.interpulse_duration) {
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
    for (let i = 0; i < array.length; i++) {
      // loop through current array of data inputs
      const number_of_repeats = array[i].repeat.number_of_repeats;
      const repeat_color = array[i].repeat.color;
      const starting_repeat_idx = x_values.length - 1; // keep track of color assignments
      const setting = array[i].settings;
      for (let k = 0; k <= number_of_repeats; k++) {
        // perform loop number of times requested in repeat block
        const nested_protocols = array[i].nested_protocols;
        helper(setting);
        if (nested_protocols.length > 0) {
          for (let j = 0; j < nested_protocols.length; j++) {
            // include all nested_protocols in repeat block
            const nested_setting = nested_protocols[j].settings;
            helper(nested_setting);
          }
        }
        const ending_repeat_idx = x_values.length; // keep track of color assignments
        if (nested_protocols.length > 0)
          color_assignments[repeat_color] = [starting_repeat_idx, ending_repeat_idx];
        if (k === number_of_repeats - 1 && number_of_repeats !== 0) {
          break;
        }
        // TODO: Luci clean up
      }
    }
    this.dispatch("stimulation/handle_repeat_frequency", { x_values, y_values });
    this.commit("stimulation/set_repeat_color_assignments", color_assignments);
    this.commit("stimulation/set_waveform_order", array);
  },
  handle_repeat_frequency({ commit, state }, { x_values, y_values }) {
    const { end_delay_duration } = this.state.stimulation.new_protocol;
    let delay_block;
    if (end_delay_duration !== 0) {
      const last_x_value = x_values[x_values.length - 1];
      const next_x_value = last_x_value + end_delay_duration;
      delay_block = [last_x_value, next_x_value];
    }
    if (delay_block) this.commit("stimulation/set_delay_axis_values", delay_block); // TODO lUci, look at conditional
    this.commit("stimulation/set_axis_values", { x_values, y_values });
  },
  async handle_new_repeat_frequency({ dispatch, state, commit }, time) {
    const { waveform_order } = this.state.stimulation.new_protocol;
    await this.commit("stimulation/set_repeat_frequency", time);
    this.dispatch("stimulation/handle_protocol_order", waveform_order);
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
    const { new_protocol } = this.state.stimulation;
    const text_to_write = JSON.stringify(new_protocol);
    const text_file_blob = new Blob([text_to_write], { type: "application/json" });
    const file_name_to_save = new_protocol.name;
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
  async add_imported_protocol({ commit, state, getters }, { name }) {
    const assignment = await this.getters["stimulation/get_next_protocol"];
    const { color, letter } = assignment;
    const updated_protocol = { color, letter, label: name };
    this.commit("stimulation/set_imported_protocol", updated_protocol);
  },
};
