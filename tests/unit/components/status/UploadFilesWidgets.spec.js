import { mount } from "@vue/test-utils";
import UploadFilesWidget from "@/components/status/UploadFilesWidget.vue";
import { UploadFilesWidget as dist_UploadFilesWidget } from "@/dist/mantarray.common";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);

let NuxtStore;
let store;

describe("UploadFilesWidget.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());
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
});
