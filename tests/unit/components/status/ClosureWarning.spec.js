import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/status/ClosureWarning.vue";
import { ClosureWarning as DistComponentToTest } from "@/dist/mantarray.common";

import { createLocalVue } from "@vue/test-utils";
let wrapper = null;
const localVue = createLocalVue();

describe("ClosureWarning.vue", () => {
  beforeEach(async () => {
    wrapper = mount(ComponentToTest, {
      localVue,
    });
  });
  afterEach(() => wrapper.destroy());
  test("When mounting ClosureWarning from the build dist file, Then it loads successfully and the `Warning!` defined title text is rendered", () => {
    wrapper = mount(DistComponentToTest, {
      localVue,
    });
    const target_span = wrapper.find(".span__closure-warning-label");
    expect(target_span.text()).toStrictEqual("Warning!");
  });
  test("Given that ClosureWarning is active, When the lifecyle hook mounted is created, Then it will display a confirmation message that operations are still in progress", async () => {
    wrapper = mount(ComponentToTest, {
      localVue,
    });
    const target_message_span = wrapper.find(".span__closure-warning-message");
    const target_message_span_p = target_message_span.findAll("p");
    expect(target_message_span_p.at(0).text()).toStrictEqual("Operations are still in progress.");
    expect(target_message_span_p.at(1)).toMatchInlineSnapshot(`
      <p>
        Are you sure you want to exit?
      </p>
    `);
  });
  test("Given that ClosureWarning is mounted, When the ClosureWarning is visible, Then click on 'Yes' or 'Cancel' results in an event 'handle_warning_closure' to be emitted", async () => {
    wrapper = mount(ComponentToTest, {
      localVue,
    });

    const cancel_yes_btn = wrapper.findAll(".span__button_label");
    await cancel_yes_btn.at(1).trigger("click");
    const yes_btn_events = wrapper.emitted("handle_confirmation");
    expect(yes_btn_events[0]).toStrictEqual([1]);

    await cancel_yes_btn.at(0).trigger("click");
    expect(yes_btn_events[1]).toStrictEqual([0]);
  });
});
