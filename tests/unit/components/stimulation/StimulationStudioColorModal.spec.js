import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioColorModal from "@/components/stimulation/StimulationStudioColorModal.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

const non_green_ranges = [...Array(71).keys(), ...[...Array(360).keys()].splice(170)];
const colors_to_display = non_green_ranges
  .filter((hue) => hue % 23 === 0)
  .map((hue) => `hsla(${hue}, 100%, 50%, 1)`);

describe("StimulationStudioColorModal.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When mounting StimulationStudioColorModal from the component file, Then there will be 12 color blocks to choose from", async () => {
    const wrapper = mount(StimulationStudioColorModal, {
      store,
      localVue,
      propsData: {
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });

    const color_blocks = wrapper.findAll(".individual_color_block");
    expect(color_blocks).toHaveLength(12);
  });

  test("When a user selects 'Cancel', Then change_pulse_color will be emitted with the original color", async () => {
    const wrapper = mount(StimulationStudioColorModal, {
      store,
      localVue,
      propsData: {
        current_color: "hsla(100, 100%, 50%, 1)",
      },
    });

    const cancel_button = wrapper.findAll(".span__button-label").at(0);
    await cancel_button.trigger("click");

    const emitedt_events = wrapper.emitted("change_pulse_color");
    expect(emitedt_events).toHaveLength(1);
    expect(emitedt_events[0]).toStrictEqual(["hsla(100, 100%, 50%, 1)"]);
  });

  test.each(colors_to_display)(
    "When a user selects %s from the 12 colors, Then the new color will be emitted to parent component",
    async (color) => {
      const wrapper = mount(StimulationStudioColorModal, {
        store,
        localVue,
        propsData: {
          current_color: "hsla(100, 100%, 50%, 1)",
        },
      });

      const color_idx = colors_to_display.indexOf(color);
      const color_blocks = wrapper.findAll(".individual_color_block");

      await color_blocks.at(color_idx).trigger("click");
      const emitedt_events = wrapper.emitted("change_pulse_color");
      expect(emitedt_events[0]).toStrictEqual([colors_to_display[color_idx]]);
    }
  );
});
