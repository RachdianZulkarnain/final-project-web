import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Minimum of first name is 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Minimum of last name is 2 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});
