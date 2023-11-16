// Create a Yup schema manually
import * as yup from "yup";

export const wordSchema = yup.object().shape({
    // Name: yup.string().required(),
    // Value: yup.string().required(),
    // Cycles: yup.number().required(),
    // IsKnowed: yup.boolean().required(),
    // Reveled: yup.boolean().required(),
    // Add more specific validations for the methods if needed
  });