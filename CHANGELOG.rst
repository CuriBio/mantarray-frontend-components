Changelog for Mantarray Frontend Components
===========================================

0.3.0 (unreleased)
------------------

- Added y-axis-zoom for waveform display
- Added heatmap
- Added websocket to receive waveform data asynchronously and in real time

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

 - Added back the capability of manual platebarcode entry and validation rules.
 - Included additional E2E VRT testcases of platebarcode entry scanner and manual entry.

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

