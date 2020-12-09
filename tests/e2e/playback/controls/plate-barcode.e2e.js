import { Selector, ClientFunction } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const unfocus = ClientFunction(() => {
  document.activeElement.blur(); // https://stackoverflow.com/questions/6976486/is-there-any-way-in-javascript-to-focus-the-document-content-area
});

const base_screenshot_path = path.join("playback", "controls", "plate-barcode");

const barcode_input_field = Selector(".input__plate-barcode-entry");

// the fixture declares what we are testing
fixture`playback/controls/plate-barcode/basic`
  .page // declare the fixture
`http://localhost:8080/playback/controls/plate-barcode/basic`; // specify the start page

test("Plate Barcode with no input field", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "basic-init");
  // make sure to unfocus off of the element so that the typing cursor is not flashing in the input box creating different results during takeScreenshot
  await unfocus();
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("Plate Barcode trying to user entry into input field", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "basic-entry-failure");
  // make sure to unfocus off of the element so that the typing cursor is not flashing in the input box creating different results during takeScreenshot
  await t.typeText(barcode_input_field, "MB190440991");
  await unfocus();
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`playback/controls/plate-barcode/basic-with-valid-barcode`
  .page // declare the fixture
`http://localhost:8080/playback/controls/plate-barcode/basic-with-valid-barcode`; // specify the start page

test("Plate Barcode with valid barcode field", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "with-typed-barcode");

  // make sure to unfocus off of the element so that the typing cursor is not flashing in the input box creating different results during takeScreenshot
  await unfocus();
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`playback/controls/plate-barcode/basic-with-error-barcode`
  .page // declare the fixture
`http://localhost:8080/playback/controls/plate-barcode/basic-with-error-barcode`; // specify the start page

test("Plate Barcode with valid barcode field", async (t) => {
  let screenshot_path = path.join(
    base_screenshot_path,
    "with-typed-error-barcode"
  );

  // make sure to unfocus off of the element so that the typing cursor is not flashing in the input box creating different results during takeScreenshot
  await unfocus();
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/plate-barcode/basic-with-twelve-barcode`
  .page // declare the fixture
`http://localhost:8080/playback/controls/plate-barcode/basic-with-twelve-barcode`; // specify the start page

test("Plate Barcode identifies the error on size more than 11 text to be typed in to input field", async (t) => {
  const screenshot_path = path.join(
    base_screenshot_path,
    "with-typed-12-characters-size-error-barcode"
  );

  // make sure to unfocus off of the element so that the typing cursor is not flashing in the input box creating different results during takeScreenshot
  await unfocus();
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`playback/controls/plate-barcode/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/playback/controls/plate-barcode/x-y-offset`; // specify the start page

test("Plate Barcode renders in offset position when parent div is moved", async (t) => {
  const screenshot_path = path.join(base_screenshot_path, "x-y-offset");
  // make sure to unfocus off of the element so that the typing cursor is not flashing in the input box creating different results during takeScreenshot
  await unfocus();

  await testcafe_page_visual_regression(t, screenshot_path);
});
