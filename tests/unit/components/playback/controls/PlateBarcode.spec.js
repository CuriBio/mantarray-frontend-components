import { mount } from "@vue/test-utils";
import PlateBarcode from "@/components/playback/controls/PlateBarcode.vue";
import { PlateBarcode as dist_PlateBarcode } from "@/dist/mantarray.common";
import playback_module from "@/store/modules/playback";
const wait_for_expect = require("wait-for-expect");
import { shallowMount } from "@vue/test-utils";
import { createLocalVue } from "@vue/test-utils";

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
  test("Given a barcode with invalid initial alphabest of MA, MB or M1 the [input.length = 11] barcode fails the defined criteria with wrong alphabets hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("AB200440012"); // wrong alphabets
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a barcode with invalid initial alphabest of MA, MB or M1 the [input.length = 11] barcode fails the defined criteria with numbers hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("12200440012"); // completely numbers
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a barcode with invalid initial alphabest of MA, MB or M1 the [input.length = 11] barcode fails the defined criteria with special symbols  hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("*#200440012"); // special characters
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a barcode with invalid date 000 in which the [input.length = 11] values is more than zero in the index range of [4-6] fails the defined criteria hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("MA200000012"); // day specified is 000
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a barcode with invalid date 367 in which the [input.length = 11] values is more than 366 in the index range of [4-6] fails the defined criteria hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("MA203670012"); // day specified is 380
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a barcode with invalid date 999 in which the [input.length = 11] values is more than 366 in the index range of [4-6] fails the defined criteria hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("MA209990121"); // day specified is 999
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a barcode with invalid Year in which the [input.length = 10] values of special charcters at [2-3] and special charcters [7-till end] fails the defined criteria hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("MA*#300001"); // year having special charcter
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a barcode with invalid special code on the [input.length = 11] edge of last key entry in the characters [7-till end] fails the defined criteria hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("MA20222111*"); // having special chacters in the last
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a barcode with invalid special charcters on the [input.length = 11] in the middle of the charcters [7-till end] fails the defined criteria hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("MA20010*#12"); // having special chacters in the last
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a barcode with invlaid date in which the [input.length = 11] which has <one spacebar> is entered at [2-3] fails the defined criteria hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("MA 13000012"); // <one spacebar> having special charcter
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a barcode with invlaid date in which the [input.length = 11] in which <one spacebar> is entered at [7-till end] fails the defined criteria hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("MA20001 021"); // having <spacebar> chacters in the last section
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a barcode with invlaid date in which the [input.length = 10] in which like tab is entered at [2-3] fails the defined criteria hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("MA  300000"); // year having special charcter
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a barcode with invlaid date in which the [input.length = 10] and has value such as scientific charcter degrees is entered  fails the defined criteria hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("MA20001º21"); // having special chacters in the last
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a barcode with invlaid date in which the [input.length = 10] value such as unicode charcter in hindi न is entered  fails the defined criteria hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("MA20210न21"); // having special unicodde chacters in the last
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a barcode with invlaid date in which the [input.length = 11] value such as unicode charcter in Chinese 浩 is entered  fails the defined criteria hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("MA20011浩211"); // having special unicode chacters in the last
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a barcode with invlaid date in which the [input.length = 10] values such as unicode charcter in Chinese numbers 二千万一千〇九 (20001009) is entered  fails the defined criteria hence the Vuex barcode is blank", async () => {
    wrapper.find("input").setValue("MA二千万一千〇九"); // having special unicode chacters of chinexe numbers 二千万一千〇九 aka 20001009
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Given a valid barcode has been entered in the [input.length = 11]  and playback state is BUFFERING, When Playback State is mutated to BUFFERING, Then the text of the Barcode Inpput remains as the valid barcode instead of becoming blank", async () => {
    wrapper.find("input").setValue("MA200440012");
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).not.toBeNull();
    store.commit(
      "playback/set_playback_state",
      playback_module.ENUMS.PLAYBACK_STATES.BUFFERING
    );
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.vm.platebarcode).toEqual("MA200440012");
  });
  test("Given a valid barcode has been entered in the [input.length = 11] and playback state is CALIBRATED, When Playback State is mutated to CALIBRATING, Then the text of the Barcode Inpput remains as the valid barcode instead of becoming blank", async () => {
    wrapper.find("input").setValue("MA200440012");
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).not.toBeNull();
    store.commit(
      "playback/set_playback_state",
      playback_module.ENUMS.PLAYBACK_STATES.CALIBRATING
    );
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.vm.platebarcode).toEqual("MA200440012");
  });

  test("Given that the User entered a valid barcode of 11 characters, When user tries to enter barcode with an additional 12th digit, then it is not considered valid in Vuex", async () => {
    wrapper.find("input").setValue("MA200440012"); // test case will fail on delating if (barcode_len >= 10 && barcode_len < 12) in API validatePlateBarcode()
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(store.state.playback.barcode).not.toBeNull();
    wrapper.find("input").setValue("MA2004400122");
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.barcode).toBeNull();
  });

  test("Set an improper platecode and validate the [input.length = 2] value is not stored in Vuex Store", async () => {
    wrapper.find("input").setValue("MA"); // partially sending data
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Set an improper platecode and validate the [input.length = 4] value is not stored in Vuex Store", async () => {
    wrapper.find("input").setValue("MA20"); // still partially sending data
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Set an improper platecode and validate the [input.length = 7] value is not stored in Vuex Store", async () => {
    wrapper.find("input").setValue("MA20044"); // still partially sending data
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Set an improper platecode with the [input.length = 8] and special characters as its not matching criteria the value is not stored in Vuex Store", async () => {
    wrapper.find("input").setValue("MA20**#*"); // still partially sending data
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Set a proper platecode with the [input.length = 10] and validate the value is the matching that of the Vuex Store as its a valid criteria of Barcode", async () => {
    wrapper.find("input").setValue("MA20044001");
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.barcode).toEqual("MA20044001");
  });
  test("Set a proper platecode with the [input.length = 11] and validate the value is the matching that of the Vuex Store as its a valid criteria of Barcode", async () => {
    wrapper.find("input").setValue("M120044099");
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.barcode).toEqual("M120044099");
  });
  test("Set a proper platecode and validate the [input.length = 11] value the YEAR is SET AS 19 so its an error so the Vuex Store value is null", async () => {
    wrapper.find("input").setValue("MB190440991");
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Set a proper platecode and validate the [input.length = 11] value the YEAR is SET AS 21 so its an error so the Vuex Store value is null", async () => {
    wrapper.find("input").setValue("MB210440991");
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Set a proper platecode and validate the [input.length = 11] value the YEAR is SET AS 10 so its an error so the Vuex Store value is null", async () => {
    wrapper.find("input").setValue("MB100440991");
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.barcode).toBeNull();
  });
  test("Set a proper platecode [input.length = 11] has and validate that no the red squiggle line is not present", async () => {
    wrapper.find("input").setValue("M120044099");
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("input").html()).toContain('spellcheck="false"');
  });
  test("Fire an event to paste text ABCD validate its not updated on input", async () => {
    const mEvent = {
      clipboardData: { getData: jest.fn().mockReturnValueOnce("12") },
    };
    wrapper.find("input").trigger("paste", mEvent);
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("input").value).toBeUndefined();
    expect(wrapper.find("input").html()).toContain('onpaste="return false;"');
  });
  test("On Vuex Store for playback_state set to RECORDING input is set to readonly true", async () => {
    store.commit(
      "playback/set_playback_state",
      playback_module.ENUMS.PLAYBACK_STATES.CALIBRATED
    );
    await wrapper.vm.$nextTick(); // wait for update
    // confirm pre-condition
    expect(wrapper.find("input").html()).not.toContain("disabled");
    store.commit(
      "playback/set_playback_state",
      playback_module.ENUMS.PLAYBACK_STATES.RECORDING
    );
    await wrapper.vm.$nextTick(); // wait for update
    expect(wrapper.find("input").html()).toContain("disabled");
    wrapper.find("input").setValue("MA20044001");
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.barcode).toBeNull();
  });
});
