Changelog for Mantarray Frontend Components
===========================================
0.1.9 (2020-12-22)
------------------

- Added the File Upload Widget and SettingsForm E2E testing VRT to validate Overlap for the dialog of Add/Edit options for Customer and User

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

