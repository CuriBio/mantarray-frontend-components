import RecordingTime from "@/components/status/RecordingTime.vue";
import { RecordingTime as dist_RecordingTime } from "@/dist/mantarray.common";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueAxios, axios);
let NuxtStore;
let store;

describe("RecordingTime.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    jest.restoreAllMocks();
  });

  afterEach(() => wrapper.destroy());

  test("Given Recording is not active, When RecordingTime is mounted successfully from the build dist file, Then it loads text as Not Recording and time is null", () => {
    const propsData = {};
    wrapper = shallowMount(dist_RecordingTime, {
      propsData,
      store,
      localVue,
    });
    expect(wrapper.find(".span__recording-text").text()).toStrictEqual("Not Recording");
    expect(wrapper.find(".span__time-text").text()).toStrictEqual("");
  });
  test("Given that RecordingTime is mounted successfully from the build dist file, When Recording Start is initiated from the Vuex Store data, Then the text changes to Recording and time is 00:00:00.000", async () => {
    const propsData = {};
    wrapper = shallowMount(dist_RecordingTime, {
      propsData,
      store,
      localVue,
    });

    const mocked_axios_get = jest.spyOn(Vue.axios, "get");
    mocked_axios_get.mockReturnValue(Promise.resolve({ status: 200 }));

    store.commit("playback/set_x_time_index", 1234500);
    await store.dispatch("playback/start_recording");
    await wrapper.vm.$nextTick(); // wait for update

    expect(wrapper.find(".span__recording-text").text()).toStrictEqual("Recording:");
    expect(wrapper.find(".span__time-text").text()).toStrictEqual("00:00:00.000");
  });
  test("Given that get method is mocked with a http response 200, When the x time index is committed in Vuex to a new value, Then the text display updates to show the difference between the x time index when recording started and the new value (the amount of time elapsed since the recording was started)", async () => {
    const propsData = {};
    wrapper = shallowMount(RecordingTime, {
      propsData,
      store,
      localVue,
    });

    const mocked_axios_get = jest.spyOn(Vue.axios, "get");
    mocked_axios_get.mockReturnValue(Promise.resolve({ status: 200 }));

    store.commit("playback/set_x_time_index", 12345000);
    await store.dispatch("playback/start_recording");
    await wrapper.vm.$nextTick(); // wait for update

    expect(wrapper.find(".span__recording-text").text()).toStrictEqual("Recording:");
    expect(wrapper.find(".span__time-text").text()).toStrictEqual("00:00:00.000");
    await wrapper.vm.$nextTick(); // wait for update

    store.commit("playback/set_x_time_index", 67363000);
    await wrapper.vm.$nextTick(); // wait for update

    expect(wrapper.find(".span__time-text").text()).toStrictEqual("00:00:55.018");
  });
  test("Given that get method is mocked with a http response 200, When Recording start is initiated at x_time_index is mutated to 6736300, Then the text updates 00:00:55.018 and stop_recording initiates resets text to null", async () => {
    const propsData = {};
    wrapper = shallowMount(RecordingTime, {
      propsData,
      store,
      localVue,
    });

    const mocked_axios_get = jest.spyOn(Vue.axios, "get");
    mocked_axios_get.mockReturnValue(Promise.resolve({ status: 200 }));

    expect(wrapper.find(".span__time-text").text()).toStrictEqual("");
    store.commit("playback/set_x_time_index", 12345000);
    await store.dispatch("playback/start_recording");
    await wrapper.vm.$nextTick(); // wait for update

    expect(wrapper.find(".span__time-text").text()).toStrictEqual("00:00:00.000");
    await wrapper.vm.$nextTick(); // wait for update

    store.commit("playback/set_x_time_index", 67363000);
    await wrapper.vm.$nextTick(); // wait for update

    expect(wrapper.find(".span__time-text").text()).toStrictEqual("00:00:55.018");

    await store.dispatch("playback/stop_recording");
    await wrapper.vm.$nextTick(); // wait for update

    expect(wrapper.find(".span__time-text").text()).toStrictEqual("");
  });
});
