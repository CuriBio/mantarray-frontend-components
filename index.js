// adapted from https://github.com/talk-to/vue-components/blob/master/src/index.js
// export { default as Waveform } from "./components/waveform/Waveform.vue";

// Why don't you export default?
// https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/

// Pure JS
export { convert_from_json_of_sample_idx_and_value } from "./js_utils/waveform_data_formatter";
export { get_well_slice_to_display } from "./js_utils/waveform_data_formatter";
export { get_array_slice_to_display } from "./js_utils/waveform_data_formatter";
export { convert_from_json_of_well_indices_and_x_y_arrays } from "./js_utils/waveform_data_formatter";
export { append_well_data } from "./js_utils/waveform_data_formatter";
export { WellTitle } from "./js_utils/labware_calculations";
export { TextValidation } from "./js_utils/text_validation";

// Store
export { default as data_store_module } from "./store/modules/data";
export { default as playback_store_module } from "./store/modules/playback";
export { default as settings_store_module } from "./store/modules/settings";
export { default as waveform_store_module } from "./store/modules/waveform";
export { default as twentyfourcontrols_store_module } from "./store/modules/twentyfourcontrols";
export { default as flask_store_module } from "./store/modules/flask";
export {
  system_status_regexp,
  system_status_when_server_ready_regexp,
  system_status_when_initializing_instrument_regexp,
  system_status_when_server_initializing_regexp,
  all_mantarray_commands_regexp,
} from "./store/modules/flask/url_regex";
export { default as stimulation_store_module } from "./store/modules/stimulation";
export { default as heatmap_store_module } from "./store/modules/heatmap";
export { default as gradient_store_module } from "./store/modules/gradient";
export { TWITCH as DATA_ENUMS } from "./store/modules/data/enums";
export { ENUMS as PLAYBACK_ENUMS } from "./store/modules/playback/enums";
export { STATUS as FLASK_STATUS_ENUMS } from "./store/modules/flask/enums";
export { METRIC_UNITS as HEATMAP_METRIC_UNITS } from "./store/modules/heatmap/enums";
export { default as create_web_socket_plugin } from "./store/plugins/websocket";
export { socket } from "./store/plugins/websocket";

// Waveform Components
export { default as Waveform } from "./components/playback/waveform/Waveform.vue";
export { default as ContinuousWaveform } from "./components/playback/waveform/ContinuousWaveform.vue";

// Playback Controls and Player
export { default as XAxisControls } from "./components/playback/controls/XAxisControls.vue";
export { default as YAxisControls } from "./components/playback/controls/YAxisControls.vue";
export { default as YAxisControlsSettings } from "./components/playback/controls/YAxisControlsSettings.vue";
export { default as WebPlayerControls } from "./components/playback/controls/player/WebPlayerControls.vue";
export { default as DesktopPlayerControls } from "./components/playback/controls/player/DesktopPlayerControls.vue";
export { default as PlayerControlsSettingsButton } from "./components/playback/controls/player/PlayerControlsSettingsButton.vue";
export { default as PlateBarcode } from "./components/playback/controls/PlateBarcode.vue";
export { default as StimulationStudioControls } from "./components/playback/controls/StimulationStudioControls.vue";

// Settings Components
export { default as SettingsForm } from "./components/settings/SettingsForm.vue";
export { default as AddCustomer } from "./components/settings/AddCustomer.vue";
export { default as EditCustomer } from "./components/settings/EditCustomer.vue";
export { default as AddUser } from "./components/settings/AddUser.vue";
export { default as EditUser } from "./components/settings/EditUser.vue";

// Basic Widgets
export { default as PlateWell } from "./components/basic_widgets/PlateWell.vue";
export { default as InputWidget } from "./components/basic_widgets/InputWidget.vue";
export { default as ButtonWidget } from "./components/basic_widgets/ButtonWidget.vue";
export { default as InputDropDown } from "./components/basic_widgets/InputDropDown.vue";
export { default as SelectDropDown } from "./components/basic_widgets/SelectDropDown.vue";
export { default as CheckBoxWidget } from "./components/basic_widgets/CheckBoxWidget.vue";
export { default as RadioButtonWidget } from "./components/basic_widgets/RadioButtonWidget.vue";
export { default as StimulationStudioPlateWell } from "./components/basic_widgets/StimulationStudioPlateWell.vue";
export { default as ToggleWidget } from "./components/basic_widgets/ToggleWidget.vue";

// Plate Based
export { default as PlateNavigator } from "./components/plate_based_widgets/navigator/PlateNavigator.vue";
export { default as PlateMapEditor } from "./components/plate_based_widgets/mapeditor/PlateMapEditor.vue";
export { default as StimulationStudioWidget } from "./components/plate_based_widgets/stimulationstudio/StimulationStudioWidget.vue";

// Status Related
export { default as StatusBar } from "./components/status/StatusBar.vue";
export { default as RecordingTime } from "./components/status/RecordingTime.vue";
export { default as SimulationMode } from "./components/status/SimulationMode.vue";
export { default as ErrorCatchWidget } from "./components/status/ErrorCatchWidget.vue";
export { default as UploadFilesWidget } from "./components/status/UploadFilesWidget.vue";
export { default as BarcodeEditDialog } from "./components/status/BarcodeEditDialog.vue";
export { default as GradientBar } from "./components/status/GradientBar.vue";
export { default as StatusWarningWidget } from "./components/status/StatusWarningWidget.vue";

// HeatMap Layout
export { default as HeatMap } from "./components/heatmap/HeatMap.vue";
export { default as PlateHeatMap } from "./components/plate_based_widgets/mapeditor/PlateHeatMap.vue";

// Stimulation Studio
export { default as StimulationStudioCreateAndEdit } from "./components/stimulation/StimulationStudioCreateAndEdit.vue";
export { default as StimulationStudioDragAndDropPanel } from "./components/stimulation/StimulationStudioDragAndDropPanel.vue";
export { default as StimulationStudioBlockViewEditor } from "./components/stimulation/StimulationStudioBlockViewEditor.vue";
export { default as StimulationStudioWaveformSettingModal } from "./components/stimulation/StimulationStudioWaveformSettingModal.vue";
export { default as StimulationStudioRepeatDelayModal } from "./components/stimulation/StimulationStudioRepeatDelayModal.vue";
export { default as StimulationStudioProtocolViewer } from "./components/stimulation/StimulationStudioProtocolViewer.vue";
export { default as StimulationStudioWaveform } from "./components/stimulation/StimulationStudioWaveform.vue";
export { default as StimulationStudioZoomControls } from "./components/stimulation/StimulationStudioZoomControls.vue";
export { default as StimulationStudio } from "./components/stimulation/StimulationStudio.vue";
