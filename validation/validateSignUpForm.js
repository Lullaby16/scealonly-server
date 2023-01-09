const Yup = require("yup");

const formSignUpSchema = Yup.object({
  email: Yup.string().required("Email required").email("Invalid email"),
  username: Yup.string()
    .required("Username required")
    .min(6, "Username too short!")
    .max(28, "Username too long!"),
  password: Yup.string()
    .required("Password required")
    .min(6, "Password too short!")
    .max(28, "Password too long!"),
});

const validateSignUpForm = (req, res, next) => {
  const formData = req.body;
  formSignUpSchema
    .validate(formData)
    .then((valid) => {
      if (valid) {
        console.log("form is good");
        return next();
      } else {
        return res.status(422).send("Something is wrong");
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(422).send("Data is not valid");
    });
};

module.exports = validateSignUpForm;
