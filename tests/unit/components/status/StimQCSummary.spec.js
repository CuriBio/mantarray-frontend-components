import { mount } from "@vue/test-utils";
import StimQCSummary from "@/components/status/StimQCSummary.vue";
import { createLocalVue } from "@vue/test-utils";
const localVue = createLocalVue();
let NuxtStore;
let store;

describe("StimQCSummary.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });
  test("When that StimQCSummary is visible, Then it will display correct configuration check messages", async () => {
    const wrapper = mount(StimQCSummary, {
      localVue,
      store,
    });
    const target_header_text = wrapper.find(".span__stimqc-label");
    const target_message_span_p = wrapper.findAll("p");

    expect(target_header_text.text()).toStrictEqual("Configuration Check Summary!");
    expect(target_message_span_p.at(0).text()).toStrictEqual(
      "An open circuit was detected in the assigned wells shown below. This will prevent you from being able to start a stimulation."
    );
    expect(target_message_span_p.at(1).text()).toStrictEqual(
      "Please unassign these wells before proceeding."
    );
  });
  test("Given that StimQCSummary is mounted, When the StimQCSummary is visible, Then click on 'Okay results in an event 'handle_confirmation' to be emitted", async () => {
    const wrapper = mount(StimQCSummary, {
      localVue,
      store,
    });
    const cancel_yes_btn = wrapper.findAll(".span__button-label");
    await cancel_yes_btn.at(0).trigger("click");
    const yes_btn_events = wrapper.emitted("handle_confirmation");
    expect(yes_btn_events[0]).toStrictEqual([0]);
  });
});
