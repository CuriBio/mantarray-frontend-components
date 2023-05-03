<template>
  <div>
    <SettingsForm></SettingsForm>
  </div>
</template>

<script>
import { SettingsForm } from "@/dist/mantarray.common";
// import SettingsForm from "@/components/settings/SettingsForm.vue";

export default {
  components: {
    SettingsForm,
  },
  created: function () {
    this.$store.commit("settings/set_beta_2_mode", true);
    const array_of_user_accounts = [
      {
        customer_id: "4vqyd62oARXqj9nRUNhtLQ",
        user_password: "941532a0-6be1-443a-a9d5-d57bdf180a52",
        user_name: "User account -1",
      },
      {
        customer_id: "6cBaidlJ84Ggc5JA7IYCgv",
        user_password: "941532a0-6be1-443a-cdee-d57bdf180a52",
        user_name: "User account -2",
      },
    ];
    this.$store.commit("settings/set_user_accounts", array_of_user_accounts);
    this.$store.commit("settings/set_active_user_index", 0);
    this.$store.commit("settings/set_pulse3d_versions", ["12.34.56", "0.24.6", "1.0.0"]);
  },
};
</script>
s
