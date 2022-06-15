<template>
  <div>
    <RecordingNameInputWidget
      id="recording-name-input-prompt"
      :default_recording_name="'Test Recording Name'"
    />
  </div>
</template>

<script>
// import { RecordingNameInputWidget } from "@/dist/mantarray.common";
import RecordingNameInputWidget from "@/components/status/RecordingNameInputWidget.vue";

export default {
  components: {
    RecordingNameInputWidget,
  },
};
</script>
