// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files
export default {
  set_heatmap_values(state, new_value) {
    state.heatmap_values = new_value;
  },
  set_metric_data(state, new_value) {
    state.heatmap_values[new_value.name].data.forEach((item, ix) => {
      item.push(new_value.data[ix]);
    });
  },
};

// set_heatmap_on_idx(state, new_value) {
//   state.heatmap_values[state.heatmap_idx] = new_value;
// },
