import { mount } from "@vue/test-utils";
// import ComponentToTest from "@/components/basic_widgets/CheckBoxWidget.vue";
import { CheckBoxWidget as DistComponentToTest } from "@/dist/mantarray.common";

import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();

let NuxtStore;
let store;

describe("CheckBoxWidget.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  afterEach(() => wrapper.destroy());
  test("When mounting from the built dist file, Then it loads successfully and the props defined radio button text is rendered", () => {
    const propsData = {
      checkbox_options: [
        { text: "Ascorbic  Acid", value: "Ascorbic Acid" },
        { text: "B27", value: "b27" },
        { text: "B27 (-insulin)", value: "b27_insulin", disabled: true },
        { text: "Lab-Exp-1", value: "lab_exp_1" },
      ],
    };
    wrapper = mount(DistComponentToTest, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.findAll(".custom-control-label > span");

    expect(target_span.at(0).text()).toStrictEqual("Ascorbic  Acid");
  });
});
