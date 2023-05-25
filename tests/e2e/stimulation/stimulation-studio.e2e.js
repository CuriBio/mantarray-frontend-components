import { Selector } from "testcafe";
const path = require("path");
import { testcafe_page_visual_regression } from "@curi-bio/frontend-test-utils";

fixture`stimulation/basic`.page // declare the fixture
`http://localhost:8080/stimulation/basic`; // specify the start page

const protocol = Selector("li").withText("A Tester");
const apply_btn = Selector(".div__stimulationstudio-btn-container").withText("Apply to Selection");
const monophasic_tile = Selector("#Monophasic");
const biphasic_tile = Selector("#Biphasic");
const delay_tile = Selector("#Delay");
const question_icon = Selector(".disabled_popover_container");
const protocol_name_input = Selector(".protocol_input");
const pencil_icon = Selector(".img__pencil-icon");
const update_button = Selector(".update-button");
// const save_btn = Selector(".span__button-label").withText("Save");
const protocol_dropdown = Selector(".div__select-dropdown-controls-content-widget");

test("testing the StimulationStudio layout on initialization", async (t) => {
  const screenshot_path_base = path.join("stimulation", "basic-layout");
  const screenshot_path = path.join(screenshot_path_base, "basic-init");
  await testcafe_page_visual_regression(t, screenshot_path);
});

// test("testing the StimulationStudio when protocol list dropdown is visible", async (t) => {
//   const screenshot_path_base = path.join("stimulation", "basic-layout");
//   const screenshot_path = path.join(screenshot_path_base, "basic-protocol-list-dropdown");

//   await t.click(update_button).click(protocol_dropdown);

//   await testcafe_page_visual_regression(t, screenshot_path);
// });

// test("testing the StimulationStudio when new protocol name is valid", async (t) => {
//   const screenshot_path_base = path.join("stimulation", "basic-layout");
//   const screenshot_path = path.join(screenshot_path_base, "basic-new-protocol-name-valid");

//   await t
//     .click(update_button)
//     .click(pencil_icon)
//     .typeText(protocol_name_input, "Protocol_1")
//     .click(pencil_icon);
//   await testcafe_page_visual_regression(t, screenshot_path);
// });

// test("testing the StimulationStudio when new protocol name is invalid", async (t) => {
//   const screenshot_path_base = path.join("stimulation", "basic-layout");
//   const screenshot_path = path.join(screenshot_path_base, "basic-new-protocol-name-invalid");

//   await t.click(update_button).click(pencil_icon).typeText(protocol_name_input, "Tester").click(pencil_icon);

//   await testcafe_page_visual_regression(t, screenshot_path);
// });

// test("testing the StimulationStudio dropdown options in BlockViewEditor are visible", async (t) => {
//   const screenshot_path_base = path.join("stimulation", "basic-layout");
//   const screenshot_path = path.join(screenshot_path_base, "basic-setting-dropdowns-visible");

//   await t
//     .click("#small_dropdown_stimulation_type")
//     .click("#small_dropdown_time_units")
//     .click("#small_dropdown_stop_options");

//   await testcafe_page_visual_regression(t, screenshot_path);
// });

// test("testing the StimulationStudio when a protocol is assigned to selected wells", async (t) => {
//   const screenshot_path_base = path.join("stimulation", "basic-layout");
//   const screenshot_path = path.join(screenshot_path_base, "assigned-protocol-to-selected-wells");

//   await t.click(update_button).click("#column_2").click(protocol_dropdown).click(protocol).click(apply_btn);

//   await testcafe_page_visual_regression(t, screenshot_path);
// });

// // test("testing the StimulationStudio when a repeat modal is visible with invalid input", async t => {
// //   const screenshot_path_base = path.join("stimulation", "basic-layout");
// //   const screenshot_path = path.join(screenshot_path_base, "basic-repeat-modal-invalid");
// //   const phase_one_duration = Selector("#input-widget-field-duration");
// //   const phase_one_charge = Selector("#input-widget-field-charge");

// //   await t
// //     .click(update_button)
// //     .click(protocol_dropdown)
// //     .click(protocol)
// //     .dragToElement(monophasic_tile, ".dropzone");

// //   await testcafe_page_visual_regression(t, screenshot_path);
// // });

// test("testing the StimulationStudio when a new Monophasic pulse gets dropped into the protocol editor and a modal should appear", async (t) => {
//   const screenshot_path_base = path.join("stimulation", "basic-layout");
//   const screenshot_path = path.join(screenshot_path_base, "basic-monophasic-modal");

//   await t.dragToElement(monophasic_tile, ".dragArea");

//   await testcafe_page_visual_regression(t, screenshot_path);
// });

// test("testing the StimulationStudio when a pulse modal opens and user hovers over max charge question mark icon for popover", async (t) => {
//   const screenshot_path_base = path.join("stimulation", "basic-layout");
//   const screenshot_path = path.join(screenshot_path_base, "basic-question-icon-hover");
//   await t.dragToElement(monophasic_tile, ".dragArea").hover(question_icon).wait(1000);
//   await testcafe_page_visual_regression(t, screenshot_path);
// });

// test("testing the StimulationStudio when a monophasic pulse modal has valid inputs", async (t) => {
//   const screenshot_path_base = path.join("stimulation", "basic-layout");
//   const screenshot_path = path.join(screenshot_path_base, "basic-monophasic-modal-with-valid-inputs");
//   const phase_one_duration = Selector("#input-widget-field-duration");
//   const phase_one_charge = Selector("#input-widget-field-charge");

//   await t
//     .dragToElement(monophasic_tile, ".dragArea")
//     .typeText(phase_one_duration, "1000")
//     .typeText(phase_one_charge, "500");
//   await testcafe_page_visual_regression(t, screenshot_path);
// });

// test("testing the StimulationStudio when a new Biphasic pulse gets dropped into the protocol editor and a modal should appear", async (t) => {
//   const screenshot_path_base = path.join("stimulation", "basic-layout");
//   const screenshot_path = path.join(screenshot_path_base, "basic-biphasic-modal");
//   await t.dragToElement(biphasic_tile, ".dragArea");
//   await testcafe_page_visual_regression(t, screenshot_path);
// });

// test("testing the StimulationStudio when a monophasic pulse modal has valid inputs", async (t) => {
//   const screenshot_path_base = path.join("stimulation", "basic-layout");
//   const screenshot_path = path.join(screenshot_path_base, "basic-biphasic-modal-with-valid-inputs");
//   const phase_one_duration = Selector("#input-widget-field-duration");
//   const phase_one_charge = Selector("#input-widget-field-charge");
//   const interphase_interval = Selector("#input-widget-field-interphase");
//   const phase_two_duration = Selector("#input-widget-field-durationtwo");
//   const phase_two_charge = Selector("#input-widget-field-chargetwo");

//   await t
//     .dragToElement(biphasic_tile, ".dragArea")
//     .typeText(phase_one_duration, "1000")
//     .typeText(phase_one_charge, "500")
//     .typeText(interphase_interval, "1500")
//     .typeText(phase_two_duration, "500")
//     .typeText(phase_two_charge, "-500");

//   await testcafe_page_visual_regression(t, screenshot_path);
// });

// test("testing the StimulationStudio when a new delay block gets dropped into the protocol editor and a modal should appear", async (t) => {
//   const screenshot_path_base = path.join("stimulation", "basic-layout");
//   const screenshot_path = path.join(screenshot_path_base, "basic-delay-modal");
//   await t.dragToElement(delay_tile, ".dragArea");
//   await testcafe_page_visual_regression(t, screenshot_path);
// });

// test("testing the StimulationStudio when a delay block modal has a valid input", async (t) => {
//   const screenshot_path_base = path.join("stimulation", "basic-layout");
//   const screenshot_path = path.join(screenshot_path_base, "basic-delay-block-with-valid-input");
//   const delay_input = Selector("#input-widget-field-repeat_delay");

//   await t.dragToElement(delay_tile, ".dragArea").typeText(delay_input, "1000");

//   await testcafe_page_visual_regression(t, screenshot_path);
// });
