import { mount } from "@vue/test-utils";
import PlateBarcode from "@/components/playback/controls/PlateBarcode.vue";
import { PlateBarcode as dist_PlateBarcode } from "@/dist/mantarray.common";
import playback_module from "@/store/modules/playback";
const wait_for_expect = require("wait-for-expect");
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
  test("Given no barcode has been entered (default state), When Playback State is mutated to CALIBRATING, Then the text of the Barcode Input field should be empty string (not cause error or say null)", async () => {
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
    store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("input").text()).toEqual("");
  });
  test("Given a valid barcode has been into the Vuex, When the component is mounted, Then the text of the Barcode Input field should be valid barcode string and Red Box is visible ", async () => {
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
    expect(wrapper.find(".input__plate-barcode-entry-valid").isVisible()).toBe(true);
  });

  test("Given a invalid barcode has been into the Vuex, When the component is mounted, Then the text of the Barcode Input field should be valid barcode string and Green Box is visible", async () => {
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
    expect(wrapper.find(".input__plate-barcode-entry-invalid").isVisible()).toBe(true);
  });
  test("Given that its in manual mode and no barcode has been entered (default state), When Playback State is mutated to CALIBRATING, Then the text of the Barcode Input field should be empty string (not cause error or say null)", async () => {
    // confirm pre-condition
    store.commit("flask/set_barcode_manual_mode", true);
    expect(store.state.playback.barcode).toBeNull();
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
  test.each([
    [
      "AB200440012",
      "validate_plate_barcode",
      "error not matching MA MB MD",
      null, //  vuex value
    ],
    ["12200440012", "validate_plate_barcode", "error not matching MA MB MD", null],
    ["*#200440012", "validate_plate_barcode", "error not matching MA MB MD", null],
    ["MA200000012", "validate_plate_barcode", "error as day is 0", null],
    ["MA203670012", "validate_plate_barcode", "error as day is 367", null],
    ["MA209990121", "validate_plate_barcode", "error as day is 999", null],
    ["MA 13000012", "validate_plate_barcode", "error due to <space>", null],
    ["MA  300000", "validate_plate_barcode", "error due to 2<space>", null],
    ["MB190440991", "validate_plate_barcode", "year 19 now allowed", "MB190440991"],
    ["MB210440991", "validate_plate_barcode", "year 21 now allowed", "MB210440991"],
    ["MB100440991", "validate_plate_barcode", "year 10 now allowed", "MB100440991"],
    ["MA*#300001", "validate_plate_barcode", "error as *# asterisk", null],
    ["MA20222111*", "validate_plate_barcode", "error as * asterisk", null],
    ["MA20010*#12", "validate_plate_barcode", "error as *# asterisk", null],
    ["MA20001 021", "validate_plate_barcode", "error due <space> in day", null],
    ["MA20001º21", "validate_plate_barcode", "error due to symbol º", null],
    ["MA20210न21", "validate_plate_barcode", "error due to unicode", null],
    ["MA20011浩211", "validate_plate_barcode", "error due to unicode", null],
    ["MA二千万一千〇九", "validate_plate_barcode", "error due to all unicode", null],
    ["MA", "validate_plate_barcode", "error due to not matching length (10,11)", null],
    ["MA20", "validate_plate_barcode", "error due to not matching length (10,11)", null],
    ["MA20044", "validate_plate_barcode", "error due to not matching length (10,11)", null],
    ["MA20**#*", "validate_plate_barcode", "error due to not matching length (10,11)", null],
    ["MA20044001", "validate_plate_barcode", "All criteria matches", "MA20044001"],
    ["M120044099", "validate_plate_barcode", "error as M1 is disallowed", null],
    ["ME20044099", "validate_plate_barcode", "All criteria matches", "ME20044099"], // new rule allow ME
  ])(
    "Given that its in manual mode and a barcode with text  %s, When validation rule %s criteria FAILS for invalid barcode or PASSES due %s for a valid barcode, Then only valid barcode %s is stored in Vuex playback.barcode and flask.barcode_manual_mode is set to true",
    async (platecode, validation_rule, reason, store_data) => {
      const spied_text_validator = jest.spyOn(TextValidation.prototype, validation_rule);

      store.commit("flask/set_barcode_manual_mode", true);
      expect(store.state.playback.barcode).toBeNull();
      store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING);
      const propsData = {};

      let wrapper = mount(PlateBarcode, {
        propsData,
        store,
        localVue,
        attachToDocument: true,
      });

      await wrapper.vm.manual_mode_on(); // This the valid form of testing an in coming event of 'yes-platebarcode'
      // refer to the file SettingsFormCustomerUser.spec.js line 95 a similar approach was followed and accepted.
      const input_id = wrapper.find("#plateinfo");
      wrapper.find("input").setValue(platecode);
      expect(spied_text_validator).toHaveBeenCalledWith(platecode);
      expect(store.state.playback.barcode).toEqual(store_data);
      // check if the flask barcode_manual_mode is set to true.
      expect(store.state.flask.barcode_manual_mode).toBe(true);
    }
  );
  test("Given that its in manual mode and a valid barcode has been entered in the [input.length = 11]  and playback state is BUFFERING, When Playback State is mutated to BUFFERING, Then the text of the Barcode Inpput remains as the valid barcode instead of becoming blank", async () => {
    const propsData = {};

    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.manual_mode_on(); // This the valid form of testing an in coming event of 'yes-platebarcode'
    // refer to the file SettingsFormCustomerUser.spec.js line 95 a similar approach was followed and accepted.

    wrapper.find("input").setValue("MA200440012");
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).not.toBeNull();
    store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.BUFFERING);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.vm.platebarcode).toEqual("MA200440012");
  });
  test("Given that its in manual mode and a valid barcode has been entered in the [input.length = 11] and playback state is CALIBRATED, When Playback State is mutated to CALIBRATING, Then the text of the Barcode Inpput remains as the valid barcode instead of becoming blank", async () => {
    const propsData = {};

    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.manual_mode_on(); // This the valid form of testing an in coming event of 'yes-platebarcode'
    // refer to the file SettingsFormCustomerUser.spec.js line 95 a similar approach was followed and accepted.

    wrapper.find("input").setValue("MA200440012");
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).not.toBeNull();
    store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.vm.platebarcode).toEqual("MA200440012");
  });

  test("Given that its in manual mode and that the User entered a valid barcode of 11 characters, When user tries to enter barcode with an additional 12th digit, then it is not considered valid in Vuex", async () => {
    const propsData = {};

    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.manual_mode_on(); // This the valid form of testing an in coming event of 'yes-platebarcode'
    // refer to the file SettingsFormCustomerUser.spec.js line 95 a similar approach was followed and accepted.

    wrapper.find("input").setValue("MA200440012"); // test case will fail on delating if (barcode_len >= 10 && barcode_len < 12) in API validatePlateBarcode()
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).not.toBeNull();
    wrapper.find("input").setValue("MA2004400122");
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Set a proper platecode [input.length = 11] has and validate that no the red squiggle line is not present", async () => {
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

    await wrapper.vm.manual_mode_on(); // This the valid form of testing an in coming event of 'yes-platebarcode'
    // refer to the file SettingsFormCustomerUser.spec.js line 95 a similar approach was followed and accepted.

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

    await wrapper.vm.manual_mode_on(); // This the valid form of testing an in coming event of 'yes-platebarcode'
    // refer to the file SettingsFormCustomerUser.spec.js line 95 a similar approach was followed and accepted.

    store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED);
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(wrapper.find("input").html()).not.toContain("disabled");
    store.commit("playback/set_playback_state", playback_module.ENUMS.PLAYBACK_STATES.RECORDING);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("input").html()).toContain("disabled");
    wrapper.find("input").setValue("MA20044001");
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.barcode).toBeNull();
  });
  test("On BarcodeEditDialog if the user chooses to 'Cancel' manual mode and the event 'cancel-platebarcode' is emitted then BarcodeEditDialog is hidden", async () => {
    const propsData = {};

    let wrapper = mount(PlateBarcode, {
      propsData,
      store,
      localVue,
      attachToDocument: true,
    });

    await wrapper.vm.manual_mode_off(); // This the valid form of testing an in coming event of 'yes-platebarcode'
    // refer to the file SettingsFormCustomerUser.spec.js line 95 a similar approach was followed and accepted.

    Vue.nextTick(() => {
      expect(modal.isVisible()).toBe(false);
      done();
    });
  });
});
