import { TextValidation } from "@/js_utils/text_validation.js";
import { TextValidation as DistTextValidation } from "@/dist/mantarray.common";

const TextValidation_PlateBarcode = new TextValidation("plate_barcode");
const TextValidation_UUIDBase57 = new TextValidation("uuidBase57encode");
const TextValidation_Alphanumeric = new TextValidation("alphanumeric");
const TextValidation_Nickname = new TextValidation("nickname");
const TextValidation_MyRule = new TextValidation("myrule");

describe("DistTextValidation", () => {
  test("Given a text validation with no rule specified, When called toString(), Then return would be undefined, thus preventing using without rules", () => {
    const validation = new DistTextValidation();
    expect(validation.toString()).toStrictEqual("TextValidation.undefined");
  });
});
describe("TextValidation", () => {
  test("Given a text validation is for platebarcode, When called toString(), Then return would match the text rule of 'platebarcode' applied", () => {
    const validation = TextValidation_PlateBarcode;
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
  test("Given a text validation is for nickname, When called toString(), Then return would match the text rule of 'nickname' applied", () => {
    const validation = TextValidation_Nickname;
    expect(validation.toString()).toStrictEqual("TextValidation.nickname");
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

describe("TextValidation.validate_plate_barcode", () => {
  test.each([
    ["AB200440012", "alphabets"],
    ["12200440012", "numbers"],
    ["*#200440012", "symbols"],
  ])(
    "Given a text %s as the platebarcode, When the alphabets of MA, MB or M1 the [input.length = 11] barcode fails the defined criteria with wrong %s, Then validation fails and feedback text is <space>",
    (plate_bar_code, type) => {
      const text = plate_bar_code;
      const TestPlateBarCode = TextValidation_PlateBarcode;
      expect(TestPlateBarCode.validate(text)).toStrictEqual(" ");
    }
  );
  test.each([
    ["MA200000012", "000"],
    ["MA203670012", "367"],
    ["MA209990121", "999"],
  ])(
    "Given a text %s as the platebarcode, When the  [input.length = 11] values in the index range of [4-6] is  %s fails the defined criteria of DAY range(001 -- 367), Then validation fails and feedback text is <space>",
    (plate_bar_code, error) => {
      const text = plate_bar_code;
      const TestPlateBarCode = TextValidation_PlateBarcode;
      expect(TestPlateBarCode.validate(text)).toStrictEqual(" ");
    }
  );
  test.each([
    ["MA 13000012", "11", "<space>", " "],
    ["MA  300000", "10", "2<space>", " "],
    ["MB190440991", "11", "YEAR is SET AS 19", ""],
    ["MB210440991", "11", "YEAR is SET AS 21", ""],
    ["MB100440991", "11", "YEAR is SET AS 10", ""],
    ["MBFF0440991", "11", "YEAR is SET AS FF", " "],
    ["MB2204409913", "12", "Length more than 11", " "],
    ["MA*#300001", "10", "Invalid symbols", " "],
    [null, "0", "its null", " "],
  ])(
    "Given a text %s as the platebarcode, When the  [input.length = %s] values in the index range of [2-3] is %s fails the defined criteria of YEAR EQUAL 20, Then validation fails and feedback text is <space>",
    (plate_bar_code, len, error, result) => {
      const text = plate_bar_code;
      const TestPlateBarCode = TextValidation_PlateBarcode;
      expect(TestPlateBarCode.validate(text)).toStrictEqual(result);
    }
  );
  test.each([
    ["MA20222111*", "Invalid symbols"],
    ["MA20010*#12", "Invalid symbols"],
    ["MA20001 021", "<space>"],
    ["MA20001º21", "scientific symbols"],
  ])(
    "Given a text %s as the platebarcode with invalid special charcters on the [input.length = 11], When the middle of the charcters [7-till end]  contained %s fails the defined criteria, Then validation fails and feedback text is <space>",
    (plate_bar_code, error) => {
      const text = plate_bar_code;
      const TestPlateBarCode = TextValidation_PlateBarcode;
      expect(TestPlateBarCode.validate(text)).toStrictEqual(" ");
    }
  );
  test.each([
    ["MA20210न21", "unicode present"],
    ["MA20011浩211", "unicode present length 11"],
    ["MA二千万一千〇九", "All unicode"],
  ])(
    "Given a text %s as the platebarcode with invalid charcters with the [input.length = 11 or 10], When the text has %s fails the the defined criteria, Then validation fails and feedback text is <space>",
    (plate_bar_code, error) => {
      const text = plate_bar_code;
      const TestPlateBarCode = TextValidation_PlateBarcode;
      expect(TestPlateBarCode.validate(text)).toStrictEqual(" ");
    }
  );
  test.each([
    ["MA", "2"],
    ["MA20", "4"],
    ["MA20044", "7"],
    ["MA20**#*", 8],
  ])(
    "When an improper platecode text  %s with the [input.length = %s] < 10 or 11 and special characters are not matching criteria, Then validation fails and feedback text is <space>",
    (plate_bar_code, error) => {
      const text = plate_bar_code;
      const TestPlateBarCode = TextValidation_PlateBarcode;
      expect(TestPlateBarCode.validate(text)).toStrictEqual(" ");
    }
  );
  test.each([
    ["MA20044001", "10", "", "MA is still valid"],
    ["M120044099", "11", " ", "M1 disallowed"], // M1 is invalid so returns space
    ["ME20044099", "11", "", "ME is new valid value"], // ME is valid so return empty
  ])(
    "When a proper platecode text of %s with the [input.length = %s] and as %s its matching criteria, Then validation PASSES and feedback text is <empty>",
    (plate_bar_code, error, result, reason) => {
      const text = plate_bar_code;
      const TestPlateBarCode = TextValidation_PlateBarcode;
      expect(TestPlateBarCode.validate(text)).toStrictEqual(result);
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
describe("TextValidation.validate_alphanumeric", () => {
  test.each([
    ["06ad547f fe02-477b-9473-f7977e4d5e17", "Wrong Format of API Key"],
    ["06ad547f-fe02-477b-9473-f7977e4d5e1", "Wrong Format of API Key"],
    ["06ad547f-fe02-477b-9473-f7977e4d5e14k", "Wrong Format of API Key"],
    ["06ad547f-fe02-477b-9473-f7977e4d5e17", ""], // need to investigate
  ])(
    "Given the UUID %s is invalid and fails the matching criteria, When the text contains (%s), Then validation fails and appropriate invalid text is returned",
    (alphanumeric, message) => {
      const text = message;
      const TestAlphanumericCode = TextValidation_Alphanumeric;
      expect(TestAlphanumericCode.validate(alphanumeric)).toStrictEqual(text);
    }
  );
});
describe("TextValidation.validate_nickname", () => {
  test.each([
    ["C", ""],
    ["Experiment anemia -1", ""],
    [null, "This field is required"],
    ["Experiment anemia alpha cells -1", "Invalid as its more than 20 charcters"],
    ["Cat * lab", "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /"],
    ["Cat lab` ", "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /"],
    ["Cat lab;", "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /"],
  ])(
    "Given the Nickname %s is invalid and fails the matching criteria, When the text contains (%s), Then validation fails and appropriate invalid text is returned",
    (nickname_id, message) => {
      const text = message;
      const TesttValidationNickname = TextValidation_Nickname;
      expect(TesttValidationNickname.validate(nickname_id)).toStrictEqual(text);
    }
  );
});
