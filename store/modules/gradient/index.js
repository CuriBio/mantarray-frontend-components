import getters from "./getters";
import mutations from "./mutations";

import Color from "colorjs.io/dist/color.cjs.min.js";

const gradient_themes = [
  { name: "Warm", color_min: "#f9d78c", color_max: "#bd3532", space: "hsl" },
  { name: "Cool", color_min: "#a5d9e9", color_max: "#10648c", space: "hsl" },
  {
    name: "Blue/Green",
    color_min: "#EDF5E1",
    color_max: "#05386B",
    space: "hsl",
  },
  {
    name: "Blue/Orange",
    color_min: "#37a1d0",
    color_max: "#fc7815",
    space: "xyz",
  },
];

const default_gradients = gradient_themes.map((theme) => {
  const color = Color.range(theme.color_min, theme.color_max, {
    space: theme.space,
  });
  const steps = Color.steps(color, { steps: 256, maxDeltaE: 10 });
  return { ...theme, color: color, steps: steps };
});

const default_idx = 0;

const state = () => ({
  gradient_range_min: 0,
  gradient_range_max: 1,
  gradient_theme_idx: default_idx,
  gradients: default_gradients,
  gradient: default_gradients[default_idx],
});

export default {
  namespaced: true,
  state,
  mutations,
  getters,
};
