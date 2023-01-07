<template>
  <div class="grid-container">
    <div v-for="c in colors" :key="c" :style="`background: ${c};`" class="color-container" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      colors: [
        "#3b77aa",
        "#45438d",
        "#6eb394",
        "#408444",
        "#e5eb94",
        "#f9d78c",
        "#f0a061",
        "#df6147",
        "#bd3532",
        "#801d38",
        "#632467",
        "#735d9e",
        "#7986b5",
        "#92afce",
        "#26542e",
        "#7db76d",
        "#283578",
        "#ed8943",
        "#a92d6c",
        "#e1abce",
        "#fffce4",
        "#00bcd4",
        "#3b77aa",
        "#ae96c0",
      ],
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
