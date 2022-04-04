import { mount } from "@vue/test-utils";
import PlateBarcode from "@/components/playback/controls/PlateBarcode.vue";
import { PlateBarcode as dist_PlateBarcode } from "@/dist/mantarray.common";
import playback_module from "@/store/modules/playback";
import { shallowMount } from "@vue/test-utils";
import { createLocalVue } from "@vue/test-utils";
import { TextValidation } from "@/js_utils/text_validation.js";
import Vue from "vue";

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

    expect(wrapper.find(".span__plate-barcode-text").text()).toEqual("Plate Barcode:");
  });
  test("Given no plate barcode has been entered (default state), When Playback State is mutated to CALIBRATING, Then the text of the Barcode Input field should be empty string (not cause error or say null)", async () => {
    // confirm pre-condition
    expect(store.state.playback.barcodes.plate_barcode.value).toBeNull();
    store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("input").text()).toEqual("");
  });
  test("Given a valid barcode has been into the Vuex, When the component is mounted, Then the text of the Barcode Input field should be valid barcode string and Red Box is visible ", async () => {
    store.commit("playback/set_barcode", { type: "plate_barcode", new_value: "ML2022053000" });
    const propsData = {};
    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("input").element.value).toEqual("ML2022053000");
    expect(wrapper.find(".input__plate-barcode-entry-valid").isVisible()).toBe(true);
  });

  test("Given a invalid barcode has been into the Vuex, When the component is mounted, Then the text of the Barcode Input field should be valid barcode string and Green Box is visible", async () => {
    store.commit("playback/set_barcode", { type: "plate_barcode", new_value: "MA209990004" });
    const propsData = {};
    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("input").element.value).toEqual("MA209990004");
    expect(wrapper.find(".input__plate-barcode-entry-invalid").isVisible()).toBe(true);
  });
  test("Given that it's not in manual mode and a valid scanned plate barcode is stored, When a user switches to manual mode, Then plate_barcode values are reset", async () => {
    // confirm pre-condition
    const test_barcode = "ML2022047000";
    store.commit("playback/set_barcode", { type: "plate_barcode", new_value: test_barcode });
    expect(store.state.playback.barcodes.plate_barcode).toStrictEqual({
      value: test_barcode,
      valid: true,
    });

    const propsData = {};
    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.handle_manual_mode_choice(true);
    expect(store.state.playback.barcodes.plate_barcode).toStrictEqual({
      value: null,
      valid: false,
    });
  });
  test("Given that its in manual mode and no plate barcode has been entered (default state), When Playback State is mutated to CALIBRATING, Then the text of the Barcode Input field should be empty string (not cause error or say null)", async () => {
    // confirm pre-condition
    store.commit("flask/set_barcode_manual_mode", true);
    expect(store.state.playback.barcodes.plate_barcode.value).toBeNull();
    store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING);
    const propsData = {};

    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("input").text()).toEqual("");
  });
  test("Given that barcode entry is in manual mode, When a plate barcode is entered, Then it is stored in Vuex playback store correctly", async () => {
    const spied_text_validator = jest.spyOn(TextValidation.prototype, "validate_plate_barcode");

    store.commit("flask/set_barcode_manual_mode", true);
    expect(store.state.playback.barcodes.plate_barcode.value).toBeNull();
    store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING);
    const propsData = {};

    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    const test_barcode = "ML2022001000";

    await wrapper.vm.handle_manual_mode_choice(true);
    wrapper.find("input").setValue(test_barcode);
    expect(spied_text_validator).toHaveBeenCalledWith(test_barcode);
    expect(store.state.playback.barcodes.plate_barcode.value).toEqual(test_barcode);
  });
  test("Given that its in manual mode and a valid barcode has been entered and playback state is BUFFERING, When Playback State is mutated to BUFFERING, Then the text of the Barcode Input remains as the valid barcode instead of becoming blank", async () => {
    const propsData = {};

    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.handle_manual_mode_choice(true);

    wrapper.find("input").setValue("ML2022053000");
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcodes.plate_barcode.value).not.toBeNull();
    store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.BUFFERING);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.vm.barcode_info.value).toEqual("ML2022053000");
  });
  test("Given that its in manual mode and a valid barcode has been entered and playback state is CALIBRATED, When Playback State is mutated to CALIBRATING, Then the text of the Barcode Inpput remains as the valid barcode instead of becoming blank", async () => {
    const propsData = {};

    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.handle_manual_mode_choice(true);

    wrapper.find("input").setValue("ML2022053000");
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcodes.plate_barcode.value).not.toBeNull();
    store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.vm.barcode_info.value).toEqual("ML2022053000");
  });

  test("Given that its in manual mode and that the User entered a valid barcode, When user tries to enter barcode with an additional 13th digit, then it is not considered valid in Vuex", async () => {
    const propsData = {};

    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.handle_manual_mode_choice(true);

    wrapper.find("input").setValue("ML2022053000"); // test case will fail on delating if (barcode_len >= 10 && barcode_len < 12) in API validatePlateBarcode()
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcodes.plate_barcode.valid).toBe(true);
    wrapper.find("input").setValue("ML20220530003");
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.barcodes.plate_barcode.valid).toBe(false);
  });
  test("Set a proper plate barcode and validate that no the red squiggle line is not present", async () => {
    wrapper.find("input").setValue("M120044099");
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("input").html()).toContain('spellcheck="false"');
  });
  test("Fire an event to paste text ABCD validate its not updated on input", async () => {
    const propsData = {};

    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.handle_manual_mode_choice(true);

    const mEvent = {
      clipboardData: { getData: jest.fn().mockReturnValueOnce("12") },
    };
    wrapper.find("input").trigger("paste", mEvent);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("input").value).toBeUndefined();
    expect(wrapper.find("input").html()).toContain('onpaste="return false;"');
  });
  test("On Vuex Store for playback_state set to RECORDING input is set to readonly true", async () => {
    const propsData = {};

    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.handle_manual_mode_choice(true);

    store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED);
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(wrapper.find("input").html()).not.toContain("disabled");
    store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.RECORDING);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("input").html()).toContain("disabled");
    wrapper.find("input").setValue("MA20044001");
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.barcodes.plate_barcode.value).toBeNull();
  });
  test("When user choose manual mode, Then BarcodeEditDialog is hidden", async () => {
    const propsData = {};

    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.handle_manual_mode_choice(false);

    Vue.nextTick(() => {
      expect(modal.isVisible()).toBe(false);
      done();
    });
  });
});
