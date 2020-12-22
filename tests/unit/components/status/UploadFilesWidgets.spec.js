import { mount } from "@vue/test-utils";
import UploadFilesWidget from "@/components/status/UploadFilesWidget.vue";
import { UploadFilesWidget as dist_UploadFilesWidget } from "@/dist/mantarray.common";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
const sinon = require("sinon");
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

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
    wrapper.destroy();
    sandbox.restore();
  });
  test("When mounting UploadFilesWidget from the build dist file, Then it loads successfully and the background black box is displayed", () => {
    const propsData = {};
    wrapper = shallowMount(dist_UploadFilesWidget, {
      propsData,
      store,
      localVue,
    });
    const target_background_div = wrapper.find(".div__upload-file-background");
    expect(target_background_div.isVisible()).toBe(true);
  });
  test("When mounting UploadFilesWidget, Then it loads the 'files uploaded' and 'total files to upload' is as specified in the Vuex values in settings file_count and max_file_count respectively", () => {
    const uploaded_files = 500;
    const total_files_to_upload = 900;

    store.commit("settings/set_file_count", uploaded_files);
    store.commit("settings/set_max_file_count", total_files_to_upload);

    const propsData = {};
    wrapper = mount(UploadFilesWidget, {
      propsData,
      store,
      localVue,
    });

    const target_upload_file_count_container = wrapper.find(
      ".span__upload-file-count-container"
    );
    expect(target_upload_file_count_container.text()).toStrictEqual("500/900");
  });
  test("When uploaded_files is set to equal the max_file_count (all files are uploaded successfully), Then the 'check mark' is visible indicating the completion of file upload activity", async () => {
    const propsData = {};
    wrapper = mount(UploadFilesWidget, {
      propsData,
      store,
      localVue,
    });
    const uploaded_files = 900;
    const total_files_to_upload = 900;

    store.commit("settings/set_file_count", uploaded_files);
    store.commit("settings/set_max_file_count", total_files_to_upload);

    await wrapper.vm.$nextTick();
    const target_upload_custom_check_mark = wrapper.find(
      ".div__upload-custom-check-mark"
    );
    expect(target_upload_custom_check_mark.isVisible()).toBe(true);
    const target_upload_custom_check_mark_color = wrapper.find(
      ".svg-inline-fa-check-path"
    );
    expect(
      target_upload_custom_check_mark_color.attributes("fill")
    ).toStrictEqual("#00c46f");
  });
  test("When Vuex is updated so that the upload of files is about 88%, Then the 'progress bar' is visible indicating and its less than the max 110px max length of progress bar attribute", async () => {
    const propsData = {};
    wrapper = mount(UploadFilesWidget, {
      propsData,
      store,
      localVue,
    });

    const uploaded_files = 800;
    const total_files_to_upload = 900;
    store.commit("settings/set_file_count", uploaded_files);
    store.commit("settings/set_max_file_count", total_files_to_upload);
    await wrapper.vm.$nextTick();

    const target_upload_progress_bar = wrapper.find(".progress-bar");
    expect(target_upload_progress_bar.attributes("style")).toBe(
      "width: 88.88888888888889%;"
    );
  });
  test("When Vuex is updated so that the uploaded file count equals the total file count (all files are uploaded successfully), Then the 'check mark' is visible indicating the completion of file upload activity for only 1500 milli second and then the checkmark disappears", async () => {
    const propsData = {};
    wrapper = mount(UploadFilesWidget, {
      propsData,
      store,
      localVue,
    });
    const uploaded_files = 900;
    const total_files_to_upload = 900;

    store.commit("settings/set_file_count", uploaded_files);
    store.commit("settings/set_max_file_count", total_files_to_upload);

    await wrapper.vm.$nextTick();
    const target_upload_custom_check_mark = wrapper.find(
      ".div__upload-custom-check-mark"
    );
    sandbox.clock.tick(1499);
    await wrapper.vm.$nextTick();
    expect(target_upload_custom_check_mark.isVisible()).toBe(true);
    sandbox.clock.tick(1);
    await wrapper.vm.$nextTick();
    expect(target_upload_custom_check_mark.isVisible()).toBe(false);
  });
});
