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
    nest_protocols: [],
    repeat: {
      number_of_repeats: 0,
      color: "fffff",
    },
    pulse_settings: {
      phase_one_duration: 300,
      phase_one_charge: 2,
      interphase_interval: 500,
      phase_two_duration: 100,
      phase_two_charge: -5,
    },
    stim_settings: {
      repeat_delay_interval: {
        duration: 0,
        unit: "milliseconds",
      },
      total_active_duration: {
        duration: 20,
        unit: "milliseconds",
      },
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
        pulse_settings: {
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
        pulse_settings: {
          phase_one_duration: 300,
          phase_one_charge: 6,
        },
      },
    ],
    repeat: {
      number_of_repeats: 0,
      color: "fffff",
    },
    pulse_settings: {
      phase_one_duration: 300,
      phase_one_charge: 2,
    },
    stim_settings: {
      repeat_delay_interval: {
        duration: 0,
        unit: "milliseconds",
      },
      total_active_duration: {
        duration: 0,
        unit: "milliseconds",
      },
    },
  },
  {
    type: "Delay",
    src: "placeholder",
    nested_protocols: [],
    repeat: {
      number_of_repeats: 0,
      color: "fffff",
    },
    pulse_settings: {
      phase_one_duration: 3000,
      phase_one_charge: 0,
      interphase_interval: 0,
      phase_two_duration: 0,
      phase_two_charge: 0,
    },
    stim_settings: {
      repeat_delay_interval: {
        duration: "",
        unit: "milliseconds",
      },
      total_active_duration: {
        duration: 3,
        unit: "seconds",
      },
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
    pulse_settings: {
      phase_one_duration: 300,
      phase_one_charge: 2,
    },
    stim_settings: {
      repeat_delay_interval: {
        duration: 0,
        unit: "milliseconds",
      },
      total_active_duration: {
        duration: 20,
        unit: "milliseconds",
      },
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
    expect(destroyed_spy).toHaveBeenCalledWith();
  });

  test("When user wants to zoom in on an axis in the Protocol Viewer, Then the scale will be divided by 1.5", async () => {
    const wrapper = mount(StimulationStudioProtocolViewer, {
      store,
      localVue,
    });
    const expected_scale = 80;
    await store.commit("stimulation/set_zoom_in", "y-axis");
    expect(wrapper.vm.y_min_max).toBe(expected_scale);

    // should be unchanged
    expect(wrapper.vm.dynamic_plot_width).toBe(1200);
    expect(wrapper.vm.x_axis_sample_length).toBe(100);
  });

  test("When user wants to zoom out on an axis in the Protocol Viewer, Then the scale will be divided by 1.5", async () => {
    const wrapper = mount(StimulationStudioProtocolViewer, {
      store,
      localVue,
    });
    const expected_scale = 180;
    await store.commit("stimulation/set_zoom_out", "y-axis");
    expect(wrapper.vm.y_min_max).toBe(expected_scale);

    // should be unchanged
    expect(wrapper.vm.dynamic_plot_width).toBe(1200);
    expect(wrapper.vm.x_axis_sample_length).toBe(100);
  });

  test("When user wants to zoom out on the x-axis in the Protocol Viewer, Then the scale will change depending on the existing plot width", async () => {
    const wrapper = mount(StimulationStudioProtocolViewer, {
      store,
      localVue,
    });
    expect(wrapper.vm.dynamic_plot_width).toBe(1200);
    expect(wrapper.vm.x_axis_sample_length).toBe(100);

    await store.commit("stimulation/set_zoom_out", "x-axis");
    expect(wrapper.vm.dynamic_plot_width).toBe(1200);
    expect(wrapper.vm.x_axis_sample_length).toBe(150);

    await wrapper.setData({ dynamic_plot_width: 1800 });

    await store.commit("stimulation/set_zoom_out", "x-axis");
    expect(wrapper.vm.dynamic_plot_width).toBe(1200);
  });

  test("When user wants to zoom in on the x-axis in the Protocol Viewer, Then the scale will change depending on the existing plot width", async () => {
    const wrapper = mount(StimulationStudioProtocolViewer, {
      store,
      localVue,
    });

    expect(wrapper.vm.dynamic_plot_width).toBe(1200);
    expect(wrapper.vm.x_axis_sample_length).toBe(100);

    await store.commit("stimulation/set_zoom_in", "x-axis");
    expect(wrapper.vm.dynamic_plot_width).toBe(1200);
    expect(wrapper.vm.x_axis_sample_length).toBe(66.66666666666667);

    await wrapper.setData({ last_x_value: 150, x_axis_sample_length: 200, datapoints: [[0, 0]] });

    await store.commit("stimulation/set_zoom_in", "x-axis");
    expect(wrapper.vm.dynamic_plot_width).toBe(1800);
    expect(wrapper.vm.x_axis_sample_length).toBe(200);
  });

  test("When pulses are added to the protocol, Then the x_axis_sample_length will automatically update to be +50 unless all pulses are removed", async () => {
    const wrapper = mount(StimulationStudioProtocolViewer, {
      store,
      localVue,
    });

    expect(wrapper.vm.x_axis_sample_length).toBe(100);

    await wrapper.setData({
      last_x_value: 200,
      datapoints: [
        [0, 0],
        [0, 300],
        [200, 300],
      ],
      delay_blocks: [[NaN, NaN]],
    });
    await wrapper.vm.get_dynamic_sample_length();
    expect(wrapper.vm.x_axis_sample_length).toBe(250);

    await wrapper.setData({
      last_x_value: 0,
      datapoints: [[0, 0]],
      delay_blocks: [[NaN, NaN]],
    });
    await wrapper.vm.get_dynamic_sample_length();
    expect(wrapper.vm.x_axis_sample_length).toBe(100);
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

    await store.dispatch("stimulation/handle_protocol_order", test_protocol_order);
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
    wrapper.vm.$options.watch.x_axis_min.call(wrapper.vm, 100);
    wrapper.vm.$options.watch.x_axis_sample_length.call(wrapper.vm, 1000);
    wrapper.vm.$options.watch.y_min.call(wrapper.vm, 0);
    wrapper.vm.$options.watch.y_max.call(wrapper.vm, 100);

    expect(render_spy).toHaveBeenCalledTimes(5);
  });

  test("When a user zooms in or zooms out of the x axis in waveform graph, Then the new graph width will be reflected and the number of the ticks of the axis will change accordingly", async () => {
    const wrapper = mount(StimulationStudioWaveform, {
      store,
      localVue,
    });

    expect(wrapper.vm.frequency_of_x_ticks).toBe(10);
    expect(wrapper.vm.div__waveform_graph__dynamic_style).toStrictEqual({ width: "1280px" });
    await wrapper.setProps({ plot_area_pixel_width: 1800 });
    expect(wrapper.vm.frequency_of_x_ticks).toBe(15);
    expect(wrapper.vm.div__waveform_graph__dynamic_style).toStrictEqual({ width: "1880px" });
  });

  test("When a user adds a delay repeat to the end of the protocol, Then it will mutation to state and will automatically update in the waveform graph", async () => {
    const wrapper = mount(StimulationStudioProtocolViewer, {
      store,
      localVue,
    });

    const expected_delay_values = [[3040, 3045]];
    const test_value = 5;

    await store.dispatch("stimulation/handle_protocol_order", test_protocol_order);
    await store.dispatch("stimulation/handle_new_rest_duration", test_value);
    expect(wrapper.vm.delay_blocks).toBe(store.state.stimulation.delay_blocks);
    expect(wrapper.vm.delay_blocks).toStrictEqual(expected_delay_values);
  });
});
