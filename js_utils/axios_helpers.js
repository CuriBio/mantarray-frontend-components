"use strict";
import Vue from "vue";

/**
 * Handles all HTTP GET calls from Vuex and updates system status if there was an error
 *
 * @param {string} whole_url - The entire URL to pass to axios.get
 * @param {Object} action_context - The context of the Vuex action calling this function (to give this function access to the Vuex store)
 * @return {Object} the result of the axios call
 */
export async function call_axios_get_from_vuex(whole_url, action_context) {
  let result;
  result = Vue.axios.get(whole_url);
}
