<template>
  <label class="switch">
    <input
      :id="`toggle_input_${label}`"
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      @click="toggle_checkbox"
    />
    <div class="slider round" :style="slider__slider_dynamic_style" />
  </label>
</template>
<script>
export default {
  name: "ToggleWidget",
  props: {
    checked_state: { type: Boolean, default: false },
    label: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      checked: false,
    };
  },
  computed: {
    slider__slider_dynamic_style: function () {
      return this.disabled ? "cursor: default" : "cursor: pointer";
    },
  },
  watch: {
    checked_state: function () {
      this.checked = this.checked_state;
    },
  },
  created() {
    this.checked = this.checked_state;
  },
  methods: {
    toggle_checkbox() {
      this.checked = !this.checked;
      this.$emit("handle_toggle_state", this.checked, this.label);
    },
  },
};
</script>
<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: hsla(0, 0%, 30%, 0.652);
  -webkit-transition: 0.6s;
  transition: 0.6s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: #6e6f72;
  -webkit-transition: 0.6s;
  transition: 0.6s;
}

input:checked + .slider {
  background-color: #00c465;
}

input:focus + .slider {
  box-shadow: 0 0 1px #a7a8a9;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
  background-color: #ececed;
}

.round {
  border-radius: 24px;
}

.round:before {
  border-radius: 50%;
}

input:disabled + .slider {
  background-color: #302f2f;
}

input:disabled + .slider:before {
  background-color: #424242;
}
</style>
