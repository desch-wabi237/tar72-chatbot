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

    const MODEL = 'gemini-pro';
    const SYSTEM_PROMPT = `Vous êtes TAR72PRONOSTIC, assistant expert pour les bonus de paris sportifs.`;

    const payload = {
      contents: [{
        parts: [{
          text: `${SYSTEM_PROMPT}\n\nQuestion: ${userQuery}`
        }]
      }]
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