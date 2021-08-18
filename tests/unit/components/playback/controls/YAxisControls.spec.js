import YAxisControls from "@/components/playback/controls/YAxisControls.vue";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import { YAxisControls as dist_YAxisControls } from "@/dist/mantarray.common";
import Vuex from "vuex";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

describe("YAxisControls.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());

  test("When mounting the YAxis controls from the dist file, Then it should load successfully", async () => {
    wrapper = shallowMount(dist_YAxisControls, { store, localVue });
    await wrapper.vm.$nextTick(); // wait for update

    const target_span = wrapper.find(".span__playback-y-axis-controls-text");
    expect(target_span.text()).toBe("Y-Axis Options:");
  });

  test("When prop values are passed for height/top/left, Then the style should persist to the main div", async () => {
    const propsData = {
      css_top_anchor: "23px",
      css_left_anchor: "99px",
      height: "971px",
    };

    wrapper = shallowMount(YAxisControls, { propsData, store, localVue });
    await wrapper.vm.$nextTick(); // wait for update

    const main_div = wrapper.find(".div__playback-y-axis-controls");
    const main_div_style = main_div.attributes("style");
    expect(main_div_style).toBe("top: 23px; left: 99px; height: 971px;");
  });
  test("When a user selects on the additional zoom controls icon, Then the modal should open", async () => {
    wrapper = shallowMount(YAxisControls, { store, localVue });

    await wrapper.find(".div__playback-y-axis-controls-zoom-control-icon").trigger("click");
    expect(wrapper.vm.controls).toBe(false);

    await wrapper.vm.y_axis_controls_cancel();
    expect(wrapper.vm.controls).toBe(true);
  });

  describe("y-zoom-in", () => {
    test("When the component reaches maximum zoom level, Then it should add the disabled CSS class to the button", async () => {
      wrapper = shallowMount(YAxisControls, { store, localVue });

      await wrapper.vm.$nextTick(); // wait for update

      const new_min_max = { y_min: 149, y_max: 151 };
      await wrapper.vm.y_axis_controls_commit(new_min_max);

      const target_button = wrapper.find(".span__playback-y-axis-controls-zoom-in-button");

      expect(target_button.classes()).toContain("div__playback-y-axis-controls--disabled");
    });
    test("When a user clicks the zoom in button, Then the change should only commit to the store if maximum zoom has not been reached", async () => {
      wrapper = shallowMount(YAxisControls, { store, localVue });
      const mutation_spy = jest.spyOn(store, "commit");

      const new_min_max = { y_min: 143, y_max: 147 };
      await wrapper.vm.y_axis_controls_commit(new_min_max);
      expect(mutation_spy).toHaveBeenCalledTimes(1);

      await wrapper.find(".span__playback-y-axis-controls-zoom-in-button").trigger("click");
      expect(mutation_spy).toHaveBeenCalledTimes(2);

      await wrapper.find(".span__playback-y-axis-controls-zoom-in-button").trigger("click");
      expect(mutation_spy).toHaveBeenCalledTimes(2);
    });
  });
  describe("y-zoom-out", () => {
    test("When the component reaches the lowest zoom level, Then it should add the disabled CSS class to the button", async () => {
      wrapper = shallowMount(YAxisControls, { store, localVue });

      const new_min_max = { y_min: -201, y_max: 100001 };
      await wrapper.vm.y_axis_controls_commit(new_min_max);

      const target_button = wrapper.find(".span__playback-y-axis-controls-zoom-out-button");
      expect(target_button.classes()).toContain("div__playback-y-axis-controls--disabled");
    });
    test("When a user clicks the zoom out button, Then the change should only commit to the store if maximum zoom has not been reached", async () => {
      wrapper = shallowMount(YAxisControls, { store, localVue });
      const mutation_spy = jest.spyOn(store, "commit");

      const new_min_max = { y_min: -150, y_max: 90000 };
      await wrapper.vm.y_axis_controls_commit(new_min_max);
      expect(mutation_spy).toHaveBeenCalledTimes(1);

      await wrapper.find(".span__playback-y-axis-controls-zoom-out-button").trigger("click");
      expect(mutation_spy).toHaveBeenCalledTimes(2);

      await wrapper.find(".span__playback-y-axis-controls-zoom-out-button").trigger("click");
      expect(mutation_spy).toHaveBeenCalledTimes(2);
    });
  });
});
