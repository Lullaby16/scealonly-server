const Yup = require("yup");

const formLoginSchema = Yup.object({
  username: Yup.string()
    .required("Username required")
    .min(6, "Username too short!")
    .max(28, "Username too long!"),
  password: Yup.string()
    .required("Password required")
    .min(6, "Password too short!")
    .max(28, "Password too long!"),
});

const validateLoginForm = (req, res, next) => {
  const formData = req.body;
  formLoginSchema
    .validate(formData)
    .then((valid) => {
      if (valid) {
        return next();
      } else {
        return res.status(422).send("Something is wrong");
      }
    })
    .catch((err) => {
      return res.status(422).send("Data is not valid");
    });
};

module.exports = validateLoginForm;
