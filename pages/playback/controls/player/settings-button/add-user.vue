<template>
  <div>
    <AddUser :dataindex="0"> </AddUser>
  </div>
</template>

<script>
import { AddUser } from "@/dist/mantarray.common";
// import AddUser from "@/components/playback/controls/player/AddUser.vue";
export default {
  components: {
    AddUser,
  },
};
</script>
