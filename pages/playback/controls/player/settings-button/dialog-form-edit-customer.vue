<template>
  <div>
    <PopDialogForm
      category="Edit Customer"
      :dialogdata="array_of_customerids"
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
    this.array_of_customerids = {
      cust_id: 0,
      uuid: "2VSckkkkk2An3dqHEyfRRE",
      api_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
      nickname: "Customer account -1",
      user_ids: {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        nickname: "User account -1",
      },
    };
  },
};
</script>
