import { mount } from "@vue/test-utils";
import { shallowMount } from "@vue/test-utils";
import ComponentToTest from "@/components/status/HeatMapColorBar.vue";
import { HeatMapColorBar as DistComponentToTest } from "@/dist/mantarray.common";

import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();

describe("HeatMapColorBar.vue", () => {
  afterEach(() => wrapper.destroy());
  test("When mounting HeatMapColorBar from the built dist file, Then it loads successfully and upper_range text '100 μN' is rendered as defined", () => {
    const propsData = {
      upper_range: 100,
      lower_range: 0,
      heatmap_height: 481,
      units: "μN",
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      localVue,
    });
    const target_span = wrapper.find(".span__heatmap-scale-higher-value");
    expect(target_span.text()).toStrictEqual("100 μN");
  });
  test("Given that the uuid, upper_range, lower_range and height props are provided, When mounted successfully, Then assert that upper_range,lower_range,height are applied on HeatMapColorBar", async () => {
    const propsData = {
      upper_range: 100,
      lower_range: 0,
      gradient_uuid: "0f81155d-23ec-4790-a3fe-92a6cc7c3c47",
      heatmap_height: 481,
      units: "mA",
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const target_span_higher = wrapper.find(
      ".span__heatmap-scale-higher-value"
    );
    expect(target_span_higher.text()).toStrictEqual("100 mA");
    const target_span_lower = wrapper.find(".span__heatmap-scale-lower-value");
    expect(target_span_lower.text()).toStrictEqual("0 mA");

    const target_div_gradient_holder = wrapper.find(
      ".div__heatmap-gradient-holder"
    );
    expect(target_div_gradient_holder.attributes().style).toBe(
      "height: 481px;"
    );
  });
});
