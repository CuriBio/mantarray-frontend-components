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
    expect(wrapper.find(".div__data-analysis-background").attributes().style).toContain("height: 450px;");
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

      await wrapper.findAll(".div__recording-list-item").at(0).trigger("click");
      await wrapper.findAll(".div__recording-list-item").at(3).trigger("click");

      expect(wrapper.vm.selected_recordings).toStrictEqual(["rec_1", "rec_4"]);

      // click cancel
      await wrapper.findAll(".span__button-label").at(button_idx).trigger("click");

      expect(wrapper.vm.selected_recordings).toStrictEqual([]);
    }
  );

  test("When a user selects multiple recordings and selects Run, Then all recording be emitted to start analyses", async () => {
    // set up directories in state
    const recording_message = {
      root_recording_path: "C:\\recording\\path\\",
      recordings_list: [
        { name: "rec_1" },
        { name: "rec_2" },
        { name: "rec_3" },
        { name: "rec_4" },
        { name: "rec_5" },
      ],
    };
    await store.commit(`settings/set_recording_dirs`, recording_message);

    wrapper = mount(DataAnalysisWidget, {
      store,
      localVue,
    });

    await wrapper.findAll(".div__recording-list-item").at(1).trigger("click");
    await wrapper.findAll(".div__recording-list-item").at(4).trigger("click");

    // click cancel
    await wrapper.findAll(".span__button-label").at(2).trigger("click");

    expect(wrapper.emitted("send_confirmation")).toStrictEqual([
      [{ idx: 2, selected_recordings: ["rec_2", "rec_5"] }],
    ]);
  });

  test("When data_analysis_state is not READY, Then buttons will not be visible, modal height will change, and spinner will appear", async () => {
    wrapper = mount(DataAnalysisWidget, {
      store,
      localVue,
    });

    expect(wrapper.find(".span__data-analysis-label").text()).toBe("Start analysis");
    expect(wrapper.find(".div__data-analysis-background").attributes().style).toContain("height: 450px;");
    expect(wrapper.find(".div__data-analysis-button-container").isVisible()).toBe(true);
    expect(store.state.playback.data_analysis_state).toBe(ENUMS.DATA_ANALYSIS_STATE.READY);

    await store.commit("playback/set_data_analysis_state", ENUMS.DATA_ANALYSIS_STATE.ACTIVE);

    expect(wrapper.find(".div__data-analysis-background").attributes().style).toContain("height: 300px;");
    expect(wrapper.find(".span__data-analysis-spinner").isVisible()).toBe(true);
  });
});
