/*
    path: api/message
*/ 

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validateJwt');
const { getChat } = require('../controllers/message');

const router = Router();

router.get('/:from', validateJWT, getChat);

module.exports = router;