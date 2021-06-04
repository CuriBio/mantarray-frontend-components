<template>
  <div class="div__simulationstudio-backdrop">
    <span class="span__stimulationstudio-layout-create_edit-header-label"
      >Create/Edit Stimulation Protocol</span
    >
    <span class="span__stimulationstudio-layout-subheader-label">Select/Create Protocol</span>
    <div class="div__stimulationstudio-select-dropdown-container">
      <SelectDropDown
        :options_text="protocol_list"
        :input_width="550"
        @selection-changed="selected_protocol_change"
      />
    </div>
    <canvas class="canvas__stimulationstudio-button-separator" />
    <div v-for="(key, value, idx) in btn_labels" :key="value" @click.exact="handle_click(idx)">
      <div :class="getClass(idx)" :style="key">
        <span :class="getLabelClass(idx)">{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import SelectDropDown from "@/components/basic_widgets/SelectDropDown.vue";
import { mapGetters } from "vuex";

export default {
  name: "StimulationStudioCreateAndEdit",
  components: {
    SelectDropDown,
  },
  data() {
    return {
      btn_labels: {
        "Apply to Selection": " left: 19%; top: 49% ",
        "Clear Selection": " left: 51%; top: 49% ",
        "Use Active Stimulation Settings": " left: 3%; top: 75%; width: 40% ",
        "Import Protocol(s)": " left: 45%; top: 75%; width: 25% ",
        "Export Protocol(s)": " left: 72%; top: 75%; width: 25% ",
      },
      selected_protocol_idx: 0,
    };
  },
  computed: {
    ...mapGetters("stimulation", {
      protocol_list: "get_protocols",
    }),
  },
  methods: {
    selected_protocol_change(idx) {
      this.selected_protocol_idx = idx;
    },
    handle_click(idx) {
      if (idx === 0) this.$store.commit("stimulation/apply_selected_protocol", this.selected_protocol_idx);
      else if (idx === 1) this.$store.commit("stimulation/clear_selected_protocol");
    },
    getClass(idx) {
      if (this.selected_protocol_idx === 0 && idx === 0)
        return "div__stimulationstudio-btn-container-disable";
      else return "div__stimulationstudio-btn-container";
    },
    getLabelClass(idx) {
      if (this.selected_protocol_idx === 0 && idx === 0) return "span__stimulationstudio-btn-label-disable";
      else return "span__stimulationstudio-btn-label";
    },
  },
};
</script>

<style scoped>
.div__simulationstudio-backdrop {
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  top: 11%;
  left: 45%;
  background: rgb(17, 17, 17);
  position: absolute;
  width: 630px;
  height: 280px;
  visibility: visible;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px 0px;
  pointer-events: all;
}
.span__stimulationstudio-layout-create_edit-header-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  padding-top: 15px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-size: 19px;
  color: rgb(255, 255, 255);
  text-align: center;
}
.span__stimulationstudio-layout-subheader-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  top: 45px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 17px;
  color: rgb(183, 183, 183);
}
.div__stimulationstudio-select-dropdown-container {
  pointer-events: all;
  white-space: nowrap;
  line-height: 100%;
  transform: rotate(0deg);
  position: absolute;
  width: 210px;
  height: 50px;
  top: 75px;
  right: 380px;
  padding: 5px;
  visibility: visible;
}
.div__stimulationstudio-select-dropdown-container > .div__input-dropdown-background {
  background: none;
  border: none;
}

.div__stimulationstudio-btn-container {
  display: flex;
  justify-content: center;
  align-content: center;
  position: absolute;
  width: 30%;
  height: 50px;
  visibility: visible;
  background: #b7b7b7;
}

.div__stimulationstudio-btn-container-disable {
  display: flex;
  justify-content: center;
  align-content: center;
  position: absolute;
  width: 30%;
  height: 50px;
  visibility: visible;
  background: #b7b7b7c9;
}

.div__stimulationstudio-btn-container:hover {
  background: #b7b7b7c9;
  cursor: pointer;
}

.span__stimulationstudio-btn-label {
  transform: translateZ(0px);
  line-height: 50px;
  font-family: Muli;
  font-size: 16px;
  color: rgb(0, 0, 0);
}

.span__stimulationstudio-btn-label-disable {
  transform: translateZ(0px);
  line-height: 50px;
  font-family: Muli;
  font-size: 16px;
  color: #6e6f72;
}

.canvas__stimulationstudio-button-separator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 90%;
  height: 2px;
  top: 70%;
  visibility: visible;
  background-color: #3f3f3f;
  opacity: 0.5;
}
</style>
