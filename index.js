// adapted from https://github.com/talk-to/vue-components/blob/master/src/index.js
// export { default as Waveform } from "./components/waveform/Waveform.vue";

// Why don't you export default?
// https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/

// Pure JS
export { convert_from_json_of_sample_idx_and_value } from "./js_utils/waveform_data_formatter";
export { get_well_slice_to_display } from "./js_utils/waveform_data_formatter";
export { get_array_slice_to_display } from "./js_utils/waveform_data_formatter";
export { convert_from_json_of_well_indices_and_x_y_arrays } from "./js_utils/waveform_data_formatter";
export { append_get_available_well_data } from "./js_utils/waveform_data_formatter";
export { WellTitle } from "./js_utils/labware_calculations";

// Store
export { default as playback_store_module } from "./store/modules/playback";
export { ENUMS as PLAYBACK_ENUMS } from "./store/modules/playback/enums";
export { default as waveform_store_module } from "./store/modules/waveform";
export { default as twentyfourcontrols_store_module } from "./store/modules/twentyfourcontrols";
export { default as flask_store_module } from "./store/modules/flask";
export { STATUS as FLASK_STATUS_ENUMS } from "./store/modules/flask/enums";
export {
  system_status_regexp,
  system_status_when_server_ready_regexp,
  system_status_when_initializing_instrument_regexp,
  system_status_when_server_initializing_regexp,
  all_mantarray_commands_regexp,
} from "./store/modules/flask/url_regex";

// Components
export { default as Waveform } from "./components/playback/waveform/Waveform.vue";
export { default as ContinuousWaveform } from "./components/playback/waveform/ContinuousWaveform.vue";
export { default as XAxisControls } from "./components/playback/controls/XAxisControls.vue";
export { default as YAxisControls } from "./components/playback/controls/YAxisControls.vue";
export { default as WebPlayerControls } from "./components/playback/controls/player/WebPlayerControls.vue";
export { default as DesktopPlayerControls } from "./components/playback/controls/player/DesktopPlayerControls.vue";
export { default as PlayerControlsSettingsButton } from "./components/playback/controls/player/PlayerControlsSettingsButton.vue";
export { default as SettingsForm } from "./components/playback/controls/player/SettingsForm.vue";
export { default as PopDialogForm } from "./components/playback/controls/player/PopDialogForm.vue";
export { default as PlateNavigator } from "./components/playback/controls/PlateNavigator.vue";
export { default as PlateBarcode } from "./components/playback/controls/PlateBarcode.vue";
export { default as StatusBar } from "./components/status/StatusBar.vue";
export { default as RecordingTime } from "./components/playback/controls/RecordingTime.vue";
export { default as SimulationMode } from "./components/status/SimulationMode.vue";
export { default as PlateMapEditor } from "./components/playback/controls/PlateMapEditor.vue";
export { default as PlateWell } from "./components/playback/controls/PlateWell.vue";
export { default as InputWidget } from "./components/playback/controls/player/InputWidget.vue";
export { default as PopButton } from "./components/playback/controls/player/PopButton.vue";
