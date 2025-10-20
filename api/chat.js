import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Gestion CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY manquante');
    return res.status(500).json({ 
      error: "Configuration serveur manquante",
      message: "Veuillez configurer GEMINI_API_KEY dans les variables d'environnement Vercel"
    });
  }

  try {
    const { userQuery } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    if (!userQuery) {
      return res.status(400).json({ error: 'Requête utilisateur manquante' });
    }

    // Constantes importantes pour le bot
    const MODEL = 'gemini-pro';
    const PROMO_CODE = "TAR72";
    const AFFILIATE_LINK_1XBET = "https://refpa58144.com/L?tag=d_4708581m_1573c_&site=4708581&ad=1573";
    const AFFILIATE_LINK_MELBET = "https://melbet-affiliate-link-a-remplacer.com/promo/TAR72";
    const WHATSAPP_LINK = "https://whatsapp.com/channel/0029VbBRgnhEawdxneZ5To1i";
    const TELEGRAM_LINK = "https://t.me/+tuopCS5aGEk3ZWZk";

    const SYSTEM_PROMPT = `Vous êtes TAR72PRONOSTIC, un assistant expert pour les bonus de paris sportifs sur 1xBet et Melbet. Votre mission est de convaincre l'utilisateur d'utiliser le code promo **${PROMO_CODE}** pour obtenir le bonus maximal.

Répondez de manière engageante, informative et courte (2-3 phrases maximum). Toujours inclure le code promo **${PROMO_CODE}** dans votre réponse.

Liens importants :
- Inscription 1xBet : ${AFFILIATE_LINK_1XBET}
- Inscription Melbet : ${AFFILIATE_LINK_MELBET}
- WhatsApp : ${WHATSAPP_LINK}  
- Telegram : ${TELEGRAM_LINK}

Utilisez le format Markdown pour mettre en gras le code promo.`;

    const payload = {
      contents: [{
        parts: [{
          text: `${SYSTEM_PROMPT}\n\nQuestion de l'utilisateur: ${userQuery}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;
    
    const geminiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!geminiResponse.ok) {
      const error = await geminiResponse.json();
      throw new Error(error.error?.message || 'Erreur API Gemini');
    }

    const data = await geminiResponse.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Réponse vide de Gemini');
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(text);

  } catch (error) {
    console.error('💥 Erreur:', error);
    return res.status(500).json({ 
      error: "Erreur interne",
      message: error.message 
    });
  }
}