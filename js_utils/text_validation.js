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
}
