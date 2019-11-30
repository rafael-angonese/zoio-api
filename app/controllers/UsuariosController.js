const express = require('express')
const router = express.Router()
const models = require('../models')
const bodyParser = require('body-parser')
const security = require("../middlewares/auth")
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const bcrypt = require("bcryptjs")
var jwt = require('jsonwebtoken');

router.post('/', async function (req, res) {
    let hash = bcrypt.hashSync(req.body.senha, 10)
    try {
        var usuario = await models.Usuario.findOne({ where: { login: req.body.login } })
        if (usuario) {
            return res.status(400).json({ error: "User already exists" });
        }

        var usuario = await models.Usuario.create({
            nome: req.body.nome,
            login: req.body.login,
            senha: hash,
            idioma: req.body.idioma
        })

        const id = usuario.id;
        var token = jwt.sign({ id }, process.env.SECRET, {
            expiresIn: 864000
        });

        res.status(200).send({ token: token, usuario: usuario });

    } catch {
        res.status(500).send({ error: "User registration failed" })
    }

})

router.get('/', security.verifyJWT, async function (req, res) {
    try {
        var usuarios = await models.Usuario.findAll()

        res.status(200).send(usuarios)
    } catch {
        res.status(400).send({ error: "User get all failed" })
    }
})

router.get('/:id', security.verifyJWT, async function (req, res) {

    try {
        var usuario = await models.Usuario.findByPk(req.params.id)
        if (!usuario) {
            res.status(404).send({ error: "User not found" })
        }

        res.status(200).send(usuario)
    } catch (err) {
        res.status(400).send({ error: "User find by id failed" })
    }

})

router.put('/:id', security.verifyJWT, async function (req, res) {
    try {
        var usuario = await models.Usuario.findByPk(req.params.id)
        if (!usuario) {
            res.status(404).send({ error: "User not found" })
        }

        var usuario = await usuario.update({
            nome: req.body.nome,
            login: req.body.login,
            idioma: req.body.idioma
        })

        res.status(200).send(usuario)
    } catch {
        res.status(400).send({ error: "User update failed" })
    }

})

router.delete('/:id', security.verifyJWT, async function (req, res) {
    try {
        var usuario = await models.Usuario.findByPk(req.params.id)
        if (!usuario) {
            res.status(404).send({ error: "User not found" })
        }

        var usuario = await models.Usuario.destroy({ where: { id: req.params.id } })

        res.status(200).send({ success: "User deleted" })
    } catch {
        res.status(400).send({ error: "User delete failed" })
    }

})

module.exports = router