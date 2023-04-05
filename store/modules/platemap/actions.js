// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
export default {
  async handle_export_platemap({ state }, map_name) {
    const { well_assignments } = state;

    const text_to_write = JSON.stringify({ map_name, labels: well_assignments });
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

    const file_name_to_save = map_name + "__" + datetime;
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
  async handle_file_import({ dispatch }, file) {
    const reader = new FileReader();

    reader.onload = async function () {
      await dispatch("handle_platemap_from_import", JSON.parse(reader.result));
    };

    reader.onerror = function () {
      console.log(reader.onerror);
    };

    reader.readAsText(file);
  },
  async handle_platemap_from_import({ state, commit }, result) {
    let { map_name, labels } = result;
    // remove all special characters
    map_name = map_name.replace(/[^\w-_ \s]/gi, "");
    // clear any existing well assignments but keep all labels
    state.well_assignments.map((assignment) => {
      assignment.wells = [];
    });

    const existing_labels = JSON.parse(JSON.stringify(state.well_assignments)).map(({ name }) => name);
    let index_to_update;
    // this accounts for if there are already existing labels and these labels need to be pushed to the end of an existing arrays with updated colors instead of replacing
    for (const label of labels) {
      // check if name already exists
      if (!existing_labels.includes(label.name)) {
        // commit the new label to both well assignments and all stored platemaps
        // this needs to go before updating the wells in each assignment so the assignment gets added to the end of the array
        commit("set_new_label", label.name);
        index_to_update = state.well_assignments.length - 1;
      } else {
        index_to_update = existing_labels.findIndex((name) => name === label.name);
      }
      // then update the assigned wells in the current platemap to match those imported
      state.well_assignments[index_to_update].wells = label.wells;
    }
    // store with updated well assignments
    commit("save_new_platemap", {
      map_name,
      labels: JSON.parse(JSON.stringify(state.well_assignments)),
    });
  },
  save_platemap({ state, commit }, map_name) {
    const previous_name = state.current_platemap_name;
    commit("set_platemap_name", map_name);
    const new_platemap = {
      map_name,
      labels: JSON.parse(JSON.stringify(state.well_assignments)),
    };

    if (
      state.stored_platemaps.some(
        ({ map_name }) => map_name === new_platemap.map_name || map_name === previous_name
      )
    ) {
      commit("save_platemap_changes", { platemap: new_platemap, previous_name });
    } else {
      commit("save_new_platemap", new_platemap);
    }
  },
  discard_current_platemap_changes({ state, commit }) {
    const previous_state = JSON.parse(JSON.stringify(state.stored_platemaps)).find(
      ({ map_name }) => map_name === state.current_platemap_name
    );

    if (previous_state) {
      // add any new well_assignments to remain in dropdown
      for (const { name, color } of state.well_assignments) {
        const current_platemap_idx = previous_state.labels.findIndex(
          (assignment) => assignment.name === name
        );
        if (current_platemap_idx === -1) {
          previous_state.labels.push({ name, color, wells: [] });
        }
      }

      commit("set_entire_platemap", previous_state.labels);
      commit("set_platemap_name", previous_state.map_name);
    } else {
      commit("clear_all_well_assignments");
      commit("set_platemap_name", "");
    }
  },
  remove_selected_well_assignment({ state, commit }, assignment_name) {
    const assignments_copy = JSON.parse(JSON.stringify(state.well_assignments));
    for (const assignment of assignments_copy) {
      if (assignment.name === assignment_name) {
        assignment.wells = [];
      }
    }

    commit("set_entire_platemap", assignments_copy);
  },
};
