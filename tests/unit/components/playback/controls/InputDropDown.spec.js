import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/InputDropDown.vue";
import { InputDropDown as DistComponentToTest } from "@/dist/mantarray.common";
import { shallowMount } from "@vue/test-utils";

import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

let NuxtStore;
let store;

describe("InputDropDown.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());
  const nicknames = [
    "Customer Account 1",
    "Customer Account 2",
    "Customer Account 3",
  ];
  test("When mounting InputDropDown from the build dist file, Then it loads successfully and the props defined title is rendered", () => {
    const propsData = {
      title_label: "Customer ID",
      options_text: nicknames,
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.find(".span__input-dropdown-content-label");

    expect(target_span.text()).toStrictEqual("Customer ID");
  });
  test("When the InputDropDown is mounted, Then it loads successfully and the props defined placeholder is rendered on input field", () => {
    const propsData = {
      title_label: "Customer ID",
      options_text: nicknames,
      placeholder: "Select Customer ID",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_input = wrapper.find("#input-dropdown-widget");
    expect(target_input.attributes().placeholder).toStrictEqual(
      "Select Customer ID"
    );
  });
  test("When the InputDropDown is mounted, Then the user enters few charters in the input, confirm that an event 'update' is emitted with entered text", async () => {
    const propsData = {
      title_label: "Customer ID",
      options_text: nicknames,
      placeholder: "Select Customer ID",
      value: "",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const customer = "New Customer"; // new Customer
    const input_widget = wrapper.find("#input-dropdown-widget");
    input_widget.element.value = customer;
    await input_widget.trigger("input");
    const parent_id_events = wrapper.emitted("update:value");
    expect(parent_id_events).toHaveLength(1);
    expect(parent_id_events).toStrictEqual([[customer]]);
  });
  test("When the InputDropDown is mouted, Then a prop message_if_blank is set to true and invalid_text is provided as value is <empty>, an error text is rendered", async () => {
    const propsData = {
      title_label: "Customer ID",
      options_text: nicknames,
      placeholder: "Select Customer ID",
      value: "",
      invalid_text: "This field is required",
      message_if_blank: true,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_div = wrapper.find(
      ".div__input-dropdown-controls-content-feedback"
    );
    expect(target_div.text()).toStrictEqual("This field is required");
  });
  test("When the InputDropDown is mounted, Then the user enters few charters in the input, verify that its prevented as props have made this option disabled", async () => {
    const propsData = {
      title_label: "Customer ID",
      options_text: nicknames,
      placeholder: "Select Customer ID",
      value: "",
      invalid_text: "This field is required",
      message_if_blank: true,
      disabled: true,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const userdata = "Demo Account"; // some data
    const input_widget = wrapper.find("#input-dropdown-widget");
    expect(input_widget.html()).toContain("disabled");
    input_widget.element.value = userdata;
    await input_widget.trigger("input");
    const parent_id_events = wrapper.emitted("update:value");
    expect(parent_id_events).toBeUndefined();
  });
  test("When the InputDropDown is mounted, Then the widget width is modified in props to that of the value set from the props value 'entry_width'", async () => {
    const propsData = {
      title_label: "Customer ID",
      options_text: nicknames,
      placeholder: "Select Customer ID",
      value: "",
      invalid_text: "This field is required",
      message_if_blank: true,
      disabled: true,
      input_width: 390,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const background = wrapper.find(".div__input-dropdown-background");
    expect(background.attributes("style")).toStrictEqual(
      "width: 394px; height: 100px;"
    );
    const input_title_label = wrapper.find(
      ".span__input-dropdown-content-label"
    );
    expect(input_title_label.attributes("style")).toStrictEqual(
      "width: 390px;"
    );
    const input_bounded_div = wrapper.find(
      ".div__input-dropdown-controls-content-widget"
    );
    expect(input_bounded_div.attributes("style")).toStrictEqual(
      "width: 390px; top: 40px;"
    );
    const input_text_entry_span = wrapper.find(
      ".span__input-dropdown-controls-content-input-txt-widget"
    );
    expect(input_text_entry_span.attributes("style")).toStrictEqual(
      "width: 390px;"
    );
    const input_text_entry_feedback = wrapper.find(
      ".div__input-dropdown-controls-content-feedback"
    );
    expect(input_text_entry_feedback.attributes("style")).toStrictEqual(
      "width: 390px; top: 88px;"
    );
  });
  test("When the InputDropDown is mounted with the title prop empty/blank, Then height of the widget is modified  in the event of title being empty without a hole", async () => {
    const propsData = {
      title_label: "",
      options_text: nicknames,
      placeholder: "Select Customer ID",
      value: "",
      invalid_text: "This field is required",
      message_if_blank: true,
      disabled: true,
      input_width: 390,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const background = wrapper.find(".div__input-dropdown-background");
    expect(background.attributes("style")).toStrictEqual(
      "width: 394px; height: 60px;"
    );
    const input_title_label = wrapper.find(
      ".span__input-dropdown-content-label"
    );
    expect(input_title_label.exists()).toBe(false);

    const input_bounded_div = wrapper.find(
      ".div__input-dropdown-controls-content-widget"
    );
    expect(input_bounded_div.attributes("style")).toStrictEqual(
      "width: 390px; top: 0px;"
    );
    const input_text_entry_span = wrapper.find(
      ".span__input-dropdown-controls-content-input-txt-widget"
    );
    expect(input_text_entry_span.attributes("style")).toStrictEqual(
      "width: 390px;"
    );
    const input_text_entry_feedback = wrapper.find(
      ".div__input-dropdown-controls-content-feedback"
    );
    expect(input_text_entry_feedback.attributes("style")).toStrictEqual(
      "width: 390px; top: 48px;"
    );
  });
});
