<template>
  <div>
    <div
      v-for="btn_index in num_of_btn"
      :key="btn_index"
      class="div__radio_selected"
      @click="radio_toggle(btn_index - 1)"
    >
      <FontAwesomeIcon
        v-show="status[btn_index - 1]"
        :icon="['far', 'dot-circle']"
      />
      <FontAwesomeIcon
        v-show="!status[btn_index - 1]"
        :icon="['far', 'circle']"
      />
      {{ radio_buttons[btn_index - 1] }}
    </div>
  </div>
</template>
<script>
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircle as fa_circle } from "@fortawesome/free-regular-svg-icons";
import { faDotCircle as fa_dotcircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fa_circle);
library.add(fa_dotcircle);
export default {
  name: "RadioButtonWidget",
  components: {
    FontAwesomeIcon,
  },
  props: {
    radio_buttons: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      status: function () {
        return new Array(this.num_of_btn).fill(false);
      },
    };
  },
  computed: {
    num_of_btn: function () {
      return this.radio_buttons.length;
    },
  },
  methods: {
    radio_toggle: function (index) {
      const button_status = new Array(this.num_of_btn).fill(false);
      button_status[index] = true;
      this.status = button_status;
      this.$emit("radio-btn-selected", index);
    },
  },
};
</script>
<style type="text/css">
.div__radio_selected {
  white-space: nowrap;
  padding-top: 15px;
  color: #b7b7b7;
  padding-bottom: 7px;
  user-select: none;
  font-family: Muli;
  font-weight: normal;
  font-style: normal;
  text-decoration: none;
  font-size: 15px;
}
</style>
