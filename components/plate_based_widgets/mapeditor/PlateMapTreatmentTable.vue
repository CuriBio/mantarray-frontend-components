<template>
  <div class="div__platemap-treatmenttable-backdrop">
    <b-table class="b-table__background-container" striped hover :items="items" :fields="fields" />
  </div>
</template>
<script>
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import { BTable } from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.component("BTable", BTable);

export default {
  name: "PlateMapTreatmentTable",
  components: { BTable },
  props: {},
  data() {
    return {
      fields: ["first_name", "last_name", "age"],
      items: [
        { isActive: true, age: 40, first_name: "Dickerson", last_name: "Macdonald" },
        { isActive: false, age: 21, first_name: "Larsen", last_name: "Shaw" },
        { isActive: false, age: 89, first_name: "Geneva", last_name: "Wilson" },
        { isActive: true, age: 38, first_name: "Jami", last_name: "Carney" },
      ],
    };
  },
  methods: {},
};
</script>
<style scoped>
.div__platemap-treatmenttable-backdrop {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  background: rgb(28, 28, 28);
  position: relative;
  width: 850px;
  height: 275px;
  visibility: visible;
  border: none;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px 0px;
  pointer-events: all;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.b-table__background-container {
  font-family: Muli;
  color: #ffff;
  width: 100%;
  position: relative;
  text-align: center;
  height: 100%;
}
</style>
