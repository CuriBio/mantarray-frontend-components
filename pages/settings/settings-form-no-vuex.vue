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
    this.$store.commit("settings/set_beta_2_mode", true);
  },
};
</script>
