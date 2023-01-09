Changelog for Mantarray Frontend Components
===========================================

1.3.2 (2023-01-06)
------------------

Added:
^^^^^^
- Booting up state which will now ignore /system_status errors instead of server initializing
- Check to pulse setting modal in stimulation studio to limit max duty cycle to 80%

Changed:
^^^^^^^^
- Changed Heatmap default to a range of 0-1 Hz and changed default metric to Twitch Frequency

Fixed:
^^^^^^
- Fixed websocket handler to match the data_type returned from BE for local data analysis
- Importing multiple stimulation protocols in one file will now populate dropdown correctly


1.3.1 (2022-12-13)
------------------

Fixed:
^^^^^^
- Fixed biphasic pulses being shown as monophasic pulses when interphase interval was set to 0 ms


1.3.0 (2022-12-07)
------------------

Added:
^^^^^^
- Ability to start live view, recording, and stimulation from stim studio start button
- Ability to select from previously used usernames when logging into the SettingsForm
- Check for type of barcode enter into inputs
- Log message when user enables manual barcode entry
- Closure warning when recording snapshot is running

Changed:
^^^^^^^^
- New format of JSON protocol message sent in /set_protocols route to start a stimulation
- Live view will always be stopped when a recording is stopped
- Error message now reads: "Please turn the instrument off, unplug from the PC, and then wait 10 seconds before attempting to use again"
- Allow pasting barcodes into barcode text box when manual entry is enabled
- Renamed ``recording_snapshot`` websocket handler to ``recording_snapshot_data``

Fixed:
^^^^^^
- Heatmap showing incorrect mean values. The last 5 data points of each well will now be used to calculate this value
- Prevent stimulation delay subprotocols from having fractional millisecond values which causes the app to crash


1.2.5 (2022-11-15)
------------------

Changed:
^^^^^^^^
- Max recording duration is now 10 minutes


1.2.4 (2022-11-03)
------------------

Added:
^^^^^^
- Ability to select a new color in the stim studio for pulse and delay blocks from setting modals
- Error message if MA Controller version is not compatible with the instrument firmware version

Changed:
^^^^^^^^
- Removed randomization from the pulse color generator in a stim protocols to prevent similar colors next to each other


1.2.3 (2022-10-13)
------------------

Changed:
^^^^^^^^
- SW auto update message on app close
- Include installer download when FE version does not match BE version
- Websocket handlers now look for "stimulation_data" instead of "stimulation"


1.2.2 (2022-10-11)
------------------

Added:
^^^^^^
- Plate barcode now sent in /start_managed_acquisition

Fixed:
^^^^^^
- 'Stimulate until complete' will now update stim_status to correct stopped state upon completion


1.2.1 (2022-09-28)
------------------

Changed:
^^^^^^^^
- Subprotocols can now be defined in terms of number of cycles or active duration

Fixed:
^^^^^^
- Now sends ``"Error"`` for pulse3d_version if no real pulse3d versions stored


1.2.0 (2022-09-20)
------------------

Added:
^^^^^^
- Ability to select which Pulse3d version to use in analysis of auto-upload files

Fixed:
^^^^^^
- Recording snapshot no longer available in Beta 1 mode


1.1.5 (2022-09-08)
------------------

Changed:
^^^^^^^^
- Location of wells in recording snapshot are the same as location on plate


1.1.4 (2022-08-19)
------------------

Fixed:
^^^^^^
- Fixed stim protocol marker overflow in live view


1.1.3 (2022-08-19)
------------------

Changed:
^^^^^^^^
- Exported stim data contains all protocol settings and well assignments
- Can import multiple protocols with one json file with new export functionality


1.1.2 (2022-08-18)
------------------

Changed:
^^^^^^^^
- Changed Toggle switch background to green when enabled

1.1.1 (2022-08-10)
------------------

Added:
^^^^^^
- Toggle switch to Settings Form for disabling recording snapshot feature globally
- Toggle switch to RecordingNameInputWidget for disabling recording snapshot feature for single recording

Changed:
^^^^^^^^
- Fixed mean calculation on heatmap well
- Added mean calculation to heatmap well color
- Switched append_metric_data to replace old well data instead of actully appending it to the old data
- Minutes and hours options for time units in stim studio
- ``append_metric_data`` now replaces old well data instead of appending it to the old data

Fixed:
^^^^^^
- No prevention against subprotocol durations that are too long
- Mean calculation on heatmap well and well color
- Bug preventing stim subprotocol blocks to update correctly when switching between stim protocols


1.1.0 (2022-08-01)
------------------

Added:
^^^^^^
- Tooltip message on configuration check icon that notifies user that check cannot be run while live view or a recording is active
- Ability to copy pulses in stim studio by double clicking waveform tile and then selecting 'Duplicate'.
- RecordingSnapshotWidget that appear after a recording is stopped with the first five seconds of analysis graphed for each well
- ``recording_snapshot`` websocket handler
- Tooltip to barcode input and icon that notifies user it's disabled when live view is active
- Colored background to stim studio waveform graph that corresponds to the waveform tile when hovered over
- Prevention of edits to stimulation settings while either recording or actively stimulating
- Warning to unplug stim lid before proceeding with a firmware update

Changed:
^^^^^^^^
- Frequency in pulse settings modal can now be positive non-integers instead of only positive integers
- Renamed StimulationStudioRepeatDelayModal to StimulationStudioDelayModal

Fixed:
^^^^^^
- Issue with waveform tile overflow in stimulation studio with long protocols

Removed:
^^^^^^^^
- Prevention from starting or stopping stimulation while recording
- Repeat feature in stimulation studio in favor of duplicate pulse feature


1.0.2 (2022-07-12)
------------------

Fixed:
^^^^^^

- Issue with final protocol markers not being displayed correctly when stopping stim
- Issue with scanned Beta 2 barcodes coming from the BE being considered invalid


1.0.1 (2022-07-11)
------------------

Added:
^^^^^^
- Support for new barcode scheme

Changed:
^^^^^^^^
- Updated recording time limit to 2 minutes from 5 minutes


Removed:
^^^^^^^^
- Five minute and one minute live view active warnings


1.0.0 (2022-06-30)
------------------

Added:
^^^^^^
- WS handler for h5 corruption error
- Popup error modal when h5_warning state changes

Changed:
^^^^^^^^
- Error enums will now be shown on ErrorCatchWidget modal instead of in the StatusBar component
- Minor style changes to status modals

Fixed:
^^^^^^
- Bug that failed to close firmware modals on system error
- Bug that prevented default recording name from being used


0.7.5 (2022-06-16)
------------------

Added:
^^^^^^
- Added ability to stop active processes when user selects 'Data Analysis' tab. Modal will appear asking to stop or continue.
- Data Analysis tab will not be enabled until no processes are running and system is initialized.
- Added WS handler for incoming error messages
- Added error enums to store sent through websocket
- Routes:

  - POST route to update a recording name

Changed:
^^^^^^^^
- Wells with open-circuit will have white fille color when selected instead of red.
- RecordingNameInputWidget will pop up after stop recording is selected.

  - Selecting 'Confirm' will now send request to check if name already exists. If so, warning modal will appear and ask user if they want to replace existing or choose again.


0.7.4 (2022-06-15)
------------------

Changed:
^^^^^^^^
- Stim QC message handling


0.7.3 (2022-05-19)
------------------

Added:
^^^^^^
- Handling to treat "error" stim status the same as "short"


0.7.2 (2022-05-11)
------------------

Added:
^^^^^^
- DataAnalysisCompleteWidget component pops up after completed data analyses with/without failed recordings if any occurred

Changed:
^^^^^^^^
- DataAnalysisWidget will show list recording with creation timestamps
- Removed CheckBoxWidget from DataAnalysisWidget component
- DataAnalysisControl component handles own window closure when analysis is active


0.7.1 (2022-05-09)
------------------

Added:
^^^^^^
- RecordingNameInputWidget modal pop up after start recording button pressed


0.7.0 (2022-05-05)
------------------

Added:
^^^^^^
- Components:

  - DataAnalysisControl component
  - DataAnalysisWidget component

- Routes:

  - GET route to get recording directories
  - POST route to start the analyses

- Websocket handler to receive data analysis statuses
- Data analysis state enums to handle global analysis state

Changed:
^^^^^^^^
- SettingsForm component


0.6.5 (2022-04-12)
------------------

- Added stimulation configuration check feature:

  - Changed the name of the AdditionalControls component to StimulationControls
  - Added websocket handler for stimulator_circuit_statuses
  - Added /start_stim_checks route to kick off configuration check
  - Added tooltips to relay new requirement to the start stim button, the stim plate widget, and the configuration check icon
  - Added three modals in repsonse to the completetion of a configuration check:

    - One displaying summary of open circuit wells on stim plate widget that will now be disabled
    - One letting user know a short circuit has been found and that a stim lid replacement is required before enabling stimulation
    - One letting user know that no errors were found and that they may now proceed with starting a stimulation

  - Added modal to appear when user starts a stimulation with open circuits in some wells warning them of the risk
  - Added an open circuit icon and tooltip to be displayed over the wells with open circuits in the stimulation studio to let user know they aren't in operation
  - Added a 24-hour active stimulation timer to display a warning to the user that it is recommended to run another configuration check
  - Added a spinner over the configuration check icon to be displayed when a check in running to let user know it is "in-progress"
  - Added checks preventing a calibration, live-view, or configuration check from being started while a configuration check is in-progress
  - Added check preventing user from starting a stimulation before a configuration check has been run or a short circuit error was found
  - Added configuration check to list of processes that prevent the desktop app from automatically  closing when a user exits. It will display a closure warning.

- Added stimulation status component
- Added Stim Lid Barcode requirement:

  - Changed the name of the PlateBarcode component to BarcodeViewer
  - Updated barcode websocket handler to handle stim_barcode and plate_barcode
  - Prevent user from starting a configuration check without a valid stim lid barcode
  - Removed the BarcodeEditDialogue component

- Updated response to a new plate barcode and/or new stim barcode values to require a new configuration check to be run
- Updated the StatusWarningWidget to dynamically render modal height

0.6.4 (2022-03-16)
------------------

- Fixed issue with stim subprotocols not displaying correctly in live view when:

  - Stopping stimulation
  - Switching between well quadrants


0.6.3 (2022-03-01)
------------------

- Changed accepted barcode headers to ML and MS
- Fixed stim start/stop button tooltip when calibrating

0.6.2 (2022-02-17)
------------------

- Added time unit dropdown to x-axis in Stimulation Studio to toggle ms/s
- Added StimulationControls tooltip on start/stop button when a recording is active
- Changed 30-second recording limit to 5 minutes with modal informing user that the recording has been stopped
- Changed 'Delete Protocol' modal to match all other warning modals
- Changed barcode comms from backend to use websockets
- Changed Heatmap's apply/reset button functionality
- Changed Additional Controls to be disabled until instrument is calibrated.
- Fixed player controls so that playback state can only transition to LIVE_VIEW_ACTIVE from BUFFERING
- Fixed live view button so it is disabled as soon as a user decides to switch to manual entry,
  even if a valid barcode has been scanned
- Fixed live view button tooltip displayed when calibrated but no valid barcode has been entered/scanned
- Fixed Heatmap's autoscale feature
- Fixed stim/live-view bug that wasn't displaying subprotocols longer than 10-second

0.6.1 (2022-02-03)
------------------

- Added expected firmware update duration to spinner widget
- Added firmware update timeout message
- Added minor styling updates
- Added additional controls hover modals
- Changed subprotocol edit from Shift+Click to Double Click


0.6.0 (2022-02-02)
------------------

- Added Firmware Autoupdating features
- Added prevention of starting stimulation while calibrating
- Added prevention of starting calibration while stimulating
- Added prevention of additional controls before initial calibration completes
- Added temperature controls icon to additional controls widget
- Added 30 second timer on recordings to automatically stop
- Fixed some live view performance issues
- Fixed various tooltips
- Fixed issue where many modals that emit messages could be closed by clicking on backdrop
- Changed some modal styling


0.5.9 (2022-01-06)
------------------

- Fixed bug with the changing of subprotocol markers in live view when subprotocol length is less than 1000ms
- Removed arguments from log when axios response includes an error to remove sensitive information in renderer logs

0.5.8 (2021-12-28)
------------------

- Live view timer fix that correctly resets and clears time intervals
- Add password field to settings form
- Remove sensitive information from /update_settings route
- Removed special character restrictions from password and user account id

0.5.7 (2021-12-28)
------------------

- Url encode parameters for update_settings

0.5.6 (2021-12-27)
------------------

- Added ability to send credentials through an ipcMain/ipcRenderer route to set in Electron store
- Auto-populate settings modal with existing customer credentials if present in Electron store
- Auto-upload defaults to false


0.5.5 (2021-12-20)
------------------

- Added Live View warnings
- Fixed issue with waveforms not being deleted after stopping live view
- Fixed with waveforms being appended to after stopping live view


0.5.4 (2021-12-17)
------------------

- No change, fix for github workflow

0.5.3 (2021-12-17)
------------------

- Added closure confirmation modal on window close if a stimulation is active or device is calibrating
- Added stimulation subprotocol markers along the X-axis of graphs in Live View when stimulation is active
- Added calibration modal to ensure device is empty in beta 2 mode
- Added ability to retain state when user switches routes in desktop app
- Updated customer credentials to include a User Account ID that gets validated in the BE
- Disabled auto-delete feature of local files in customer settings


0.5.2 (2021-11-17)
------------------

- Added websocket handler for file upload statuses
- Added failed and successful upload modals
- Added closure confirmation modal on window close if files are still uploading
- Updated UploadFileWidget to increase when a recording stops and when a upload status is received


0.5.1 (2021-11-08)
------------------

- Updated Y-axis zoom and heatmap range entries to allow decimal values
- Updated shutdown error message


0.5.0 (2021-11-04)
------------------

- Added websocket handler for stimulation data
- Added stim subprotocol markers to waveform players
- Added biphasic and monophasic pulse diagrams
- Updated Stim Studio to make current controlled stimulation the default
- Updated Stim play/stop button to be disabled when no protocols are assigned or if a recording is being made
- Updated all timing to be in µs
- Fixed Customer Account ID/Password validations
- Fixed stim pulses being modified when creating outgoing message
- Fixed issue with some stim pulses overlapping in protocol viewer
- Fixed issue with heatmap not updating while recording


0.4.7 (2021-10-13)
------------------

- Updated create_protocol_message for new ``/set_protocols`` format
- Added ability to enter customer credentials


0.4.6 (2021-08-27)
------------------

- Added initial Gen 1 stimulation studio
- Added warning confirmation on window close if processes (live view and recording) are still running
- Added stimulation additional controls component


0.4.5 (2021-08-23)
------------------

- Added autoscale feature to heatmap
- Fixed issue with +/- buttons of y-zoom widget not updating zoom window correctly


0.4.4 (2021-08-02)
------------------

- Added support for entering barcodes with "ML" header
- Fixed misc styling issues


0.4.3 (2021-07-28)
------------------

- Fixed heatmap styling and page reload behavior


0.4.2 (2021-07-26)
------------------

- Fixed issue with min y-zoom value of 0 being marked invalid after updating max value


0.4.1 (2021-07-22)
------------------

- Fixed exporting of new features


0.4.0 (2021-07-22)
------------------

- Added initial Gen 1 heatmap
- Added websocket to receive waveform data asynchronously and in real time
- Added initial stimulation studio
- Added currently_displayed_time_index parameter to /system_status call to Flask
- Fixed Y-axis zoom logic for input validation
- Removed /get_available_data


0.3.0 (2021-07-08)
------------------

- Added Y-axis zoom for waveform display

0.2.0 (2021-04-01)
------------------

- Added ability to skip ahead if the live view is lagging while being rendered

0.1.13 (2021-03-29)
------------------

- Added more detailed logging on axios errors to Flask backend

0.1.12 (2021-01-27)
------------------

- Fixed issue where an immediately returned /system_status could change the state if a start/stop calibration/recording/liveview command was just sent

0.1.11 (2021-01-15)
------------------

- Fixed visual issues with button to manually edit barcode

0.1.10 (2021-01-14)
------------------

- Added back the capability of manual plate barcode entry and validation rules.
- Included additional E2E VRT testcases of plate barcode entry scanner and manual entry.

0.1.9 (2021-01-06)
------------------

- Added the File Upload Widget which provides the details of files upload to the cloud.
- Included additional E2E VRT testcases for SettingsForm and Add/Edit dialogs for Customer and User.
- Changed to publishing in Node 14

0.1.8 (2020-12-17)
------------------

- Made the Simulation Mode widget red instead of seafoam green to be more obvious

0.1.7 (2020-12-17)
------------------

- Made error handling more lenient so any type of axios error is suppressed if the system state is SERVER_STILL_INITIALIZING

0.1.6 (2020-12-16)
------------------

- Added log message in call_axios_get_from_vuex to help troubleshoot

0.1.5 (2020-12-16)
------------------

- System no longer goes into error mode if HTTP error occurs while Server is still Initializing

0.1.4 (2020-12-16)
------------------

- Moved bootstrap and bootstrap-vue from devDependencies to Dependencies.

0.1.3 (2020-12-14)
------------------

- Updated Error Handling capability via ErrorCatchWidget and gracefully shutdown for Electron App

0.1.2 (2020-12-02)
------------------

- Updated new plate barcode series 'ME'

0.1.1 (2020-10-06)
------------------

- Updated a variety of dependencies major versions, including core-js

0.1 (2020-10-05)
------------------

- Transitioned to Github / NPM


0.0.61 (2020-09-03)
------------------

- Bumped frontend_test_utils to solve pre-commit version conflict


0.0.59 (2020-09-03)
------------------

- Added current_displayed_timepoint parameter to /get_available_data call to Flask

