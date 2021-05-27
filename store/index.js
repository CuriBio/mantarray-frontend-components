// adapted from https://stackoverflow.com/questions/53446792/nuxt-vuex-how-do-i-break-down-a-vuex-module-into-separate-files

import Vuex from "vuex";
import playback_module from "./modules/playback";
// const playback_module = require("./modules/playback").default;
// const waveform_module = require("./modules/waveform").default;
import waveform_module from "./modules/waveform";
import twentyfourcontrols_module from "./modules/twentyfourcontrols";
import flask_module from "./modules/flask";
import settings_module from "./modules/settings";
import heatmap_module from "./modules/heatmap";
import stimulation_module from "./modules/stimulation";
import gradient_module from "./modules/gradient";

const createStore = () => {
  return new Vuex.Store({
    // namespaced: true, // this doesn't seem to do anything...(Eli 4/1/20) each module seems to need to be namespaced: true individually https://vuex.vuejs.org/guide/modules.html
    modules: {
      playback: playback_module,
      waveform: waveform_module,
      flask: flask_module,
      twentyfourcontrols: twentyfourcontrols_module,
      settings: settings_module,
      heatmap: heatmap_module,
      stimulation: stimulation_module,
      gradient: gradient_module,
    },
  });
};

export default createStore;
