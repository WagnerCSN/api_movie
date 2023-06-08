const Router = require("express");
const notesController = require("../controllers/NotesController");
const notescontroller = new notesController();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const notesRoutes = Router();

notesRoutes.use(ensureAuthenticated);

notesRoutes.get("/", notescontroller.index)
notesRoutes.post("/", notescontroller.create)
notesRoutes.get("/:id", notescontroller.show)
notesRoutes.delete("/:id", notescontroller.delete)

module.exports = notesRoutes;