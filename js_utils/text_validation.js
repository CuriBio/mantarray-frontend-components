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
        /* yet to implement a function todo */
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
}
