const Yup = require("yup");

const postSchema = Yup.object({
  title: Yup.string().required("Title required"),
  content: Yup.string().required("Story required"),
});

const validatePost = (req, res, next) => {
  const formPost = req.body;
  postSchema
    .validate(formPost)
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

module.exports = validatePost;
