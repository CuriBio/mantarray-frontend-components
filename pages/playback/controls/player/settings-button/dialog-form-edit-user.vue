<template>
  <div>
    <PopDialogForm
      category="Edit User"
      :dialogdata="array_of_userid"
      :dataindex="0"
    ></PopDialogForm>
  </div>
</template>

<script>
import { PopDialogForm } from "../../../../../dist/mantarray.common";
// import PopDialogForm from "@/components/playback/controls/player/PopDialogForm.vue";

export default {
  components: {
    PopDialogForm,
  },
  created: function () {
    this.array_of_userid = {
      user_id: 0,
      uuid: "2VSckkBYr2An3dqHEyfRRE",
      nickname: "User account -1",
    };
  },
};
</script>
