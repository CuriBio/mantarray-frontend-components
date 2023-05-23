import { mount } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import RecordingSnapshotWidget from "@/components/status/RecordingSnapshotWidget.vue";
import Vue from "vue";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);

let NuxtStore;
let store;
let wrapper = null;

const example_coordinates = [
  [
    [0, 10],
    [1, 15],
    [2, 20],
    [3, 25],
    [4, 20],
    [5, 15],
  ],
  [
    [0, 300],
    [1, 400],
    [2, 300],
    [3, 500],
    [4, 600],
    [5, 300],
  ],
];
describe("RecordingSnapshotWidget.vue", () => {
  beforeAll(async () => {
    // note the store will mutate across tests, so make sure to re-create it in beforeEach
    const storePath = `${process.env.buildDir}/store.js`;
    NuxtStore = await import(storePath);
  });

  beforeEach(async () => {
    store = await NuxtStore.createStore();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  test.each([
    [Array(24).fill([]), true],
    [Array(23).fill([]), false],
    [Array(25).fill([]), false],
    [Array(0).fill([]), false],
  ])(
    "Given the graphs should only render if recording data has a length of 24, When RecordingSnapshotWidget is initially mounted with %s, Then the existence of the container should be %s",
    async (recording_data, bool) => {
      store.commit("data/set_recording_snapshot_data", recording_data);
      wrapper = mount(RecordingSnapshotWidget, { store, localVue });

      const graph_container = wrapper.find(".div__scrollable-container");
      expect(graph_container.exists()).toBe(bool);
    }
  );
  test("When user select 'Close' button on modal, Then the close_modal event should be emitted and commit empty recording_snapshot_data to state", async () => {
    store.commit("data/set_recording_snapshot_data", Array(24).fill([]));
    wrapper = mount(RecordingSnapshotWidget, { store, localVue });

    await wrapper.find(".span__button-label").trigger("click");

    expect(wrapper.emitted("close_modal")).toHaveLength(1);
    expect(store.state.data.recording_snapshot_data).toStrictEqual([]);
  });
  test("When RecordingSnapshotWidget is mounted, Then the y max and min values are computed for every well index", async () => {
    store.commit("data/set_recording_snapshot_data", example_coordinates);
    wrapper = mount(RecordingSnapshotWidget, { store, localVue });

    expect(wrapper.vm.y_max_min_values).toStrictEqual([
      { max: 25 + 25 * 0.2, min: 10 - 25 * 0.2 },
      { max: 600 + 600 * 0.2, min: 300 - 600 * 0.2 },
    ]);
  });
});
