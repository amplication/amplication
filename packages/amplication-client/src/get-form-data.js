/**
 * Vendor get-form-data to include fix of https://github.com/insin/get-form-data/pull/13
 */

const NODE_LIST_CLASSES = {
  "[object HTMLCollection]": true,
  "[object NodeList]": true,
  "[object RadioNodeList]": true,
};

// .type values for elements which can appear in .elements and should be ignored
const IGNORED_ELEMENT_TYPES = {
  button: true,
  fieldset: true,
  reset: true,
  submit: true,
};

const CHECKED_INPUT_TYPES = {
  checkbox: true,
  radio: true,
};

const TRIM_RE = /^\s+|\s+$/g;

const { slice } = Array.prototype;
const { toString } = Object.prototype;

/**
 * @param {HTMLFormElement} form
 * @param {Object} [options]
 * @return {Object.<string,boolean|string|string[]>} an object containing
 *   submittable value(s) held in the form's .elements collection, with
 *   properties named as per element names or ids.
 */
export default function getFormData(form, options) {
  if (!form) {
    throw new Error(
      `A form is required by getFormData, was given form=${form}`
    );
  }

  options = {
    includeDisabled: false,
    trim: false,
    ...options,
  };

  let data = {};
  let elementName;
  let elementNames = [];
  let elementNameLookup = {};

  // Get unique submittable element names for the form
  for (let i = 0, l = form.elements.length; i < l; i++) {
    let element = form.elements[i];
    if (
      IGNORED_ELEMENT_TYPES[element.type] ||
      (element.disabled && !options.includeDisabled)
    ) {
      continue;
    }
    elementName = element.name || element.id;
    if (elementName && !elementNameLookup[elementName]) {
      elementNames.push(elementName);
      elementNameLookup[elementName] = true;
    }
  }

  // Extract element data name-by-name for consistent handling of special cases
  // around elements which contain multiple inputs.
  for (let i = 0, l = elementNames.length; i < l; i++) {
    elementName = elementNames[i];
    let value = getFieldData(form, elementName, options);
    if (value != null) {
      data[elementName] = value;
    }
  }

  return data;
}

/**
 * @param {HTMLFormElement} form
 * @param {string} fieldName
 * @param {Object} [options]
 * @return {?(boolean|string|string[]|File|File[])} submittable value(s) in the
 *   form for a  named element from its .elements collection, or null if there
 *   was no element with that name, or the element had no submittable value(s).
 */
export function getFieldData(form, fieldName, options) {
  if (!form) {
    throw new Error(
      `A form is required by getFieldData, was given form=${form}`
    );
  }
  if (!fieldName && toString.call(fieldName) !== "[object String]") {
    throw new Error(
      `A field name is required by getFieldData, was given fieldName=${fieldName}`
    );
  }

  options = {
    includeDisabled: false,
    trim: false,
    ...options,
  };

  let element = form.elements[fieldName];
  if (!element || (element.disabled && !options.includeDisabled)) {
    return null;
  }

  if (!NODE_LIST_CLASSES[toString.call(element)]) {
    return getFormElementValue(element, options.trim);
  }

  // Deal with multiple form controls which have the same name
  let data = [];
  let allRadios = true;
  for (let i = 0, l = element.length; i < l; i++) {
    if (element[i].disabled && !options.includeDisabled) {
      continue;
    }
    if (allRadios && element[i].type !== "radio") {
      allRadios = false;
    }
    let value = getFormElementValue(element[i], options.trim);
    if (value != null) {
      data = data.concat(value);
    }
  }

  // Special case for an element with multiple same-named inputs which were all
  // radio buttons: if there was a selected value, only return the value.
  if (allRadios && data.length === 1) {
    return data[0];
  }

  return data.length > 0 ? data : null;
}

/**
 * @param {HTMLElement} element a form element.
 * @param {boolean} [trim] should values for text entry inputs be trimmed?
 * @return {?(boolean|string|string[]|File|File[])} the element's submittable
 *   value(s), or null if it had none.
 */
function getFormElementValue(element, trim) {
  let value = null;
  let { type } = element;

  if (type === "select-one") {
    if (element.options.length) {
      value = element.options[element.selectedIndex].value;
    }
    return value;
  }

  if (type === "select-multiple") {
    value = [];
    for (let i = 0, l = element.options.length; i < l; i++) {
      if (element.options[i].selected) {
        value.push(element.options[i].value);
      }
    }
    if (value.length === 0) {
      value = null;
    }
    return value;
  }

  // If a file input doesn't have a files attribute, fall through to using its
  // value attribute.
  if (type === "file" && "files" in element) {
    if (element.multiple) {
      value = slice.call(element.files);
      if (value.length === 0) {
        value = null;
      }
    } else {
      // Should be null if not present, according to the spec
      value = element.files[0];
    }
    return value;
  }

  if (!CHECKED_INPUT_TYPES[type]) {
    value = trim ? element.value.replace(TRIM_RE, "") : element.value;
  } else if (element.checked !== undefined) {
    if (type === "checkbox" && !element.hasAttribute("value")) {
      value = element.checked;
    } else {
      value = element.value;
    }
  }

  return value;
}

// For UMD build access to getFieldData
getFormData.getFieldData = getFieldData;
