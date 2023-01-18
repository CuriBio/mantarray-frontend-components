import { mount } from "@vue/test-utils";
import PlateMapEditor from "@/components/plate_based_widgets/mapeditor/PlateMapEditor.vue";
import { createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();

localVue.use(Vuex);
let NuxtStore;
let store;

describe("PlateMapEditor.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting PlateMapEditor, Then it loads successfully", async () => {
    const wrapper = mount(PlateMapEditor, {
      store,
      localVue,
    });
    const page_header = wrapper.find(".div__platemapeditor-header");
    expect(page_header.text()).toBe("Plate Map Editor");
  });
});
