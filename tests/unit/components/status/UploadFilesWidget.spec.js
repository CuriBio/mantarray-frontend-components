import { mount } from "@vue/test-utils";
import UploadFilesWidget from "@/components/status/UploadFilesWidget.vue";
import { UploadFilesWidget as dist_UploadFilesWidget } from "@/dist/mantarray.common";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import Vue from "vue";
const sinon = require("sinon");
import { createLocalVue } from "@vue/test-utils";

const localVue = createLocalVue();
localVue.use(Vuex);

let NuxtStore;
let store;
const sandbox = sinon.createSandbox();

describe("UploadFilesWidget.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    sandbox.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  });

  afterEach(async () => {
    sandbox.restore();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("When mounting UploadFilesWidget from the build dist file, Then it loads successfully and the background black box is displayed", () => {
    const propsData = {};
    const wrapper = shallowMount(dist_UploadFilesWidget, {
      propsData,
      store,
      localVue,
    });
    const target_background_div = wrapper.find(".div__upload-file-background");
    expect(target_background_div.isVisible()).toBe(true);
  });
  test("When mounting UploadFilesWidget, Then it loads the 'files uploaded' and 'total files to upload' is as specified in the Vuex values in settings file_count and total_file_count respectively", () => {
    store.commit("settings/set_file_count");
    store.commit("settings/set_total_file_count");

    const propsData = {};
    const wrapper = mount(UploadFilesWidget, {
      propsData,
      store,
      localVue,
    });

    const { total_file_count, file_count } = store.state.settings;
    expect(total_file_count).toBe(1);
    expect(file_count).toBe(1);

    const target_upload_file_count_container = wrapper.find(".span__upload-file-count-container");
    expect(target_upload_file_count_container.text()).toStrictEqual("1/1");
  });

  test("When uploaded_files is set to equal the total_file_count (all files are uploaded successfully), Then the 'check mark' is visible indicating the completion of file upload activity", async () => {
    const propsData = {};
    const wrapper = mount(UploadFilesWidget, {
      propsData,
      store,
      localVue,
    });

    store.commit("settings/set_file_count");
    store.commit("settings/set_total_file_count");

    await wrapper.vm.$nextTick();
    const target_upload_custom_check_mark = wrapper.find(".div__upload-custom-check-mark");
    expect(target_upload_custom_check_mark.isVisible()).toBe(true);
    const target_upload_custom_check_mark_color = wrapper.find(".svg-inline-fa-check-path");
    expect(target_upload_custom_check_mark_color.attributes("fill")).toStrictEqual("#00c46f");
  });

  test("When Vuex is updated so that the upload of files is about 88%, Then the 'progress bar' is visible indicating and its less than the max 110px max length of progress bar attribute", async () => {
    const propsData = {};
    const wrapper = mount(UploadFilesWidget, {
      propsData,
      store,
      localVue,
    });
    store.commit("settings/set_file_count");
    store.commit("settings/set_total_file_count");
    store.commit("settings/set_total_file_count");
    await wrapper.vm.$nextTick();

    const target_upload_progress_bar = wrapper.find(".progress-bar");
    expect(target_upload_progress_bar.attributes("style")).toBe("width: 50%;");
  });
  test("When Vuex is updated so that the uploaded file count equals the total file count (all files are uploaded successfully), Then the 'check mark' is visible indicating the completion of file upload activity for only 1500 milli second and then the checkmark disappears", async () => {
    const propsData = {};
    const wrapper = mount(UploadFilesWidget, {
      propsData,
      store,
      localVue,
    });

    store.commit("settings/set_file_count");
    store.commit("settings/set_total_file_count");

    await wrapper.vm.$nextTick();
    const target_upload_custom_check_mark = wrapper.find(".div__upload-custom-check-mark");
    sandbox.clock.tick(1499);
    await wrapper.vm.$nextTick();
    expect(target_upload_custom_check_mark.isVisible()).toBe(true);
    sandbox.clock.tick(1);
    await wrapper.vm.$nextTick();
    expect(target_upload_custom_check_mark.isVisible()).toBe(false);
  });

  test.each([
    [
      "generic",
      {
        header: "Error!",
        msg_one: `There was an error uploading recording: test_file_name_1.`,
        msg_two: "Will automatically retry next start up.",
        button_names: ["Close"],
      },
      false,
    ],
    [
      "usage",
      {
        header: "Important!",
        msg_one: `The following recording was successfully uploaded: test_file_name_1. `,
        msg_two: `However, because the analysis limit has been reached for this customer account, the analysis will not run.`,
        button_names: ["Close"],
      },
      true,
    ],
  ])(
    "When Vuex is updated with a %s upload_error, Then modal appears with the labels %s",
    async (error_type, labels, job_limit_reached) => {
      const propsData = {};
      const watch_spy = jest.spyOn(UploadFilesWidget.watch, "upload_error");

      const wrapper = mount(UploadFilesWidget, {
        propsData,
        store,
        localVue,
      });

      expect(store.state.settings.job_limit_reached).toBe(false);

      await store.commit("settings/set_auto_upload", true);
      await store.commit("settings/set_file_name", "test_file_name_1");
      await store.commit("settings/set_upload_error", error_type);

      const status_modal = wrapper.find(".div__status-warning-background");

      expect(watch_spy).toHaveBeenCalledTimes(2);
      expect(wrapper.vm.modal_labels.header).toBe(labels.header);
      expect(wrapper.vm.modal_labels.msg_one).toBe(labels.msg_one);
      expect(wrapper.vm.modal_labels.msg_two).toBe(labels.msg_two);
      expect(wrapper.vm.status).toBe(false);
      expect(store.state.settings.upload_error).toBe(false);
      expect(store.state.settings.job_limit_reached).toBe(job_limit_reached);
      expect(store.state.settings.auto_upload).toBe(!job_limit_reached);

      Vue.nextTick(() => {
        expect(status_modal.isVisible()).toBe(true);
      });
    }
  );
});
