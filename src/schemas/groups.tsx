// Create a Yup schema manually
import * as yup from "yup";
import { wordSchema } from "./words";

export const groupSchema = yup.object().shape({
    Id: yup.string().required(),
    Name: yup.string().required(),
    LastModified: yup.date().notRequired(),
    Status: yup.mixed().notRequired(),
    Words: yup.array().of(wordSchema),
  });