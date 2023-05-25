import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

const span__button_label = Selector(".span__button-label");
const button_event_handler = Selector(".button-event-handler");

fixture`basic_widgets/button-widget/basic-button`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/button-widget/basic-button`; // specify the start page

test("testing the button Widget basic display", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "button-widget");
  const screenshot_path = path.join(screenshot_path_base, "basic-button-widget");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the ButtonWidget and hover on the buttons", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "button-widget");

  const buttons = ["cancel", "delete", "save"];
  var count = await span__button_label.count;

  for (var i = 0; i < count; i++) {
    let screenshot_path = path.join(screenshot_path_base, "button-widget-hover-" + buttons[i]);
    await t.hover(span__button_label.nth(i));
    await testcafe_page_visual_regression(t, screenshot_path);
  }
});

fixture`basic_widgets/button-widget/button-grey`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/button-widget/button-grey`; // specify the start page

test("testing the button Widget basic display with Greyed button", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "button-widget");
  const screenshot_path = path.join(screenshot_path_base, "button-grey-display");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/button-widget/multiple-button`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/button-widget/multiple-button`; // specify the start page

test("testing the multiple options capability using Button Widget with an X-Y Offset", async (t) => {
  const screenshot_path_base = path.join("basic_widgets", "button-widget");
  const screenshot_path = path.join(screenshot_path_base, "multiple-button");
  await testcafe_page_visual_regression(t, screenshot_path);
});

fixture`basic_widgets/button-widget/button-event`
  .page // declare the fixture
`http://localhost:8080/basic_widgets/button-widget/button-event`; // specify the start page
test("testing the ButtonWidget and hover on the buttons", async (t) => {
  const buttons_label = ["Cancel", "Delete ID", "Save ID"];
  var count = await span__button_label.count;

  for (var i = 0; i < count; i++) {
    await t.click(span__button_label.nth(i));
    await t
      .expect(button_event_handler.textContent)
      .contains("The Button that was clicked :" + buttons_label[i]);
  }
});
