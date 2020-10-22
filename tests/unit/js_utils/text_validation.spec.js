import { TextValidation } from "@/js_utils/text_validation.js";
import { TextValidation as DistTextValidation } from "@/dist/mantarray.common";

const TextValidation_PlateBarcode = new TextValidation("platebarcode");
const TextValidation_UUIDBase57 = new TextValidation("uuidBase57encode");
const TextValidation_Alphanumeric = new TextValidation("alphanumeric");
const TextValidation_Nickname = new TextValidation("nickname");

describe("DistTextValidation", () => {
  test("Given a text validation with no rule specified, When called toString(), Then return would be undefined, thus preventing using without rules", () => {
    const validation = new DistTextValidation();
    expect(validation.toString()).toStrictEqual("TextValidation.undefined");
  });
});
describe("TextValidation", () => {
  test("Given a text validation is for platebarcode, When called toString(), Then return would match the text rule of 'platebarcode' applied", () => {
    const validation = TextValidation_PlateBarcode;
    expect(validation.toString()).toStrictEqual("TextValidation.platebarcode");
  });
  test("Given a text validation is for uuidBase57encode, When called toString(), Then return would match the text rule of 'uuidBase57encode' applied", () => {
    const validation = TextValidation_UUIDBase57;
    expect(validation.toString()).toStrictEqual(
      "TextValidation.uuidBase57encode"
    );
  });
  test("Given a text validation is for alphanumeric, When called toString(), Then return would match the text rule of  'alphanumeric' applied", () => {
    const validation = TextValidation_Alphanumeric;
    expect(validation.toString()).toStrictEqual("TextValidation.alphanumeric");
  });
  test("Given a text validation is for nickname, When called toString(), Then return would match the text rule of 'nickname' applied", () => {
    const validation = TextValidation_Nickname;
    expect(validation.toString()).toStrictEqual("TextValidation.nickname");
  });
});

describe("TextValidation.validate", () => {
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
    ["MA 13000012", "11", "<space>"],
    ["MA  300000", "10", "2<space>"],
    ["MB190440991", "11", "YEAR is SET AS 19"],
    ["MB210440991", "11", "YEAR is SET AS 21"],
    ["MB100440991", "11", "YEAR is SET AS 10"],
  ])(
    "Given a text %s as the platebarcode, When the  [input.length = %s] values in the index range of [2-3] is %s fails the defined criteria of YEAR EQUAL 20, Then validation fails and feedback text is <space>",
    (plate_bar_code, len, error) => {
      const text = plate_bar_code;
      const TestPlateBarCode = TextValidation_PlateBarcode;
      expect(TestPlateBarCode.validate(text)).toStrictEqual(" ");
    }
  );
});
