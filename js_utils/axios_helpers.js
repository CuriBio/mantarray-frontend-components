"use strict";
import Vue from "vue";
import { STATUS } from "@/store/modules/flask/enums";

import axios from "axios";
import VueAxios from "vue-axios";
Vue.use(VueAxios, axios);

/**
 * Handles all HTTP GET calls from Vuex and updates system status if there was an error
 *
 * @param {string} whole_url - The entire URL to pass to axios.get
 * @param {Object} action_context - The context of the Vuex action calling this function (to give this function access to the Vuex store)
 * @return {Object} the result of the axios call
 */
export async function call_axios_get_from_vuex(whole_url, action_context) {
  let result = 0;
  try {
    result = await Vue.axios.get(whole_url);
  } catch (error) {
    // adapted from https://stackoverflow.com/questions/49967779/axios-handling-errors
    console.log(
      // allow-log
      "Error in call_axios_get_from_vuex for " + whole_url + ": " + error
    );
    if (error.response) {
      // Request made and server responded
      console.log(error.response.data); // allow-log
      console.log(error.response.status); // allow-log
      console.log(error.response.headers); // allow-log
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request); // allow-log
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message); // allow-log
    }
    // if (error.response) {
    // if (error.response.status === 404) {
    if (action_context.rootState.flask.status_uuid === STATUS.MESSAGE.SERVER_STILL_INITIALIZING) {
      return error;
      // return error.response;
    }
    // }

    action_context.commit("flask/set_status_uuid", STATUS.MESSAGE.ERROR, {
      root: true,
    });
    action_context.commit("flask/stop_status_pinging", null, { root: true }); // Error reported clear the ping_system_status
    action_context.commit("playback/stop_playback_progression", null, {
      root: true,
    });
    if (error.response) {
      return error.response;
    }
    return;
    // return error.response;
    // }
  }
  return result;
}

/**
 * Function to post protocol message for stim studio
 * @param  {Object} message of type Object
 * @return {Int} Int status code if error
 */
export async function post_stim_message(message) {
  const baseURL = "http://localhost:4567";
  const URL = "/set_protocols";
  const body = { data: JSON.stringify(message) };
  try {
    await Vue.axios.post(`${baseURL}${URL}`, body);
    return;
  } catch (error) {
    console.log("Error in post_stim_status for " + `${baseURL}${URL}` + ": " + error);
    if (error.response) return error.response.status;
  }
}

/**
 * Function to post play status for stim studio
 * @param  {Boolean} status of type Boolean.
 * @return {Int} Int status code if error
 */
export async function post_stim_status(status) {
  const baseURL = "http://localhost:4567";
  const URL = `/set_stim_status?running=${status}`;
  try {
    await Vue.axios.post(`${baseURL}${URL}`);
    return;
  } catch (error) {
    console.log("Error in post_stim_status for " + `${baseURL}${URL}` + ": " + error);
    if (error.response) return error.response.status;
  }
}
