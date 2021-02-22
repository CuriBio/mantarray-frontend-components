import { renderToString } from "@vue/server-test-utils";
import { mount } from "@vue/test-utils";
import { shallowMount } from "@vue/test-utils";
import ComponentToTest from "@/components/status/HeatMapColorBar.vue";
import { HeatMapColorBar as DistComponentToTest } from "@/dist/mantarray.common";

import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();

describe("HeatMapColorBar.vue", () => {
  // afterEach(() => wrapper.destroy());
  test("When mounting HeatMapColorBar from the build dist file, Then it loads successfully and higher_range text as defined rendered", () => {
    const propsData = {
      upper_range: "100",
    };
    wrapper = shallowMount(DistComponentToTest, {
      propsData,
      localVue,
    });
    const target_span = wrapper.find(".span__heatmap-scale-higher-value");
    expect(target_span.text()).toStrictEqual("100 μN");
  });
  test("Given that the uuid, upper_range, lower_range and height, When mounted successfully, Then assert the default linear-gradient,upper_range,lower_range and height are applied on HeatMapColorBar", async () => {
    const propsData = {
      upper_range: "100",
      lower_range: "0",
      gradient_uuid: "0f81155d-23ec-4790-a3fe-92a6cc7c3c47",
      heatmap_height: 481,
    };
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const target_span_higher = wrapper.find(
      ".span__heatmap-scale-higher-value"
    );
    expect(target_span_higher.text()).toStrictEqual("100 μN");
    const target_span_lower = wrapper.find(".span__heatmap-scale-lower-value");
    expect(target_span_lower.text()).toStrictEqual("0 μN");

    const target_div_gradient_holder = wrapper.find(
      ".div__heatmap-gradient-holder"
    );
    expect(target_div_gradient_holder.attributes().style).toBe(
      "height: 481px;"
    );

    const renderwrapper = await renderToString(ComponentToTest, {
      propsData,
      localVue,
    });
    expect(renderwrapper).toContain(
      '<div data-server-rendered="true"><div class="div__heatmap-gradient-holder" style="height:481px;background:linear-gradient(to top,  #2c7bb6 0%,#00a6ca 12.5%,#00ccbc 25%,#90eb9d 37.5%,#ffff8c 50%,#f9d057 62.5%,#f29e2e 75%,#e76818 87.5%,#d7191c 100%);"></div> <span class="span__heatmap-scale-higher-value"> 100 <wbr>μN</span> <span class="span__heatmap-scale-lower-value" style="top:465px;">0 <wbr>μN</span></div>'
    );
  });
  test("Given that the uuid is empty, upper_range, lower_range and height, When mounted successfully, Then assert the default linear-gradient,upper_range,lower_range and height are applied on HeatMapColorBar", async () => {
    const propsData = {
      upper_range: "100",
      lower_range: "0",
      gradient_uuid: "",
      heatmap_height: 481,
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
    expect(target_span_higher.text()).toStrictEqual("100 μN");
    const target_span_lower = wrapper.find(".span__heatmap-scale-lower-value");
    expect(target_span_lower.text()).toStrictEqual("0 μN");

    const target_div_gradient_holder = wrapper.find(
      ".div__heatmap-gradient-holder"
    );
    expect(target_div_gradient_holder.attributes().style).toBe(
      "height: 481px;"
    );

    const renderwrapper = await renderToString(ComponentToTest, {
      propsData,
      localVue,
    });
    expect(renderwrapper).toContain(
      '<div data-server-rendered="true"><div class="div__heatmap-gradient-holder" style="height:481px;background:linear-gradient(to top, #2c7bb6 0%,#00a6ca 25%,#00ccbc 50%,#90eb9d 75%,#ffff8c 100%);"></div> <span class="span__heatmap-scale-higher-value"> 100 <wbr>μN</span> <span class="span__heatmap-scale-lower-value" style="top:465px;">0 <wbr>μN</span></div>'
    );
  });

  test("Given that the uuid, upper_range, lower_range and height, When mounted successfully, Then update the heatmap_height to 400, assert the default linear-gradient,upper_range,lower_range and height applied on HeatMapColorBar, observe the height is updated to 400", async () => {
    const propsData = {
      upper_range: "100",
      lower_range: "0",
      gradient_uuid: "0f81155d-23ec-4790-a3fe-92a6cc7c3c47",
      heatmap_height: 481,
    };
    wrapper = await mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const target_span_higher = wrapper.find(
      ".span__heatmap-scale-higher-value"
    );
    expect(target_span_higher.text()).toStrictEqual("100 μN");
    const target_span_lower = wrapper.find(".span__heatmap-scale-lower-value");
    expect(target_span_lower.text()).toStrictEqual("0 μN");

    await wrapper.setProps({ heatmap_height: 400 });

    await wrapper.vm.$nextTick();

    const target_div_gradient_holder = wrapper.find(
      ".div__heatmap-gradient-holder"
    );
    expect(target_div_gradient_holder.attributes().style).toBe(
      "height: 400px;"
    );

    propsData.heatmap_height = 400;

    const renderwrapper = await renderToString(ComponentToTest, {
      propsData,
      localVue,
    });
    expect(renderwrapper).toContain(
      '<div data-server-rendered="true"><div class="div__heatmap-gradient-holder" style="height:400px;background:linear-gradient(to top,  #2c7bb6 0%,#00a6ca 12.5%,#00ccbc 25%,#90eb9d 37.5%,#ffff8c 50%,#f9d057 62.5%,#f29e2e 75%,#e76818 87.5%,#d7191c 100%);"></div> <span class="span__heatmap-scale-higher-value"> 100 <wbr>μN</span> <span class="span__heatmap-scale-lower-value" style="top:384px;">0 <wbr>μN</span></div>'
    );
  });
  test("Given that the uuid is null, upper_range, lower_range and height, When mounted successfully, Then assert the default linear-gradient,upper_range,lower_range and height are applied on HeatMapColorBar", async () => {
    const propsData = {
      upper_range: "100",
      lower_range: "0",
      gradient_uuid: "",
      heatmap_height: 481,
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
    expect(target_span_higher.text()).toStrictEqual("100 μN");
    const target_span_lower = wrapper.find(".span__heatmap-scale-lower-value");
    expect(target_span_lower.text()).toStrictEqual("0 μN");

    const target_div_gradient_holder = wrapper.find(
      ".div__heatmap-gradient-holder"
    );
    expect(target_div_gradient_holder.attributes().style).toBe(
      "height: 481px;"
    );

    await wrapper.setProps({ heatmap_height: 400 });

    await wrapper.vm.$nextTick();

    expect(target_div_gradient_holder.attributes().style).toBe(
      "height: 400px;"
    );

    propsData.heatmap_height = 400;

    const renderwrapper = await renderToString(ComponentToTest, {
      propsData,
      localVue,
    });

    expect(renderwrapper).toContain(
      '<div data-server-rendered="true"><div class="div__heatmap-gradient-holder" style="height:400px;background:linear-gradient(to top, #2c7bb6 0%,#00a6ca 25%,#00ccbc 50%,#90eb9d 75%,#ffff8c 100%);"></div> <span class="span__heatmap-scale-higher-value"> 100 <wbr>μN</span> <span class="span__heatmap-scale-lower-value" style="top:384px;">0 <wbr>μN</span></div>'
    );
  });

  test("Given that the uuid is empty, upper_range, lower_range and height, When mounted successfully, Then update the uuid to valid value, assert the default linear-gradient,upper_range,lower_range and height applied on HeatMapColorBar, observe that the linear_gradient is updated to provided value", async () => {
    const propsData = {
      upper_range: "100",
      lower_range: "0",
      gradient_uuid: "",
      heatmap_height: 481,
      gradient_range: [
        { color: "#2c7bb6", offset: "0%" },
        { color: "#00a6ca", offset: "25%" },
        { color: "#00ccbc", offset: "50%" },
        { color: "#90eb9d", offset: "75%" },
        { color: "#ffff8c", offset: "100%" },
      ],
    };
    wrapper = await mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const target_span_higher = wrapper.find(
      ".span__heatmap-scale-higher-value"
    );
    expect(target_span_higher.text()).toStrictEqual("100 μN");
    const target_span_lower = wrapper.find(".span__heatmap-scale-lower-value");
    expect(target_span_lower.text()).toStrictEqual("0 μN");

    await wrapper.setProps({
      gradient_uuid: "0f81155d-23ec-4790-a3fe-92a6cc7c3c47",
    });

    propsData.gradient_uuid = "0f81155d-23ec-4790-a3fe-92a6cc7c3c47";

    const renderwrapper = await renderToString(ComponentToTest, {
      propsData,
      localVue,
    });
    expect(renderwrapper).toContain(
      '<div data-server-rendered="true"><div class="div__heatmap-gradient-holder" style="height:481px;background:linear-gradient(to top,  #2c7bb6 0%,#00a6ca 12.5%,#00ccbc 25%,#90eb9d 37.5%,#ffff8c 50%,#f9d057 62.5%,#f29e2e 75%,#e76818 87.5%,#d7191c 100%);"></div> <span class="span__heatmap-scale-higher-value"> 100 <wbr>μN</span> <span class="span__heatmap-scale-lower-value" style="top:465px;">0 <wbr>μN</span></div>'
    );
  });
  test("Given that the uuid is empty, upper_range, lower_range, gradient_range and height, When mounted successfully, Then update the gradient_range to different range, assert the default linear-gradient,upper_range,lower_range and height applied on HeatMapColorBar, observe that the linear_gradient is updated to provided value", async () => {
    const propsData = {
      upper_range: "100",
      lower_range: "0",
      gradient_uuid: "",
      heatmap_height: 481,
      gradient_range: [
        { color: "#2c7bb6", offset: "0%" },
        { color: "#00a6ca", offset: "25%" },
        { color: "#00ccbc", offset: "50%" },
        { color: "#90eb9d", offset: "75%" },
        { color: "#ffff8c", offset: "100%" },
      ],
    };
    wrapper = await mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const target_span_higher = wrapper.find(
      ".span__heatmap-scale-higher-value"
    );
    expect(target_span_higher.text()).toStrictEqual("100 μN");
    const target_span_lower = wrapper.find(".span__heatmap-scale-lower-value");
    expect(target_span_lower.text()).toStrictEqual("0 μN");

    await wrapper.setProps({
      gradient_range: [
        { color: "#2c7bb6", offset: "0%" },
        { color: "#00a6ca", offset: "12.5%" },
        { color: "#00ccbc", offset: "25%" },
        { color: "#90eb9d", offset: "37.5%" },
        { color: "#ffff8c", offset: "50%" },
        { color: "#f9d057", offset: "62.5%" },
        { color: "#f29e2e", offset: "75%" },
        { color: "#e76818", offset: "87.5%" },
        { color: "#d7191c", offset: "100%" },
      ],
    });

    propsData.gradient_range = [
      { color: "#2c7bb6", offset: "0%" },
      { color: "#00a6ca", offset: "12.5%" },
      { color: "#00ccbc", offset: "25%" },
      { color: "#90eb9d", offset: "37.5%" },
      { color: "#ffff8c", offset: "50%" },
      { color: "#f9d057", offset: "62.5%" },
      { color: "#f29e2e", offset: "75%" },
      { color: "#e76818", offset: "87.5%" },
      { color: "#d7191c", offset: "100%" },
    ];
    const renderwrapper = await renderToString(ComponentToTest, {
      propsData,
      localVue,
    });
    expect(renderwrapper).toContain(
      '<div data-server-rendered="true"><div class="div__heatmap-gradient-holder" style="height:481px;background:linear-gradient(to top, #2c7bb6 0%,#00a6ca 12.5%,#00ccbc 25%,#90eb9d 37.5%,#ffff8c 50%,#f9d057 62.5%,#f29e2e 75%,#e76818 87.5%,#d7191c 100%);"></div> <span class="span__heatmap-scale-higher-value"> 100 <wbr>μN</span> <span class="span__heatmap-scale-lower-value" style="top:465px;">0 <wbr>μN</span></div>'
    );
  });
});
