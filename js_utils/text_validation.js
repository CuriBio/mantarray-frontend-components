// dependencies
const baseX = require("base-x"); // External library depenency of @tofandel/uuid-base62
const customBase = baseX(
  "23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"
); // Custom Base 57 defined as per requirement.

/** Allows text validation for the pre-defined criteria rules applied on the text by definitions */
export class TextValidation {
  /**
   * Take the rule name and set the value for validation of strings been verfied
   *
   * @param {string} validation_rules - The string name  of the validation rules been activated
   */
  constructor(validation_rules) {
    this.rule = validation_rules;
  }
  /**
   * Returns the current rule active for the instance
   *
   * @return {string}
   */
  toString() {
    return `TextValidation.${this.rule}`;
  }
  /**
   * Returns the feedback text with either value of "" or text with reason for failure
   *
   * @param  {text}  text The text on which the validation rules are verified
   * @return {string} The string is either empty on valid and <space> or <invalid meessage>
   */
  validate(text) {
    let feedback = ""; // have a try catch block and throw an error
    switch (this.rule) {
      case "platebarcode":
        feedback = this.validate_plate_barcode(text);
        break;
      case "uuidBase57encode":
        feedback = this.validate_uuidBase_fiftyseven_encode(text);
        break;
      case "alphanumeric":
        /* yet to implement a function todo */
        break;
      case "nickname":
        /* yet to implement a function todo */
        break;
      default:
        feedback = " ";
        break;
    }
    return feedback;
  }

  /**
   * Returns the feedback text for the plate barcode validation
   *
   * @param  {text}   text The text on which the validation rules are verified
   * @return {string}  The string is either empty on valid and <space> on invalid
   *
   */
  validate_plate_barcode(text) {
    let error = false; // We first assume that the text has no error default its false
    const barcode_len = text.length;
    // process for validation only when length is either 10 or 11 for Barcode.
    if (barcode_len >= 10 && barcode_len < 12) {
      const initial_code = text.slice(0, 2); // this has to be MA, MB or M1 [2 characters]
      const year_code = text.slice(2, 4); // this is of range 00 to 99   [2 characters]
      const day_code = text.slice(4, 7); // this is of range 000 to 367 [3 characters]
      if (
        initial_code === "MA" ||
        initial_code === "MB" ||
        initial_code === "M1"
      ) {
        // validate if the remaining values are only numbers and no special characters.
        error = false; // first validation passed so error is false
        for (let i = 2; i < barcode_len && error == false; i++) {
          const scan_ascii = text.charCodeAt(i);
          if (scan_ascii > 47 && scan_ascii < 58) {
            error = false; // filter out all the charcters not contain any special characters or alphabetces
            // this has to be numbers only then keyed Barcode matches further processing.
          } else {
            error = true; // validation any were fails results in breaking the loop.
          }
        }
        if (error == false) {
          const year = parseInt(year_code);
          const day = parseInt(day_code);
          if (year == 20) {
            // Year is always 20
            if (day > 0 && day < 367) {
              // Day is between 1 to 366
              error = false;
            } else {
              error = true;
            }
          } else {
            error = true;
          }
        }
      } else {
        error = true;
      }
    } else {
      error = true;
    }
    return error ? " " : "";
  }
  /**
   * Returns the feedback text for the uuidBase57 encoding validation
   *
   * @param  {uuidtext}   uuidtext The uuidtext on which the validation rules are verified
   * @return {string}  The string is either empty on valid or invalid text
   *
   */
  validate_uuidBase_fiftyseven_encode(uuidtext) {
    let invalid_text = "";
    const len_uuidBase57encode = uuidtext.length;
    if (len_uuidBase57encode == 22) {
      // decode the the value provided
      try {
        // decode the the value provided
        const decode_uuid = customBase.decode(uuidtext);
        const encode_uuid = customBase.encode(decode_uuid);
        if (encode_uuid === uuidtext) {
          invalid_text = this.uuid_errorfinder(
            len_uuidBase57encode,
            "valid",
            uuidtext
          );
        } else {
          invalid_text = this.uuid_errorfinder(
            len_uuidBase57encode,
            "encoderror",
            uuidtext
          );
        }
      } catch (err) {
        invalid_text = this.uuid_errorfinder(
          len_uuidBase57encode,
          "error",
          uuidtext
        );
      }
    } else {
      invalid_text = this.uuid_errorfinder(
        len_uuidBase57encode,
        "size",
        uuidtext
      );
    }
    return invalid_text;
  }
  /**
   * Returns the feedback text for the uuidBase57 encoding validation
   *
   * @param  {len}    len The len contains the length of uuidbase57 encoded data
   * @param  {source} source The source identifies first level identified validation and errors.
   * @param  {uuidtext} uuidtext The uuidtext on which the validation rules are verified
   * @return {string}  The string is either empty on valid or invalid text with specific information.
   *
   */
  uuid_errorfinder(len, source, uuidtext) {
    let feedback_text = "";
    let invalid_builder = "";
    let error = false;
    for (let i = 0; i < uuidtext.length; i++) {
      const scan_ascii = uuidtext.charCodeAt(i);
      if (scan_ascii === 48) {
        invalid_builder = invalid_builder + "0";
        error = true;
      }
      if (scan_ascii === 49) {
        invalid_builder = invalid_builder + "1";
        error = true;
      }
      if (scan_ascii === 73) {
        invalid_builder = invalid_builder + "I";
        error = true;
      }
      if (scan_ascii === 108) {
        invalid_builder = invalid_builder + "l";
        error = true;
      }
      if (scan_ascii === 79) {
        invalid_builder = invalid_builder + "O";
        error = true;
      }
      if (error === true) {
        invalid_builder = invalid_builder + ",";
        error = false;
      }
    }
    if (len < 22) {
      if (len == 0) {
        feedback_text = "This field is required";
      } else {
        feedback_text =
          "The entered ID is " +
          len +
          " characters. All valid IDs are exactly 22 characters.";
      }
    } else {
      if (invalid_builder != "") {
        feedback_text =
          "The entered ID has an invalid character " + invalid_builder;
      } else {
        if (source == "error") {
          feedback_text = "Entry permitted for Alphanumeric only";
        } else {
          if (source == "encoderror") {
            feedback_text =
              "This combination of 22 characters is invalid encoded id";
          } else {
            feedback_text = "";
          }
        }
      }
    }
    if (len > 22) {
      feedback_text =
        "The entered ID is " +
        len +
        " characters. All valid IDs are exactly 22 characters.";
    }
    return feedback_text;
  }
}
