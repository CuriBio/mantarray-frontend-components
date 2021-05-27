export default {
  add_selected_wells(state, well_values) {
    state.selected_wells = [...state.selected_wells, ...well_values];
  },
  remove_selected_wells(state, well_values) {
    const filtered_wells = well_values.map(well => {
      return state.selected_wells.filter(state_well => {
        return state_well !== well;
      });
    });
    // console.log(filtered_wells);
    state.selected_wells = filtered_wells;
  }
};
