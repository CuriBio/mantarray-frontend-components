import { mount } from "@vue/test-utils";
import PlateBarcode from "@/components/playback/controls/PlateBarcode.vue";
import { PlateBarcode as dist_PlateBarcode } from "@/dist/mantarray.common";
import playback_module from "@/store/modules/playback";
const wait_for_expect = require("wait-for-expect");
import { shallowMount } from "@vue/test-utils";
import { createLocalVue } from "@vue/test-utils";
import { TextValidation } from "@/js_utils/text_validation.js";

let wrapper = null;

const localVue = createLocalVue();
let NuxtStore;
let store;

beforeAll(async () => {
  // note the store will mutate across tests, so make sure to re-create it in beforeEach
  const storePath = `${process.env.buildDir}/store.js`;
  NuxtStore = await import(storePath);
});

beforeEach(async () => {
  store = await NuxtStore.createStore();
  jest.restoreAllMocks();
  const propsData = {};
  wrapper = shallowMount(PlateBarcode, {
    propsData,
    store,
    localVue,
    attachToDocument: true,
  });
});

afterEach(() => wrapper.destroy());

describe("PlateBarcode.vue", () => {
  test("When mounting RecordingTime from the build dist file, it loads successfully text is Not Recording and time is null", () => {
    const propsData = {};
    wrapper = shallowMount(dist_PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    expect(wrapper.find(".span__plate-barcode-text").text()).toEqual(
      "Plate Barcode:"
    );
  });
  test("Given no barcode has been entered (default state), When Playback State is mutated to CALIBRATING, Then the text of the Barcode Input field should be empty string (not cause error or say null)", async () => {
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
    store.commit(
      "playback/set_playback_state",
      playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING
    );
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("input").text()).toEqual("");
  });
  test("Given a valid barcode has been into the Vuex, When Playback State is at any state, Then the text of the Barcode Input field should be valid barcode string and Red Box is visible ", async () => {
    store.commit("playback/set_barcode_number", "MA200440004");
    const propsData = {};
    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("input").element.value).toEqual("MA200440004");
    expect(wrapper.find(".input__plate-barcode-entry-valid").isVisible()).toBe(
      true
    );
  });

  test("Given a invalid barcode has been into the Vuex, When Playback State is at any state, Then the text of the Barcode Input field should be valid barcode string and Green Box is visible", async () => {
    store.commit("playback/set_barcode_number", "MA209990004");
    const propsData = {};
    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("input").element.value).toEqual("MA209990004");
    expect(
      wrapper.find(".input__plate-barcode-entry-invalid").isVisible()
    ).toBe(true);
  });
});
