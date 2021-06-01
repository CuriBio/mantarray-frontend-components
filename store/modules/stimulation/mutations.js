export default {
  handle_selected_wells(state, wells) {
    console.log(wells);
    const well_values = [];
    wells.filter((well, idx) => {
      if (well === true) well_values.push(idx);
    });
    state.selected_wells = well_values;
  },
};
