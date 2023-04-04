import { mount } from "@vue/test-utils";
import StimulationRunningWidget from "@/components/status/StimulationRunningWidget.vue";

describe("StimulationRunningWidget.vue", () => {
  test("renders correct text when stim_play_state is true", async () => {
    const wrapper = mount(StimulationRunningWidget, {
      computed: {
        stim_play_state: () => true,
      },
    });

    const text_div = wrapper.find(".div__stimulation_status");
    expect(text_div.text()).toBe("Stimulation is Running");

    await wrapper.vm.$nextTick();

    const border_style = text_div.element.style.border;
    const background_color = text_div.element.style.backgroundColor;

    expect(border_style).toBe("2px solid red");
    expect(background_color).toBe("red");

    wrapper.destroy();
  });

  test("renders correct text when stim_play_state is false", async () => {
    const wrapper = mount(StimulationRunningWidget, {
      computed: {
        stim_play_state: () => false,
      },
    });

    const text_div = wrapper.find(".div__stimulation_status");
    expect(text_div.text()).toBe("Stimulation is Stopped");

    await wrapper.vm.$nextTick();

    const border_style = text_div.element.style.border;
    const background_color = text_div.element.style.backgroundColor;

    expect(border_style).toBe("2px solid red");
    expect(background_color).toBe("red");

    wrapper.destroy();
  });
});
