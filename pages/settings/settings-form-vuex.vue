<template>
  <div>
    <SettingsForm></SettingsForm>
  </div>
</template>

<script>
// import { SettingsForm } from "@/dist/mantarray.common";
import SettingsForm from "@/components/settings/SettingsForm.vue";

export default {
  components: {
    SettingsForm,
  },
  created: function () {
    const array_of_userid_1 = [
      {
        user_id: 0,
        uuid: "2VSckkBYr2An3dqHEyfRRE",
        username: "User account -1",
      },
      {
        user_id: 1,
        uuid: "5FY8KwTsQaUJ2KzHJGetfE",
        username: "User account -2",
      },
    ];
    const array_of_userid_2 = [
      {
        user_id: 0,
        uuid: "2VSckkkkk2An3dqHEyfRRE",
        username: "Lab User -1",
      },
      {
        user_id: 1,
        uuid: "5FY8ghtsQaUJ2KzHJGetfE",
        username: "Intern -1",
      },
    ];
    const array_of_customerids = [
      {
        cust_idx: 0,
        cust_id: "4vqyd62oARXqj9nRUNhtLQ",
        pass_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        username: "Customer account -1",
        user_ids: array_of_userid_1,
      },
      {
        cust_idx: 1,
        cust_id: "6cBaidlJ84Ggc5JA7IYCgv",
        pass_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        username: "Customer account -2",
        user_ids: array_of_userid_2,
      },
    ];
    this.$store.commit("settings/set_customer_account_ids", array_of_customerids);
    this.$store.commit("settings/set_customer_index", 0);
    this.$store.commit("settings/set_user_index", 0);
  },
};
</script>
