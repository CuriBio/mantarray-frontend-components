<template>
  <div class="div__plate-map-link">
    <FontAwesomeIcon class="fontawesome__pencil-icon" :icon="['fa', 'pencil-alt']" /> Plate Map Editor
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(faTrashAlt);

export default {
  name: "PlateMapAssignmentTable",
  components: { FontAwesomeIcon },
};
</script>
<style scoped>
.div__plate-map-link {
  color: #b7b7b7;
  font-size: 14px;
  font-family: Muli;
  width: 207px;
  height: 23px;
  margin-left: 30px;
}

.div__plate-map-link:hover {
  color: #b7b7b7c9;
  cursor: pointer;
}

.fontaawesome__pencil-icon {
  left: 4%;
  color: #b7b7b7;
  position: relative;
}
</style>
