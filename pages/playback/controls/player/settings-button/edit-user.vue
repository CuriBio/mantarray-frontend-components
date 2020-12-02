<template>
  <div>
    <EditUser :dialogdata="user" :dataindex="0"> </EditUser>
  </div>
</template>

<script>
import { EditUser } from "@/dist/mantarray.common";
// import EditUser from "@/components/playback/controls/player/EditUser.vue";
export default {
  components: {
    EditUser,
  },
  data() {
    return {
      user: {
        user_id: 0,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        nickname: "Experiment anemia -1",
      },
    };
  },
};
</script>
