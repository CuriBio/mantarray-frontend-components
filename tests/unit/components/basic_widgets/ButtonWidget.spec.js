import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/basic_widgets/ButtonWidget.vue";
import { ButtonWidget as DistComponentToTest } from "@/dist/mantarray.common";
import { shallowMount } from "@vue/test-utils";

import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);

let NuxtStore;
let store;

describe("ButtonWidget.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());

  test("When mounting ButtonWidget from the build dist file, Then it loads successfully and the black box is displayed", () => {
    const propsData = {
      button_names: ["Save ID"],
      enabled_color: "#FFFFFF",
      disabled_color: "#3F3F3F",
      is_enabled: [true],
      hover_color: ["#BD4932"],
      button_widget_width: 500,
      button_widget_height: 50,
      button_widget_top: 0,
      button_widget_left: 0,
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_background_div = wrapper.find(".div__button-background");
    expect(target_background_div.isVisible()).toBe(true);
  });
  test("When that ButtonWidget is mounted, Then the button width/height/top and left gets applied based on the values from the props", () => {
    const propsData = {
      button_names: ["Save ID"],
      enabled_color: "#FFFFFF",
      disabled_color: "#3F3F3F",
      is_enabled: [true],
      hover_color: ["#BD4932"],
      button_widget_width: 500,
      button_widget_height: 50,
      button_widget_top: 0,
      button_widget_left: 0,
      button_background_color: "rgb(255, 255, 255)",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_background_div = wrapper.find(".div__button-background");
    expect(target_background_div.attributes().style).toBe(
      "width: 500px; height: 50px; top: 0px; left: 0px; background: rgb(255, 255, 255);"
    );
  });
  test("When that ButtonWidget is mounted, Then it loads the button background, button label, visible, focus color and greyed color the values provided from the props as visible is true so focus color text is rendred", () => {
    const propsData = {
      button_names: ["Save ID"],
      enabled_color: "#FFFFFF",
      disabled_color: "#3F3F3F",
      is_enabled: [true],
      hover_color: ["#BD4932"],
      button_widget_width: 500,
      button_widget_height: 50,
      button_widget_top: 0,
      button_widget_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_button_label_btn = wrapper.find(".span__button-label");
    expect(target_button_label_btn.text()).toStrictEqual("Save ID");
    expect(target_button_label_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 500px; left: 0px; cursor: pointer;"
    ); // DOM converts the #FFFFFF to rgb(255, 255, 255)
  });
  test("When that ButtonWidget is mounted, Then it loads the button background, button label, visible, focus color and greyed color the values provided from the props as visible is false a greyed color text is rendred", () => {
    const propsData = {
      button_names: ["Save ID"],
      enabled_color: "#FFFFFF",
      disabled_color: "#3F3F3F",
      is_enabled: [false],
      hover_color: ["#BD4932"],
      button_widget_width: 500,
      button_widget_height: 50,
      button_widget_top: 0,
      button_widget_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_button_label_btn = wrapper.find(".span__button-label");
    expect(target_button_label_btn.text()).toStrictEqual("Save ID");
    expect(target_button_label_btn.attributes().style).toBe(
      "color: rgb(63, 63, 63); width: 500px; left: 0px;"
    ); // DOM converts the #3F3F3F to rgb(63, 63, 63)
  });
  test("When that ButtonWidget is mounted, Then it loads the button background, button label, visible, focus color and greyed color the values provided from the props as visible is false a greyed color text, on a prop update of visible to true the enabled color text is rendered", async () => {
    const propsData = {
      button_names: ["Save ID"],
      enabled_color: "#FFFFFF",
      disabled_color: "#3F3F3F",
      is_enabled: [false],
      hover_color: ["#BD4932"],
      button_widget_width: 500,
      button_widget_height: 50,
      button_widget_top: 0,
      button_widget_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_button_label_btn = wrapper.find(".span__button-label");
    expect(target_button_label_btn.text()).toStrictEqual("Save ID");
    expect(target_button_label_btn.attributes().style).toBe(
      "color: rgb(63, 63, 63); width: 500px; left: 0px;"
    ); // DOM converts the #3F3F3F to rgb(63, 63, 63)

    const updated_propsData = {
      is_enabled: [true],
    };

    await wrapper.setProps(updated_propsData);
    expect(target_button_label_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 500px; left: 0px; cursor: pointer;"
    ); // DOM converts the #FFFFFF to rgb(255, 255, 255)
  });
  test("When that ButtonWidget is mounted, Then it loads the button background, button label, visible, focus color, greyed color, hover color the values provided from the props as visible is true so focus color text is rendred, user hover the hover color is rendered", async () => {
    const propsData = {
      button_names: ["Save ID"],
      enabled_color: "#FFFFFF",
      disabled_color: "#3F3F3F",
      is_enabled: [true],
      hover_color: ["#BD4932"],
      button_widget_width: 500,
      button_widget_height: 50,
      button_widget_top: 0,
      button_widget_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_button_label_btn = wrapper.find(".span__button-label");
    await target_button_label_btn.trigger("mouseenter");
    expect(target_button_label_btn.attributes().style).toBe(
      "color: rgb(189, 73, 50); width: 500px; left: 0px; cursor: pointer;"
    );
    await target_button_label_btn.trigger("mouseleave");
    expect(target_button_label_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 500px; left: 0px; cursor: pointer;"
    );
  });
  test("When that ButtonWidget is mounted, Then it loads the button background, button label, hover color, without enabled_color prop from the props as visible is true so focus color text is rendred", async () => {
    const propsData = {
      button_names: ["Save ID"],
      disabled_color: "#3F3F3F",
      is_enabled: [true],
      hover_color: ["#BD4932"],
      button_widget_width: 500,
      button_widget_height: 50,
      button_widget_top: 0,
      button_widget_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_button_label_btn = wrapper.find(".span__button-label");
    expect(target_button_label_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 500px; left: 0px; cursor: pointer;"
    );
  });
  test("When that ButtonWidget is mounted, Then it loads the button background, button label, hover color, without disabled_color prop from the props as visible is false so greyed color text is rendred", async () => {
    const propsData = {
      button_names: ["Save ID"],
      enabled_color: "#FFFFFF",
      is_enabled: [false],
      hover_color: ["#BD4932"],
      button_widget_width: 500,
      button_widget_height: 50,
      button_widget_top: 0,
      button_widget_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_button_label_btn = wrapper.find(".span__button-label");
    expect(target_button_label_btn.attributes().style).toBe(
      "color: rgb(63, 63, 63); width: 500px; left: 0px;"
    );
  });
  test("When that ButtonWidget is mounted, Then it loads the button background, with buttons label Cancel/Delete ID/Save ID is placed with equal width of 1/3 that of widget and shifted from left at rate of 0, 1/3 and 2/3", async () => {
    const propsData = {
      button_names: ["Cancel", "Delete ID", "Save ID"],
      enabled_color: "#FFFFFF",
      disabled_color: "#3F3F3F",
      is_enabled: [true, true, false],
      hover_color: ["#BD4932", "#BD4932", "#19ac8a"],
      button_widget_width: 500,
      button_widget_height: 50,
      button_widget_top: 0,
      button_widget_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_button_label_btn = wrapper.findAll(".span__button-label");
    const cancel_btn = target_button_label_btn.at(0);
    expect(cancel_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 166.66666666666666px; left: 0px; cursor: pointer;"
    );
    const delete_btn = target_button_label_btn.at(1);
    expect(delete_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 166.66666666666666px; left: 166.66666666666666px; cursor: pointer;"
    );
    const save_btn = target_button_label_btn.at(2);
    expect(save_btn.attributes().style).toBe(
      "color: rgb(63, 63, 63); width: 166.66666666666666px; left: 333.3333333333333px;"
    );
  });
  test("When that ButtonWidget is mounted, Then it loads the button background, with buttons label Cancel/Delete ID/Save ID as default all buttons are enabled and have enabled_color for color", async () => {
    const propsData = {
      button_names: ["Cancel", "Delete ID", "Save ID"],
      enabled_color: "#FFFFFF",
      disabled_color: "#3F3F3F",
      hover_color: ["#BD4932", "#BD4932", "#19ac8a"],
      button_widget_width: 500,
      button_widget_height: 50,
      button_widget_top: 0,
      button_widget_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_button_label_btn = wrapper.findAll(".span__button-label");
    const cancel_btn = target_button_label_btn.at(0);
    expect(cancel_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 166.66666666666666px; left: 0px; cursor: pointer;"
    );
    const delete_btn = target_button_label_btn.at(1);
    expect(delete_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 166.66666666666666px; left: 166.66666666666666px; cursor: pointer;"
    );
    const save_btn = target_button_label_btn.at(2);
    expect(save_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 166.66666666666666px; left: 333.3333333333333px; cursor: pointer;"
    );
  });
  test("When the ButtonWidget is mounted, Then it loads the horizontal top-line divider proportion, to the defined width of 490px with padding from edges of the widget length", async () => {
    const propsData = {
      button_names: ["Save ID"],
      enabled_color: "#FFFFFF",
      disabled_color: "#3F3F3F",
      is_enabled: [true],
      hover_color: ["#BD4932"],
      button_widget_width: 500,
      button_widget_height: 50,
      button_widget_top: 0,
      button_widget_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_canvas_common_line = wrapper.find(".canvas__common-horizontal-line");
    expect(target_canvas_common_line.attributes().style).toBe("width: 490px;"); // validated if dynamically the value is modified to n-10 px in width as 5px padding is as per mockflow
  });
  test("When the ButtonWidget is mounted, Then it loads the widget as there is only one single btn label Save ID, verify that vertical line is not present", async () => {
    const propsData = {
      button_names: ["Save ID"],
      enabled_color: "#FFFFFF",
      disabled_color: "#3F3F3F",
      is_enabled: [true],
      hover_color: ["#BD4932"],
      button_widget_width: 500,
      button_widget_height: 50,
      button_widget_top: 0,
      button_widget_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_canvas_vertical_line = wrapper.find(".canvas__vertical-line");
    expect(target_canvas_vertical_line.exists()).toBe(false);
  });
  test("When that ButtonWidget is mounted, Then it loads the button background, with buttons label Cancel/Delete ID/Save ID in between them a vertical line between button labels is rendered", async () => {
    const propsData = {
      button_names: ["Cancel", "Delete ID", "Save ID"],
      enabled_color: "#FFFFFF",
      disabled_color: "#3F3F3F",
      is_enabled: [true, true, false],
      hover_color: ["#BD4932", "#BD4932", "#19ac8a"],
      button_widget_width: 500,
      button_widget_height: 50,
      button_widget_top: 0,
      button_widget_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_vertical_line = wrapper.findAll(".canvas__vertical-line");

    const first_vertical_line = target_vertical_line.at(0);
    expect(first_vertical_line.attributes().style).toBe("left: 166.66666666666666px;");
    const second_vertical_line = target_vertical_line.at(1);
    expect(second_vertical_line.attributes().style).toBe("left: 333.3333333333333px;");
  });
  test("Given the ButtonWidget is mounted with Cancel / Save ID buttons and Save is disabled, When User clicks on Cancel, Then an event is emmitted with the Button Index as the contents of the event", async () => {
    const propsData = {
      button_names: ["Cancel", "Save ID"],
      enabled_color: "#FFFFFF",
      disabled_color: "#3F3F3F",
      is_enabled: [true, false],
      hover_color: ["#BD4932", "#19ac8a"],
      button_widget_width: 500,
      button_widget_height: 50,
      button_widget_top: 0,
      button_widget_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_button_label_btn = wrapper.findAll(".span__button-label");
    const cancel_btn = target_button_label_btn.at(0);
    await cancel_btn.trigger("click");
    const parent_id_events = wrapper.emitted("btn-click");
    expect(parent_id_events).toHaveLength(1);
    expect(parent_id_events).toStrictEqual([[0]]);
  });
  test("Given the ButtonWidget is mounted with Cancel / Save ID buttons and Save is disabled, When User clicks on Save, Then no event is emmitted when disabled button of Save is clicked", async () => {
    const propsData = {
      button_names: ["Cancel", "Save ID"],
      enabled_color: "#FFFFFF",
      disabled_color: "#3F3F3F",
      is_enabled: [true, false],
      hover_color: ["#BD4932", "#19ac8a"],
      button_widget_width: 500,
      button_widget_height: 50,
      button_widget_top: 0,
      button_widget_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_button_label_btn = wrapper.findAll(".span__button-label");
    const save_btn = target_button_label_btn.at(1);
    await save_btn.trigger("click");
    const parent_id_events = wrapper.emitted("btn-click");
    expect(parent_id_events).toBeUndefined();
    expect(parent_id_events).toBeUndefined();
  });
});
