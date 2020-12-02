<template>
  <div>
    <AddCustomer :dataindex="0"> </AddCustomer>
  </div>
</template>

<script>
import { AddCustomer } from "@/dist/mantarray.common";
// import AddCustomer from "@/components/playback/controls/player/AddCustomer.vue";
export default {
  components: {
    AddCustomer,
  },
};
</script>
