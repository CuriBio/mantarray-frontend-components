import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioWaveform from "@/components/stimulation/StimulationStudioWaveform.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

describe("StimulationStudioWaveform.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When exiting instance, Then instance is effectively destroyed", async () => {
    // const destroyed_spy = jest.spyOn(StimulationStudioWaveform, "watch");
    // const wrapper = mount(StimulationStudioWaveform, {
    //   store,
    //   localVue
    // });
    // wrapper.watch();
    // expect(destroyed_spy).toHaveBeenCalled();
  });
});
