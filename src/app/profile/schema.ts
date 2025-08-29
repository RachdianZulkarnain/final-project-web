import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  firstName: Yup.string().notRequired().nullable(),
  lastName: Yup.string().notRequired().nullable(),
  email: Yup.string().email("Invalid email").notRequired().nullable(),
});
