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

test("Plate Barcode allows text to be typed in to input field", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "basic-init");
  // make sure to unfocus off of the element so that the typing cursor is not flashing in the input box creating different results during takeScreenshot
  await unfocus();
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.typeText(barcode_input_field, "ME202050002");

  // make sure to unfocus off of the element so that the typing cursor is not flashing in the input box creating different results during takeScreenshot
  await unfocus();

  screenshot_path = path.join(base_screenshot_path, "with-typed-barcode");
  await testcafe_page_visual_regression(t, screenshot_path);

  await t.typeText(barcode_input_field, "AB");

  // make sure to unfocus off of the element so that the typing cursor is not flashing in the input box creating different results during takeScreenshot
  await unfocus();

  screenshot_path = path.join(base_screenshot_path, "with-typed-error-barcode");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("Plate Barcode identifies the error on size more than 11 text to be typed in to input field", async (t) => {
  const screenshot_path = path.join(
    base_screenshot_path,
    "with-typed-12-characters-size-error-barcode"
  );

  await t.typeText(barcode_input_field, "M12020500024");

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
