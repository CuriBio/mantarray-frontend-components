<template>
  <div class="div__platemap-createapply-backdrop">
    <div class="div__platemap-createapply-header">Well Settings</div>
    <div class="div__platemap-createapply-subheader">Well Colors</div>
    <div class="div__platemap-createapply-color-container" />
    <canvas class="canvas__common-horizontal-line" />
    <div class="div__platemap-createapply-subheader">Well Treatments</div>
    <div class="div__platemap-createapply-buttons-container">
      <div
        v-for="(value, idx) in ['Select Treatment(s)', 'Create Treatment']"
        :id="idx"
        :key="value"
        class="div__platemap-createapply-button-background"
        @click.exact="handle_click"
      >
        {{ value }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PlateMapCreateApply",
  components: {},
  props: {},
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped>
.div__platemap-createapply-backdrop {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(28, 28, 28);
  position: absolute;
  width: 450px;
  height: 280px;
  top: 0px;
  left: 450px;
  visibility: visible;
  border: 0px none rgb(0, 0, 0);
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px 0px;
  pointer-events: all;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.div__platemap-createapply-header {
  width: 450px;
  text-align: center;
  font-family: Muli;
  height: 40px;
  top: 10px;
  font-size: 20px;
  position: relative;
  color: #ffffff;
}
.div__platemap-createapply-subheader {
  width: 450px;
  text-align: center;
  font-family: Muli;
  height: 45px;
  top: 10px;
  font-size: 18px;
  position: relative;
  color: #b7b7b7;
}
.canvas__common-horizontal-line {
  transform: rotate(0deg);
  pointer-events: all;
  position: relative;
  height: 2px;
  width: 350px;
  visibility: visible;
  z-index: 3;
  background-color: #3f3f3f;
  opacity: 0.5;
}
.div__platemap-createapply-buttons-container {
  display: flex;
  flex-direction: row;
  position: relative;
  height: 70px;
  width: 415px;
  justify-content: center;
  align-items: center;
}
.div__platemap-createapply-color-container {
  position: relative;
  height: 30px;
  width: 400px;
  border: 1px dashed #b7b7b7c9;
  margin: 7px;
}

.div__platemap-createapply-button-background {
  background: #b7b7b7;
  height: 45px;
  line-height: 2.5;
  position: relative;
  width: 220px;
  margin: 10px;
  text-align: center;
  font-size: 16px;
  font-family: Muli;
}

.div__platemap-createapply-button-background:hover {
  background: #b7b7b7c9;
  cursor: pointer;
}
</style>
