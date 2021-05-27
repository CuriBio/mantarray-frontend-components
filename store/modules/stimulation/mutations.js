export default {
  handle_selected_wells(state, wells) {
    const well_values = [];
    wells.filter((well, idx) => {
      if (well === true) well_values.push(idx);
    });
    state.selected_wells = well_values;
    console.log(state.selected_wells);
  },
};
