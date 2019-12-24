const express = require('express')
const router = express.Router()
const models = require('../models')
const bodyParser = require('body-parser')
const security = require("../middlewares/auth")
const translateService = require("../middlewares/transalateService");
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

const vision = require('@google-cloud/vision');

const key = {
    keyFilename: 'config/cloud-vision.json'
}

router.post('/all', security.verifyJWT, async function (req, res) {

    try {
        
        var file = req.body.file;
        var idioma = req.body.idioma;

        const request = {
            "image": {
                "content": file
            },
            "features": [
                {
                    "type": "LANDMARK_DETECTION"
                },
                {
                    "type": "FACE_DETECTION"
                },
                {
                    "type": "LABEL_DETECTION"
                },
                {
                    "type": "IMAGE_PROPERTIES"
                },
                {
                    "type": "WEB_DETECTION"
                },
                {
                    "type": "OBJECT_LOCALIZATION"
                },
                {
                    "type": "DOCUMENT_TEXT_DETECTION"
                }
            ],
        };

        const client = new vision.ImageAnnotatorClient(key);

        const data = await client.annotateImage(request);

        const { labelAnnotations, textAnnotations, localizedObjectAnnotations, fullTextAnnotation, webDetection } = data[0];

        var labels = [];
        var objetos = [];
        var textos = [];


        labelAnnotations.forEach(label => {
            var item = label.description;
            labels.push(item);
        });

        localizedObjectAnnotations.forEach(object => {
            var item = object.name;
            objetos.push(item);
        });

        textAnnotations.forEach(text => {
            var item = text.description;
            textos.push(item);
        });

        var translation = {
            "labels": ["Não foi encontrado nenhuma label"],
            "objetos": ["Não foi encontrado nenhum objeto"],
            "textos": ["Não foi encontrado nenhum texto"],
        }

        let traduction_promisses = [];

        if (labels.length > 0) {
            traduction_promisses.push(
                translateService.traduzir(labels, idioma)
                    .then(res => {
                        translation["labels"] = res
                    })
                    .catch(err => {
                        translation["labels"] = err
                    })
            )
        }

        if (objetos.length > 0) {
            traduction_promisses.push(
                translateService.traduzir(objetos, idioma)
                    .then(res => {
                        translation["objetos"] = res
                    })
                    .catch(err => {
                        translation["objetos"] = err
                    })
            )
        }

        if (textos.length > 0) {
            traduction_promisses.push(
                translateService.traduzir(textos, idioma)
                .then(res => {
                    translation["textos"] = res
                })
                .catch(err => {
                    translation["textos"] = err
                })
            )
        }

        Promise.all(traduction_promisses)
            .then(res => {
                res.status(200).send(translation)
            })
            .catch(err => {
                res.status(200).send(translation)
            })

    } catch {
        res.status(500).send({ error: "Vision get all failed" })
    }

})

/*
router.post('/labels', security.verifyJWT, async function (req, res) {

    try {
        var file = '';
        var file = req.body.file;

        const client = new vision.ImageAnnotatorClient(key);

        const [result] = await client.labelDetection({ image: { content: file } });

        const labels = result.labelAnnotations;

        var items = [];

        labels.forEach(label => {

            var item = label.description;
            items.push(item);
        });

        var translation = await translateService.traduzir(items);

        res.status(200).send(translation);
    } catch {
        res.status(500).send({ error: "Vision get labels failed" })
    }

})

router.post('/objects', security.verifyJWT, async function (req, res) {

    try {
        var file = req.body.file;

        const client = new vision.ImageAnnotatorClient(key);

        const [result] = await client.objectLocalization({ image: { content: file } });

        const objects = result.localizedObjectAnnotations;

        var items = [];

        objects.forEach(object => {

            var item = object.name;
            items.push(item);
        });

        var translation = await translateService.traduzir(items);

        res.status(200).send(translation)
    } catch {
        res.status(500).send({ error: "Vision get objects failed" })
    }

})

router.post('/texts', security.verifyJWT, async function (req, res) {

    try {
        var file = req.body.file;

        const client = new vision.ImageAnnotatorClient(key);

        const [result] = await client.textDetection({ image: { content: file } });

        const detections = result.textAnnotations;

        var items = [];

        detections.forEach(detection => {

            var item = detection.name;
            items.push(item);
        });

        var translation = await translateService.traduzir(items);

        res.status(200).send(translation)
    } catch {
        res.status(500).send({ error: "Vision get text failed" })
    }

})
*/

module.exports = router