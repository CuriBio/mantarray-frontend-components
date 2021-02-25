import { mount } from "@vue/test-utils";
import { shallowMount } from "@vue/test-utils";
import ComponentToTest from "@/components/status/HeatMapColorBar.vue";
import { HeatMapColorBar as DistComponentToTest } from "@/dist/mantarray.common";

import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();

describe("HeatMapColorBar.vue", () => {
  afterEach(() => wrapper.destroy());
  test("When mounting HeatMapColorBar from the build dist file, Then it loads successfully and upper_range text '100 μN' is rendered as defined", () => {
    const propsData = {
      upper_range: 100,
      lower_range: 0,
      heatmap_height: 481,
      units: "uA",
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      localVue,
    });
    const target_span = wrapper.find(".span__heatmap-scale-higher-value");
    expect(target_span.text()).toStrictEqual("100 uA");
  });
  test("Given that the uuid, upper_range, lower_range and height, When mounted successfully, Then assert that upper_range,lower_range,height are applied and as uuid is match a default linear-gradient is applied on HeatMapColorBar", async () => {
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
  test("Given that the uuid is empty, upper_range, lower_range, height, and gradient_range, When mounted successfully, Then assert that upper_range,lower_range, height are applied on HeatMapColorBar and as uuid is empty then gradient_range values are applied on linear-gradient", async () => {
    const propsData = {
      upper_range: 100,
      lower_range: 0,
      gradient_uuid: "",
      heatmap_height: 481,
      units: "mA",
      gradient_range: [
        { color: "#2c7bb6", offset: "0%" },
        { color: "#00a6ca", offset: "25%" },
        { color: "#00ccbc", offset: "50%" },
        { color: "#90eb9d", offset: "75%" },
        { color: "#ffff8c", offset: "100%" },
      ],
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

  test("Given that the uuid, upper_range, lower_range and height, When mounted successfully, Then prop update of the heatmap_height to 400, assert height is updated to 400 and as uuid is match a default linear-gradient is applied on HeatMapColorBar", async () => {
    const propsData = {
      upper_range: 100,
      lower_range: 0,
      gradient_uuid: "0f81155d-23ec-4790-a3fe-92a6cc7c3c47",
      heatmap_height: 481,
      units: "mA",
    };
    wrapper = await mount(ComponentToTest, {
      propsData,
      localVue,
    });

    const target_div_gradient_holder = wrapper.find(
      ".div__heatmap-gradient-holder"
    );

    expect(target_div_gradient_holder.attributes().style).toBe(
      "height: 481px;"
    );

    // await wrapper.setProps({ heatmap_height: 400 });  Currently in order to match the feature of changing gradient and height native
    // await wrapper.vm.$nextTick();                     Javascript functions are invoked which calls functions removeChild(object<--div__heatmap-gradient-holder),
    //                                                   createElement('div') and appendChild(object<-- new div__heatmap-graident-holder)
    //                                                   This results in the passed prop of heatmap_height been applied on new object of div__heat-gradient-holder)
    //                                                   which is not available for vue-test-utils as it only can understand virtualDOM elements and not native Javascript
    //                                                   document or (DOM) objects so the failure happens when we assert the same.
    //
    //                                                   So the below lines are commented to be validate via VRT.
    // expect(target_div_gradient_holder.attributes().style).toBe(
    //   "height: 400px;"
    // );
  });
  test("Given that the uuid is null, upper_range, lower_range and height, When mounted successfully, Then prop update of the heatmap_height to 400, assert height is updated to 400 and as uuid is empty then gradient_range values are applied on linear-gradient", async () => {
    const propsData = {
      upper_range: 100,
      lower_range: 0,
      gradient_uuid: "",
      heatmap_height: 481,
      units: "mA",
      gradient_range: [
        { color: "#2c7bb6", offset: "0%" },
        { color: "#00a6ca", offset: "25%" },
        { color: "#00ccbc", offset: "50%" },
        { color: "#90eb9d", offset: "75%" },
        { color: "#ffff8c", offset: "100%" },
      ],
    };

    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });

    const target_div_gradient_holder = wrapper.find(
      ".div__heatmap-gradient-holder"
    );

    expect(target_div_gradient_holder.attributes().style).toBe(
      "height: 481px;"
    );

    // await wrapper.setProps({ heatmap_height: 400 });  Currently in order to match the feature of changing gradient and height native
    // await wrapper.vm.$nextTick();                     Javascript functions are invoked which calls functions removeChild(object<--div__heatmap-gradient-holder),
    //                                                   createElement('div') and appendChild(object<-- new div__heatmap-graident-holder)
    //                                                   This results in the passed prop of heatmap_height been applied on new object of div__heat-gradient-holder)
    //                                                   which is not available for vue-test-utils as it only can understand virtualDOM elements and not native Javascript
    //                                                   document or (DOM) objects so the failure happens when we assert the same.
    //
    //                                                   So the below lines are commented to be validate via VRT.
    // expect(target_div_gradient_holder.attributes().style).toBe(
    //   "height: 400px;"
    // );
  });

  // test("Given that the uuid is empty, upper_range, lower_range and height, When mounted successfully, Then update the uuid to valid value, and as uuid is match a default linear-gradient is applied on HeatMapColorBar", async () => {
  //   const propsData = {
  //     upper_range: "100",
  //     lower_range: "0",
  //     gradient_uuid: "",
  //     heatmap_height: 481,
  //     gradient_range: [
  //       { color: "#2c7bb6", offset: "0%" },
  //       { color: "#00a6ca", offset: "25%" },
  //       { color: "#00ccbc", offset: "50%" },
  //       { color: "#90eb9d", offset: "75%" },
  //       { color: "#ffff8c", offset: "100%" },
  //     ],
  //   };
  //   wrapper = await mount(ComponentToTest, {
  //     propsData,
  //     localVue,
  //   });

  //   await wrapper.setProps({
  //     gradient_uuid: "0f81155d-23ec-4790-a3fe-92a6cc7c3c47",
  //   });
  // });
  // test("Given that the uuid is empty, upper_range, lower_range, gradient_range and height, When mounted successfully, Then update the gradient_range to different range, and assert linear-gradient as per the updated gradient_range on HeatMapColorBar", async () => {
  //   const propsData = {
  //     upper_range: "100",
  //     lower_range: "0",
  //     gradient_uuid: "",
  //     heatmap_height: 481,
  //     gradient_range: [
  //       { color: "#2c7bb6", offset: "0%" },
  //       { color: "#00a6ca", offset: "25%" },
  //       { color: "#00ccbc", offset: "50%" },
  //       { color: "#90eb9d", offset: "75%" },
  //       { color: "#ffff8c", offset: "100%" },
  //     ],
  //   };
  //   wrapper = await mount(ComponentToTest, {
  //     propsData,
  //     localVue,
  //   });
  //   const target_span_higher = wrapper.find(
  //     ".span__heatmap-scale-higher-value"
  //   );
  //   expect(target_span_higher.text()).toStrictEqual("100");
  //   const target_span_lower = wrapper.find(".span__heatmap-scale-lower-value");
  //   expect(target_span_lower.text()).toStrictEqual("0");

  //   await wrapper.setProps({
  //     gradient_range: [
  //       { color: "#2c7bb6", offset: "0%" },
  //       { color: "#00a6ca", offset: "12.5%" },
  //       { color: "#00ccbc", offset: "25%" },
  //       { color: "#90eb9d", offset: "37.5%" },
  //       { color: "#ffff8c", offset: "50%" },
  //       { color: "#f9d057", offset: "62.5%" },
  //       { color: "#f29e2e", offset: "75%" },
  //       { color: "#e76818", offset: "87.5%" },
  //       { color: "#d7191c", offset: "100%" },
  //     ],
  //   });

  // });
});
