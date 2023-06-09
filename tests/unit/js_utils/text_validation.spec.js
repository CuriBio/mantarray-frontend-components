import { TextValidation } from "@/js_utils/text_validation.js";
import { TextValidation as DistTextValidation } from "@/dist/mantarray.common";

const TextValidation_BarcodeViewer = new TextValidation("plate_barcode");
const TextValidation_UUIDBase57 = new TextValidation("uuidBase57encode");
const TextValidation_Alphanumeric = new TextValidation("alphanumeric");
const TextValidation_user_account = new TextValidation("user_account_input");
const TextValidation_MyRule = new TextValidation("myrule");

describe("DistTextValidation", () => {
  test("Given a text validation with no rule specified, When called toString(), Then return would be undefined, thus preventing using without rules", () => {
    const validation = new DistTextValidation();
    expect(validation.toString()).toStrictEqual("TextValidation.undefined");
  });
});
describe("TextValidation", () => {
  test("Given a text validation is for plate_barcode, When called toString(), Then return would match the text rule of 'plate_barcode' applied", () => {
    const validation = TextValidation_BarcodeViewer;
    expect(validation.toString()).toStrictEqual("TextValidation.plate_barcode");
  });
  test("Given a text validation is for uuidBase57encode, When called toString(), Then return would match the text rule of 'uuidBase57encode' applied", () => {
    const validation = TextValidation_UUIDBase57;
    expect(validation.toString()).toStrictEqual("TextValidation.uuidBase57encode");
  });
  test("Given a text validation is for alphanumeric, When called toString(), Then return would match the text rule of  'alphanumeric' applied", () => {
    const validation = TextValidation_Alphanumeric;
    expect(validation.toString()).toStrictEqual("TextValidation.alphanumeric");
  });
  test("Given a text validation is for user_name, When called toString(), Then return would match the text rule of 'user_name' applied", () => {
    const validation = TextValidation_user_account;
    expect(validation.toString()).toStrictEqual("TextValidation.user_account_input");
  });
  test("Given a text validation is for Myrule, When called for validate, Then return would thow an error", () => {
    const validation = TextValidation_MyRule;
    const obj_error = { err: "Not Supported rule error" };
    try {
      validation.validate("my criteria");
    } catch (err) {
      /* eslint-disable jest/no-conditional-expect */
      expect(err).toStrictEqual(obj_error);
      /* eslint-enable */
    }
  });
});

describe("TextValidation.validate_barcode with new barcodes", () => {
  test.each([
    ["", "empty"],
    [null, "null"],
    [undefined, "undefined"],
    ["ML34567890123", "length over 12"],
    ["ML345678901", "length under 12"],
    ["MA2021072144", "invalid header 'MA'"],
    ["MB2021072144", "invalid header 'MB'"],
    ["ME2021$72144", "invalid header 'ME'"],
    ["ML2021$72144", "invalid character '$'"],
    ["ML20210721*4", "invalid character '*'"],
    ["ML2020172144", "invalid year '2020'"],
    ["ML2021000144", "invalid Julian date '000'"],
    ["ML2021367144", "invalid Julian date '367'"],
  ])(
    "When barcode %s with %s is passed to validate function, Then ' ' is returned",
    (plate_barcode, error) => {
      const TestBarcodeViewer = TextValidation_BarcodeViewer;
      expect(TestBarcodeViewer.validate(plate_barcode)).toStrictEqual(" ");
    }
  );
  test.each([
    ["MS2021172000", "header 'MS'"],
    ["ML2021172001", "kit ID '001'"],
    ["ML2021172002", "kit ID '002'"],
    ["ML2021172003", "kit ID '003'"],
    ["ML2021172004", "kit ID '004'"],
    ["ML2021172300", "kit ID '300'"],
    ["ML2021172200", "kit ID '200'"],
    ["ML2021172100", "kit ID '100'"],
    ["ML9999172001", "year '9999'"],
    ["ML2021001144", "julian date '001'"],
    ["ML2021366144", "julian date '366'"],
  ])(
    "When valid barcode %s with %s is passed to validate function, Then '' is returned",
    (plate_barcode, diff) => {
      const TestBarcodeViewer = TextValidation_BarcodeViewer;
      expect(TestBarcodeViewer.validate(plate_barcode)).toStrictEqual("");
    }
  );
});

describe("TextValidation.validate_uuidBase_fiftyseven_encode", () => {
  test.each([
    ["0VSckkBYH2An3dqHEyfRRE", "0", "The entered ID has an invalid character 0,"],
    [
      "2VSckkBY2An3dqHEyfRRE",
      "one less",
      "The entered ID is 21 characters. All valid IDs are exactly 22 characters.",
    ],
    ["2VSckkBY12An3dqHEyfRRE", "1", "The entered ID has an invalid character 1,"],
    ["2VSIkkBYH2An3dqHEyfRRE", "I", "The entered ID has an invalid character I,"],
    ["2VSskkBYH2An3dqHElfRRE", "l", "The entered ID has an invalid character l,"],
    ["2VSskkBYH2An3dqHEyfRRO", "O", "The entered ID has an invalid character O,"],
    ["5FY8KwTsQaUJ2KzHJGetfE", "", ""],
    [
      "2VSckkBY2An3dqHEyfRREab",
      "more than 21",
      "The entered ID is 23 characters. All valid IDs are exactly 22 characters.",
    ],
    ["4vqyd62oARXqj9nRUNhtLQ", "", "This combination of 22 characters is invalid encoded id"],
  ])(
    "Given the encoded-uuid %s is the invalid and fails the matching criteria, When the text contains (%s) charcter, Then validation fails and appropriate invalid text is returned",
    (uuid_text, error, message) => {
      const text = message;
      const TestBase57Code = TextValidation_UUIDBase57;
      expect(TestBase57Code.validate(uuid_text)).toStrictEqual(text);
    }
  );
});
describe("TextValidation.validate_user_account_input", () => {
  test.each([
    ["C", ""],
    ["Experiment anemia -1", ""],
    [null, "This field is required"],
    ["Experiment anemia -1234567890-1234567890", "Invalid as its more than 36 charcters"],
  ])(
    "Given the user_name %s is invalid and fails the matching criteria, When the text contains (%s), Then validation fails and appropriate invalid text is returned",
    (user_name_id, message) => {
      const text = message;
      const TestValidationuser_name = TextValidation_user_account;
      expect(TestValidationuser_name.validate(user_name_id, "user_name")).toStrictEqual(text);
    }
  );
});
describe("Test new scheme for barcode", () => {
  test.each([
    ["", "empty"],
    [null, "null"],
    [undefined, "undefined"],
    ["ML22123099-1hh", "length over 12"],
    ["ML34-", "length under 12"],
    ["MA22123099-1", "invalid header 'MA'"],
    ["MB22123099-1", "invalid header 'MB'"],
    ["ME22123099-1", "invalid header 'ME'"],
    ["ML20123099-1", "invalid year '2020'"],
    ["ML22444099-1", "day is not between 1 and 365"],
    ["ML22123411-1", "invalid ###"],
    ["MLh2123099-1", "none numeric values"],
    ["ML221230991-", "dash in wrong place"],
  ])(
    "When invalid barcode %s with %s is passed to validate function, Then ' ' is returned",
    (plate_barcode, diff) => {
      const TestBarcodeViewer = TextValidation_BarcodeViewer;
      expect(TestBarcodeViewer.validate(plate_barcode)).toStrictEqual(" ");
    }
  );

  test("Test valid barcodes for beta 1 and beta 2 modes", async () => {
    //check valid beta 1 mode
    const TestBarcodeViewer = TextValidation_BarcodeViewer;
    expect(TestBarcodeViewer.validate("ML22123099-1", "", false)).toStrictEqual("");
    //check invalid beta 1 mode
    expect(TestBarcodeViewer.validate("ML22123099-3", "", false)).toStrictEqual(" ");

    //check valid beta 2 mode
    expect(TestBarcodeViewer.validate("ML22123099-2", "", true)).toStrictEqual("");
    //check invalid beta 2 mode
    expect(TestBarcodeViewer.validate("ML22123099-1", "", true)).toStrictEqual(" ");
  });
});
