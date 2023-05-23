import { mount } from "@vue/test-utils";
import YAxisControlsSettings from "@/components/playback/controls/YAxisControlsSettings.vue";
import { shallowMount } from "@vue/test-utils";
import { YAxisControlsSettings as dist_YAxisControlsSettings } from "@/dist/mantarray.common";
import Vue from "vue";
import Vuex from "vuex";

import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

describe("YAxisControlsSettings.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting YAxisControlsSettings from the build dist file, Then it loads successfully  `Y-Axis Display Mode` as defined title text is rendered", () => {
    wrapper = mount(dist_YAxisControlsSettings, {
      store,
      localVue,
    });
    const target_span = wrapper.find(".span__y-axis-control-settings-label");
    expect(target_span.text()).toStrictEqual("Y-Axis Display Mode");
  });
  test("When mounting YAxisControlsSettings from the component file, Then it loads successfully  `Y-Axis Display Mode` as defined title text is rendered", () => {
    wrapper = shallowMount(YAxisControlsSettings, {
      store,
      localVue,
    });
    const target_span = wrapper.find(".span__y-axis-control-settings-label");
    expect(target_span.text()).toStrictEqual("Y-Axis Display Mode");
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the user enters 'Maximum' value less than zero ( < 0), Then the invalid text should indicate invalid message 'cannot be negative'", async () => {
    wrapper = mount(YAxisControlsSettings, {
      store,
      localVue,
    });
    const target_max_input = wrapper.find("#input-widget-field-max");
    const target_feedback_input = wrapper.find("#input-widget-feedback-max");
    target_max_input.setValue("-1");
    await Vue.nextTick();
    expect(target_feedback_input.text()).toStrictEqual("cannot be negative");
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the user enters 'Minimum' value - (negative), Then the invalid text should indicate  message 'invalid'", async () => {
    wrapper = mount(YAxisControlsSettings, {
      store,
      localVue,
    });
    const target_min_input = wrapper.find("#input-widget-field-min");
    const target_feedback_input = wrapper.find("#input-widget-feedback-min");
    target_min_input.setValue("-");
    await Vue.nextTick();
    expect(target_feedback_input.text()).toStrictEqual("invalid");
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the user enters 'Minimum' value  (empty), Then the invalid text should indicate  message 'invalid'", async () => {
    wrapper = mount(YAxisControlsSettings, {
      store,
      localVue,
    });
    const target_min_input = wrapper.find("#input-widget-field-min");
    const target_feedback_input = wrapper.find("#input-widget-feedback-min");
    target_min_input.setValue("");
    await Vue.nextTick();
    expect(target_feedback_input.text()).toStrictEqual("invalid");
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the user enters 'Minimum' value less than zero ( < 0), Then the invalid text should indicate invalid message 'cannot be negative'", async () => {
    wrapper = mount(YAxisControlsSettings, {
      store,
      localVue,
    });
    const target_min_input = wrapper.find("#input-widget-field-min");
    const target_feedback_input = wrapper.find("#input-widget-feedback-min");
    target_min_input.setValue("-");
    await Vue.nextTick();
    expect(target_feedback_input.text()).toStrictEqual("invalid");
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the user enters 'Maximum' value less than zero ( > 1000000), Then the invalid text should indicate invalid message 'maximum above 1000000'", async () => {
    wrapper = mount(YAxisControlsSettings, {
      store,
      localVue,
    });
    const target_max_input = wrapper.find("#input-widget-field-max");
    const target_feedback_input = wrapper.find("#input-widget-feedback-max");
    target_max_input.setValue("1000001");
    await Vue.nextTick();
    expect(target_feedback_input.text()).toStrictEqual("must be <= 100000");
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the user enters 'Maximum' value - (negative), Then the invalid text should indicate  message 'invalid'", async () => {
    wrapper = mount(YAxisControlsSettings, {
      store,
      localVue,
    });
    const target_max_input = wrapper.find("#input-widget-field-max");
    const target_feedback_input = wrapper.find("#input-widget-feedback-max");
    target_max_input.setValue("-");
    await Vue.nextTick();
    expect(target_feedback_input.text()).toStrictEqual("invalid");
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the user enters 'Maximum' value  (empty), Then the invalid text should indicate  message 'invalid'", async () => {
    wrapper = mount(YAxisControlsSettings, {
      store,
      localVue,
    });
    const target_max_input = wrapper.find("#input-widget-field-max");
    const target_feedback_input = wrapper.find("#input-widget-feedback-max");
    target_max_input.setValue("");
    await Vue.nextTick();
    expect(target_feedback_input.text()).toStrictEqual("invalid");
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the user enters 'Maximum' value less than 'Minimum', Then the invalid text should indicate invalid message 'min greater than max'", async () => {
    wrapper = mount(YAxisControlsSettings, {
      store,
      localVue,
    });
    const target_max_input = wrapper.find("#input-widget-field-max");
    const target_feedback_max_input = wrapper.find("#input-widget-feedback-max");
    target_max_input.setValue("500");
    const target_min_input = wrapper.find("#input-widget-field-min");
    const target_feedback_min_input = wrapper.find("#input-widget-feedback-min");
    target_min_input.setValue("501");
    await Vue.nextTick();
    expect(target_feedback_max_input.text()).toStrictEqual("min greater than max");
    expect(target_feedback_min_input.text()).toStrictEqual("min greater than max");
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the user enters 'Maximum' value less than 'Minimum', Then the invalid text should indicate invalid message 'cannot be negative'", async () => {
    wrapper = mount(YAxisControlsSettings, {
      store,
      localVue,
    });
    const target_max_input = wrapper.find("#input-widget-field-max");
    const target_feedback_max_input = wrapper.find("#input-widget-feedback-max");
    target_max_input.setValue("500");
    const target_min_input = wrapper.find("#input-widget-field-min");
    const target_feedback_min_input = wrapper.find("#input-widget-feedback-min");
    target_min_input.setValue("-201");
    await Vue.nextTick();
    expect(target_feedback_max_input.text()).toStrictEqual("");
    expect(target_feedback_min_input.text()).toStrictEqual("must be >= -200");
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the user enters 'Maximum' value less than 'Minimum', Then the invalid text should be empty", async () => {
    wrapper = mount(YAxisControlsSettings, {
      store,
      localVue,
    });
    const target_max_input = wrapper.find("#input-widget-field-max");
    const target_feedback_max_input = wrapper.find("#input-widget-feedback-max");
    target_max_input.setValue("0");
    const target_min_input = wrapper.find("#input-widget-field-min");
    const target_feedback_min_input = wrapper.find("#input-widget-feedback-min");
    target_min_input.setValue("1");
    await Vue.nextTick();

    target_max_input.setValue("2");
    target_min_input.setValue("1");
    await Vue.nextTick();
    expect(target_feedback_max_input.text()).toStrictEqual("");
    expect(target_feedback_min_input.text()).toStrictEqual("");
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the user enters valid 'Maximum' and 'Minimum' range and click the button 'Apply', Then an event 'y-axis-new-range' with (y_max,y_min) is sent to parent component", async () => {
    wrapper = mount(YAxisControlsSettings, {
      store,
      localVue,
    });
    const target_max_input = wrapper.find("#input-widget-field-max");
    const target_min_input = wrapper.find("#input-widget-field-min");
    target_max_input.setValue("1.2");
    target_min_input.setValue("1.1");
    await Vue.nextTick();
    const target_button_label_btn = wrapper.findAll(".span__button-label");
    const apply_btn = target_button_label_btn.at(0);
    await apply_btn.trigger("click");
    await Vue.nextTick();
    const apply_id_btn = wrapper.emitted("y-axis-new-range");
    expect(apply_id_btn).toHaveLength(1);
    expect(apply_id_btn[0]).toStrictEqual([
      {
        y_max: 1.2,
        y_min: 1.1,
      },
    ]);
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the click the button 'Cancel', Then an event 'y-axis-no-change' with no data is is sent to parent component", async () => {
    wrapper = mount(YAxisControlsSettings, {
      store,
      localVue,
    });

    const target_button_label_btn = wrapper.findAll(".span__button-label");
    const cancel_btn = target_button_label_btn.at(1);
    await cancel_btn.trigger("click");
    await Vue.nextTick();
    const cancel_id_btn = wrapper.emitted("y-axis-no-change");
    expect(cancel_id_btn).toHaveLength(1);
    expect(cancel_id_btn[0]).toStrictEqual([]);
  });
});
