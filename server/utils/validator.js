import validator from 'validator';
import models from '../models';

const { Op } = models.sequelize;

/**
 * Class handling validations
 */
export default class ValidatorClass {
  /**
   * Validates form input
   * @param {*} field
   * @param {*} value
   * @param {*} payload
   * @returns {string} validation message
   */
  static fieldValidator(field, value, payload) {
    switch (field) {
      case `${field}`:
        if (!value || !(/\S/.test(value))) {
          return 'This field is required';
        }

      /* es-lint-disable-no-fallthrough */
      case 'maleResidents':
      case 'femaleResidents':
        if ((field === 'maleResidents' || field === 'femaleResidents') && value && !this.isInteger(value)) {
          return 'Value must be an integer';
        }

      default:
        break;
    }
  }

  static isInteger = (value) => Number.isInteger(Number.parseFloat(value, 10))

  /**
   * Loops through each field and calls the field validator method on it
   * @param {*} enumArray
   * @param {*} payload
   * @returns {object} returns validation status and object containing errors
   */
  static validateFields(enumArray, payload) {
    const errors = {};
    enumArray.forEach((item) => {
      const value = payload[item];
      errors[item] = this.fieldValidator(item, value, payload);
    });
    return {
      errors: { validations: JSON.parse(JSON.stringify(errors)) },
      isValid: !Object.keys(JSON.parse(JSON.stringify(errors))).length
    };
  }

  /**
   * Validates existence of data in database
   * @param {*} modelName
   * @param {*} queryOptions
   * @param {*} enumArray
   * @param {*} payload
   * @returns {object} returns validation status and object containing errors
   */
  static validateExistence(modelName, queryOptions, enumArray, payload) {
    const { errors: { validations } } = this.validateFields(enumArray, payload);

    return models[modelName].findOne({
          where: queryOptions,
        })
      .then((found) => {
        if (found) {
          Object.keys(queryOptions).forEach((item) => {
            if (found[item] === payload[item]) {
              validations[item] = `${item} is not available`;
            }
          });
        }

        return {
          errors: { validations },
          isValid: !Object.keys(validations).length,
          found
        };
      })
      .catch((error) => {
        error.code = 500;
        error.message = 'Something went wrong';
        throw error;
      });
  }

  static validateFieldsSync(enumArray, source) {
    try {
      const { errors, isValid } = this.validateFields(enumArray, source);
      if (!isValid) {
        throw errors;
      }
      return {
        errors,
        isValid
      };
    } catch (error) {
      return {
        errors: error,
        isValid: false,
      };
    }
  }
}
