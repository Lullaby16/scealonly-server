const Yup = require("yup");

const commentSchema = Yup.object({
  comment: Yup.string().required("Comment required"),
  post_id: Yup.number().required("ID required"),
});

const validateComment = (req, res, next) => {
  const formComment = req.body;
  commentSchema
    .validate(formComment)
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

module.exports = validateComment;
