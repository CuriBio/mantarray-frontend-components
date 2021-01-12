import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/playback/controls/player/BarcodeEditDialog.vue";
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
  //   test("Given that BarcodeEditDialog is active, When the lifecyle hook mounted is created, Then dialog message and option to switch over to manual mode for platebarcode is displayed", async () => {
  //   wrapper = mount(ComponentToTest, {
  //       store,
  //       localVue,
  //     });

  //   });
});
