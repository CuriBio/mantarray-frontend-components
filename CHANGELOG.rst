Changelog for Mantarray Frontend Components
===========================================


0.5.1 (unreleased)
------------------

- Updated Y-axis zoom and heatmap range entries to allow decimal values.


0.5.0 (2021-11-04)
------------------

- Added websocket handler for stimulation data
- Added stim subprotocol markers to waveform players
- Added biphasic and monophasic pulse diagrams
- Updated Stim Studio to make current controlled stimulation the default
- Updated Stim play/stop button to be disabled when no protocols are assigned or if a recording is being made
- Updated all timing to be in µs
- Fixed Username/Password validations
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

