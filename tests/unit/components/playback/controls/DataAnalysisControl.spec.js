import { mount, shallowMount } from "@vue/test-utils";
const wait_for_expect = require("wait-for-expect");
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";
import { createLocalVue } from "@vue/test-utils";
const MockAxiosAdapter = require("axios-mock-adapter");
import DataAnalysisControl from "@/components/playback/controls/data_analysis/DataAnalysisControl.vue";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";
import { ENUMS } from "@/store/modules/playback/enums";
import * as axios_helpers from "@/js_utils/axios_helpers.js";
import Vue from "vue";
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueAxios, axios);
let NuxtStore;
let store;
let mocked_axios;
let wrapper = null;

describe("DataAnalysisControl.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    jest.restoreAllMocks();
    store = await NuxtStore.createStore();
    mocked_axios = new MockAxiosAdapter(axios);
    store.state.stimulation.protocol_assignments = { 1: {} };
  });

  afterEach(() => {
    wrapper.destroy();
    mocked_axios.restore();
  });

  test("When the root_recording_path gets updated in the store, Then the warning_modal_labels get updated with the path", async () => {
    wrapper = mount(DataAnalysisControl, {
      store,
      localVue,
    });

    const recording_message = { root_recording_path: "C:\\recording\\path\\", recordings_list: [] };

    await store.commit(`settings/set_recording_dirs`, recording_message);
    expect(wrapper.vm.warning_modal_labels.msg_two).toBe(recording_message.root_recording_path);
  });

  test("When a user select Select Files button and it is enabled, Then the action will be dispatched to get files from BE", async () => {
    wrapper = mount(DataAnalysisControl, {
      store,
      localVue,
    });

    await store.commit("stimulation/set_stim_status", STIM_STATUS.READY);
    await store.commit("playback/set_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATED);

    const store_spy = jest.spyOn(store, "dispatch").mockImplementation(() => null);
    await wrapper.find(".button__data-analysis-button").trigger("click");

    expect(store_spy).toHaveBeenCalledWith("settings/get_recording_dirs");
  });

  test.each([
    ["COMPLETE", "data-analysis-complete"],
    ["ERROR", "data-analysis-error"],
  ])(
    "When a user the data analysis completes with %s, Then when the modal closes the analysis state will reset to READY",
    async (status, id) => {
      wrapper = mount(DataAnalysisControl, {
        store,
        localVue,
      });
      const store_spy = jest.spyOn(store, "commit");
      await store.commit("playback/set_data_analysis_state", ENUMS.DATA_ANALYSIS_STATE[status]);

      wait_for_expect(() => {
        wrapper.findAll("span__button-label").at(0).trigger("cick");

        expect(store_spy).toHaveBeenCalledWith(
          "playback/set_data_analysis_state",
          ENUMS.DATA_ANALYSIS_STATE.READY
        );
      });

      await wrapper.vm.close_analysis_complete_modal(id);
      expect(store.state.playback.data_analysis_state).toBe(ENUMS.DATA_ANALYSIS_STATE.READY);
    }
  );
  test("When a user selects to start an analysis by selecting files from DataAnalysisWidget, Then when user selects 'Run' it will kick off", async () => {
    const store_spy = jest.spyOn(store, "dispatch");
    const recording_message = {
      root_recording_path: "C:\\recording\\path\\",
      recordings_list: ["rec_1", "rec_2", "rec_3", "rec_4", "rec_5"],
    };
    jest.spyOn(axios_helpers, "call_axios_get_from_vuex").mockImplementation(() => {
      return { data: recording_message };
    });

    await store.commit("stimulation/set_stim_status", STIM_STATUS.READY);
    await store.commit("playback/set_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATED);

    wrapper = mount(DataAnalysisControl, {
      store,
      localVue,
    });

    await wrapper.find(".button__data-analysis-button").trigger("click");

    wait_for_expect(() => {
      expect(wrapper.find("start-data-analysis").isVisible()).toBe(true);
    });

    // simulate emitted 'Run' function
    await wrapper.vm.close_analysis_modal({ idx: 2, selected_recordings: ["rec_1", "rec_2"] });
    expect(store_spy).toHaveBeenCalledWith("playback/start_data_analysis", ["rec_1", "rec_2"]);
    expect(store_spy).toHaveBeenCalledTimes(2);

    // simulate emitted 'Cancel' function
    await wrapper.vm.close_analysis_modal({ idx: 0, selected_recordings: [] });
    expect(store_spy).toHaveBeenCalledTimes(2); // assert nothing happened
  });
  test("When a user selects the Select Files button, Then the DataAnalysisWidget will be visible with number of recordings returned from BE", async () => {
    wrapper = mount(DataAnalysisControl, {
      store,
      localVue,
    });
    const get_url = "http://localhost:4567/get_recordings";
    mocked_axios
      .onGet(get_url)
      .reply(200, { root_recording_path: "C:\\test\\recording\\path", recordings_list: ["rec_1", "rec_2"] });

    await store.commit("stimulation/set_stim_status", STIM_STATUS.READY);
    await store.commit("playback/set_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATED);

    wait_for_expect(() => {
      wrapper.find(".button__data-analysis-button").trigger("click");
      expect(wrapper.findAll(".div__checkbox-background")).toHaveLength(2);
    });
  });

  test.each([
    ["ACTIVE", true],
    ["COMPLETE", false],
    ["ERROR", false],
    ["READY", false],
  ])(
    "When a user selects to close the window, Then the confirmation modal will appear only if the data analysis state is ACTIVE",
    async (state, bool) => {
      wrapper = mount(DataAnalysisControl, {
        store,
        localVue,
      });

      await store.commit("playback/set_data_analysis_state", ENUMS.DATA_ANALYSIS_STATE[state]);
      await store.commit("settings/set_confirmation_request", true);

      Vue.nextTick(() => {
        expect(wrapper.find("#analysis-closure-warning").isVisible()).toBe(bool);
        wrapper.find(".span__button-label").trigger("click");
      });

      wrapper.vm.handle_confirmation(0);
      expect(wrapper.emitted("send_confirmation")).toStrictEqual([[0]]);
    }
  );
  test("When a user selects the Select Files button, Then a modal will appear warning user that there were no recordings found if an empty array is returned from BE", async () => {
    wrapper = mount(DataAnalysisControl, {
      store,
      localVue,
    });
    const get_url = "http://localhost:4567/get_recordings";
    mocked_axios
      .onGet(get_url)
      .reply(200, { root_recording_path: "C:\\test\\recording\\path", recordings_list: [] });

    wait_for_expect(() => {
      store.commit("stimulation/set_stim_status", STIM_STATUS.READY);
      store.commit("playback/set_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATED);
      expect(wrapper.findAll("p").at(0)).toBe(
        `There were no recordings found. Please ensure that they are located in the correct directory: C:\\test\\recording\\path`
      );
    });
  });
});
