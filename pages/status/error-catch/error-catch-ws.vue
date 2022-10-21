<template>
  <div>
    <ComponentToTest log_filepath="C:\Users\Mantarray\AppData\Roaming\MantarrayController\logs_flask" />
    <button class="update-button" @click="commit_error({ error_type: 'InstrumentCreateConnectionError' })">
      InstrumentCreateConnectionError
    </button>
    <button
      class="update-button"
      :style="'top: 300px;'"
      @click="commit_error({ error_type: 'InstrumentConnectionLostError' })"
    >
      InstrumentConnectionLostError
    </button>
    <button
      class="update-button"
      :style="'top: 500px;'"
      @click="commit_error({ error_type: 'InstrumentBadDataError' })"
    >
      InstrumentBadDataError
    </button>
    <button
      class="update-button"
      :style="'top: 700px;'"
      @click="commit_error({ error_type: 'InstrumentFirmwareError' })"
    >
      InstrumentFirmwareError
    </button>
    <button
      class="update-button"
      :style="'top: 900px;'"
      @click="
        commit_error({
          error_type: 'FirmwareAndSoftwareNotCompatibleError',
          latest_compatible_sw_version: '1.2.3',
        })
      "
    >
      FirmwareAndSoftwareNotCompatibleError
    </button>
  </div>
</template>

<script>
// import { ErrorCatchWidget as ComponentToTest } from "@/dist/mantarray.common";
import ComponentToTest from "@/components/status/ErrorCatchWidget.vue";

export default {
  components: {
    ComponentToTest,
  },
  methods: {
    commit_error: function (err_info) {
      this.$store.commit("settings/set_shutdown_error_status", err_info);
    },
  },
};
</script>
<style scoped>
button {
  position: absolute;
  top: 100px;
  left: 600px;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  background-color: #4ca0af;
  z-index: 999;
}
</style>
