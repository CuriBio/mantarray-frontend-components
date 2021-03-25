import { mount } from "@vue/test-utils";
import YAxisControlsSettings from "@/components/playback/controls/YAxisControlsSettings.vue";
import { shallowMount } from "@vue/test-utils";
import { YAxisControlsSettings as dist_YAxisControlsSettings } from "@/dist/mantarray.common";
import Vue from "vue";

import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();

describe("YAxisControlsSettings.vue", () => {
  test("When mounting YAxisControlsSettings from the build dist file, Then it loads successfully  `Y-Axis Display Mode` as defined title text is rendered", () => {
    wrapper = mount(dist_YAxisControlsSettings, {
      localVue,
    });
    const target_span = wrapper.find(".span__y-axis-control-settings-label");
    expect(target_span.text()).toStrictEqual("Y-Axis Display Mode");
  });
  test("When mounting YAxisControlsSettings from the component file, Then it loads successfully  `Y-Axis Display Mode` as defined title text is rendered", () => {
    wrapper = shallowMount(YAxisControlsSettings, {
      localVue,
    });
    const target_span = wrapper.find(".span__y-axis-control-settings-label");
    expect(target_span.text()).toStrictEqual("Y-Axis Display Mode");
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the user enters 'Maximum' value less than zero ( < 0), Then the invalid text should indicate invalid message 'cannot be negative'", async () => {
    wrapper = mount(YAxisControlsSettings, {
      localVue,
    });
    const target_max_input = wrapper.find("#input-widget-field-max");
    const target_feedback_input = wrapper.find("#input-widget-feedback-max");
    target_max_input.setValue("-1");
    await Vue.nextTick();
    expect(target_feedback_input.text()).toStrictEqual("cannot be negative");
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the user enters 'Minimum' value less than zero ( < 0), Then the invalid text should indicate invalid message 'cannot be negative'", async () => {
    wrapper = mount(YAxisControlsSettings, {
      localVue,
    });
    const target_min_input = wrapper.find("#input-widget-field-min");
    const target_feedback_input = wrapper.find("#input-widget-feedback-min");
    target_min_input.setValue("-1");
    await Vue.nextTick();
    expect(target_feedback_input.text()).toStrictEqual("cannot be negative");
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the user enters 'Maximum' value less than zero ( > 1000000), Then the invalid text should indicate invalid message 'maximum above 1000000'", async () => {
    wrapper = mount(YAxisControlsSettings, {
      localVue,
    });
    const target_max_input = wrapper.find("#input-widget-field-max");
    const target_feedback_input = wrapper.find("#input-widget-feedback-max");
    target_max_input.setValue("1000001");
    await Vue.nextTick();
    expect(target_feedback_input.text()).toStrictEqual("very large");
  });
  test("Given that the YAxisControlsSettings is mounted successfully, When the user enters 'Maximum' value less than 'Minimum', Then the invalid text should indicate invalid message 'min greater than max'", async () => {
    wrapper = mount(YAxisControlsSettings, {
      localVue,
    });
    const target_max_input = wrapper.find("#input-widget-field-max");
    const target_feedback_max_input = wrapper.find(
      "#input-widget-feedback-max"
    );
    target_max_input.setValue("500");
    const target_min_input = wrapper.find("#input-widget-field-min");
    const target_feedback_min_input = wrapper.find(
      "#input-widget-feedback-min"
    );
    target_min_input.setValue("501");
    await Vue.nextTick();
    expect(target_feedback_max_input.text()).toStrictEqual(
      "min greater than max"
    );
    expect(target_feedback_min_input.text()).toStrictEqual(
      "min greater than max"
    );
  });
});
