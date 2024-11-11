export default function LoginValidation(values) {
  let errors = {};
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]{8,}$/;

  if (!values.username) {
    errors.username = "Username should not be empty";
  }

  if (!values.password) {
    errors.password = "Password should not be empty";
  }

  return errors;
}
