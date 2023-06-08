"use strict";
import Vue from "vue";
import { STATUS } from "@/store/modules/flask/enums";
import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);

/**
 * Handles all HTTP GET calls from Vuex and updates system status if there was an error
 *
 * @param {string} url - The URL to pass to axios.get, without query params
 * @param {Object} action_context - The context of the Vuex action calling this function (to give this function access to the Vuex store)
 * @param {Object} params - The query params to include in the URL
 * @return {Object} the result of the axios call
 */
export async function call_axios_get_from_vuex(url, action_context, params = {}) {
  try {
    return await Vue.axios.get(url, { params });
  } catch (error) {
    // adapted from https://stackoverflow.com/questions/49967779/axios-handling-errors
    console.log(
      // allow-log
      "Error in call_axios_get_from_vuex for " + url + ": " + error
    );
    if (error.response) {
      // Request made and server responded
      console.log("data:", error.response.data); // allow-log
      console.log("status:", error.response.status); // allow-log
      console.log("headers:", error.response.headers); // allow-log
    } else if (error.request) {
      // The request was made but no response was received
      console.log("No response was received to request:", error.request); // allow-log
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message); // allow-log
    }
    if (error.response && error.response.status === 520) {
      const version = error.response.statusText.split(" ").slice(-1)[0];
      action_context.commit(
        "settings/set_shutdown_error_message",
        "Error during install. Please restart this PC then reinstall. " +
          `The installer can be downloaded here: https://downloads.curibio.com/software/mantarray/MantarrayController-Setup-prod-${version}.exe`,
        { root: true }
      );
    } else if (action_context.rootState.flask.status_uuid === STATUS.MESSAGE.SERVER_BOOTING_UP) {
      return error;
    }
    if (error.response === undefined || error.response.status !== 401) {
      action_context.commit("flask/set_status_uuid", STATUS.MESSAGE.ERROR, {
        root: true,
      });
      action_context.commit("flask/stop_status_pinging", null, { root: true }); // Error reported clear the ping_system_status
      action_context.commit("playback/stop_playback_progression", null, {
        root: true,
      });
    }
    if (error.response) {
      return error.response;
    }
    return;
  }
}

/**
 * Function to post statuses to flask server
 * @param  {String} url endpoint with any additional params.
 * @param  {Object} data request body sent with post request, otherwise null.
 * @return {Int} Int status code if error
 */
export async function call_axios_post_from_vuex(url, data = null) {
  const baseURL = "http://localhost:4567";
  const endpoint = url.split("?")[0];

  try {
    return await Vue.axios.post(`${baseURL}${url}`, data);
  } catch (error) {
    console.log(`Error in ${endpoint} for ${baseURL}${endpoint}: ${error}`);

    if (error.response) return error.response.status;
    else return error;
  }
}
