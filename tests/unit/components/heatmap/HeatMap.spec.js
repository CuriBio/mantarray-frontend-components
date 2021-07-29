import { mount } from "@vue/test-utils";
import HeatMap from "@/components/heatmap/HeatMap.vue";
import { HeatMap as DistComponentToTest } from "@/dist/mantarray.common";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

const max_warm_rgb = "rgb(74.118% 20.784% 19.608%)";
const min_warm_rgb = "rgb(97.647% 84.314% 54.902%)";
const max_cool_rgb = "rgb(6.275% 39.216% 54.902%)";

const localVue = createLocalVue();

localVue.use(Vuex);
let NuxtStore;
let store;

describe("HeatMap.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting HeatMap from the build dist file, Then it loads successfully", async () => {
    const wrapper = mount(DistComponentToTest, {
      store,
      localVue,
    });
  });
  test("When mounting HeatMap, Then it loads successfully", async () => {
    const wrapper = mount(HeatMap, {
      store,
      localVue,
    });
  });

  test("When a single well is selected, Then the mean text display visibilities are updated", async () => {
    const wrapper = mount(HeatMap, {
      store,
      localVue,
    });
    // Tanner (7/28/21): data store needs to be initialized with one valid metric having one well for this test to work
    store.commit("data/set_heatmap_values", {
      "Twitch Force": { data: [[]] },
    });

    const default_text = wrapper.find(".div__heatmap-layout-heatmap-well-label");
    const default_value = wrapper.find(".div__heatmap-layout-heatmap-well-value");
    const mean_text = wrapper.find(".div__heatmap-layout-heatmap-mean-well-label");
    const mean_value = wrapper.find(".div__heatmap-layout-heatmap-mean-value-well-label");

    expect(default_text.isVisible()).toBe(true);
    expect(default_value.isVisible()).toBe(true);
    expect(mean_text.isVisible()).toBe(false);
    expect(mean_value.isVisible()).toBe(false);

    await wrapper.findAll("circle").at(0).trigger("click");
    expect(default_text.isVisible()).toBe(false);
    expect(default_value.isVisible()).toBe(false);
    expect(mean_text.isVisible()).toBe(true);
    expect(mean_value.isVisible()).toBe(true);
  });
  test("Given a single column of wells has data and a display metric is selected, When that column is selected, Then the mean value of the wells is computed and for the selected metric", async () => {
    const wrapper = mount(HeatMap, {
      store,
      localVue,
    });
    const init_heatmap_values = {
      "Twitch Force": { data: [[1], [2], [4], [5]] },
      "Twitch Frequency": { data: [[10], [10], [10], [10]] },
    };
    store.commit("data/set_heatmap_values", init_heatmap_values);

    const mean_text = wrapper.find(".div__heatmap-layout-heatmap-mean-well-label");
    const mean_value = wrapper.find(".div__heatmap-layout-heatmap-mean-value-well-label");

    await wrapper.find("#column_1").trigger("click");

    // test default metric selection (Twitch Force)
    expect(mean_text.text()).toEqual("Mean of 4 Wells (µN):");
    expect(mean_value.text()).toEqual("3.000");
    // switch to Twitch Frequency
    await wrapper.findAll("li").at(0).trigger("click");
    // test new values
    expect(mean_text.text()).toEqual("Mean of 4 Wells (Hz):");
    expect(mean_value.text()).toEqual("10.000");
  });
  test("When new max and min values are entered for scale bar and apply button is pressed, Then gradient bar labels update", async () => {
    const wrapper = mount(HeatMap, {
      store,
      localVue,
    });
    store.commit("data/set_heatmap_values", {
      "Twitch Force": { data: [[]] },
    });

    await wrapper.find("#input-widget-field-heatmap-max").setValue("10");
    await wrapper.find("#input-widget-field-heatmap-min").setValue("1");
    await wrapper.find(".span__heatmap-settings-apply-btn-label").trigger("click");

    expect(wrapper.find(".span__heatmap-scale-higher-value").text()).toEqual("10 µN");
    expect(wrapper.find(".span__heatmap-scale-lower-value").text()).toEqual("1 µN");
  });
  test("Given a single well has a single data entry, When new max and min values are entered for scale bar and apply button is pressed, Then the color for this well updates", async () => {
    // - plate colors update
    const wrapper = mount(HeatMap, {
      store,
      localVue,
    });
    store.commit("data/set_heatmap_values", {
      "Twitch Force": { data: [[15]] },
    });

    await wrapper.find("#input-widget-field-heatmap-max").setValue("15");
    await wrapper.find("#input-widget-field-heatmap-min").setValue("0");
    await wrapper.find(".span__heatmap-settings-apply-btn-label").trigger("click");
    expect(wrapper.findAll("circle").at(0).attributes("fill")).toStrictEqual(max_warm_rgb);
  });

  test("When a few metric types are entered into the data store, Then the display drop down options match the metric names", async () => {
    // need to commit values to store before mounting
    store.commit("data/set_heatmap_values", {
      "Twitch Force": { data: [[]] },
      "Twitch Frequency": { data: [[]] },
      "Twitch Period": { data: [[]] },
    });
    const wrapper = mount(HeatMap, {
      store,
      localVue,
    });

    const selected_option = wrapper.find(".span__input-controls-content-dropdown-widget");
    expect(selected_option.text()).toEqual("Twitch Force");

    const unselected_options = wrapper.findAll("li");
    expect(unselected_options.at(0).text()).toEqual("Twitch Frequency");
    expect(unselected_options.at(1).text()).toEqual("Twitch Period");
  });
  test("Given a single well has a different data value for two metrics, When display option is changed, Then the color for this well updates", async () => {
    const wrapper = mount(HeatMap, {
      store,
      localVue,
    });
    store.commit("data/set_heatmap_values", {
      "Twitch Force": { data: [[0]] },
      "Twitch Frequency": { data: [[100]] },
    });

    // switch to freq first
    await wrapper.findAll("li").at(0).trigger("click");
    expect(wrapper.findAll("circle").at(0).attributes("fill")).toStrictEqual(max_warm_rgb);

    // switch back to force
    await wrapper.findAll("li").at(0).trigger("click");
    expect(wrapper.findAll("circle").at(0).attributes("fill")).toStrictEqual(min_warm_rgb);
  });
  test("Given two metrics are present in data store, When display option is changed, Then the plateheatmap title and unit in all labels are updated", async () => {
    const wrapper = mount(HeatMap, {
      store,
      localVue,
    });
    store.commit("data/set_heatmap_values", {
      "Twitch Force": { data: [[]] },
      "Twitch Frequency": { data: [[]] },
    });

    // switch to freq
    await wrapper.findAll("li").at(0).trigger("click");

    expect(wrapper.find(".div__heatmap-layout-twitch-metric-label").text()).toEqual("Twitch Frequency (Hz)");
    expect(wrapper.find(".span__heatmap-scale-higher-value").text()).toContain("Hz");
    expect(wrapper.find(".span__heatmap-scale-lower-value").text()).toContain("Hz");
    expect(wrapper.find(".div__heatmap-layout-heatmap-mean-well-label").text()).toContain("Hz");
  });

  test("Given default gradient themes are loaded and a single well has data for one metric, When a radio button for a different color scheme is pressed, Then the color for this well is updated", async () => {
    const wrapper = mount(HeatMap, {
      store,
      localVue,
    });
    store.commit("data/set_heatmap_values", {
      "Twitch Force": { data: [[0]] },
      "Twitch Frequency": { data: [[100]] },
    });

    // for some reason need to select a metric first before colors are displayed so switching to freq
    await wrapper.findAll("li").at(0).trigger("click");

    const test_well = wrapper.findAll("circle").at(0);
    expect(test_well.attributes("fill")).toStrictEqual(max_warm_rgb);
    // switch from Warm to Cool theme
    const target_radio_btn = wrapper.findAll("input[type='radio']");
    target_radio_btn.at(1).setChecked(true);
    await target_radio_btn.at(1).trigger("change");
    expect(test_well.attributes("fill")).toStrictEqual(max_cool_rgb);
  });

  test("Given all settings are changed from default and a well selection is set, When the reset button is pressed, Then all settings reset except for well selection", async () => {
    const wrapper = mount(HeatMap, {
      store,
      localVue,
    });
    store.commit("data/set_heatmap_values", {
      "Twitch Force": { data: [[0]] },
      "Twitch Frequency": { data: [[100]] },
    });

    // set metric display to freq
    await wrapper.findAll("li").at(0).trigger("click");
    // set to Cool theme
    const target_radio_btn = wrapper.findAll("input[type='radio']");
    target_radio_btn.at(1).setChecked(true);
    await target_radio_btn.at(1).trigger("change");
    // set and apply min and max values
    await wrapper.find("#input-widget-field-heatmap-max").setValue("96");
    await wrapper.find("#input-widget-field-heatmap-min").setValue("34");
    await wrapper.find(".span__heatmap-settings-apply-btn-label").trigger("click");
    // select well 0
    const test_well = wrapper.findAll("circle").at(0);
    await wrapper.findAll("circle").at(0).trigger("click");

    // make assertion on labels before resetting to confirm precondition
    const mean_text = wrapper.find(".div__heatmap-layout-heatmap-mean-well-label");
    const mean_value = wrapper.find(".div__heatmap-layout-heatmap-mean-value-well-label");
    expect(mean_text.text()).toEqual("Mean of 1 Wells (Hz):");
    expect(mean_value.text()).toEqual("100.000");
    expect(mean_text.isVisible()).toBe(true);
    expect(mean_value.isVisible()).toBe(true);
    // click reset btn
    await wrapper.find(".span__heatmap-settings-reset-btn-label").trigger("click");

    // test selected metric is set back to force and labels are still visible
    expect(mean_text.text()).toEqual("Mean of 1 Wells (µN):");
    expect(mean_value.text()).toEqual("0.000");
    expect(mean_text.isVisible()).toBe(true);
    expect(mean_value.isVisible()).toBe(true);
    // test dropdown is reset
    const selected_option = wrapper.find(".span__input-controls-content-dropdown-widget");
    expect(selected_option.text()).toEqual("Twitch Force");
    const unselected_options = wrapper.findAll("li");
    expect(unselected_options.at(0).text()).toEqual("Twitch Frequency");
    // test min and max are reset
    expect(wrapper.find(".span__heatmap-scale-higher-value").text()).toEqual("100 µN");
    expect(wrapper.find(".span__heatmap-scale-lower-value").text()).toEqual("0 µN");
    // test gradient theme is reset to Warm
    expect(test_well.attributes("fill")).toStrictEqual(min_warm_rgb);
  });

  test("Given all settings are changed from default and a well selection is set, When page is rerendered, Then all settings and the well selection persist", async () => {
    const wrapper = mount(HeatMap, {
      store,
      localVue,
    });
    store.commit("data/set_heatmap_values", {
      "Twitch Force": { data: [[0]] },
      "Twitch Frequency": { data: [[100]] },
    });
  });
});
