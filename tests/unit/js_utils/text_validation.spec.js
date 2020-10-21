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
