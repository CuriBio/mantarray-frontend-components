import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const okay_btn_label = Selector(".span__button-label");
const error_catch_contact = Selector("#error_contact");

fixture`status/error-catch/error-catch-basic`
  .page // declare the fixture
`http://localhost:8080/status/error-catch/error-catch-basic`; // specify the start page

test("testing the ErrorCatchWidget with a error log file path", async (t) => {
  const screenshot_path_base = path.join("status", "errorcatch");
  const screenshot_path = path.join(screenshot_path_base, "error-catch-basic");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the ErrorCatchWidget with a error log file path and hover on the okay button", async (t) => {
  const screenshot_path_base = path.join("status", "errorcatch");
  const screenshot_path = path.join(screenshot_path_base, "error-catch-hover-okay-button");
  await t.hover(okay_btn_label);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the ErrorCatchWidget with a error log file path and hover on the contact e-mail", async (t) => {
  const screenshot_path_base = path.join("status", "errorcatch");
  const screenshot_path = path.join(screenshot_path_base, "error-catch-hover-contact-email");
  await t.hover(error_catch_contact);
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`status/error-catch/error-catch-x-y-offset`
  .page // declare the fixture
`http://localhost:8080/status/error-catch/error-catch-x-y-offset`; // specify the start page

test("testing the ErrorCatchWidget with an offset of X and Y position", async (t) => {
  const screenshot_path_base = path.join("status", "errorcatch");
  const screenshot_path = path.join(screenshot_path_base, "error-catch-x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`status/error-catch/error-catch-small-path`
  .page // declare the fixture
`http://localhost:8080/status/error-catch/error-catch-small-path`; // specify the start page

test("testing the ErrorCatchWidget with a error log file with just small size file path and height adjusted based on length error log file", async (t) => {
  const screenshot_path_base = path.join("status", "errorcatch");
  const screenshot_path = path.join(screenshot_path_base, "error-catch-small-path");
  await testcafe_page_visual_regression(t, screenshot_path);
});
