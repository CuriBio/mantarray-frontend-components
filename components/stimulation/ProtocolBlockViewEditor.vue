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
      <span class="span__protocol-letter" :style="'color:' + current_color">{{ current_letter }}</span>
      <input placeholder="Protocol Name" :disabled="disabled == 1" />
      <img class="img__pencil-icon" src="~/assets/pencil-icon.png" @click="handleInput()" />
      <div class="div__scroll-container" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from "Vuex";
export default {
  name: "ProtocolBlockViewEditor",
  //   components: {
  //     InputWidget
  //   },
  data() {
    return {
      activeTab: "Basic",
      disabled: 1,
      current_letter: "",
      current_color: "",
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

.span__protocol-letter {
  position: relative;
  left: 2%;
  top: 4%;
  font-weight: bold;
  font-size: 22px;
}

.img__pencil-icon {
  left: 4%;
  position: relative;
  top: 5%;
}

.div__scroll-container {
  position: relative;
  width: 95%;
  left: 2.5%;
  top: 10%;
  height: 60%;
  overflow-x: scroll;
  background: rgb(27, 27, 27);
}

input {
  background: rgb(0, 0, 0);
  height: 30px;
  width: 250px;
  left: 3%;
  top: 3%;
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

.span__stimulationstudio-drag-drop-header-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  position: absolute;
  padding-top: 25px;
  font-size: 19px;
  color: rgb(255, 255, 255);
  text-align: center;
}
.canvas__stimulationstudio-header-seperator {
  transform: rotate(0deg);
  pointer-events: all;
  position: absolute;
  width: 272px;
  height: 2px;
  top: 65px;
  visibility: visible;
  background-color: #3f3f3f;
  opacity: 0.5;
}
</style>
