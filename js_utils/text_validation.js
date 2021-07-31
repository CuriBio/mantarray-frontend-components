"use strict";

// dependencies
const uuidBase62 = require("@tofandel/uuid-base62"); // External library depenency of @tofandel/uuid-base62
/* eslint-disable new-cap */
uuidBase62.customBase = new uuidBase62.baseX("23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"); // Custom Base 57 defined as per requirement.
/* eslint-enable */

// Helper function for validate_plate_barcode
const _validate_old_barcode = function (barcode) {
  const plate_barcode_len = barcode.length;
  // check that barcode is a valid length
  if (plate_barcode_len < 10 || plate_barcode_len > 11) {
    return " ";
  }
  const start_code = barcode.slice(0, 2); // Tanner (7/30/21): "old" barcodes with the same format are MA, MB, ME
  if (!["MA", "MB", "ME"].includes(start_code)) {
    return " ";
  }
  for (let i = 2; i < plate_barcode_len; i++) {
    const scan_ascii = barcode.charCodeAt(i);
    // check that remaining characters are numeric
    if (scan_ascii < 47 || scan_ascii > 58) {
      return " ";
    }
  }
  // check julian data is in range 001 to 366 [3 characters]
  const day_code = barcode.slice(4, 7);
  const day = parseInt(day_code);
  if (day < 1 || day > 366) {
    return " ";
  }
  return "";
};

// Helper function for validate_plate_barcode
const _validate_new_barcode = function (barcode) {
  const plate_barcode_len = barcode.length;
  // check that barcode is a valid length
  if (plate_barcode_len !== 12) {
    return " ";
  }
  // Tanner (7/30/21): Assuming only barcodes with header 'ML' are passed to this function, so not checking header
  for (let i = 2; i < plate_barcode_len; i++) {
    const scan_ascii = barcode.charCodeAt(i);
    // check that remaining characters are numeric
    if (scan_ascii < 47 || scan_ascii > 58) {
      return " ";
    }
  }
  // check year is at least 2021 [4 characters]
  const year_code = barcode.slice(2, 6);
  const year = parseInt(year_code);
  if (year < 2021) {
    return " ";
  }
  // check julian data is in range 001 to 366 [3 characters]
  const day_code = barcode.slice(6, 9);
  const day = parseInt(day_code);
  if (day < 1 || day > 366) {
    return " ";
  }
  // check kit ID [3 characters]
  const kit_id_remainder = parseInt(barcode.slice(9)) % 4;
  // Tanner (7/30/21): currently this number must have a remainder of 0 or 1 when divided by 4
  if (kit_id_remainder > 1) {
    return " ";
  }
  return "";
};

/** Allows text validation for the pre-defined criteria rules applied on the text by definitions */
export class TextValidation {
  /**
   * Take the rule name and set the value for validation of strings been verfied
   *
   * @param {string}  validation_rules - The string name  of the validation rules been activated
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
   * @param  {string}  text The text on which the validation rules are verified
   * @return {string} The string is either empty on valid and <space> or <invalid meessage>
   */
  validate(text) {
    let feedback = "";
    const obj = {};
    try {
      switch (this.rule) {
        case "plate_barcode":
          feedback = this.validate_plate_barcode(text);
          break;
        case "uuidBase57encode":
          feedback = this.validate_uuidBase_fiftyseven_encode(text);
          break;
        case "alphanumeric":
          feedback = this.validate_alphanumeric(text);
          break;
        case "nickname":
          feedback = this.validate_nickname(text);
          break;
        default:
          obj.err = "rule error";
          throw obj;
      }
    } catch (exception) {
      exception.err = "Not Supported " + exception.err;
      throw exception;
    }
    return feedback;
  }

  /**
   * Returns the feedback text for the plate barcode validation
   *
   * @param  {string}  barcode The barcode string to validate
   * @return {string} "" if barcode is valid, " " otherwise
   *
   */
  validate_plate_barcode(barcode) {
    if (barcode == null) {
      return " ";
    }
    return barcode.slice(0, 2) === "ML" ? _validate_new_barcode(barcode) : _validate_old_barcode(barcode);
  }
  /**
   * Returns the feedback text for the uuidBase57 encoding validation
   *
   * @param  {string}  uuidtext The uuidtext on which the validation rules are verified
   * @return {string} The string is either empty on valid or invalid text
   *
   */
  validate_uuidBase_fiftyseven_encode(uuidtext) {
    let invalid_text = "";
    const len_uuidBase57encode = uuidtext.length;
    let encode_uuid = "";
    let decode_uuid = "";
    if (len_uuidBase57encode == 22) {
      // decode the the value provided
      try {
        // decode the the value provided
        decode_uuid = uuidBase62.decode(uuidtext);
        encode_uuid = uuidBase62.encode(decode_uuid);
        if (encode_uuid === uuidtext) {
          invalid_text = this.uuid_errorfinder(len_uuidBase57encode, "valid", uuidtext);
        } else {
          invalid_text = this.uuid_errorfinder(len_uuidBase57encode, "encoderror", uuidtext);
        }
      } catch (err) {
        invalid_text = this.uuid_errorfinder(len_uuidBase57encode, "error", uuidtext);
      }
    } else {
      invalid_text = this.uuid_errorfinder(len_uuidBase57encode, "size", uuidtext);
    }
    return invalid_text;
  }
  /**
   * Returns the feedback text for the uuidBase57 encoding validation
   *
   * @param  {number}  len The len contains the length of uuidbase57 encoded data
   * @param  {string}  source The source identifies first level identified validation and errors.
   * @param  {string}  uuidtext The uuidtext on which the validation rules are verified
   * @return {string} The string is either empty on valid or invalid text with specific information.
   *
   */
  uuid_errorfinder(len, source, uuidtext) {
    let feedback_text = "";
    let invalid_builder = "";
    for (let i = 0; i < uuidtext.length; i++) {
      const scan_ascii = uuidtext.charCodeAt(i);
      if (scan_ascii === 48) {
        invalid_builder += "0,";
      } else if (scan_ascii === 49) {
        invalid_builder += "1,";
      } else if (scan_ascii === 73) {
        invalid_builder += "I,";
      } else if (scan_ascii === 79) {
        invalid_builder += "O,";
      } else if (scan_ascii === 108) {
        invalid_builder += "l,";
      }
    }
    if (len == 0) {
      feedback_text = "This field is required";
    } else if (len < 22) {
      feedback_text = "The entered ID is " + len + " characters. All valid IDs are exactly 22 characters.";
    } else if (len > 22) {
      feedback_text = "The entered ID is " + len + " characters. All valid IDs are exactly 22 characters.";
    } else if (invalid_builder != "") {
      feedback_text = "The entered ID has an invalid character " + invalid_builder;
    } else if (source == "error") {
      feedback_text = "Entry permitted for Alphanumeric only";
    } else if (source == "encoderror") {
      feedback_text = "This combination of 22 characters is invalid encoded id";
    } else {
      feedback_text = "";
    }
    return feedback_text;
  }
  /**
   * Returns the feedback text with either value of "" or text with reason for failure
   *
   * @param  {apikey}  apikey The apikey on which the validation rules are verified
   * @return {string} The string is either empty on valid and <space> or <invalid meessage>
   */
  validate_alphanumeric(apikey) {
    let feedback_text = "";
    const apikey_len = apikey.length;
    let encode_uuid = "";
    let decode_uuid = "";
    if (apikey_len == 36) {
      // encode the the value provided
      try {
        encode_uuid = uuidBase62.encode(apikey);
        decode_uuid = uuidBase62.decode(encode_uuid);

        if (decode_uuid === apikey) {
          feedback_text = this.apikey_errorfinder("valid");
        }
      } catch (err) {
        feedback_text = this.apikey_errorfinder("error");
      }
    } else {
      if (apikey_len == 0) {
        feedback_text = "";
      } else {
        if (apikey_len > 36) {
          feedback_text = this.apikey_errorfinder("error");
        }
        if (apikey_len <= 35) {
          feedback_text = this.apikey_errorfinder("error");
        }
      }
    }
    return feedback_text;
  }
  /**
   * Returns the feedback text with either value of "" or text with reason for failure
   *
   * @param  {stats}  stats The stats on which the validation status
   * @return {string} The string is either empty on valid and <space> or <invalid meessage>
   */
  apikey_errorfinder(stats) {
    let invalid_text = "";
    switch (stats) {
      case "valid":
        invalid_text = "";
        break;
      case "error":
        invalid_text = "Wrong Format of API Key";
        break;
    }
    return invalid_text;
  }
  /**
   * Returns the feedback text with either value of "" or text with reason for failure
   *
   * @param  {text}  text The text on which the validation rules are verified
   * @return {string} The string is either empty on valid and <space> or <invalid meessage>
   */
  validate_nickname(text) {
    let feedback = "";
    if (text != null) {
      const len_nickname = text.length;
      if (len_nickname >= 1 && len_nickname <= 20) {
        feedback = this.nickname_errorfinder(true, text, len_nickname);
      } else {
        feedback = this.nickname_errorfinder(false, text, len_nickname);
      }
    } else {
      feedback = this.nickname_errorfinder(false, text, 0);
    }
    return feedback;
  }
  /**
   * Returns the feedback text with either value of "" or text with reason for failure
   *
   * @param  {stats}     stats The stats on the value of the name lenght verification (true) is proper length else (false)
   * @param  {nickname}  nickname The nickname on which the validation rules are verified
   * @param  {len}  len The len the total length of the nickname
   * @return {string} The string is either empty on valid and <space> or <invalid meessage>
   */
  nickname_errorfinder(stats, nickname, len) {
    let invalid_text = "";
    switch (stats) {
      case true:
        invalid_text = "";
        break;
      case false:
        if (len == 0) {
          invalid_text = "This field is required";
        } else {
          invalid_text = "The valid nickname is min 1 charcter and max 20 charcters";
        }
        if (len > 20) {
          invalid_text = "Invalid as its more than 20 charcters";
        }
        break;
    }
    if (stats == true) {
      if (len > 0 && len < 21) {
        invalid_text = this.nickname_parser(stats, nickname, len);
      }
    }
    return invalid_text;
  }
  /**
   * Returns the feedback text this is a real parser which identfies the proper error reason failure
   *
   * @param  {stats}     stats The stats on the value of the name length verification (true) is proper length else (false)
   * @param  {name}  name The name on which the validation rules are verified
   * @param  {len}  len The len the total length of the name
   * @return {string} The string is either empty on valid and <space> or <invalid meessage>
   */
  nickname_parser(stats, name, len) {
    let parse_error = "";
    for (let i = 0; i < len; i++) {
      let scan_ascii = 0;
      scan_ascii = name.charCodeAt(i);
      switch (true) {
        case scan_ascii == 32: /* space          */
        case scan_ascii == 35: /* hash       #   */
        case scan_ascii == 38: /* ampersand     & */
        case scan_ascii == 40: /* parantheses (  */
        case scan_ascii == 41: /* parantheses )  */
        case scan_ascii == 45: /* hypen     -    */
        case scan_ascii == 46: /*  period     .   */
        case scan_ascii == 47: /*  forward slash / */
        case scan_ascii >= 48 &&
          scan_ascii <= 57: /* 0, 1, 2, 3, 4, 5, 6, 7, 8, 9  ascii of '0' is 48 and '9' is 57*/
        case scan_ascii >= 65 && scan_ascii <= 90: /* A ascii of 'A' is 65  Z ascii of 'Z' is 90 */
        case scan_ascii == 95: /* underscore _   */
        case scan_ascii >= 97 && scan_ascii <= 122:
          parse_error = "";
          break;
        case scan_ascii <= 31:
        case scan_ascii == 33:
        case scan_ascii == 34:
        case scan_ascii == 36:
        case scan_ascii == 37:
        case scan_ascii == 39:
        case scan_ascii >= 42 && scan_ascii <= 44:
        case scan_ascii >= 58 && scan_ascii <= 64:
        case scan_ascii >= 91 && scan_ascii <= 94:
        case scan_ascii == 96:
        case scan_ascii >= 123:
          parse_error = "Invalid character present. Valid characters are alphanumeric & # - . _  ( ) /";
          i = len + 1;
          break;
      }
    }
    return parse_error;
  }
}
