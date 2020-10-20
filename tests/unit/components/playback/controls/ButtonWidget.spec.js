import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/ButtonWidget.vue";
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
      btn_names: ["Save ID"],
      focus_color: "#FFFFFF",
      hide_color: "#3F3F3F",
      is_enabled: [true],
      btn_width: 500,
      btn_height: 50,
      btn_top: 0,
      btn_left: 0,
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_background_div = wrapper.find(".div__button-background");
    expect(target_background_div.isVisible()).toBe(true);
  });
  test("When that ButtonWidget is mounted, Then the button CSS values gets applied based on the values from the props", () => {
    const propsData = {
      btn_names: ["Save ID"],
      focus_color: "#FFFFFF",
      hide_color: "#3F3F3F",
      is_enabled: [true],
      btn_width: 500,
      btn_height: 50,
      btn_top: 0,
      btn_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_background_div = wrapper.find(".div__button-background");
    expect(target_background_div.attributes().style).toBe(
      "width: 500px; height: 50px; top: 0px; left: 0px;"
    );
  });
  test("When that ButtonWidget is mounted, Then it loads the button background, button label, visible, focus color and greyed color the values provided from the props as visible is true so focus color text is rendred", () => {
    const propsData = {
      btn_names: ["Save ID"],
      focus_color: "#FFFFFF",
      hide_color: "#3F3F3F",
      is_enabled: [true],
      btn_width: 500,
      btn_height: 50,
      btn_top: 0,
      btn_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_button_label_btn = wrapper.find(".span__button_label");
    expect(target_button_label_btn.text()).toStrictEqual("Save ID");
    expect(target_button_label_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 500px; left: 0px;"
    ); // DOM converts the #FFFFFF to rgb(255, 255, 255)
  });
  test("When that ButtonWidget is mounted, Then it loads the button background, button label, visible, focus color and greyed color the values provided from the props as visible is false a greyed color text is rendred", () => {
    const propsData = {
      btn_names: ["Save ID"],
      focus_color: "#FFFFFF",
      hide_color: "#3F3F3F",
      is_enabled: [false],
      btn_width: 500,
      btn_height: 50,
      btn_top: 0,
      btn_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_button_label_btn = wrapper.find(".span__button_label");
    expect(target_button_label_btn.text()).toStrictEqual("Save ID");
    expect(target_button_label_btn.attributes().style).toBe(
      "color: rgb(63, 63, 63); width: 500px; left: 0px;"
    ); // DOM converts the #3F3F3F to rgb(63, 63, 63)
  });
  test("When that ButtonWidget is mounted, Then it loads the button background, button label, visible, focus color, greyed color, hover color the values provided from the props as visible is true so focus color text is rendred, user hover the hover color is rendered", async () => {
    const propsData = {
      btn_names: ["Save ID"],
      focus_color: "#FFFFFF",
      hide_color: "#3F3F3F",
      is_enabled: [true],
      hover_color: ["#BD4932"],
      btn_width: 500,
      btn_height: 50,
      btn_top: 0,
      btn_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_button_label_btn = wrapper.find(".span__button_label");
    await target_button_label_btn.trigger("mouseenter");
    expect(target_button_label_btn.attributes().style).toBe(
      "color: rgb(189, 73, 50); width: 500px; left: 0px;"
    );
    await target_button_label_btn.trigger("mouseleave");
    expect(target_button_label_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 500px; left: 0px;"
    );
  });
  test("When that ButtonWidget is mounted, Then it loads the button background, with buttons label Cancel/Delete ID/Save ID is placed with equal width of 1/3 that of widget and shifted from left at rate of 0, 1/3 and 2/3", async () => {
    const propsData = {
      btn_names: ["Cancel", "Delete ID", "Save ID"],
      focus_color: "#FFFFFF",
      hide_color: "#3F3F3F",
      is_enabled: [true, true, false],
      hover_color: ["#BD4932", "#BD4932", "#19ac8a"],
      btn_width: 500,
      btn_height: 50,
      btn_top: 0,
      btn_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_button_label_btn = wrapper.findAll(".span__button_label");
    const cancel_btn = target_button_label_btn.at(0);
    expect(cancel_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 166.66666666666666px; left: 0px;"
    );
    const delete_btn = target_button_label_btn.at(1);
    expect(delete_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 166.66666666666666px; left: 166.66666666666666px;"
    );
    const save_btn = target_button_label_btn.at(2);
    expect(save_btn.attributes().style).toBe(
      "color: rgb(63, 63, 63); width: 166.66666666666666px; left: 333.3333333333333px;"
    );
  });
  test("When the ButtonWidget is mounted, Then it loads the horizontal top-line divider proportion, to the defined width of 490px with padding from edges of the widget length", async () => {
    const propsData = {
      btn_names: ["Save ID"],
      focus_color: "#FFFFFF",
      hide_color: "#3F3F3F",
      is_enabled: [true],
      hover_color: ["#BD4932"],
      btn_width: 500,
      btn_height: 50,
      btn_top: 0,
      btn_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_canvas_common_line = wrapper.find(
      ".canvas__common-horizontal-line"
    );
    expect(target_canvas_common_line.attributes().style).toBe("width: 490px;"); // validated if dynamically the value is modified to n-10 px in width as 5px padding is as per mockflow
  });
  test("When the ButtonWidget is mounted, Then it loads the widget as there is only one single btn label Save ID, verify that vertical line is not present", async () => {
    const propsData = {
      btn_names: ["Save ID"],
      focus_color: "#FFFFFF",
      hide_color: "#3F3F3F",
      is_enabled: [true],
      hover_color: ["#BD4932"],
      btn_width: 500,
      btn_height: 50,
      btn_top: 0,
      btn_left: 0,
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
      btn_names: ["Cancel", "Delete ID", "Save ID"],
      focus_color: "#FFFFFF",
      hide_color: "#3F3F3F",
      is_enabled: [true, true, false],
      hover_color: ["#BD4932", "#BD4932", "#19ac8a"],
      btn_width: 500,
      btn_height: 50,
      btn_top: 0,
      btn_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_vertical_line = wrapper.findAll(".canvas__vertical-line");

    const first_vertical_line = target_vertical_line.at(0);
    expect(first_vertical_line.attributes().style).toBe(
      "left: 166.66666666666666px;"
    );
    const second_vertical_line = target_vertical_line.at(1);
    expect(second_vertical_line.attributes().style).toBe(
      "left: 333.3333333333333px;"
    );
  });
  test("When that ButtonWidget is mounted, Then it loads the button background, with buttons label Cancel/Save ID when user click on Cancel an event is sent, as Save ID is disabled no-event is sent", async () => {
    const propsData = {
      btn_names: ["Cancel", "Save ID"],
      focus_color: "#FFFFFF",
      hide_color: "#3F3F3F",
      is_enabled: [true, false],
      hover_color: ["#BD4932", "#19ac8a"],
      btn_width: 500,
      btn_height: 50,
      btn_top: 0,
      btn_left: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_button_label_btn = wrapper.findAll(".span__button_label");
    const cancel_btn = target_button_label_btn.at(0);
    await cancel_btn.trigger("click");
    const parent_id_events = wrapper.emitted("btn-click");
    expect(parent_id_events).toHaveLength(1);
    expect(parent_id_events).toStrictEqual([[0]]);

    const save_btn = target_button_label_btn.at(1);
    await save_btn.trigger("click");
    expect(parent_id_events).toHaveLength(1);
    expect(parent_id_events).toStrictEqual([[0]]);
  });
});
