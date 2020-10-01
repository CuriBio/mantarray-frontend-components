import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

Vue.use(VueAxios, axios);

const baseURL = "https://94fjmm5591.execute-api.us-east-1.amazonaws.com/";

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    //  Vue.axios.defaults.baseURL = ;
  },

  get(resource) {
    return Vue.axios.get(`${baseURL}${resource}`).catch((error) => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  },
};

/**
 * Function to get_recordings for waveform
 * @param  {String} endpoint of type URL.
 * @return {Object} JSON response.
 */
export function get_recording(endpoint) {
  return ApiService.get(endpoint);
}
