import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/basic_widgets/CheckBoxWidget.vue";
import { CheckBoxWidget as DistComponentToTest } from "@/dist/mantarray.common";

import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();

describe("CheckBoxWidget.vue", () => {
  afterEach(() => wrapper.destroy());
  test("When mounting from the built dist file, Then it loads successfully and the props defined checkbox button text is rendered", () => {
    const propsData = {
      checkbox_options: [
        { text: "Ascorbic  Acid", value: "Ascorbic Acid" },
        { text: "B27", value: "b27" },
        { text: "B27 (-insulin)", value: "B27 (-insulin)", disabled: true },
        { text: "Lab-Exp-1", value: "Lab-Exp-1" },
      ],
    };
    wrapper = mount(DistComponentToTest, {
      propsData,
      localVue,
    });
    const target_span = wrapper.findAll(".custom-control-label > span");

    expect(target_span.at(0).text()).toStrictEqual("Ascorbic  Acid");
    expect(target_span.at(1).text()).toStrictEqual("B27");
    expect(target_span.at(2).text()).toStrictEqual("B27 (-insulin)");
    expect(target_span.at(3).text()).toStrictEqual("Lab-Exp-1");
  });
  test("When mounting from the component, Then it loads successfully and the props defined checkbox button  and the text is <empty>", () => {
    const propsData = {
      checkbox_options: [
        { text: "", value: "Ascorbic Acid" },
        { text: "", value: "B27" },
        { text: "", value: "B27 (-insulin)", disabled: true },
        { text: "", value: "Lab-Exp-1" },
      ],
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const target_span = wrapper.findAll(".custom-control-label > span");

    expect(target_span.at(0).text()).toStrictEqual("");
    expect(target_span.at(1).text()).toStrictEqual("");
    expect(target_span.at(2).text()).toStrictEqual("");
    expect(target_span.at(3).text()).toStrictEqual("");
  });
  test("Given that the checkbox are rendered in a sequence, When a click-select of checkbox occurs, Then an event 'checkbox-selected' with the value of the 'checkbox text' is emitted", async () => {
    const propsData = {
      checkbox_options: [
        { text: "Ascorbic  Acid", value: "Ascorbic Acid" },
        { text: "B27", value: "B27" },
        { text: "B27 (-insulin)", value: "B27 (-insulin)", disabled: true },
        { text: "Lab-Exp-1", value: "Lab-Exp-1" },
      ],
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const target_checkbox_btn = wrapper.findAll('input[type="checkbox"]');
    target_checkbox_btn.at(1).setChecked(true);

    await target_checkbox_btn.at(1).trigger("change");
    // manually force Vue to update
    const parent_id_events = wrapper.emitted("checkbox-selected");
    expect(parent_id_events).toHaveLength(2);
    expect(parent_id_events).toStrictEqual([[["B27"]], [["B27"]]]);
  });

  test("Given that the checkbox are rendered with <empty text> in a sequence, When a click-select of checkbox occurs multiple times, Then an event 'checkbox-selected' with the value of the 'checkbox text' is emitted", async () => {
    const propsData = {
      checkbox_options: [
        { text: "", value: "Ascorbic Acid" },
        { text: "", value: "B27" },
        { text: "", value: "B27 (-insulin)" },
        { text: "", value: "Lab-Exp-1" },
      ],
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const target_checkbox_btn = wrapper.findAll('input[type="checkbox"]');
    target_checkbox_btn.at(1).setChecked(true);

    await target_checkbox_btn.at(1).trigger("change");

    target_checkbox_btn.at(3).setChecked(true);

    await target_checkbox_btn.at(3).trigger("change");
    // manually force Vue to update
    const parent_id_events = wrapper.emitted("checkbox-selected");
    expect(parent_id_events).toHaveLength(4);
    expect(parent_id_events).toStrictEqual([
      [["B27"]],
      [["B27"]],
      [["B27", "Lab-Exp-1"]],
      [["B27", "Lab-Exp-1"]],
    ]);
  });
});
