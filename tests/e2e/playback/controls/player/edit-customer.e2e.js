import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const span__button_label = Selector(".span__button_label");

const edit_customer_cancel_btn = span__button_label.nth(0);
const edit_customer_delete_btn = span__button_label.nth(1);
const edit_customer_save_btn = span__button_label.nth(2);

fixture`playback/controls/player/settings-button/edit-customer`
  .page // declare the fixture
`http://localhost:8080/playback/controls/player/settings-button/edit-customer`; // specify the start page

test("testing for the edit customer Valid State", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "edit-customer"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "edit-customer-valid"
  );
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing for the edit customer Valid State Cancel Hover", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "edit-customer"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "edit-customer-Cancel-Hover"
  );
  await t.hover(edit_customer_cancel_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing for the edit customer Valid State Delete Hover", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "edit-customer"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "edit-customer-Delete-Hover"
  );
  await t.hover(edit_customer_delete_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing for the edit customer Valid State Delete Hover", async (t) => {
  const screenshot_path_base = path.join(
    "playback",
    "controls",
    "player",
    "edit-customer"
  );
  const screenshot_path = path.join(
    screenshot_path_base,
    "edit-customer-Save-Hover"
  );
  await t.hover(edit_customer_save_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});
