<template>
  <div>
    <div
      id="cmpDd7c4156bb0839a33f5be9502418562bf"
      class="mfWFCompCls"
      style="
        pointer-events: all;
        transform: rotate(0deg);
        position: absolute;
        background: rgb(17, 17, 17);
        width: 450px;
        height: 270px;
        top: -15px;
        left: -15px;
        visibility: visible;
        z-index: 1;
      "
    ></div>
    <span
      id="cmpD94339a6591e3ead19b4308b3a8b0cb68"
      class="mfWFCompCls"
      style="
        pointer-events: all;
        line-height: 100%;
        transform: rotate(0deg);
        overflow: hidden;
        position: absolute;
        width: 420px;
        height: 30px;
        top: 17.3852px;
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
        z-index: 3;
      "
      >An&nbsp;<wbr />error&nbsp;<wbr />occurred.
    </span>
    <div
      id="cmpD7504e31fab5b6799a0bbf3fe2514622e"
      class="mfWFCompCls mfWFTxtCls"
      style="
        line-height: 1.2;
        transform: rotate(0deg);
        padding: 0px;
        margin: 0px;
        overflow-wrap: break-word;
        color: rgb(183, 183, 183);
        font-family: Muli;
        position: absolute;
        top: 57.6407px;
        left: 41px;
        width: 338px;
        height: 66px;
        overflow: hidden;
        visibility: visible;
        user-select: none;
        text-align: center;
        font-size: 15px;
        letter-spacing: normal;
        font-weight: normal;
        font-style: normal;
        text-decoration: none;
        z-index: 5;
        pointer-events: all;
      "
    >
      <p>Mantarray software is about to shut down.</p>
      <p>
        Please send this log file to
        <a href="mailto:contact@curibio.com?subject = Error log&body = Logfile"
          >Curi Bio</a
        >
      </p>
    </div>
    <texarea
      id="error_file_path"
      name="error_file"
      rows="4"
      cols="50"
      style="
        line-height: 1.2;
        transform: rotate(0deg);
        padding: 0px;
        margin: 0px;
        overflow-wrap: break-word;
        color: rgb(183, 183, 183);
        font-family: Courier New;
        position: absolute;
        top: 137.6407px;
        left: 41px;
        width: 338px;
        height: 68px;
        overflow: hidden;
        visibility: visible;
        user-select: text;
        text-align: left;
        font-size: 15px;
        letter-spacing: normal;
        font-weight: normal;
        font-style: normal;
        text-decoration: none;
        z-index: 5;
        pointer-events: all;
      "
    >
      C:\Users\Eli\
      CuriBio\AppData\Roaming\MantarrayController\logs_flask\mantarray_log__2020_10_21_185640.txt
    </texarea>
    <div style="top: 220px; left: -5px; position: absolute">
      <ButtonWidget
        :button_widget_width="440"
        :button_widget_height="50"
        :button_widget_top="0"
        :button_widget_left="0"
        :button_names="btnnames_create_plate_map_okay"
        :enabled_color="visiblecolor_create_plate_map_okay"
        :disabled_color="hidecolor_create_plate_map_okay"
        :hover_color="hovercolors_create_plate_map_okay"
        :is_enabled="enablelist_create_plate_map_okay"
      >
      </ButtonWidget>
    </div>
  </div>
</template>
<script>
import ButtonWidget from "@/components/playback/controls/player/ButtonWidget.vue";
// import { ButtonWidget } from "@/dist/mantarray.common";
export default {
  name: "ErrorCatchWidget",
  components: {
    ButtonWidget,
  },
  data() {
    return {
      error_txt: "",
    };
  },
  computed: {},
  watch: {},
  created() {
    this.btnnames_create_plate_map_okay = ["Okay"];
    this.enablelist_create_plate_map_okay = [true];
    this.visiblecolor_create_plate_map_okay = "#FFFFFF";
    this.hidecolor_create_plate_map_okay = "#3F3F3F";
    this.hovercolors_create_plate_map_okay = ["#BD4932"];
  },
  methods: {},
};
</script>
<style>
a:link {
  color: #ffffff;
  background-color: transparent;
  text-decoration: none;
}
a:hover {
  color: #bd4932;
  background-color: transparent;
  text-decoration: none;
}
</style>
