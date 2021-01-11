<template>
  <div>
    <div
      class="div__barcode-edit-dialog-background"
      width="420"
      height="240"
      style="
        pointer-events: all;
        transform: rotate(0deg);
        position: absolute;
        width: 420px;
        height: 240px;
        top: 0;
        left: 0;
        visibility: visible;
        color: #1c1c1c;
        border-color: #000000;
        background: rgb(17, 17, 17);
        z-index: 3;
      "
    >
      <span
        class="span__barcode-edit-dialog-label"
        style="
          pointer-events: all;
          line-height: 100%;
          transform: rotate(0deg);
          overflow: hidden;
          position: absolute;
          width: 420px;
          height: 30px;
          top: 17.385px;
          left: 0px;
          padding: 5px;
          visibility: visible;
          user-select: none;
          font-family: Muli;
          font-weight: normal;
          font-style: normal;
          text-decoration: none;
          font-size: 17px;
          color: rgb(255, 255, 255);
          text-align: center;
          z-index: 5;
        "
        >Warning!</span
      >
      <div
        class="span__barcode-edit-dialog-message"
        style="
          line-height: 1.2;
          transform: rotate(0deg);
          padding: 0px;
          margin: 0px;
          overflow-wrap: break-word;
          color: rgb(183, 183, 183);
          font-family: Muli;
          position: absolute;
          top: 77.641px;
          left: 21px;
          width: 378px;
          height: 123px;
          overflow: hidden;
          visibility: visible;
          user-select: none;
          text-align: center;
          font-size: 15px;
          letter-spacing: normal;
          font-weight: normal;
          font-style: normal;
          text-decoration: none;
          z-index: 7;
          pointer-events: all;
        "
      >
        <p>Do you want to enable manual barcode editing?</p>
        <p>
          Once enabled, all barcodes must be entered manually. This should only
          be done if the barcode scanner is malfunctioning. Scanning cannot be
          re-enabled until software is restarted.
        </p>
      </div>
      <div class="div__barcode-edit-dialog-button">
        <ButtonWidget
          :button_widget_width="420"
          :button_widget_height="50"
          :button_widget_top="0"
          :button_widget_left="0"
          :button_names="['Cancel', 'Yes']"
          :enabled_color="'#B7B7B7'"
          :hover_color="['#FFFFFF', '#FFFFFF']"
        >
        </ButtonWidget>
      </div>
    </div>
  </div>
</template>
<script>
import ButtonWidget from "@/components/playback/controls/player/ButtonWidget.vue";

export default {
  name: "BarcodeEditDialog",
  components: {
    ButtonWidget,
  },
  data() {},
  methods: {},
};
</script>
<style type="text/css">
.div__barcode-edit-dialog-button {
  top: 191px;
  left: 0px;
  position: absolute;
}
</style>
