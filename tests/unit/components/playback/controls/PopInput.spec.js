import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/PopInput.vue";
import { PopInput as DistComponentToTest } from "@/dist/mantarray.common";
import { shallowMount } from "@vue/test-utils";

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

describe("popinput.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());
  test("When mounting popinput from the build dist file, Then it loads successfully and the props defined title is rendered", () => {
    const propsData = {
      title_label: "Enter  Alphanumeric  ID",
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.find(".span__input-content-label");

    expect(target_span.text()).toStrictEqual("Enter  Alphanumeric  ID"); // the value of &nbsp<wbr> is '\u00a0'
  });
  test("When the PopInput is mounted, Then it loads successfully and the props defined placeholder is rendered on input field", () => {
    const propsData = {
      title_label: "Enter  Alphanumeric  ID",
      placeholder: "place holder",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_input = wrapper.find("#input-widget");
    expect(target_input.attributes().placeholder).toStrictEqual("place holder");
  });
  test("When the PopInput is mounted, Then the user enters few charters in the input, confirm that an event 'update' is emitted with entered text", async () => {
    const propsData = {
      title_label: "Enter  Alphanumeric  ID",
      placeholder: "place holder",
      value: "",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const uuidBase62 = "2VSckkBYH2An3dqHEyfRRE"; // proper uuidcode sent
    const input_widget = wrapper.find("#input-widget");
    input_widget.element.value = uuidBase62;
    await input_widget.trigger("input");
    const parent_id_events = wrapper.emitted("update:value");
    expect(parent_id_events).toHaveLength(2);
    expect(parent_id_events).toStrictEqual([[""], ["2VSckkBYH2An3dqHEyfRRE"]]);
    expect(wrapper.vm.input_key_action).toStrictEqual(true); // This is a computed value its a response its important to verify the value
  });
  test("When the popinput is mouted, Then when by default an error text is rendered provided in the prop", async () => {
    const propsData = {
      title_label: "Enter  Alphanumeric  ID",
      placeholder: "place holder",
      value: "",
      invalid_text: "This field is required",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_div = wrapper.find(".div__input-controls-content-feedback");
    expect(target_div.text()).toStrictEqual("This field is required");
  });
  test("When the PopInput is mounted, Then the user enters few charters in the input, verify that the spellcheck is set to false", async () => {
    const propsData = {
      title_label: "Enter  Alphanumeric  ID",
      placeholder: "place holder",
      value: "",
      invalid_text: "This field is required",
      spellcheck: false,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const userdata = "bdukeusaued"; // proper uuidcode sent
    const input_widget = wrapper.find("#input-widget");
    input_widget.element.value = userdata;
    await input_widget.trigger("input");
    expect(input_widget.html()).toContain('spellcheck="false"');
  });
  test("When the PopInput is mounted, Then the user enters few charters in the input, verify that its prevented as props have made this option disabled", async () => {
    const propsData = {
      title_label: "Enter  Alphanumeric  ID",
      placeholder: "place holder",
      value: "",
      invalid_text: "This field is required",
      spellcheck: false,
      disabled: true,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const userdata = "bdukeusaued"; // proper uuidcode sent
    const input_widget = wrapper.find("#input-widget");
    input_widget.element.value = userdata;
    await input_widget.trigger("input");
    expect(input_widget.html()).toContain("disabled");
    const parent_id_events = wrapper.emitted("update:value");
    expect(parent_id_events).toHaveLength(1);
    expect(parent_id_events).toStrictEqual([[""]]); // confirming that the values are not passed
  });
  test("When the PopInput is mounted, Then the widget width is modified in proption to that of the value set from the props value 'entry_width'", async () => {
    const propsData = {
      title_label: "Enter  Alphanumeric  ID",
      placeholder: "place holder",
      value: "",
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
      "width: 394px; height: 100px;"
    );
    const input_title_label = wrapper.find(".span__input-content-label");
    expect(input_title_label.attributes("style")).toStrictEqual(
      "width: 390px;"
    );
    const input_bounded_div = wrapper.find(
      ".div__input-controls-content-widget"
    );
    expect(input_bounded_div.attributes("style")).toStrictEqual(
      "width: 390px; top: 40px;"
    );
    const input_text_entry_span = wrapper.find(
      ".span__input-controls-content-input-txt-widget"
    );
    expect(input_text_entry_span.attributes("style")).toStrictEqual(
      "width: 390px;"
    );
    const input_text_entry_feedback = wrapper.find(
      ".div__input-controls-content-feedback"
    );
    expect(input_text_entry_feedback.attributes("style")).toStrictEqual(
      "width: 390px; top: 88px;"
    );
  });
  test("When the PopInput is mounted, Then the widget width is modified in proption to that of the value set from the props value 'entry_width' in the event of title being empty the height is modified without a hole", async () => {
    const propsData = {
      title_label: "",
      placeholder: "place holder",
      value: "",
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
      "width: 394px; height: 60px;"
    );
    const input_title_label = wrapper.find(".span__input-content-label");
    expect(input_title_label.exists()).toBe(false);

    const input_bounded_div = wrapper.find(
      ".div__input-controls-content-widget"
    );
    expect(input_bounded_div.attributes("style")).toStrictEqual(
      "width: 390px; top: 0px;"
    );
    const input_text_entry_span = wrapper.find(
      ".span__input-controls-content-input-txt-widget"
    );
    expect(input_text_entry_span.attributes("style")).toStrictEqual(
      "width: 390px;"
    );
    const input_text_entry_feedback = wrapper.find(
      ".div__input-controls-content-feedback"
    );
    expect(input_text_entry_feedback.attributes("style")).toStrictEqual(
      "width: 390px; top: 48px;"
    );
  });
});
