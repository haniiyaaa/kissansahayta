// utils/translateHelper.js
const axios = require('axios');

const LIBRE_URL = process.env.LIBRE_URL || 'https://libretranslate.de/translate';

async function translateText(text, targetLang, sourceLang = 'auto') {
  try {
    const res = await axios.post(LIBRE_URL, {
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    // response structure: { translatedText: "..." } on some endpoints, other may be res.data.translatedText
    if (res.data && (res.data.translatedText || res.data.translated_text)) {
      return res.data.translatedText || res.data.translated_text;
    }
    // fallback - some instances return as res.data[0].translatedText etc.
    return res.data.translatedText || JSON.stringify(res.data);
  } catch (err) {
    console.error('translateText error', err.message || err);
    return text; // fallback to original text
  }
}

module.exports = { translateText };
