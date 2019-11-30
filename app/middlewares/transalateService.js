const {Translate} = require('@google-cloud/translate');

const key = {
    keyFilename: 'config/cloud-vision.json'
}

async function traduzir(text, target) {
    try {

        const translate = new Translate(key);

        const [translation] = await translate.translate(text, target);

        //console.log(`Text: ${text}`);
        //console.log(`Translation: ${translation}`);

        return translation;

    } catch {
        return "Translate failed";
    }
};

module.exports = { traduzir: traduzir }