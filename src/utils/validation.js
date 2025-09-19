export function isValidEmail(value) {
  return /.+@.+\..+/.test(value);
}

export function minLength(value, length) {
  return value && value.length >= length;
}
