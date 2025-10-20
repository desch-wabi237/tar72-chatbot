const fetch = require('node-fetch');

module.exports = async (req, res) => {
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
    return res.status(500).json({ 
      error: "Configuration serveur manquante",
      message: "GEMINI_API_KEY non configurée sur Vercel"
    });
  }

  try {
    let userQuery;
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      userQuery = body.userQuery;
    } catch (e) {
      return res.status(400).json({ error: 'Format de requête invalide' });
    }
    
    if (!userQuery || typeof userQuery !== 'string') {
      return res.status(400).json({ error: 'Requête utilisateur manquante' });
    }

    // Configuration du bot
    const MODEL = 'gemini-pro';
    const PROMO_CODE = "TAR72";
    const AFFILIATE_LINK_1XBET = "https://refpa58144.com/L?tag=d_4708581m_1573c_&site=4708581&ad=1573";
    const AFFILIATE_LINK_MELBET = "https://lien-melbet-a-remplacer.com";
    const WHATSAPP_LINK = "https://whatsapp.com/channel/0029VbBRgnhEawdxneZ5To1i";
    const TELEGRAM_LINK = "https://t.me/+tuopCS5aGEk3ZWZk";

    const SYSTEM_PROMPT = `Vous êtes TAR72PRONOSTIC, assistant expert pour les bonus de paris sportifs. Utilisez le code **${PROMO_CODE}** pour le bonus maximal sur 1xBet et Melbet. Répondez de manière concise et engageante.`;

    const payload = {
      contents: [{
        parts: [{
          text: `${SYSTEM_PROMPT}\n\nQuestion: ${userQuery}\n\nLiens importants:\n- 1xBet: ${AFFILIATE_LINK_1XBET}\n- Melbet: ${AFFILIATE_LINK_MELBET}\n- WhatsApp: ${WHATSAPP_LINK}\n- Telegram: ${TELEGRAM_LINK}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    console.log('🔄 Appel à Gemini API...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Erreur Gemini:', errorData);
      throw new Error(`API Gemini: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Réponse vide de Gemini');
    }

    console.log('✅ Réponse reçue avec succès');
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(text);

  } catch (error) {
    console.error('💥 Erreur:', error);
    return res.status(500).send(`Erreur serveur: ${error.message}. Code promo: ${PROMO_CODE}`);
  }
};