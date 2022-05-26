/*
    path: /api/login
*/

const { Router } = require("express");
const { check } = require("express-validator");
// controladores
const { createUser, login, renewToken } = require("../controllers/auth");
const { validatedFields } = require("../middlewares/validated-field");
const { validateJWT } = require("../middlewares/validateJwt");

const router = Router();

// Crear nuevos usuarios.
router.post(
  "/new",
  [
    check("name", "The name is a String").not().isEmpty(),
    check("password", "The password is required").not().isEmpty(),
    check("email", "The email is required").isEmail(),
    validatedFields,
  ],
  createUser
);

// Login
router.post(
  "/",
  [
    check("email", "The email is required").isEmail(),
    check("password", "The password is required").not().isEmpty(),
    validatedFields,
  ],
  login
);

// Renovar token
router.get("/renew", validateJWT, renewToken);

module.exports = router;
