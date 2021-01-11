import { mount } from "@vue/test-utils";
import WebPlayerControls from "@/components/playback/controls/player/WebPlayerControls.vue";
import { WebPlayerControls as dist_WebPlayerControls } from "@/dist/mantarray.common";
import playback_module from "@/store/modules/playback";

import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { createLocalVue } from "@vue/test-utils";

let wrapper = null;

const localVue = createLocalVue();
localVue.use(Vuex);
let NuxtStore;
let store;

beforeAll(async () => {
  // note the store will mutate across tests, so make sure to re-create it in beforeEach
  const storePath = `${process.env.buildDir}/store.js`;
  NuxtStore = await import(storePath);
});

beforeEach(async () => {
  store = await NuxtStore.createStore();
});

afterEach(() => {
  store.commit("playback/stop_playback_progression");
  wrapper.destroy();
});

describe("WebPlayerControls.vue", () => {
  it("should be able to mount the WebPlayerControls when loaded from the built dist file", () => {
    const propsData = {};
    wrapper = shallowMount(dist_WebPlayerControls, {
      propsData,
      store,
      localVue,
    });
    const target_span = wrapper.find(
      ".span__playback-web-player-controls-text"
    );

    expect(target_span.text()).toEqual("Playback Options:");
  });

  it("mounts in the STOPPED state when prop is toggled", async () => {
    // confirm initial condition
    expect(store.state.playback.playback_state).toEqual(
      playback_module.ENUMS.PLAYBACK_STATES["FILE_NOT_LOADED"]
    );

    const propsData = { create_with_vuex_in_stopped_state: true };
    wrapper = shallowMount(WebPlayerControls, {
      propsData,
      store,
      localVue,
    });

    expect(store.state.playback.playback_state).toEqual(
      playback_module.ENUMS.PLAYBACK_STATES["STOPPED"]
    );
  });

  it("mutates loop_playback state in Vuex when control is clicked", async () => {
    const propsData = {};
    wrapper = shallowMount(WebPlayerControls, {
      propsData,
      store,
      localVue,
    });
    const loop_playback_button = wrapper.find(
      ".svg__playback-web-player-controls-loop-button"
    );

    // confirm initial state
    expect(store.state.playback.loop_playback).toEqual(false);

    loop_playback_button.trigger("click");
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.loop_playback).toEqual(true);
    loop_playback_button.trigger("click");
    await wrapper.vm.$nextTick(); // wait for update
    expect(store.state.playback.loop_playback).toEqual(false);
  });
  it("updates display of Loop button when Vuex is updated", async () => {
    const propsData = {};
    wrapper = shallowMount(WebPlayerControls, {
      propsData,
      store,
      localVue,
    });
    const loop_playback_button = wrapper.find(
      ".svg__playback-web-player-controls-loop-button"
    );

    // confirm initial state
    expect(store.state.playback.loop_playback).toEqual(false);
    expect(loop_playback_button.classes()).not.toContain(
      "span__playback-web-player-controls--active"
    );
    expect(loop_playback_button.classes()).toContain(
      "span__playback-web-player-controls--available"
    );

    store.commit("playback/set_loop_playback", true);
    await wrapper.vm.$nextTick(); // wait for update

    expect(loop_playback_button.classes()).toContain(
      "span__playback-web-player-controls--active"
    );
    expect(loop_playback_button.classes()).not.toContain(
      "span__playback-web-player-controls--available"
    );

    store.commit("playback/set_loop_playback", false);
    await wrapper.vm.$nextTick(); // wait for update

    expect(loop_playback_button.classes()).not.toContain(
      "span__playback-web-player-controls--active"
    );
    expect(loop_playback_button.classes()).toContain(
      "span__playback-web-player-controls--available"
    );
  });

  it.each([
    [".svg__playback-web-player-controls-pause-button", "STOPPED"],
    [".svg__playback-web-player-controls-pause-button", "FILE_NOT_LOADED"],
    [".span__playback-web-player-controls-play-button", "FILE_NOT_LOADED"],
    [".svg__playback-web-player-controls-stop-button", "FILE_NOT_LOADED"],
  ])(
    "does not transition playback state in Vuex when %s button clicked while in %s state",
    async (selector_str, playback_state_enum_str) => {
      const propsData = {};
      wrapper = shallowMount(WebPlayerControls, {
        propsData,
        store,
        localVue,
      });
      const target_button = wrapper.find(selector_str);
      const playback_state_enum =
        playback_module.ENUMS.PLAYBACK_STATES[playback_state_enum_str];
      // set initial state
      await store.dispatch(
        "playback/transition_playback_state",
        playback_state_enum
      );
      await wrapper.vm.$nextTick(); // wait for update

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update
      expect(store.state.playback.playback_state).toEqual(playback_state_enum);
    }
  );

  it.each([
    ["PLAYING", "STOPPED", ".svg__playback-web-player-controls-stop-button"],
    ["PAUSED", "STOPPED", ".svg__playback-web-player-controls-stop-button"],
    ["STOPPED", "PLAYING", ".span__playback-web-player-controls-play-button"],
    ["PAUSED", "PLAYING", ".span__playback-web-player-controls-play-button"],
    ["PLAYING", "PAUSED", ".svg__playback-web-player-controls-pause-button"],
  ])(
    "transitions playback state in Vuex from %s to %s when the button matching %s is clicked",
    async (
      starting_playback_state_enum,
      ending_playback_state_enum,
      selector_str
    ) => {
      const propsData = {};
      wrapper = shallowMount(WebPlayerControls, {
        propsData,
        store,
        localVue,
      });
      const target_button = wrapper.find(selector_str);

      // set initial state
      store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES[starting_playback_state_enum]
      );
      await wrapper.vm.$nextTick(); // wait for update

      target_button.trigger("click");
      await wrapper.vm.$nextTick(); // wait for update
      expect(store.state.playback.playback_state).toEqual(
        playback_module.ENUMS.PLAYBACK_STATES[ending_playback_state_enum]
      );
    }
  );

  it.each([
    [
      ".span__playback-web-player-controls-play-button",
      "FILE_NOT_LOADED",
      false,
      false,
    ],
    [".span__playback-web-player-controls-play-button", "STOPPED", true, false],
    [".span__playback-web-player-controls-play-button", "PAUSED", true, false],
    [".span__playback-web-player-controls-play-button", "PLAYING", false, true],
    [
      ".svg__playback-web-player-controls-pause-button",
      "FILE_NOT_LOADED",
      false,
      false,
    ],
    [
      ".svg__playback-web-player-controls-pause-button",
      "STOPPED",
      false,
      false,
    ],
    [".svg__playback-web-player-controls-pause-button", "PAUSED", false, true],
    [".svg__playback-web-player-controls-pause-button", "PLAYING", true, false],
    [
      ".svg__playback-web-player-controls-stop-button",
      "FILE_NOT_LOADED",
      false,
      false,
    ],
    [".svg__playback-web-player-controls-stop-button", "STOPPED", false, false],
    [".svg__playback-web-player-controls-stop-button", "PAUSED", true, false],
    [".svg__playback-web-player-controls-stop-button", "PLAYING", true, false],
  ])(
    "updates display of button matching %s when playback_state changes in Vuex to %s so that available is %s and active is %s",
    async (
      selector_str,
      playback_state_enum,
      expected_available,
      expected_active
    ) => {
      const propsData = {};
      wrapper = shallowMount(WebPlayerControls, {
        propsData,
        store,
        localVue,
      });
      const target_button = wrapper.find(selector_str);

      // set initial state
      store.commit(
        "playback/set_playback_state",
        playback_module.ENUMS.PLAYBACK_STATES[playback_state_enum]
      );
      await wrapper.vm.$nextTick(); // wait for update
      const the_classes = target_button.classes();
      if (expected_available) {
        expect(the_classes).toContain(
          "span__playback-web-player-controls--available"
        );
      } else {
        expect(the_classes).not.toContain(
          "span__playback-web-player-controls--available"
        );
      }
      if (expected_active) {
        expect(the_classes).toContain(
          "span__playback-web-player-controls--active"
        );
      } else {
        expect(the_classes).not.toContain(
          "span__playback-web-player-controls--active"
        );
      }
    }
  );
});
