import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/heatmap/HeatMap.vue";
import { HeatMap as DistComponentToTest } from "@/dist/mantarray.common";

import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();

describe("HeatMap.vue", () => {
  afterEach(() => wrapper.destroy());
  test("When mounting from the built dist file, Then it loads successfully and assert all the elements of the HeatMap Layout is rendered", () => {
    const propsData = {};
    wrapper = mount(DistComponentToTest, {
      propsData,
      localVue,
    });
    wrapper
      .find(".span__heatmap-layout-heatmap-settings-label")
      .isVisible(true);
    const twitch_label = wrapper.find(
      ".span__heatmap-layout-heatmap-settings-label"
    );
    expect(twitch_label.text()).toStrictEqual("Heatmap Settings");
  });
  test("When mounting from the component, Then it loads successfully and assert all the elements of the HeatMap Layout is rendered", () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    wrapper
      .find(".span__heatmap-layout-heatmap-settings-label")
      .isVisible(true);
    const twitch_label = wrapper.find(
      ".span__heatmap-layout-heatmap-settings-label"
    );
    expect(twitch_label.text()).toStrictEqual("Heatmap Settings");
  });
  test("Given that the maximum value is valid, When the value of the maximum is 100, Then HeatmapBar maximum upper range is set to 100", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const maximum = "100";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find(".span__heatmap-scale-higher-value");
    expect(upper_value.text()).toStrictEqual("100 μN");
  });
  test("Given that the minimum value is valid, When the value of the minimum is 1, Then HeatmapBar minimum lower range is set to 1", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const maximum = "100";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find(".span__heatmap-scale-higher-value");
    expect(upper_value.text()).toStrictEqual("100 μN");
    const minimum = "1";
    wrapper.vm.on_update_minimum(minimum);
    await wrapper.vm.$nextTick(); // wait for update
    const lower_value = wrapper.find(".span__heatmap-scale-lower-value");
    expect(lower_value.text()).toStrictEqual("1 μN");
  });
  test("Given that the maximum value is valid, When the value of the maximum is -1, Then HeatmapBar maximum upper range is set to 0", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const maximum = "-1";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find(".span__heatmap-scale-higher-value");
    expect(upper_value.text()).toStrictEqual("0 μN");
  });
  test("Given that the minimum value is valid, When the value of the minimum is -1, Then HeatmapBar minimum lower range is set to 0", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const minimum = "-1";
    wrapper.vm.on_update_minimum(minimum);
    await wrapper.vm.$nextTick(); // wait for update
    const lower_value = wrapper.find(".span__heatmap-scale-lower-value");
    expect(lower_value.text()).toStrictEqual("0 μN");
  });
  test("Given that the maximum value is empty, When the value of the maximum is '', Then HeatmapBar maximum upper range is set to 0", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const maximum = "";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find(".span__heatmap-scale-higher-value");
    expect(upper_value.text()).toStrictEqual("0 μN");
  });
  test("Given that the minimum value is valid, When the value of the minimum is '', Then HeatmapBar minimum lower range is set to 0", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const minimum = "";
    wrapper.vm.on_update_minimum(minimum);
    await wrapper.vm.$nextTick(); // wait for update
    const lower_value = wrapper.find(".span__heatmap-scale-lower-value");
    expect(lower_value.text()).toStrictEqual("0 μN");
  });
  test("Given that the maximum value is more than 1000, When the value of the maximum is 1001, Then HeatmapBar maximum upper range is set to 0", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const maximum = "1001";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find(".span__heatmap-scale-higher-value");
    expect(upper_value.text()).toStrictEqual("0 μN");
  });
  test("Given that the maximum is less than minimum, When the value of maximum is 100 and minimum is 200, Then HeatmapBar maximum is set to 100 and minimum range is set to 0", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const maximum = "100";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find(".span__heatmap-scale-higher-value");
    expect(upper_value.text()).toStrictEqual("100 μN");
    const minimum = "200";
    wrapper.vm.on_update_minimum(minimum);
    await wrapper.vm.$nextTick(); // wait for update
    const lower_value = wrapper.find(".span__heatmap-scale-lower-value");
    expect(lower_value.text()).toStrictEqual("0 μN");
  });
  test("Given that the maximum is set after minimum, When the value of the maximum is set 100 after minimum is set 200, Then HeatmapBar minimum is set to 200 and maximum is set to old value 300", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    const maximum = "300";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find(".span__heatmap-scale-higher-value");
    expect(upper_value.text()).toStrictEqual("300 μN");

    const minimum = "200";
    wrapper.vm.on_update_minimum(minimum);
    await wrapper.vm.$nextTick(); // wait for update
    const lower_value = wrapper.find(".span__heatmap-scale-lower-value");
    expect(lower_value.text()).toStrictEqual("200 μN");

    const maximum_rentry = "100";
    wrapper.vm.on_update_maximum(maximum_rentry);
    await wrapper.vm.$nextTick(); // wait for update
    expect(upper_value.text()).toStrictEqual("300 μN");
  });
  test("Given that a valid option is set for DropDown option, When the user selects the option of 'Twitch Force', Then verify that the Title of Heatmap is updated with 'Twitch Force'", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    wrapper.vm.entrykey = "Twitch Force";
    await wrapper.vm.$nextTick(); // wait for update
    const heatmap_title = wrapper.find(
      ".div__heatmap-layout-twitch-force-label"
    );
    expect(heatmap_title.text()).toStrictEqual("Twitch Force (μN)");
  });
  test("Given that option is set to empty, When the user selects the option as '', Then verify that the Title of Heatmap is updated with ''", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      localVue,
    });
    wrapper.vm.entrykey = "Twitch Force";
    await wrapper.vm.$nextTick(); // wait for update
    const heatmap_title = wrapper.find(
      ".div__heatmap-layout-twitch-force-label"
    );
    expect(heatmap_title.text()).toStrictEqual("Twitch Force (μN)");
    wrapper.vm.entrykey = "";
    await wrapper.vm.$nextTick(); // wait for update
    expect(heatmap_title.text()).toStrictEqual("(μN)");
  });
});
