import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/basic_widgets/InputDropDown.vue";
import { InputDropDown as DistComponentToTest } from "@/dist/mantarray.common";
import { shallowMount } from "@vue/test-utils";
import SmallDropDown from "@/components/basic_widgets/SmallDropDown.vue";
import SelectDropDown from "@/components/basic_widgets/SelectDropDown.vue";

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
  const nicknames = ["Customer Account 1", "Customer Account 2", "Customer Account 3"];
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
    const target_input = wrapper.find("#input-dropdown-widget-");
    expect(target_input.attributes().placeholder).toStrictEqual("Select Customer ID");
  });
  test("When the user types a valid option from the list, Then an event 'update' is emitted with the entered text", async () => {
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
    const customer = "Customer Account 1"; // new Customer
    const input_widget = wrapper.find("#input-dropdown-widget-");
    input_widget.element.value = customer;
    await input_widget.trigger("input");
    const parent_id_events = wrapper.emitted("update:value");
    expect(parent_id_events).toHaveLength(1);
    expect(parent_id_events).toStrictEqual([[customer]]);
  });
  test("When the InputDropDown is mounted, Then a prop message_if_invalid is set to true and invalid_text is provided as value is <empty>, an error text is rendered", async () => {
    const propsData = {
      title_label: "Customer ID",
      options_text: nicknames,
      placeholder: "Select Customer ID",
      value: "",
      invalid_text: "This field is required",
      message_if_invalid: true,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_div = wrapper.find(".div__input-dropdown-controls-content-feedback");
    const target_dropdown_surronded_box = wrapper.find(
      ".div__input-dropdown-controls-content-widget--invalid"
    );
    expect(target_dropdown_surronded_box.isVisible()).toBe(true);
    expect(target_div.text()).toStrictEqual("This field is required");
  });
  test("Given the disabled prop is set to true, When the user types a few characters, Then no update event is emitted by the component.", async () => {
    const propsData = {
      title_label: "Customer ID",
      options_text: nicknames,
      placeholder: "Select Customer ID",
      value: "",
      invalid_text: "This field is required",
      message_if_invalid: true,
      disabled: true,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const userdata = "Demo Account"; // some data
    const input_widget = wrapper.find("#input-dropdown-widget-");
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
      message_if_invalid: true,
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
      "width: 394px; height: 100px; background: rgb(0, 0, 0); border: 2px solid rgb(0, 0, 0);"
    );
    const input_title_label = wrapper.find(".span__input-dropdown-content-label");
    expect(input_title_label.attributes("style")).toStrictEqual("width: 390px;");
    const input_bounded_div = wrapper.find(".div__input-dropdown-controls-content-widget");
    expect(input_bounded_div.attributes("style")).toStrictEqual("width: 390px; top: 40px;");
    const input_text_entry_span = wrapper.find(".span__input-dropdown-controls-content-input-txt-widget");
    expect(input_text_entry_span.attributes("style")).toStrictEqual("width: 390px;");
    const input_text_entry_feedback = wrapper.find(".div__input-dropdown-controls-content-feedback");
    expect(input_text_entry_feedback.attributes("style")).toStrictEqual("width: 390px; top: 88px;");
  });
  test("When the InputDropDown is mounted with the title prop empty/blank, Then height of the widget is modified  in the event of title being empty without a hole", async () => {
    const propsData = {
      title_label: "",
      options_text: nicknames,
      placeholder: "Select Customer ID",
      value: "",
      invalid_text: "This field is required",
      message_if_invalid: true,
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
      "width: 394px; height: 60px; background: rgb(0, 0, 0); border: 2px solid rgb(0, 0, 0);"
    );
    const input_title_label = wrapper.find(".span__input-dropdown-content-label");
    expect(input_title_label.exists()).toBe(false);

    const input_bounded_div = wrapper.find(".div__input-dropdown-controls-content-widget");
    expect(input_bounded_div.attributes("style")).toStrictEqual("width: 390px; top: 0px;");
    const input_text_entry_span = wrapper.find(".span__input-dropdown-controls-content-input-txt-widget");
    expect(input_text_entry_span.attributes("style")).toStrictEqual("width: 390px;");
    const input_text_entry_feedback = wrapper.find(".div__input-dropdown-controls-content-feedback");
    expect(input_text_entry_feedback.attributes("style")).toStrictEqual("width: 390px; top: 48px;");
  });

  test("When exiting the SelectDropDown instance, Then instance is effectively destroyed", async () => {
    const destroyed_spy = jest.spyOn(SelectDropDown, "beforeDestroy");
    const wrapper = mount(SelectDropDown, {
      store,
      localVue,
      propsData: {
        options_text: ["test"],
      },
    });
    wrapper.destroy();
    expect(destroyed_spy).toHaveBeenCalledWith();
  });
  describe("SmallDropdown.vue", () => {
    test("When the disable_toggle prop changes to true , Then the options list will not expand when a user clicks on it", async () => {
      const toggle_spy = jest.spyOn(SmallDropDown.methods, "toggle");
      const wrapper = mount(SmallDropDown, {
        store,
        localVue,
        propsData: {
          options_text: ["option_1", "option_2"],
          disable_toggle: false,
        },
      });

      await wrapper.setProps({ disable_toggle: true });
      const selected_opt = wrapper.find(".span__small-dropdown-controls-content-input-txt-widget");
      await wrapper.find(".div__small-dropdown-controls-content-widget").trigger("click");

      expect(wrapper.vm.visible).toBe(false);
      expect(selected_opt.text()).toContain("option_1");
      expect(toggle_spy).toHaveBeenCalledTimes(0);
    });
    test("When exiting the SmallDropDown instance, Then instance is effectively destroyed", async () => {
      const destroyed_spy = jest.spyOn(SmallDropDown, "beforeDestroy");
      const wrapper = mount(SmallDropDown, {
        store,
        localVue,
        propsData: {
          options_text: ["test"],
        },
      });
      wrapper.destroy();
      expect(destroyed_spy).toHaveBeenCalledWith();
    });
    test("When the disable_selection prop changes to true, Then the ability to change the selected option should be disabled", async () => {
      const toggle_spy = jest.spyOn(SmallDropDown.methods, "toggle");
      const change_spy = jest.spyOn(SmallDropDown.methods, "change_selection");
      const wrapper = mount(SmallDropDown, {
        store,
        localVue,
        propsData: {
          options_text: ["option_1", "option_2"],
          disable_selection: false,
        },
      });

      await wrapper.setProps({ disable_selection: true });
      expect(wrapper.vm.visible).toBe(false);

      const selected_opt = wrapper.find(".span__small-dropdown-controls-content-input-txt-widget");
      expect(selected_opt.text()).toContain("option_1");

      await wrapper.find(".div__small-dropdown-controls-content-widget").trigger("click");
      const list_opts = wrapper.findAll("li");

      expect(toggle_spy).toHaveBeenCalledTimes(1);
      expect(list_opts).toHaveLength(1);

      // try to select other option when disabled
      await list_opts.at(0).trigger("click");

      // selected option should not have changed
      expect(selected_opt.text()).toContain("option_1");
      expect(change_spy).toHaveBeenCalledTimes(0);
    });
  });
});
