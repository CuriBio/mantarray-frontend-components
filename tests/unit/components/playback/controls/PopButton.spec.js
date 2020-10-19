import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/PopButton.vue";
import { PopButton as DistComponentToTest } from "@/dist/mantarray.common";
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

describe("popbutton.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());

  test("When mounting popbutton from the build dist file, Then it loads successfully and the black box is displayed", () => {
    const propsData = {};
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_background_div = wrapper.find(".div__popbutton-background");
    expect(target_background_div.isVisible()).toBe(true);
  });
  test("When that popbutton is mounted, Then the button CSS values gets applied based on the values from the props", () => {
    const propsData = {
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
    const target_background_div = wrapper.find(".div__popbutton-background");
    expect(target_background_div.attributes().style).toBe(
      "width: 500px; height: 50px; top: 0px; left: 0px;"
    );
  });

  /*

  Given PopButton is mounted with empty invalid_text, When the invalid_text prop gets updated to non-empty, Then the red text appears in the DOM

  Given PopButton is mounted with empty invalid_text, When the invalid_text prop gets updated to non-empty, Then the red "invalid" icon appears inside the textbox

  When PopButton is mounted with a message in invalid_text, Then the red "invalid" icon appears inside the textbox and red outline and invalid_text is displayed below




  */

  test("When that popbutton is mounted, Then it loads the button background, button label, visible, focus color and greyed color the values provided from the props as visible is true so focus color text is rendred", () => {
    const propsData = {
      popup_btn_names: ["Save ID"],
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
    const target_popdialog_btn = wrapper.find(".span__popdialog-btn");
    expect(target_popdialog_btn.text()).toStrictEqual("Save ID");
    expect(target_popdialog_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 500px; left: 0px;"
    ); // DOM converts the #FFFFFF to rgb(255, 255, 255)
  });
  test("When that popbutton is mounted, Then it loads the button background, button label, visible, focus color and greyed color the values provided from the props as visible is false a greyed color text is rendred", () => {
    const propsData = {
      popup_btn_names: ["Save ID"],
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
    const target_popdialog_btn = wrapper.find(".span__popdialog-btn");
    expect(target_popdialog_btn.text()).toStrictEqual("Save ID");
    expect(target_popdialog_btn.attributes().style).toBe(
      "color: rgb(63, 63, 63); width: 500px; left: 0px;"
    ); // DOM converts the #3F3F3F to rgb(63, 63, 63)
  });
  test("When that popbutton is mounted, Then it loads the button background, button label, visible, focus color, greyed color, hover color the values provided from the props as visible is true so focus color text is rendred, user hover the hover color is rendered", async () => {
    const propsData = {
      popup_btn_names: ["Save ID"],
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
    const target_popdialog_btn = wrapper.find(".span__popdialog-btn");
    await target_popdialog_btn.trigger("mouseenter");
    expect(target_popdialog_btn.attributes().style).toBe(
      "color: rgb(189, 73, 50); width: 500px; left: 0px;"
    );
    await target_popdialog_btn.trigger("mouseleave");
    expect(target_popdialog_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 500px; left: 0px;"
    );
  });
  test("When that popbutton is mounted, Then it loads the button background, with buttons label Cancel/Delete ID/Save ID is placed with equal width of 1/3 that of widget and shifted from left at rate of 0, 1/3 and 2/3", async () => {
    const propsData = {
      popup_btn_names: ["Cancel", "Delete ID", "Save ID"],
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
    const target_popdialog_btn = wrapper.findAll(".span__popdialog-btn");
    const cancel_btn = target_popdialog_btn.at(0);
    expect(cancel_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 166.66666666666666px; left: 0px;"
    );
    const delete_btn = target_popdialog_btn.at(1);
    expect(delete_btn.attributes().style).toBe(
      "color: rgb(255, 255, 255); width: 166.66666666666666px; left: 166.66666666666666px;"
    );
    const save_btn = target_popdialog_btn.at(2);
    expect(save_btn.attributes().style).toBe(
      "color: rgb(63, 63, 63); width: 166.66666666666666px; left: 333.3333333333333px;"
    );
  });
  test("When the PopButton is mounted, Then it loads the horizontal top-line divider proportion, to the defined width of 490px with padding from edges of the widget length", async () => {
    const propsData = {
      popup_btn_names: ["Save ID"],
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
});
