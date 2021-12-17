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
    const array_of_customerids = [
      {
        cust_idx: 0,
        cust_id: "4vqyd62oARXqj9nRUNhtLQ",
        pass_key: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        user_account_id: "Customer account -1",
      },
      {
        cust_idx: 1,
        cust_id: "6cBaidlJ84Ggc5JA7IYCgv",
        pass_key: "941532a0-6be1-443a-cdee-d57bdf180a52",
        user_account_id: "Customer account -2",
      },
    ];
    this.$store.commit("settings/set_customer_account_ids", array_of_customerids);
    this.$store.commit("settings/set_customer_index", 0);
  },
};
</script>
