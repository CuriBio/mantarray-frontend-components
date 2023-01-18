import { mount } from "@vue/test-utils";
import PlateMapCreateApply from "@/components/plate_based_widgets/mapeditor/PlateMapCreateApply.vue";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);
let NuxtStore;
let store;

describe("PlateMapCreateApply.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting PlateMapCreateApply, Then the apply button should be disabled", async () => {
    const wrapper = mount(PlateMapCreateApply, {
      store,
      localVue,
    });
    const disabled_button = wrapper.find(".div__platemap-createapply-button-background-disabled");
    expect(disabled_button.isVisible()).toBe(true);
  });

  test("When a new treatment is created, Then the well treatments dropdown will auto select newly created treatment index", async () => {
    const wrapper = mount(PlateMapCreateApply, {
      store,
      localVue,
    });

    expect(wrapper.vm.well_treatment_names).toStrictEqual(["Select Treatment"]);
    expect(wrapper.vm.treatment_options_idx).toBe(0);

    await wrapper.find(".div__platemap-createapply-button-background-enabled").trigger("click");
    await wrapper.find("#input-widget-field-treatment-name").setValue("test_treatment");

    await wrapper.findAll(".span__button_label").at(1).trigger("click");

    expect(wrapper.vm.well_treatment_names).toStrictEqual(["Select Treatment", "test_treatment"]);
    expect(wrapper.vm.treatment_options_idx).toBe(1);
  });
});
