import { mount, shallowMount } from "@vue/test-utils";
const wait_for_expect = require("wait-for-expect");
import Vuex from "vuex";
import axios from "axios";
import VueAxios from "vue-axios";
import { createLocalVue } from "@vue/test-utils";
const MockAxiosAdapter = require("axios-mock-adapter");
import DataAnalysisCompleteWidget from "@/components/playback/controls/data_analysis/DataAnalysisCompleteWidget.vue";
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

describe("DataAnalysisCompleteWidget.vue", () => {
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

  test("When mounting DataAnalysisCompleteWidget is initially rendered, Then it loads the header label successfully", () => {
    wrapper = shallowMount(DataAnalysisCompleteWidget, {
      store,
      localVue,
    });
    const header_span = wrapper.find(".span__data-analysis-label");
    const background_div = wrapper.find(".div__data-analysis-background");
    expect(header_span.text()).toBe("Analysis Complete!");
    expect(background_div.attributes().style).toContain("height: 250px");
  });
  test("When an analysis completes with failures, Then the modal labels will change accordingly", async () => {
    wrapper = mount(DataAnalysisCompleteWidget, {
      store,
      localVue,
    });

    await store.commit("settings/set_failed_recordings", [
      { name: "rec_1" },
      { name: "rec_2" },
      { name: "rec_3" },
    ]);

    const header_span = wrapper.find(".span__data-analysis-label");
    const background_div = wrapper.find(".div__data-analysis-background");

    expect(header_span.text()).toBe("Analysis Complete!");
    expect(background_div.attributes().style).toContain("height: 500px");

    const list_items = wrapper.findAll(".div__recording-name-container");

    expect(list_items.at(0).text()).toBe("rec_1");
    expect(list_items.at(1).text()).toBe("rec_2");
    expect(list_items.at(2).text()).toBe("rec_3");
  });
  test("When a user selects Close, Then the function will be emitted to parent function to handle closure", async () => {
    wrapper = mount(DataAnalysisCompleteWidget, {
      store,
      localVue,
    });

    const button_span = wrapper.find(".span__button-label");
    expect(button_span.text()).toBe("Close");

    await button_span.trigger("click");

    expect(wrapper.emitted("handle_confirmation")).toStrictEqual([[0]]);
  });
});
