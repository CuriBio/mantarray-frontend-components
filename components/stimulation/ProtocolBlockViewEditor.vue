<template>
  <div class="div__BlockViewEditor-background">
    <div class="div__Tabs-panel">
      <span
        :id="'Basic'"
        :class="activeTab === 'Advanced' ? 'span__Inactive-Tab-labels' : 'span__Active-Tab-label'"
        @click="toggleTab($event.target.id)"
        >Basic</span
      >
      <span
        :id="'Advanced'"
        :class="activeTab === 'Basic' ? 'span__Inactive-Tab-labels' : 'span__Active-Tab-label'"
        @click="toggleTab($event.target.id)"
        >Advanced</span
      >
    </div>
    <div class="div__Editor-background">
      <div class="div__setting-panel-container">
        <span class="span__protocol-letter" :style="'color:' + current_color">{{ current_letter }}</span>
        <input class="protocol_input" placeholder="Protocol Name" :disabled="disabled == 1" />
        <img class="img__pencil-icon" src="~/assets/pencil-icon.png" @click="handleInput()" />
        <div class="div__right-settings-panel">
          <SmallDropDown
            :input_height="11"
            :input_width="180"
            :options_text="stimulation_types"
            :style="'margin-right: 2%; z-index: 10;'"
          />
          <!-- <canvas class="canvas__separator" /> -->
          <span class="span__settings-label">Stimulate</span>
          <SmallDropDown
            :input_height="11"
            :input_width="100"
            :options_text="until_options"
            :style="' z-index: 10;'"
          />
          <span class="span__settings-label">every</span>
          <input class="number_input" placeholder=" " />
          <SmallDropDown
            :input_height="11"
            :input_width="80"
            :options_text="time_options"
            :style="' z-index: 10;'"
          />
          <!-- <canvas class="canvas__separator" /> -->
          <img class="img__trash-icon" src="~/assets/trash-icon.png" @click="handleTrash()" />
        </div>
      </div>
      <div class="div__scroll-container" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "Vuex";
import SmallDropDown from "@/components/basic_widgets/SmallDropDown.vue";
export default {
  name: "ProtocolBlockViewEditor",
  components: {
    SmallDropDown,
  },
  data() {
    return {
      activeTab: "Basic",
      disabled: 1,
      current_letter: "",
      current_color: "",
      stimulation_types: ["Voltage Controlled Stimulation", "Current Controlled Stimulation"],
      until_options: ["Until Stopped", "Until ... "],
      time_options: ["seconds", "milliseconds"],
    };
  },
  computed: {
    ...mapGetters("stimulation", {
      current_protocol: "get_next_protocol",
    }),
  },
  created() {
    this.current_letter = this.current_protocol.letter;
    this.current_color = this.current_protocol.color;
  },
  methods: {
    toggleTab(tab) {
      tab === "Basic" ? (this.activeTab = "Basic") : (this.activeTab = "Advanced");
    },
    handleInput() {
      this.disabled = 0;
    },
    handleTrash() {
      console.log("trashed");
    },
  },
};
</script>
<style scoped>
.div__BlockViewEditor-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  background: rgb(0, 0, 0);
  position: absolute;
  border-radius: 10px;
  width: 60%;
  height: 23%;
  top: 41%;
  left: 20%;
  font-family: muli;
}

.span__settings-label {
  color: rgb(255, 255, 255);

  height: 8px;
  padding: 10px;
  font-size: 12px;
  margin-bottom: 1%;
  margin-left: 2%;
}

.div__setting-panel-container {
  position: relative;
  width: 100%;
  height: 40px;
  display: flex;
  top: 2%;
  align-items: center;
}

.div__delete-confirmation-modal {
  border: 1px solid white;
  height: 50%;
  position: relative;
}

.span__protocol-letter {
  position: relative;
  left: 2%;
  font-weight: bold;
  font-size: 22px;
}

.img__pencil-icon {
  left: 4%;
  position: relative;
}

img:hover {
  cursor: pointer;
}
.img__trash-icon {
  margin-left: 5%;
}

.div__scroll-container {
  position: relative;
  width: 97%;
  left: 1.5%;
  top: 5%;
  height: 65%;
  overflow-x: scroll;
  background: rgb(27, 27, 27);
}

.div__right-settings-panel {
  width: 80%;
  display: flex;
  justify-self: flex-end;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  margin: 5px;
}

.number_input {
  background: #1c1c1c;
  height: 25px;
  width: 40px;
  border: none;
  color: #b7b7b7;
  font-size: 11px;
  margin-right: 1%;
}

.protocol_input {
  background: rgb(0, 0, 0);
  height: 30px;
  width: 250px;
  left: 3%;
  position: relative;
  border: none;
  padding: 0 10px 0 10px;
  color: rgb(255, 255, 255);
}

.span__Inactive-Tab-labels {
  background: rgb(8, 8, 8);
  border: 2px solid rgb(17, 17, 17);
  width: 48%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b7b7b7b7;
}

.span__Active-Tab-label {
  width: 50%;
  height: 90%;
  background: rgb(17, 17, 17);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #b7b7b7;
}

.div__Editor-background {
  transform: rotate(0deg);
  box-sizing: border-box;
  background: rgb(17, 17, 17);
  width: 100%;
  height: 82%;
}
.div__Tabs-panel {
  background: rgb(17, 17, 17);
  width: 20%;
  height: 13%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  cursor: pointer;
}
.canvas__separator {
  transform: rotate(90deg);
  width: 30px;
  height: 2px;
  margin-left: 2%;
  background-color: #3f3f3f;
  left: 10%;
}
</style>
