<template>
  <div>
    <div class="div__heatmap-gradient-holder" :style="value"></div>
    <span class="span__heatmap-scale-higher-value">
      {{ upper_range }}&nbsp;<wbr />μN</span
    >
    <span class="span__heatmap-scale-lower-value" :style="top_shift"
      >{{ lower_range }}&nbsp;<wbr />μN</span
    >
  </div>
</template>
<script>
export default {
  name: "HeatMapColorBar",
  props: {
    gradient_uuid: {
      type: String,
      default: "",
    },
    lower_range: {
      type: String,
      default: "",
    },
    upper_range: {
      type: String,
      default: "",
    },
    gradient_range: {
      type: Array,
      default: function () {
        return [];
      },
    },
    heatmap_height: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      heatmap_uuid: "0f81155d-23ec-4790-a3fe-92a6cc7c3c47",
      uuid_defined_colormap: [
        { color: "#2c7bb6", offset: "0%" },
        { color: "#00a6ca", offset: "12.5%" },
        { color: "#00ccbc", offset: "25%" },
        { color: "#90eb9d", offset: "37.5%" },
        { color: "#ffff8c", offset: "50%" },
        { color: "#f9d057", offset: "62.5%" },
        { color: "#f29e2e", offset: "75%" },
        { color: "#e76818", offset: "87.5%" },
        { color: "#d7191c", offset: "100%" },
      ],
    };
  },
  watch: {
    gradient_uuid: function () {
      let uuid_gradient = "";
      if (this.gradient_uuid == this.heatmap_uuid) {
        this.value =
          "height: " +
          this.heatmap_height +
          "px; background: linear-gradient(to top,";
        for (let i = 0; i < this.uuid_defined_colormap.length; i++) {
          uuid_gradient =
            uuid_gradient +
            this.uuid_defined_colormap[i].color +
            " " +
            this.uuid_defined_colormap[i].offset +
            ", ";
        }
        this.value = this.value + uuid_gradient.slice(0, -1) + ");";
      }
    },
    gradient_range: function () {
      let uuid_gradient = "";
      if (this.gradient_uuid != this.heatmap_uuid) {
        this.value =
          "height: " +
          this.heatmap_height +
          "px; background: linear-gradient(to top,";
        for (let i = 0; i < this.gradient_range.length; i++) {
          const color = this.gradient_range[i].color.toString();
          const offset = this.gradient_range[i].offset.toString();
          uuid_gradient = uuid_gradient + color + " " + offset + ", ";
        }
        this.value = this.value + uuid_gradient.slice(0, -1) + ");";
      }
    },
    heatmap_height: function () {
      const top_change = this.heatmap_height - 16;
      this.top_shift = "top: " + top_change.toString() + "px;";
      let uuid_gradient = " ";
      if (this.gradient_uuid === this.heatmap_uuid) {
        this.value =
          "height: " +
          this.heatmap_height +
          "px; background: linear-gradient(to top, ";
        for (let i = 0; i < this.uuid_defined_colormap.length; i++) {
          uuid_gradient =
            uuid_gradient +
            this.uuid_defined_colormap[i].color +
            " " +
            this.uuid_defined_colormap[i].offset +
            ",";
        }
        this.value = this.value + uuid_gradient.slice(0, -1) + ");";
      } else {
        if (this.gradient_uuid != this.heatmap_uuid) {
          this.value =
            "height: " +
            this.heatmap_height +
            "px; background: linear-gradient(to top,";
          for (let i = 0; i < this.gradient_range.length; i++) {
            const color = this.gradient_range[i].color.toString();
            const offset = this.gradient_range[i].offset.toString();
            uuid_gradient = uuid_gradient + color + " " + offset + ",";
          }
          this.value = this.value + uuid_gradient.slice(0, -1) + ");";
        }
      }
    },
  },
  created() {
    this.top_shift = "";
    this.value = "";
    const top_change = this.heatmap_height - 16;
    this.top_shift = "top: " + top_change.toString() + "px;";
    let uuid_gradient = " ";
    if (this.gradient_uuid == this.heatmap_uuid) {
      this.value =
        "height: " +
        this.heatmap_height +
        "px; background: linear-gradient(to top, ";
      for (let i = 0; i < this.uuid_defined_colormap.length; i++) {
        uuid_gradient =
          uuid_gradient +
          this.uuid_defined_colormap[i].color +
          " " +
          this.uuid_defined_colormap[i].offset +
          ",";
      }
      this.value = this.value + uuid_gradient.slice(0, -1) + ");";
    } else {
      if (this.gradient_uuid != this.heatmap_uuid) {
        this.value =
          "height: " +
          this.heatmap_height +
          "px; background: linear-gradient(to top,";
        for (let j = 0; j < this.gradient_range.length; j++) {
          const color = this.gradient_range[j].color.toString();
          const offset = this.gradient_range[j].offset.toString();
          uuid_gradient = uuid_gradient + color + " " + offset + ",";
        }
        this.value = this.value + uuid_gradient.slice(0, -1) + ");";
      }
    }
  },
};
</script>
<style type="text/css">
.div__heatmap-gradient-holder {
  transform: rotate(0deg);
  box-sizing: border-box;
  padding: 0px;
  margin: 0px;
  position: absolute;
  width: 41px;
  top: 0px;
  left: 0px;
  visibility: visible;
  box-shadow: none;
  pointer-events: all;
}
.span__heatmap-scale-higher-value {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 92px;
  height: 22px;
  top: 0px;
  left: 45px;
  padding: 2px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
  color: rgb(183, 183, 183);
  text-align: left;
}

.span__heatmap-scale-lower-value {
  pointer-events: all;
  line-height: 100%;
  transform: rotate(0deg);
  overflow: hidden;
  position: absolute;
  width: 68px;
  height: 22px;
  left: 42px;
  padding: 5px;
  visibility: visible;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
  color: rgb(183, 183, 183);
  text-align: left;
}
</style>
