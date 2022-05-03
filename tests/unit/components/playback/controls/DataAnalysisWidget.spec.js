import { mount, shallowMount } from "@vue/test-utils";
const wait_for_expect = require("wait-for-expect");
import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { createLocalVue } from "@vue/test-utils";
const MockAxiosAdapter = require("axios-mock-adapter");
import DataAnalysisWidget from "@/components/playback/controls/data_analysis/DataAnalysisWidget.vue";
import { STIM_STATUS } from "@/store/modules/stimulation/enums";
import { ENUMS } from "@/store/modules/playback/enums";
import * as axios_helpers from "@/js_utils/axios_helpers.js";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueAxios, axios);
let NuxtStore;
let store;
let mocked_axios;
let wrapper = null;

describe("DataAnalysisWidget.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    jest.restoreAllMocks();
    store = await NuxtStore.createStore();
    mocked_axios = new MockAxiosAdapter(axios);
  });

  afterEach(() => {
    wrapper.destroy();
    mocked_axios.restore();
  });

  test("When mounting DataAnalysisWidget is initially rendered, Then it loads the buttons and modal height successfully", () => {
    wrapper = shallowMount(DataAnalysisWidget, {
      store,
      localVue,
    });
    expect(wrapper.find(".span__data-analysis-label").text()).toBe("Start analysis");
    expect(wrapper.find(".div__data-analysis-background").attributes().style).toContain("height: 420px;");
    expect(wrapper.find(".div__data-analysis-button-container").isVisible()).toBe(true);
  });

  test.each([0, 1])(
    "When a user selects multiple recordings and selects Cancel/Reset, Then all recording will go back to unchecked state",
    async (button_idx) => {
      // set up directories in state
      const recording_message = {
        root_recording_path: "C:\\recording\\path\\",
        recordings_list: ["rec_1", "rec_2", "rec_3", "rec_4", "rec_5"],
      };
      await store.commit(`settings/set_recording_dirs`, recording_message);

      wrapper = mount(DataAnalysisWidget, {
        store,
        localVue,
      });

      expect(wrapper.vm.selected_recordings).toStrictEqual([]);

      await wrapper.findAll(".custom-control-input").at(0).trigger("click");

      await wrapper.findAll(".custom-control-input").at(3).trigger("click");

      expect(wrapper.vm.selected_recordings).toStrictEqual(["rec_1", "rec_4"]);

      // click cancel
      await wrapper.findAll(".span__button_label").at(button_idx).trigger("click");

      expect(wrapper.vm.selected_recordings).toStrictEqual([]);
    }
  );

  test("When data_analysis_state is not READY, Then buttons will not be visible, modal height will change, and spinner will appear", async () => {
    wrapper = mount(DataAnalysisWidget, {
      store,
      localVue,
    });

    expect(wrapper.find(".span__data-analysis-label").text()).toBe("Start analysis");
    expect(wrapper.find(".div__data-analysis-background").attributes().style).toContain("height: 420px;");
    expect(wrapper.find(".div__data-analysis-button-container").isVisible()).toBe(true);
    expect(store.state.playback.data_analysis_state).toBe(ENUMS.DATA_ANALYSIS_STATE.READY);

    await store.commit("playback/set_data_analysis_state", ENUMS.DATA_ANALYSIS_STATE.ACTIVE);

    expect(wrapper.find(".div__data-analysis-background").attributes().style).toContain("height: 300px;");
    expect(wrapper.find(".span__data-analysis-spinner").isVisible()).toBe(true);
  });

  //   test("When the data_analysis_directory gets updated in the store, Then the anaysis_complete_modal_labels get updated with the path", async () => {
  //     wrapper = mount(DataAnalysisControl, {
  //       store,
  //       localVue
  //     });

  //     const expected_analysis_path = "C:\\recording\\path\\";

  //     await store.commit(`settings/set_data_analysis_directory`, expected_analysis_path);
  //     expect(wrapper.vm.anaysis_complete_modal_labels.msg_two).toBe(expected_analysis_path);
  //   });

  //   test("When a user selects the Select Files button and another process is running, Then nothing will happen", async () => {
  //     wrapper = mount(DataAnalysisControl, {
  //       store,
  //       localVue
  //     });
  //     const store_spy = jest.spyOn(store, "dispatch").mockImplementation(() => null);
  //     await wrapper.find(".button__data-analysis-button--disabled").trigger("click");

  //     expect(store_spy).not.toHaveBeenCalledWith("settings/get_recording_dirs");
  //   });
  //   test("When a user select Select Files button and it is enabled, Then the action will be dispatched to get files from BE", async () => {
  //     wrapper = mount(DataAnalysisControl, {
  //       store,
  //       localVue
  //     });

  //     await store.commit("stimulation/set_stim_status", STIM_STATUS.READY);
  //     await store.commit("playback/set_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATED);

  //     const store_spy = jest.spyOn(store, "dispatch").mockImplementation(() => null);
  //     await wrapper.find(".button__data-analysis-button--enabled").trigger("click");

  //     expect(store_spy).toHaveBeenCalledWith("settings/get_recording_dirs");
  //   });

  //   test.each(["COMPLETE", "ERROR"])(
  //     "When a user the data analysis completes with %s, Then when the modal closes the analysis state will reset to READY",
  //     async status => {
  //       wrapper = mount(DataAnalysisControl, {
  //         store,
  //         localVue
  //       });
  //       const store_spy = jest.spyOn(store, "commit").mockImplementation(() => null);
  //       await store.commit("playback/set_data_analysis_state", ENUMS.DATA_ANALYSIS_STATE[status]);

  //       wait_for_expect(() => {
  //         wrapper
  //           .findAll("span__button_label")
  //           .at(0)
  //           .trigger("cick");

  //         expect(store_spy).toHaveBeenCalledWith(
  //           "playback/set_data_analysis_state",
  //           ENUMS.DATA_ANALYSIS_STATE.READY
  //         );
  //       });
  //     }
  //   );

  //   test("When a user selects the Select Files button, Then the DataAnalysisWidget will be visible with number of recordings returned from BE", async () => {
  //     wrapper = mount(DataAnalysisControl, {
  //       store,
  //       localVue
  //     });
  //     const get_url = "http://localhost:4567/get_recordings_list";
  //     mocked_axios
  //       .onGet(get_url)
  //       .reply(200, { root_recording_path: "C:\\test\\recording\\path", recordings_list: ["rec_1", "rec_2"] });

  //     await store.commit("stimulation/set_stim_status", STIM_STATUS.READY);
  //     await store.commit("playback/set_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATED);

  //     wait_for_expect(() => {
  //       wrapper.find(".button__data-analysis-button--enabled").trigger("click");
  //       expect(wrapper.findAll(".div__checkbox-background")).toHaveLength(2);
  //     });
  //   });
  //   test("When a user selects the Select Files button, Then a modal will appear warning user that there were no recordings found if an empty array is returned from BE", async () => {
  //     wrapper = mount(DataAnalysisControl, {
  //       store,
  //       localVue
  //     });
  //     const get_url = "http://localhost:4567/get_recordings_list";
  //     mocked_axios
  //       .onGet(get_url)
  //       .reply(200, { root_recording_path: "C:\\test\\recording\\path", recordings_list: [] });

  //     wait_for_expect(() => {
  //       store.commit("stimulation/set_stim_status", STIM_STATUS.READY);
  //       store.commit("playback/set_playback_state", ENUMS.PLAYBACK_STATES.CALIBRATED);
  //       expect(wrapper.findAll("p").at(0)).toBe(
  //         `There were no recordings found. Please ensure that they are located in the correct directory: C:\\test\\recording\\path`
  //       );
  //     });
  //   });
});
