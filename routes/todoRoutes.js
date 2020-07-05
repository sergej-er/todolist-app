const mongoose = require("mongoose");
const _ = require("lodash");
const List = mongoose.model("lists");
const Todo = mongoose.model("todos");
const requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
  app.get("/todos", requireLogin, (req, res) => {
    res.redirect("/todos/today");
  });

  app.get("/todos/:listTitle", requireLogin, (req, res) => {
    const listTitle = _.kebabCase(req.params.listTitle);

    List.find({ _user: req.user.id }, async (err, foundLists) => {
      if (!err) {
        const currentList = foundLists.find((list) => list.name === listTitle);
        if (!currentList) {
          const list = await new List({
            name: listTitle,
            todos: [],
            _user: req.user.id,
          });

          list.save();

          res.redirect("/todos/" + listTitle);
        } else {
          res.render("list", {
            user: req.user,
            lists: foundLists,
            listTitle: _.startCase(currentList.name),
            todos: currentList.todos,
          });
        }
      }
    });

    app.post("/todos/:listTitle", requireLogin, (req, res) => {
      const newTodo = new Todo({
        name: req.body.newTodo,
      });

      const listTitle = req.body.list;

      List.findOne({ name: listTitle }, (err, foundList) => {
        foundList.todos.push(newTodo);
        foundList.save();
      });
      res.redirect("/todos/" + listTitle);
    });

    app.post("/todos/:listTitle/delete", requireLogin, (req, res) => {
      const listTitle = req.body.list;
      const itemToDelete = req.body.checkbox;

      List.findOneAndUpdate(
        { "todos._id": itemToDelete },
        { $pull: { todos: { _id: itemToDelete } } },
        (err, foundList) => {
          if (!err) {
            res.redirect("/todos/" + foundList.name);
          }
        }
      );
    });
  });
};
