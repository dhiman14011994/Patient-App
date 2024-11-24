import * as yup from 'yup';
import CONSTANTS from './constants';
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const personalInfoValidationSchema = yup.object({
  name: yup.string().required('Enter valid name'),
  email: yup
    .string()
    .required('Email address is required')
    .email('Enter valid email address')
    .matches(regex, 'Enter valid email address'),
  dob: yup.string().required('Select valid birth of date'),
  // mobile_no: yup
  //   .string()
  //   .required('Enter the phone no')
  //   .matches(phoneRegExp, 'Enter valid phone no')
  //   .min(8, 'Enter valid phone no')
  //   .max(15, 'Enter valid phone no'),
  gender: yup.string().required('Select gender'),
});

export const removeSpecialCharInString = value => {
  return value.replace(/[^a-zA-Z0-9 ]/g, '');
};

export const feedbackValidationSchema = yup.object({
  email: yup
    .string()
    .required('Email address is required')
    .email('Enter valid email address')
    .matches(regex, 'Enter valid email address'),
  ratting: yup.number().required('Please add ratting'),
  comment: yup.string().required('Please add comment'),
});
