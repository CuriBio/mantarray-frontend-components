<template>
  <div class="div__platemap-treatmenttable-backdrop">
    <b-table class="b-table__background-container" :fields="fields" :items="items">
      <template #head()="data">
        <div :class="'b-table__th-class'">{{ data.field.label }}</div>
      </template>
      <template #cell(name)="data">
        <div :class="'b-table__td-class'">{{ data.item.name }}</div>
      </template>
      <template #cell(age)="data">
        <div :class="'b-table__td-class'">{{ data.item.age }}</div>
      </template>
    </b-table>
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
      fields: [
        {
          key: "name",
          label: "Name",
        },
        {
          key: "age",
          label: "Age",
        },
      ],
      items: [
        { age: 40, name: "Dickerson" },
        { age: 21, name: "Larsen" },
        { age: 89, name: "Geneva" },
        { age: 38, name: "Jami" },
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
  box-shadow: rgba(0, 0, 0, 0.7) 0px 0px 10px 0px;
  pointer-events: all;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.b-table__background-container {
  font-family: Muli;
  width: 100%;
  position: relative;
  text-align: center;
  height: 100%;
}
.b-table__th-class {
  font-size: 19px;
  background: black;
  color: #ffff;
  width: 100%;
  position: relative;
  border: none;
  height: 30px;
}
.b-table__td-class {
  font-size: 16px;
  color: #b7b7b7;
  /* border-bottom: 1px solid #ffff; */
}
</style>
