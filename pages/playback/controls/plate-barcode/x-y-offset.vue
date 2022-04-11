<template>
  <div class="x-y-offset-modified">
    <ComponentToTest></ComponentToTest>
  </div>
</template>

<script>
import { BarcodeViewer as ComponentToTest } from "../../../../dist/mantarray.common";

export default {
  components: {
    ComponentToTest,
  },
};
</script>
<style>
.x-y-offset-modified *,
.x-y-offset-modified *:before,
.x-y-offset-modified *:after {
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}

.x-y-offset-modified {
  top: 111px;
  left: 88px;
  position: absolute;
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
}
</style>
