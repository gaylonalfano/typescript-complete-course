// Validation
export interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export function validate(validatableInput: Validatable) {
  // Track status by first setting to true
  let isValid = true;
  // Let's check if the validatableInput has required = true
  if (validatableInput.required) {
    /* isValid = isValid && validatableInput.value.toString().trim().length !== 0; */
    // Alternate TS 4.0 syntax:
    isValid &&= validatableInput.value.toString().trim().length !== 0;
  }
  // If value is a string then check minLength
  // Adding != null check in case minLength = 0 (falsey, so will skip)
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  // If value is a string then check maxLength
  // Adding != null check in case maxLength = 0 (falsey, so will skip)
  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  // If value is a number then check min and max
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  // If value is a number then check min and max
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }
  return isValid;
}
