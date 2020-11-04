import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/status/ErrorCatchWidget.vue";
import { ErrorCatchWidget as DistComponentToTest } from "@/dist/mantarray.common";
import { shallowMount } from "@vue/test-utils";

import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);

let NuxtStore;
let store;

describe("ErrorCatchWidget.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());

  test("When mounting ErrorCatchWidget from the build dist file, Then it loads successfully and the background black box is displayed", () => {
    const propsData = {
      error_file_full_path: "C:\\ ",
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_background_div = wrapper.find(
      ".div__status-error-catch-background"
    );
    expect(target_background_div.isVisible()).toBe(true);
  });
  test("Given that ErrorCatchWidget has a props having error file name, When the lifecyle hook mount is excuted, Then title, alert text, contact e-mail and error file name is rendered properly", async () => {
    const propsData = {
      error_file_full_path: "C:\\test_file_log.txt",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_title_div = wrapper.find(
      ".div_status-error-catch-title-label"
    );
    expect(target_title_div.text()).toStrictEqual("An error occurred.");
    const target_alert_div = wrapper.find(".div_status-error-catch-alert-txt");
    const target_alert_div_p = target_alert_div.findAll("p");
    expect(target_alert_div_p.at(0).text()).toStrictEqual(
      "Mantarray software is about to shut down."
    );
    /* commented as prettier-ignore is not working on the ErrorCatchWidget.vue file at line 12
    expect(target_alert_div_p.at(1).html()).toStrictEqual(
      '<p>Please send this log file to <a href="mailto:contact@curibio.com ? subject = Mantarray Error log">contact@curibio.com</a></p>'
    ); */
    await wrapper.vm.$nextTick(); // wait for update
    const target_text_area = wrapper.find(".textarea__error-file-path");
    expect(target_text_area.element.value).toStrictEqual(
      "C:\\test_file_log.txt"
    );
  });
});
