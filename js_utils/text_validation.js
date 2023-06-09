"use strict";
// dependencies
const uuidBase62 = require("@tofandel/uuid-base62"); // External library depenency of @tofandel/uuid-base62
/* eslint-disable new-cap */
uuidBase62.customBase = new uuidBase62.baseX("23456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ"); // Custom Base 57 defined as per requirement.
/* eslint-enable */

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
   * @param  {string}  type The type of value being checked: ID, passkey, or user_name
   * @param  {bool}    beta_2_mode True if in beta2 mode false if in beta 1 mode
   * @return {string} The string is either empty on valid and <space> or <invalid meessage>
   */
  validate(text, type, beta_2_mode) {
    let feedback = "";
    const obj = {};
    try {
      switch (this.rule) {
        case "plate_barcode":
          feedback = this.validate_barcode(text, type, beta_2_mode);
          break;
        case "platemap_editor_input":
          feedback = this.validate_platemap_editor_input(text);
          break;
        case "uuidBase57encode":
          feedback = this.validate_uuidBase_fiftyseven_encode(text);
          break;
        // case "alphanumeric":
        //   feedback = this.validate_alphanumeric(text);
        //   break;
        case "user_account_input":
          feedback = this.validate_user_account_input(text, type);
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
   * Returns the feedback text with either value of "" or text with reason for failure
   *
   * @param  {text}  text The text on which the validation rules are verified
   * @param  {string}  type The type of value being checked: ID, passkey, or user_name

   * @return {string} The string is either empty on valid and <space> or <invalid meessage>
   */
  validate_user_account_input(text, type) {
    let feedback = "";
    if (text != null) {
      const val_length = text.length;
      if (val_length >= 1 && val_length <= 36) {
        feedback = this.input_errorfinder(true, text, type, val_length);
      } else {
        feedback = this.input_errorfinder(false, text, type, val_length);
      }
    } else {
      feedback = this.input_errorfinder(false, text, type, 0);
    }
    return feedback;
  }

  /**
   * Returns the feedback text with either value of "" or text with reason for failure
   *
   * @param  {text}  text The text on which the validation rules are verified

   * @return {string} The string is either empty on valid and <space> or <invalid meessage>
   */
  validate_platemap_editor_input(text) {
    let feedback = "";
    const valid_regex = new RegExp("^[0-9A-Za-z _-]+$");
    if (!text || text.length === 0) feedback = "Required";
    else if (!valid_regex.test(text))
      feedback =
        "Invalid character present. Valid characters are alphanumeric, spaces, hyphens, and underscores";

    return feedback;
  }

  /**
   * Returns the feedback text with either value of "" or text with reason for failure
   *
   * @param  {stats} stats The stats on the value of the name lenght verification (true) is proper length else (false)
   * @param  {text}  text The value on which the validation rules are verified
   * @param  {string}  type The type of value being checked: ID, passkey, or user_name
   * @param  {len}  len The len the total length of the input
   * @return {string} The string is either empty on valid and <space> or <invalid meessage>
   */
  input_errorfinder(stats, text, type, len) {
    let invalid_text = "";
    switch (stats) {
      case true:
        invalid_text = "";
        break;
      case false:
        if (len == 0) {
          invalid_text = "This field is required";
        } else {
          invalid_text = `The valid ${type} is min 1 charcter and max 36 charcters`;
        }
        if (len > 36) {
          invalid_text = "Invalid as its more than 36 charcters";
        }
        break;
    }
    if (stats == true) {
      if (len > 0 && len < 36 && type == "ID") {
        invalid_text = this.input_parser(stats, text, type, len);
      }
    }
    return invalid_text;
  }
  /**
   * Returns the feedback text this is a real parser which identfies the proper error reason failure
   *
   * @param  {stats}     stats The stats on the value of the name length verification (true) is proper length else (false)
   * @param  {text}  text The name on which the validation rules are verified
   * @param  {string}  type The type of value being checked: ID, passkey, or user_name
   * @param  {len}  len The len the total length of the name
   * @return {string} The string is either empty on valid and <space> or <invalid meessage>
   */
  input_parser(stats, text, type, len) {
    let parse_error = "";
    for (let i = 0; i < len; i++) {
      let scan_ascii = 0;
      scan_ascii = text.charCodeAt(i);
      switch (true) {
        case scan_ascii == 32 && type !== "user_name" /* space          */:
          parse_error = "This field is required. No spaces allowed";
          break;
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

  /**
   * Returns the feedback text for the plate barcode validation
   *
   * @param  {string}  barcode The barcode string to validate
   * @param {string} type The barcode type "stim_barcode" or "plate_barcode"
   * @param {bool} beta_2_mode True if in bet 2 mode false if in beta 1 mode
   * @return {string} "" if barcode is valid, " " otherwise
   *
   */
  validate_barcode(barcode, type, beta_2_mode) {
    if (barcode == null) {
      return " ";
    }
    // check that barcode is a valid length
    const plate_barcode_len = barcode.length;
    if (plate_barcode_len !== 12) {
      return " ";
    }
    // check barcode header
    const barcode_header = barcode.slice(0, 2);
    if (
      (type === "plate_barcode" && barcode_header !== "ML") ||
      (type === "stim_barcode" && barcode_header !== "MS") ||
      (barcode_header !== "ML" && barcode_header !== "MS")
    ) {
      return " ";
    }

    return barcode.includes("-")
      ? this._check_new_barcode(barcode, beta_2_mode)
      : this._check_old_barcode(barcode);
  }

  /**
   * Returns the feedback text for the new plate barcode validation
   *
   * @param  {string}  barcode The barcode string to validate
   * @param  {bool}    beta_2_mode True if in bet 2 mode false if in beta 1 mode
   * @return {string} "" if barcode is valid, " " otherwise
   *
   */
  _check_new_barcode(barcode, beta_2_mode) {
    // check that barcode is numeric exept for header and dash
    const numeric_barcode = barcode.slice(2, 10) + barcode[11];
    if (isNaN(numeric_barcode)) {
      return " ";
    }
    // check if dash is in correct location
    if (barcode[10] !== "-") {
      return " ";
    }
    // check if the year is 2022 or later
    if (parseInt(barcode.slice(2, 4)) < 22) {
      return " ";
    }
    // check if the day is between 1 and 365 inclusive
    if (parseInt(barcode.slice(4, 7)) < 1 || parseInt(barcode.slice(4, 7)) > 365) {
      return " ";
    }
    // check that experiment code is between 0 and 299 inclusive
    if (parseInt(barcode.slice(7, 10)) < 0 || parseInt(barcode.slice(7, 10)) > 399) {
      return " ";
    }
    // check if in beta one or two mode. if last digit invalid then mark the barcode as invalid
    if ((beta_2_mode && barcode[11] !== "2") || (!beta_2_mode && barcode[11] !== "1")) {
      return " ";
    }
    return "";
  }
  /**
   * Returns the feedback text for the old plate barcode validation
   *
   * @param  {string}  barcode The barcode string to validate
   * @return {string} "" if barcode is valid, " " otherwise
   *
   */
  _check_old_barcode(barcode) {
    const plate_barcode_len = barcode.length;
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
    return "";
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
   * @param  {passkey}  passkey The passkey on which the validation rules are verified
   * @return {string} The string is either empty on valid and <space> or <invalid meessage>
   */
  // validate_alphanumeric(passkey) {
  //   let feedback_text = "";
  //   const passkey_len = passkey.length;
  //   let encode_uuid = "";
  //   let decode_uuid = "";
  //   if (passkey_len == 36) {
  //     // encode the the value provided
  //     try {
  //       encode_uuid = uuidBase62.encode(passkey);
  //       decode_uuid = uuidBase62.decode(encode_uuid);

  //       if (decode_uuid === passkey) {
  //         feedback_text = this.passkey_errorfinder("valid");
  //       }
  //     } catch (err) {
  //       feedback_text = this.passkey_errorfinder("error");
  //     }
  //   } else {
  //     if (passkey_len == 0) {
  //       feedback_text = "This field is required";
  //     } else {
  //       if (passkey_len > 36) {
  //         feedback_text = this.passkey_errorfinder("error");
  //       }
  //       if (passkey_len <= 35) {
  //         feedback_text = this.passkey_errorfinder("error");
  //       }
  //     }
  //   }
  //   return feedback_text;
  // }
  // /**
  //  * Returns the feedback text with either value of "" or text with reason for failure
  //  *
  //  * @param  {stats}  stats The stats on which the validation status
  //  * @return {string} The string is either empty on valid and <space> or <invalid meessage>
  //  */
  // passkey_errorfinder(stats) {
  //   let invalid_text = "";
  //   switch (stats) {
  //     case "valid":
  //       invalid_text = "";
  //       break;
  //     case "error":
  //       invalid_text = "Wrong Format of pass Key";
  //       break;
  //   }
  //   return invalid_text;
  // }
}
