<template>
  <div class="grid-container">
    <div v-for="c in colors" :key="c" :style="`background: ${c};`" class="color-container" />
  </div>
</template>
<script>
import { COLOR_PALETTE } from "@/store/modules/stimulation/enums";
export default {
  data() {
    return {
      colors: COLOR_PALETTE,
    };
  },
};
</script>
<style scoped>
.color-container {
  position: relative;
  border: 2px solid white;
  height: 100px;
  width: 100px;
  display: flex;
  flex-direction: row;
}
.grid-container {
  height: 1vh;
  width: 1vw;
  display: grid;
  position: absolute;
  grid-template-areas:
    "0 1 2 3 4 5"
    "6 7 8 9 10 11"
    "12 13 14 15 16 17"
    "18 19 20 21 22 23";
}
</style>
