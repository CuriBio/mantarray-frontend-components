// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
export default {
  async handle_export_platemap({ state }, platemap_name) {
    const { well_treatments } = state;

    const text_to_write = JSON.stringify({ name: platemap_name, map: well_treatments });
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

    const file_name_to_save = platemap_name + "__" + datetime;
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
  async handle_import_platemap({ commit }, file) {
    const reader = new FileReader();

    reader.onload = async function () {
      const response = JSON.parse(reader.result);
      await commit("save_new_platemap", response);
      await commit("set_entire_platemap", response.map);
    };

    reader.onerror = function () {
      console.log(reader.onerror);
    };

    reader.readAsText(file);
  },
  save_platemap({ state, commit }, name) {
    const previous_name = state.current_platemap_name;
    commit("set_platemap_name", name);
    const new_platemap = {
      name,
      map: JSON.parse(JSON.stringify(state.well_treatments)),
    };

    if (state.stored_platemaps.some(({ name }) => name === new_platemap.name || name === previous_name)) {
      commit("save_platemap_changes", { platemap: new_platemap, previous_name });
    } else {
      commit("save_new_platemap", new_platemap);
    }
  },
  discard_current_platemap_changes({ state, commit }) {
    const previous_state = JSON.parse(JSON.stringify(state.stored_platemaps)).find(
      ({ name }) => name === state.current_platemap_name
    );

    if (previous_state) {
      // add any new well_treatments to remain in dropdown
      for (const { name, color } of state.well_treatments) {
        const current_platemap_idx = previous_state.map.findIndex((treatment) => treatment.name === name);
        if (current_platemap_idx === -1) {
          previous_state.map.push({ name, color, wells: [] });
        }
      }

      commit("set_entire_platemap", previous_state.map);
      commit("set_platemap_name", previous_state.name);
    } else {
      commit("clear_well_treatments");
      commit("set_platemap_name", "");
    }
  },
  remove_selected_well_treatment({ state, commit }, treatment_name) {
    const treatments_copy = JSON.parse(JSON.stringify(state.well_treatments));
    for (const treatment of treatments_copy) {
      if (treatment.name === treatment_name) {
        treatment.wells = [];
      }
    }

    commit("set_entire_platemap", treatments_copy);
  },
};
