import * as Yup from "yup";

export const TenantSignupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, "Minimum of first name is 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Minimum of last name is 2 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\+?[0-9]{7,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  bankName: Yup.string()
    .min(2, "Minimum of bank name is 2 characters")
    .required("Bank name is required"),
  bankNumber: Yup.string()
    .matches(/^[0-9]{6,20}$/, "Invalid bank account number")
    .required("Bank number is required"),
});
