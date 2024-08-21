import * as Yup from "yup";

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(256, "Password max length is 256")
    .required("Password is required"),
});

export const signupValidationSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(1, "Full name must be at least 1 character")
    .max(512, "Full name max length is 512")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(256, "Password max length is 256")
    .required("Password is required"),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required(),
});
