import { mount } from "@vue/test-utils";
import RecordingTime from "@/components/playback/controls/RecordingTime.vue";
import { RecordingTime as dist_RecordingTime } from "@/dist/mantarray.common";
import playback_module from "@/store/modules/playback";
const wait_for_expect = require("wait-for-expect");
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

describe("RecordingTime.vue", () => {
  afterEach(() => {});
  test("When mounting RecordingTime from the build dist file, it loads successfully text is Not Recording and time is null", () => {
    const propsData = {};
    wrapper = shallowMount(dist_RecordingTime, {
      propsData,
      store,
      localVue,
    });
    expect(wrapper.find(".span__recording-text").text()).toEqual(
      "Not Recording"
    );
    expect(wrapper.find(".span__time-text").text()).toEqual("");
  });
  test("When Recording Start is initiated from the Vuex Store data commited text change to Recording and time is 00:00:00.000", async () => {
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

    expect(wrapper.find(".span__recording-text").text()).toEqual("Recording:");
    expect(wrapper.find(".span__time-text").text()).toEqual("00:00:00.000");
  });
  test("When Recording Start is initiated moved by 55018 intermediate x_time_index update on the Vuex Store data commited", async () => {
    const propsData = {};
    wrapper = shallowMount(RecordingTime, {
      propsData,
      store,
      localVue,
    });

    const mocked_axios_get = jest.spyOn(Vue.axios, "get");
    mocked_axios_get.mockReturnValue(Promise.resolve({ status: 200 }));

    store.commit("playback/set_x_time_index", 1234500);
    await store.dispatch("playback/start_recording");
    await wrapper.vm.$nextTick(); // wait for update

    expect(wrapper.find(".span__recording-text").text()).toEqual("Recording:");
    expect(wrapper.find(".span__time-text").text()).toEqual("00:00:00.000");
    await wrapper.vm.$nextTick(); // wait for update

    store.commit("playback/set_x_time_index", 6736300);
    await wrapper.vm.$nextTick(); // wait for update

    expect(wrapper.find(".span__time-text").text()).toEqual("00:00:55.018");
  });
  test("When Recording Start is initiated moved by 55018 intermediate x_time_index and Recording Stop", async () => {
    const propsData = {};
    wrapper = shallowMount(RecordingTime, {
      propsData,
      store,
      localVue,
    });

    const mocked_axios_get = jest.spyOn(Vue.axios, "get");
    mocked_axios_get.mockReturnValue(Promise.resolve({ status: 200 }));

    //expect(wrapper.find(".span__recording-text").text()).toEqual("Not Recording");
    expect(wrapper.find(".span__time-text").text()).toEqual("");
    store.commit("playback/set_x_time_index", 1234500);
    await store.dispatch("playback/start_recording");
    await wrapper.vm.$nextTick(); // wait for update

    //expect(wrapper.find(".span__recording-text").text()).toEqual("Recording:");
    expect(wrapper.find(".span__time-text").text()).toEqual("00:00:00.000");
    await wrapper.vm.$nextTick(); // wait for update

    store.commit("playback/set_x_time_index", 6736300);
    await wrapper.vm.$nextTick(); // wait for update

    //expect(wrapper.find(".span__recording-text").text()).toEqual("Recording:");
    expect(wrapper.find(".span__time-text").text()).toEqual("00:00:55.018");

    await store.dispatch("playback/stop_recording");
    await wrapper.vm.$nextTick(); // wait for update

    //expect(wrapper.find(".span__recording-text").text()).toEqual("Not Recording");
    expect(wrapper.find(".span__time-text").text()).toEqual("");
  });
});
