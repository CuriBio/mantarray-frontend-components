import { mount, createLocalVue } from "@vue/test-utils";
import StimulationStudioProtocolViewer from "@/components/stimulation/StimulationStudioProtocolViewer.vue";
import StimulationStudioWaveform from "@/components/stimulation/StimulationStudioWaveform.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

const test_protocol_order = [
  {
    type: "Biphasic",
    src: "placeholder",
    nested_protocols: [],
    repeat: {
      number_of_repeats: 0,
      color: "fffff",
    },
    settings: {
      phase_one_duration: 300,
      phase_one_charge: 2,
      interpulse_duration: 500,
      phase_two_duration: 100,
      phase_two_charge: -5,
    },
  },
  {
    type: "Monophasic",
    src: "placeholder",
    nested_protocols: [
      {
        type: "Monophasic",
        src: "placeholder",
        nested_protocols: [],
        repeat: {
          number_of_repeats: 0,
          color: "fffff",
        },
        settings: {
          phase_one_duration: 100,
          phase_one_charge: -2,
        },
      },
      {
        type: "Monophasic",
        src: "placeholder",
        nested_protocols: [],
        repeat: {
          number_of_repeats: 0,
          color: "fffff",
        },
        settings: {
          phase_one_duration: 300,
          phase_one_charge: 6,
        },
      },
    ],
    repeat: {
      number_of_repeats: 0,
      color: "fffff",
    },
    settings: {
      phase_one_duration: 300,
      phase_one_charge: 2,
    },
  },
];

describe("StimulationStudioProtocolViewer.vue", () => {
  beforeAll(async () => {
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
  });

  test("When exiting instance, Then instance is effectively destroyed", async () => {
    const destroyed_spy = jest.spyOn(StimulationStudioProtocolViewer, "beforeDestroy");
    const wrapper = mount(StimulationStudioProtocolViewer, {
      store,
      localVue,
    });
    wrapper.destroy();
    expect(destroyed_spy).toHaveBeenCalled();
  });

  test("When a user switch time unit in drop down, Then the x-axis scale should change accordingly", async () => {
    const wrapper = mount(StimulationStudioProtocolViewer, {
      store,
      localVue,
    });

    await store.commit("stimulation/handle_time_unit", "milliseconds");
    expect(store.state.stimulation.x_axis_scale).toBe(100000);
    await store.commit("stimulation/handle_time_unit", "seconds");
    expect(store.state.stimulation.x_axis_scale).toBe(100);
  });

  test("When user wants to zoom in on an axis in the Protocol Viewer, Then the scale will be divided by 10", async () => {
    const wrapper = mount(StimulationStudioProtocolViewer, {
      store,
      localVue,
    });
    await store.commit("stimulation/handle_zoom_in", "y-axis");
    expect(wrapper.vm.y_min_max).toBe(1);
  });

  test("When a user deletes the protocol, Then all datapoints should be deleted", async () => {
    const wrapper = mount(StimulationStudioProtocolViewer, {
      store,
      localVue,
    });

    wrapper.vm.datapoints = [1, 2, 3, 4];
    await store.commit("stimulation/reset_state");
    expect(wrapper.vm.datapoints).toStrictEqual([]);
  });

  test("When a user adds to the protocol, Then corresponding repeat colors should be reassignment upon mutation", async () => {
    const wrapper = mount(StimulationStudioProtocolViewer, {
      store,
      localVue,
    });

    await store.commit("stimulation/handle_protocol_order", test_protocol_order);
    expect(wrapper.vm.repeat_colors).toBe(store.state.stimulation.repeat_colors);
  });

  test("When a user the protocol, Then all datapoints should be deleted", async () => {
    const wrapper = mount(StimulationStudioWaveform, {
      store,
      localVue,
    });

    const render_spy = jest.spyOn(wrapper.vm, "render_plot");
    wrapper.vm.$options.watch.data_points.call(wrapper.vm, [
      [1, 2],
      [2, 3],
    ]);

    expect(render_spy).toHaveBeenCalled();
  });
});
