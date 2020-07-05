module.exports = (app) => {
  app.get("/", (req, res) => {
    if (!req.user) {
      res.render("index", {
        user: req.user,
      });
    } else {
      res.redirect("/todos");
    }
  });
};
