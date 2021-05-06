import { mount } from "@vue/test-utils";
import ComponentToTest from "@/components/heatmap/HeatMap.vue";
import { HeatMap as DistComponentToTest } from "@/dist/mantarray.common";

import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);

let NuxtStore;
let store;

describe("HeatMap.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    const radio_button_list = ["Warm", "Cool", "Blue/Red", "Purple/Green"];
    const display_options = [
      "Twitch Force",
      "Twitch Period",
      "Twitch Frequency",
      "Twitch Width 80",
      "Contraction Velocity",
      "Relaxation Velocity",
    ];
    const display_min_max = [
      {
        min: 0,
        max: 50,
      },
      {
        min: 0,
        max: 100,
      },
      {
        min: 0,
        max: 200,
      },
      {
        min: 0,
        max: 400,
      },
      {
        min: 0,
        max: 800,
      },
      {
        min: 0,
        max: 1600,
      },
    ];
    const radio_button_gradient = [
      [
        { color: "#bd3532", offset: "0%" },
        { color: "#f9d78c", offset: "100%" },
      ],
      [
        { color: "#2c7bb6", offset: "0%" },
        { color: "#00ccbc", offset: "100%" },
      ],
      [
        { color: "#2c7bb6", offset: "0%" },
        { color: "#90eb9d", offset: "100%" },
      ],
      [
        { color: "#2c7bb6", offset: "0%" },
        { color: "#ffff8c", offset: "100%" },
      ],
    ];
    store.commit("heatmap/set_heatmap_options_array", radio_button_list);
    store.commit("heatmap/set_heatmap_display_array", display_options);
    store.commit("heatmap/set_heatmap_display_min_max", display_min_max);
    store.commit("heatmap/set_heatmap_options_gradient", radio_button_gradient);
  });

  afterEach(() => wrapper.destroy());

  test("When mounting from the built dist file, Then it loads successfully and assert all the elements of the HeatMap Layout is rendered", () => {
    const propsData = {};
    wrapper = mount(DistComponentToTest, {
      propsData,
      store,
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
      store,
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
      store,
      localVue,
    });
    const maximum = "100";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find("#input-widget-feedback-max");
    expect(upper_value.text()).toStrictEqual("");
  });
  test("Given that the minimum value is valid, When the value of the minimum is 1, Then HeatmapBar minimum lower range is set to 1", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const maximum = "100";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find("#input-widget-feedback-max");
    expect(upper_value.text()).toStrictEqual("");
    const minimum = "1";
    wrapper.vm.on_update_minimum(minimum);
    await wrapper.vm.$nextTick(); // wait for update
    const lower_value = wrapper.find("#input-widget-feedback-min");
    expect(lower_value.text()).toStrictEqual("");
  });
  test("Given that the maximum value is valid, When the value of the maximum is -1, Then HeatmapBar maximum upper range is set to 0", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const maximum = "-1";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find("#input-widget-feedback-max");
    expect(upper_value.text()).toStrictEqual("cannot be negative");
  });
  test("Given that the minimum value is valid, When the value of the minimum is -1, Then HeatmapBar minimum lower range is set to 0", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const maximum = "10"; // this allows us to create coverage
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find("#input-widget-feedback-max");
    expect(upper_value.text()).toStrictEqual("");

    const minimum = "-1";
    wrapper.vm.on_update_minimum(minimum);
    await wrapper.vm.$nextTick(); // wait for update
    const lower_value = wrapper.find("#input-widget-feedback-min");
    expect(lower_value.text()).toStrictEqual("cannot be negative");
  });
  test("Given that the maximum value is empty, When the value of the maximum is '', Then HeatmapBar maximum upper range is set to 0", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const maximum = "";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find("#input-widget-feedback-max");
    expect(upper_value.text()).toStrictEqual("invalid");
  });
  test("Given that the minimum value is valid, When the value of the minimum is '', Then HeatmapBar minimum lower range is set to 0", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const minimum = "";
    wrapper.vm.on_update_minimum(minimum);
    await wrapper.vm.$nextTick(); // wait for update
    const lower_value = wrapper.find("#input-widget-feedback-min");
    expect(lower_value.text()).toStrictEqual("invalid");
  });
  test("Given that the maximum value is more than 1000, When the value of the maximum is 1001, Then HeatmapBar maximum upper range is set to 0", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const maximum = "1001";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find("#input-widget-feedback-max");
    expect(upper_value.text()).toStrictEqual("larger than 1000");
  });
  test("Given that the minimum value is more than 1000, When the value of the minimum is 1001, Then HeatmapBar maximum upper range is set to 0", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const minimum = "1001";
    wrapper.vm.on_update_minimum(minimum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find("#input-widget-feedback-min");
    expect(upper_value.text()).toStrictEqual("larger than 1000");
  });
  test("Given that the maximum is less than minimum, When the value of maximum is 100 and minimum is 200, Then HeatmapBar maximum is set to 100 and minimum range is set to 0", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const maximum = "100";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find("#input-widget-feedback-max");
    expect(upper_value.text()).toStrictEqual("");
    const minimum = "200";
    wrapper.vm.on_update_minimum(minimum);
    await wrapper.vm.$nextTick(); // wait for update
    const lower_value = wrapper.find("#input-widget-feedback-min");
    expect(lower_value.text()).toStrictEqual("min is more than max");
  });
  test("Given that the maximum is set after minimum, When the value of the maximum is set 100 after minimum is set 200, Then HeatmapBar minimum is set to 200 and maximum is set to old value 300", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const maximum = "300";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find("#input-widget-feedback-max");
    expect(upper_value.text()).toStrictEqual("");

    const minimum = "200";
    wrapper.vm.on_update_minimum(minimum);
    await wrapper.vm.$nextTick(); // wait for update
    const lower_value = wrapper.find("#input-widget-feedback-min");
    expect(lower_value.text()).toStrictEqual("");

    const maximum_rentry = "100";
    wrapper.vm.on_update_maximum(maximum_rentry);
    await wrapper.vm.$nextTick(); // wait for update
    expect(upper_value.text()).toStrictEqual("min is more than max");
  });
  test("Given that the minimum/maximum value is invalid, When the value of the minimum is 100, Then HeatmapBar minimum lower range is set to 0", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const maximum = "100";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find("#input-widget-feedback-max");
    expect(upper_value.text()).toStrictEqual("");
    const minimum = "100";
    wrapper.vm.on_update_minimum(minimum);
    await wrapper.vm.$nextTick(); // wait for update
    const lower_value = wrapper.find("#input-widget-feedback-min");
    expect(lower_value.text()).toStrictEqual("min is equal to max");
  });
  test("Given that the maximum/minimum value is invalid, When the value of the maximum is 20, Then HeatmapBar upper range is set to 100", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    let maximum = "100";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find("#input-widget-feedback-max");
    expect(upper_value.text()).toStrictEqual("");
    const minimum = "20";
    wrapper.vm.on_update_minimum(minimum);
    await wrapper.vm.$nextTick(); // wait for update
    const lower_value = wrapper.find("#input-widget-feedback-min");
    expect(lower_value.text()).toStrictEqual("");
    maximum = "20";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_new_value = wrapper.find("#input-widget-feedback-max");
    expect(upper_new_value.text()).toStrictEqual("max is equal to min");
  });
  test("Given that the maximum/minimum value is invalid, When the value of the maximum is 10 and minimum is '', Then HeatmapBar upper range is set to 10 and invalid text is rendered", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const maximum = "10";
    wrapper.vm.on_update_maximum(maximum);
    await wrapper.vm.$nextTick(); // wait for update
    const upper_value = wrapper.find("#input-widget-feedback-max");
    expect(upper_value.text()).toStrictEqual("");
    const minimum = "";
    wrapper.vm.on_update_minimum(minimum);
    await wrapper.vm.$nextTick(); // wait for update
    const lower_value = wrapper.find("#input-widget-feedback-min");
    expect(lower_value.text()).toStrictEqual("invalid");
  });
  test("Given that a valid option is set for DropDown option, When the user selects the option of 'Twitch Force', Then verify that the Title of Heatmap is updated with 'Twitch Force'", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    wrapper.vm.entrykey = "Twitch Force";
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.vm.is_apply_set).toStrictEqual(true);
  });
  test("Given that option is set to empty, When the user selects the option as '', Then verify that the Title of Heatmap is updated with ''", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    wrapper.vm.entrykey = "Twitch Force";
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.vm.is_apply_set).toStrictEqual(true);
    wrapper.vm.entrykey = "";
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.vm.is_apply_set).toStrictEqual(false);
  });
  test("Given that Auto Scale is set, When the user select the checkbox of Auto Scale, Then verify that the display is set to 'Twitch Force'", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    wrapper.vm.auto_scale("Auto-Scale");
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.vm.is_apply_set).toStrictEqual(true);
    expect(wrapper.vm.entrykey).toStrictEqual("Twitch Force");
  });
  test("Given that Auto Scale is unset, When the user un-select the checkbox of Auto Scale, Then verify that the display is set to ''", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    wrapper.vm.auto_scale("");
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.vm.is_apply_set).toStrictEqual(false);
    expect(wrapper.vm.entrykey).toStrictEqual("");
  });
  test("Given that Radio Button is set, When the user selects either 'Warm' 'Cold'... etc, Then verify that the gradient value is set", async () => {
    const propsData = {};
    wrapper = mount(ComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const radio_option = {
      name: "Warm",
      index: 0,
    };
    wrapper.vm.radio_option_selected(radio_option);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.vm.radio_option_idx).toStrictEqual(0);
  });
});
