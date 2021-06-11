<template>
  <div class="div__background-container">
    <div class="div__DragAndDdrop-panel">
      <span class="span__stimulationstudio-drag-drop-header-label">Drag/Drop Waveforms</span>
      <canvas class="canvas__stimulationstudio-header-separator" width="272" height="2" />
      <draggable
        tag="div"
        style="display: flex; width: 100%; justify-content: space-evenly; margin-top: 80px"
        :list="icon_types"
        :group="{ name: 'order', pull: 'clone', put: false }"
      >
        <div v-for="(types, idx) in icon_types" :key="idx">
          <img :src="types.src" :style="'margin-top: 8px; cursor: pointer;'" />
        </div>
      </draggable>
    </div>
    <div class="div__scroll-container">
      <draggable
        group="order"
        class="dropzone"
        style="width: 100%; overflow: hidden; height: 118px; display: flex"
        :list="protocol_order"
      >
        <div v-for="(types, idx) in protocol_order" :key="idx">
          <img :src="types.src" :style="'margin-top: 8px; cursor: pointer;'" />
        </div>
      </draggable>
    </div>
  </div>
</template>
<script>
import draggable from "vuedraggable";
export default {
  name: "DragAndDropPanel",
  components: {
    draggable,
  },
  data() {
    return {
      icon_types: [
        { type: "Monophasic", src: require("@/assets/Monophasic-tile.png") },
        { type: "Biphasic", src: require("@/assets/Biphasic-tile.png") },
      ],
      protocol_order: [],
    };
  },
  method: {
    log(e) {
      console.log(e);
    },
  },
};
</script>
<style scoped>
.div__DragAndDdrop-panel {
  background: rgb(17, 17, 17);
  position: absolute;
  width: 23%;
  height: 100%;
  bottom: 0;
  visibility: visible;
  box-shadow: none;
  border: 2px solid rgb(0, 0, 0);
  display: flex;
  justify-content: center;
}

.div__icon-container {
  margin-top: 80px;
  display: flex;
  justify-content: space-around;
  width: 100%;
  border: 2px solid white;
}

.div__background-container {
  position: absolute;
  width: 80%;
  left: 20%;
  height: 93.5%;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
}

.div__scroll-container {
  position: relative;
  top: 46%;
  width: 73%;
  right: 26%;
  height: 13%;
  overflow-x: scroll;
  background: rgb(27, 27, 27);
  z-index: 3;
  white-space: nowrap;
}

.span__stimulationstudio-drag-drop-header-label {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  position: absolute;
  padding-top: 25px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-size: 19px;
  color: rgb(255, 255, 255);
  text-align: center;
}
.canvas__stimulationstudio-header-separator {
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
