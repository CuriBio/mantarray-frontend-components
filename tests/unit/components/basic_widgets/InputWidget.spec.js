import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/basic_widgets/InputWidget.vue";
import { InputWidget as DistComponentToTest } from "@/dist/mantarray.common";

import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.min.css";
import uuid from "@tofandel/uuid-base62";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);
localVue.use(uuid);

let NuxtStore;
let store;

describe("InputWidget.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());
  test("When mounting from the built dist file, Then it loads successfully and the props defined title is rendered", () => {
    const propsData = {
      title_label: "Enter  Alphanumeric  ID",
    };
    wrapper = mount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.find(".span__input-content-label");

    expect(target_span.text()).toStrictEqual("Enter  Alphanumeric  ID"); // the value of &nbsp<wbr> is '\u00a0'
  });
  test("When the Component is mounted, Then it loads successfully and the props defined placeholder is rendered on input field", () => {
    const propsData = {
      title_label: "Enter  Alphanumeric  ID",
      placeholder: "place holder",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_input = wrapper.find("#input-widget-field-");
    expect(target_input.attributes().placeholder).toStrictEqual("place holder");
  });
  test("When the Component is mounted with an initial value supplied as a prop, Then the input field is populated with that value", () => {
    const expected = "quick brown fox";
    const propsData = {
      initial_value: expected,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_input = wrapper.find("#input-widget-field-");
    expect(target_input.element.value).toStrictEqual(expected);
  });
  test("When the Component is mounted with a DOM ID suffix supplied as a prop, Then the input field and feedback text have that included in their DOM IDs", () => {
    const expected = "my-suffix";
    const propsData = {
      dom_id_suffix: expected,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_input = wrapper.find("#input-widget-field-" + expected);
    expect(target_input.exists()).toBe(true);
    const target_feedback = wrapper.find("#input-widget-feedback-" + expected);
    expect(target_feedback.exists()).toBe(true);
  });

  test("When the the user enters few charters in the input, Then an event 'update' is emitted with entered text", async () => {
    const propsData = {
      title_label: "Enter  Alphanumeric  ID",
      placeholder: "place holder",
      initial_value: "",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const uuidBase62 = "2VSckkBYH2An3dqHEyfRRE"; // proper uuidcode sent
    const input_widget = wrapper.find("#input-widget-field-");
    input_widget.element.value = uuidBase62;
    await input_widget.trigger("input");
    const emitted_events = wrapper.emitted("update:value");
    expect(emitted_events).toHaveLength(1);
    expect(emitted_events).toStrictEqual([["2VSckkBYH2An3dqHEyfRRE"]]);
  });
  test("When the component is mounted with some invalid text present as a prop, Then the error text is rendered in the DOM", async () => {
    const expected_text = "This field is required";
    const propsData = {
      invalid_text: expected_text,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_div = wrapper.find(".div__input-controls-content-feedback");
    expect(target_div.text()).toStrictEqual(expected_text);
  });
  test("When the Component is mounted with the spellcheck prop set to false, Then the input field in the DOM has the spellcheck attribute set to false", async () => {
    const propsData = {
      spellcheck: false,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const input_widget = wrapper.find("#input-widget-field-");
    expect(input_widget.html()).toContain('spellcheck="false"');
  });
  test("Given the component is mounted with the disabled prop set to True, When the user enters few charters in the input, Then no update:value event should be emitted because the field is disabled", async () => {
    const propsData = {
      disabled: true,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const input_widget = wrapper.find("#input-widget-field-");
    expect(input_widget.html()).toContain("disabled");

    const userdata = "bdukeusaued"; // proper uuidcode sent
    input_widget.element.value = userdata;
    await input_widget.trigger("input");
    const parent_id_events = wrapper.emitted("update:value");
    expect(parent_id_events).toBeUndefined();
  });
  test("When the component is mounted, Then the widget width is modified in proption to that of the value set from the props value 'entry_width'", async () => {
    const propsData = {
      title_label: "Enter  Alphanumeric  ID",
      input_width: 390,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const background = wrapper.find(".div__input-background");
    expect(background.attributes("style")).toStrictEqual(
      "width: 394px; height: 100px; background: rgb(17, 17, 17); border: 2px solid rgb(17, 17, 17);"
    );
    const input_title_label = wrapper.find(".span__input-content-label");
    expect(input_title_label.attributes("style")).toStrictEqual("width: 390px;");
    const input_bounded_div = wrapper.find(".div__input-controls-content-widget");
    expect(input_bounded_div.attributes("style")).toStrictEqual("width: 390px; height: 45px; top: 40px;");
    const input_text_entry_span = wrapper.find(".span__input-controls-content-input-txt-widget");
    expect(input_text_entry_span.attributes("style")).toStrictEqual(
      "width: 390px; height: 45px; line-height: 45px;"
    );
    const input_text_entry_feedback = wrapper.find(".div__input-controls-content-feedback");
    expect(input_text_entry_feedback.attributes("style")).toStrictEqual("width: 390px; top: 89px;");
  });
  test("When the component is mounted, Then the widget width is modified in proption to that of the value set from the props value 'entry_width' in the event of title being empty the height is modified without a hole", async () => {
    const propsData = {
      title_label: "",
      placeholder: "place holder",
      initial_value: "",
      invalid_text: "This field is required",
      spellcheck: false,
      disabled: false,
      input_width: 390,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const background = wrapper.find(".div__input-background");
    expect(background.attributes("style")).toStrictEqual(
      "width: 394px; height: 55px; background: rgb(17, 17, 17); border: 2px solid rgb(17, 17, 17);"
    );
    const input_title_label = wrapper.find(".span__input-content-label");
    expect(input_title_label.exists()).toBe(false);

    const input_bounded_div = wrapper.find(".div__input-controls-content-widget");
    expect(input_bounded_div.attributes("style")).toStrictEqual("width: 390px; height: 45px; top: 0px;");
    const input_text_entry_span = wrapper.find(".span__input-controls-content-input-txt-widget");
    expect(input_text_entry_span.attributes("style")).toStrictEqual(
      "width: 390px; height: 45px; line-height: 45px;"
    );
    const input_text_entry_feedback = wrapper.find(".div__input-controls-content-feedback");
    expect(input_text_entry_feedback.attributes("style")).toStrictEqual("width: 390px; top: 49px;");
  });
  test("When the component is mounted with the display_text_message prop set to false, Then the invalid_text is not rendered", async () => {
    const propsData = {
      title_label: "",
      placeholder: "place holder",
      initial_value: "",
      invalid_text: "This field is required",
      spellcheck: false,
      disabled: false,
      input_width: 390,
      display_text_message: false,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const input_text_entry_feedback = wrapper.find(".div__input-controls-content-feedback");
    expect(input_text_entry_feedback.isVisible()).toBe(false);
  });
  test("Given the component was mounted with the display_text_message prop set to false, When the display_text_message prop is updated to True, Then the invalid_text is rendered", async () => {
    const propsData = {
      title_label: "",
      placeholder: "place holder",
      initial_value: "",
      invalid_text: "This field is required",
      spellcheck: false,
      disabled: false,
      input_width: 390,
      display_text_message: false,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const input_text_entry_feedback = wrapper.find(".div__input-controls-content-feedback");
    expect(input_text_entry_feedback.isVisible()).toBe(false);
    await wrapper.setProps({ display_text_message: true });
    expect(input_text_entry_feedback.isVisible()).toBe(true);
  });
  test("When an the props cut_paste_disable is set to true, Then validate its not updated on input and onpaste attribute has script with 'return false;'", async () => {
    const propsData = {
      title_label: "",
      placeholder: "place holder",
      initial_value: "",
      invalid_text: "This field is required",
      spellcheck: false,
      disabled: false,
      input_width: 390,
      display_text_message: false,
      disable_paste: true,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const mEvent = {
      clipboardData: { getData: jest.fn().mockReturnValueOnce("12") },
    };
    wrapper.find("#input-widget-field-").trigger("paste", mEvent);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("#input-widget-field-").value).toBeUndefined();
    expect(wrapper.find("#input-widget-field-").html()).toContain('onpaste="true"');
  });
  test("When an the props change to render validate class, Then the corresponding validation class should be returned", async () => {
    const propsData = {
      title_label: "",
      placeholder: "place holder",
      initial_value: "",
      invalid_text: "",
      spellcheck: false,
      disabled: false,
      input_width: 390,
      display_text_message: false,
      disable_paste: true,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    await wrapper.setProps({ initial_value: "test" });

    expect(wrapper.vm.input_is_valid).toBe(true);
    expect(wrapper.find(".div__input-controls-content-widget--valid")).toBeTruthy();
  });
  test("When an the props change to render invalid class, Then the corresponding validation class should be returned", async () => {
    const propsData = {
      title_label: "",
      placeholder: "place holder",
      initial_value: "",
      invalid_text: "invalid text",
      spellcheck: false,
      disabled: false,
      input_width: 390,
      display_text_message: false,
      disable_paste: true,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });

    expect(wrapper.vm.input_is_valid).toBe(false);
    expect(wrapper.find(".div__input-controls-content-widget--invalid")).toBeTruthy();
  });
});
