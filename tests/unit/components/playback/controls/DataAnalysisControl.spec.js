import { mount, shallowMount } from "@vue/test-utils";
const wait_for_expect = require("wait-for-expect");
import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { createLocalVue } from "@vue/test-utils";
// const MockAxiosAdapter = require("axios-mock-adapter");
import DataAnalysisControl from "@/components/playback/controls/data_analysis/DataAnalysisControl.vue";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";
import { ENUMS } from "@/store/modules/playback/enums";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueAxios, axios);
let NuxtStore;
let store;
// let mocked_axios;
let wrapper = null;

describe("DataAnalysisControl.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    // mocked_axios = new MockAxiosAdapter(axios);
  });

  afterEach(async () => {
    wrapper.destroy();
    jest.restoreAllMocks();
  });

  test("When mounting DataAnalysisControl is initially rendered, Then it loads the button successfully", () => {
    const propsData = {};
    wrapper = shallowMount(DataAnalysisControl, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.find(".button__data-analysis-button--disabled");
    expect(target_span.text()).toBe("Select Recordings...");
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

  test("When the data_analysis_directory gets updated in the store, Then the anaysis_complete_modal_labels get updated with the path", async () => {
    wrapper = mount(DataAnalysisControl, {
      store,
      localVue,
    });

    const expected_analysis_path = "C:\\recording\\path\\";

    await store.commit(`settings/set_data_analysis_directory`, expected_analysis_path);
    expect(wrapper.vm.anaysis_complete_modal_labels.msg_two).toBe(expected_analysis_path);
  });

  test("When a user selects the Select Files button and another process is running, Then nothing will happen", async () => {
    wrapper = mount(DataAnalysisControl, {
      store,
      localVue,
    });
    const store_spy = jest.spyOn(store, "dispatch").mockImplementation(() => null);
    await wrapper.find(".button__data-analysis-button--disabled").trigger("click");

    expect(store_spy).not.toHaveBeenCalledWith("settings/get_recording_dirs");
  });
  test("When a user select Select Files button and it is enabled, Then the action will be dispatched to get files from BE", async () => {
    wrapper = mount(DataAnalysisControl, {
      store,
      localVue,
    });

    await store.commit("stimulation/set_stim_status", STIM_STATUS.READY);
    await store.commit("playback/set_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATED);

    const store_spy = jest.spyOn(store, "dispatch").mockImplementation(() => null);
    await wrapper.find(".button__data-analysis-button--enabled").trigger("click");

    expect(store_spy).toHaveBeenCalledWith("settings/get_recording_dirs");
  });
  test("When a user closes the ", async () => {
    wrapper = mount(DataAnalysisControl, {
      store,
      localVue,
    });

    await store.commit("stimulation/set_stim_status", STIM_STATUS.READY);
    await store.commit("playback/set_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATED);

    const store_spy = jest.spyOn(store, "dispatch").mockImplementation(() => null);
    await wrapper.find(".button__data-analysis-button--enabled").trigger("click");

    expect(store_spy).toHaveBeenCalledWith("settings/get_recording_dirs");
  });
});
