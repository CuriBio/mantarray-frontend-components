import { Selector } from "testcafe";

const path = require("path");

import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";
const base_screenshot_path = path.join("plate_based_widgets", "plate-mapeditor");

const backdrop_div = Selector(".div__platemap-editor-backdrop");

const column_one_btn = Selector("#column_1");
const column_five_btn = Selector("#column_5");

const row_A_btn = Selector("#row_0");
const row_B_btn = Selector("#row_1");
const row_D_btn = Selector("#row_3");

const plus_btn = Selector("#plus");
const minus_btn = Selector("#minus");

const well_2 = Selector(".well_2");

const well_22 = Selector(".well_22");

// the fixture declares what we are testing
fixture`plate_based_widgets/plate-mapeditor/basic-plate`
  .page // declare the fixture
`http://localhost:8080/plate_based_widgets/plate-mapeditor/basic-plate`; // specify the start page

test("testing the Plate-MapEditor page should display as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "basic-init");
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display hover effect on plus-sign as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "plus-sign-hover");
  await t.hover(plus_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display click effect on plus-sign as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "plus-sign-click");
  await t.click(plus_btn);
  await t.hover(backdrop_div);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display hover effect on minus-sign as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "minus-sign-hover");
  await t.click(plus_btn);
  await t.hover(backdrop_div);
  await t.hover(minus_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display click effect on minus-sign as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "minus-sign-click");
  await t.click(plus_btn);
  await t.click(minus_btn);
  await t.hover(backdrop_div);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display click on B Row as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "B-Row-click");
  await t.click(row_B_btn);
  await t.hover(backdrop_div);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display hover on B Row as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "B-Row-hover");
  await t.hover(row_B_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display Shift+click on B Row as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "B-Row-shift-click");
  await t.click(row_B_btn, { modifiers: { shift: true } });
  await t.hover(backdrop_div);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display click on D Row as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "D-Row-click");
  await t.click(row_D_btn);
  await t.hover(backdrop_div);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display click on D Row as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "D-Row-hover");
  await t.hover(row_D_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display Shift+click on D Row as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "D-Row-shift-click");
  await t.click(row_D_btn, { modifiers: { shift: true } });
  await t.hover(backdrop_div);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display click on 01 Column as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "One-Column-click");
  await t.click(column_one_btn);
  await t.hover(backdrop_div);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display hover on 01 Column as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "One-Column-hover");
  await t.hover(column_one_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display Shift+click on 01 Column as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "One-Column-shift-click");
  await t.click(column_one_btn, { modifiers: { shift: true } });
  await t.hover(backdrop_div);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display click on 05 Column as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "Five-Column-click");
  await t.click(column_five_btn);
  await t.hover(backdrop_div);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display hover on 05 Column as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "Five-Column-hover");
  await t.hover(column_five_btn);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display Shift+click on 05 Column  as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "Five-Column-shift-click");
  await t.click(column_five_btn, { modifiers: { shift: true } });
  await t.hover(backdrop_div);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display click on WELL Display as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "PlateMap-Well-click");
  await t.click(well_2);
  await t.hover(backdrop_div);
  await testcafe_page_visual_regression(t, screenshot_path);
});

test("testing the Plate-MapEditor page should display hover on WELL Display as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "PlateMap-Well-hover");
  await t.hover(well_2);
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`plate_based_widgets/plate-mapeditor/x-y-offset`
  .page // declare the fixture
`http://localhost:8080/plate_based_widgets/plate-mapeditor/x-y-offset`; // specify the start page

test("testing the Plate-MapEditor should display at an x-y-offset as a widget as per in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "x-y-offset");
  await testcafe_page_visual_regression(t, screenshot_path);
});

// the fixture declares what we are testing
fixture`plate_based_widgets/plate-mapeditor/pre-select`
  .page // declare the fixture
`http://localhost:8080/plate_based_widgets/plate-mapeditor/pre-select`; // specify the start page
test("testing the Plate-MapEditor page should display as designed in the mockflow", async (t) => {
  let screenshot_path = path.join(base_screenshot_path, "pre-select-init");
  await testcafe_page_visual_regression(t, screenshot_path);
});
