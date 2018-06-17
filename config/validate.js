module.exports = {
  errorBagName: 'errors', // change if property conflicts.
  fieldsBagName: 'fields',
  delay: 0,
  // locale: store.state.locale,
  dictionary: null,
  strict: true,
  enableAutoClasses: false,
  events: 'blur',
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  }
}
