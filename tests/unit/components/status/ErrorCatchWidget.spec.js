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
      log_filepath: "C:\\ ",
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_background_div = wrapper.find(".div__status-error-catch-background");
    expect(target_background_div.isVisible()).toBe(true);
  });
  test("Given that ErrorCatchWidget has a props having error file name, When the lifecyle hook mounted is created, Then title, alert text, contact e-mail and error file name is rendered properly", async () => {
    const propsData = {
      log_filepath: "C:\test_file_log.txt",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_title_div = wrapper.find(".div_status-error-catch-title-label");
    expect(target_title_div.text()).toStrictEqual("An error occurred.");
    const target_alert_div = wrapper.find(".div_status-error-catch-alert-txt");
    const target_alert_div_p = target_alert_div.findAll("p");
    expect(target_alert_div_p.at(0).text()).toStrictEqual("Mantarray software is about to shut down.");
    expect(target_alert_div_p.at(1)).toMatchInlineSnapshot(`
      <p>
        Please send this log file to
        <a id="error_contact" href="mailto:contact@curibio.com ? subject = Mantarray Error log">contact@curibio.com</a>
      </p>
    `);
    await wrapper.vm.$nextTick(); // wait for update
    const target_text_area = wrapper.find(".textarea__error-file-path");
    expect(target_text_area.element.value).toStrictEqual("C:\test_file_log.txt");
  });
  test("Given that ErrorCatchWidget has a props having log_filepath is small, When mounting the component with short log_filepath, Then the text area rows attribute is modified to suite the length of props log_filepath intially, at run time based on new log_filepath then the rows attribute of textarea is updated", async () => {
    const propsData = {
      log_filepath: "C:\test_file_log.txt",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    await wrapper.vm.$nextTick(); // wait for update
    const target_text_area = wrapper.find(".textarea__error-file-path");
    expect(target_text_area.attributes("rows")).toBe("1");
    await wrapper.setProps({
      log_filepath:
        "C:UsersEliCuriBioAppDataRoamingMantarrayControllerlogs_flaskmantarray-2020-10-21-185640.txt",
    });
    expect(target_text_area.attributes("rows")).toBe("3");
  });
  test("Given that ErrorCatchWidget has a props having log_filepath is small, When mounting the component with short log_filepath, Then the height attribute of the status-error-catch-background, textarea__error-file-path and the top attribute of error_catch_button is updated based on the length prop log_filepath", async () => {
    const propsData = {
      log_filepath: "C:\test_file_log.txt",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_background_div = wrapper.find(".div__status-error-catch-background");
    expect(target_background_div.attributes().style).toBe("height: 232px;");
    const target_text_area = wrapper.find(".textarea__error-file-path");
    expect(target_text_area.attributes().style).toBe("height: 37px;");
    const target_error_button = wrapper.find(".div__error-button");
    expect(target_error_button.attributes().style).toBe("top: 232px; left: 0px; position: absolute;");
    /* A run time update of prop occured below then observe that height value and top is updated */
    await wrapper.setProps({
      log_filepath: "C:UsersMantarrayAppDataRoamingMantarrayControllerlogs_flask",
    });
    expect(target_background_div.attributes().style).toBe("height: 244px;");
    expect(target_text_area.attributes().style).toBe("height: 49px;");
    expect(target_error_button.attributes().style).toBe("top: 244px; left: 0px; position: absolute;");
  });
  test("Given that ErrorCatchWidget is mounted, When the ErrorCatchWidget is visible, Then click on 'Okay' results in an event 'ok-clicked' to be emitted", async () => {
    const propsData = {
      log_filepath: "C:\test_file_log.txt",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });

    const okay_btn = wrapper.find(".span__button_label");
    await okay_btn.trigger("click");
    await wrapper.vm.$nextTick();
    const okay_btn_events = wrapper.emitted("ok-clicked");
    expect(okay_btn_events).toHaveLength(1);
    expect(okay_btn_events[0]).toStrictEqual([]);
  });
});
