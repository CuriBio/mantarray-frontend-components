import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/status/BarcodeEditDialog.vue";
import { BarcodeEditDialog as DistComponentToTest } from "@/dist/mantarray.common";

import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();

describe("BarcodeEditDialog.vue", () => {
  beforeEach(async () => {
    const propsData = {
      dialogdata: null,
      dataindex: 0,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
  });
  afterEach(() => wrapper.destroy());
  test("When mounting BarcodeEditDialog from the build dist file, Then it loads successfully and the `Warning!` defined title text is rendered", () => {
    wrapper = mount(DistComponentToTest, {
      localVue,
    });
    const target_span = wrapper.find(".span__barcode-edit-dialog-label");
    expect(target_span.text()).toStrictEqual("Warning!");
  });
  test("Given that BarcodeEditDialog is active, When the lifecyle hook mounted is created, Then dialog message and option to switch over to manual mode for plate_barcode is displayed", async () => {
    wrapper = mount(ComponentToTest, {
      localVue,
    });
    const target_message_span = wrapper.find(".span__barcode-edit-dialog-message");
    const target_message_span_p = target_message_span.findAll("p");
    expect(target_message_span_p.at(0).text()).toStrictEqual("Do you want to enable manual barcode editing?");
    expect(target_message_span_p.at(1)).toMatchInlineSnapshot(`
      <p>
        Once enabled, all barcodes must be entered manually. This should only be done if the barcode scanner
        is malfunctioning. Scanning cannot be re-enabled until software is restarted.
      </p>
    `);
  });
  test("Given that BarcodeEditDialog is mounted, When the BarcodeEditDialog is visible, Then click on 'Yes' results in correct event being emitted", async () => {
    wrapper = mount(ComponentToTest, {
      localVue,
    });

    const buttons = wrapper.findAll(".span__button_label");
    await buttons.at(1).trigger("click");
    await wrapper.vm.$nextTick();
    const button_events = wrapper.emitted("manual-mode-choice");
    expect(button_events).toHaveLength(1);
    expect(button_events[0]).toStrictEqual([true]);
  });
  test("Given that BarcodeEditDialog is mounted, When the BarcodeEditDialog is visible, Then click on 'Cancel' results in correct event being emitted", async () => {
    wrapper = mount(ComponentToTest, {
      localVue,
    });

    const buttons = wrapper.findAll(".span__button_label");
    await buttons.at(0).trigger("click");
    await wrapper.vm.$nextTick();
    const button_events = wrapper.emitted("manual-mode-choice");
    expect(button_events).toHaveLength(1);
    expect(button_events[0]).toStrictEqual([false]);
  });
});
