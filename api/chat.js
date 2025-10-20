// Vercel Serverless Function (Node.js) pour le proxy Gemini
// Créez ce fichier dans le dossier 'api' de votre projet (par exemple, api/chat.js)

module.exports = async (req, res) => {
    // 1. Définition des constantes sécurisées (invisibles au client)
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // LUE DEPUIS LES VAR D'ENV DE VERCEL
    const MODEL = 'gemini-2.5-flash-preview-09-2025';
    const PROMO_CODE = "TAR72";
    const AFFILIATE_LINK = "https://refpa58144.com/L?tag=d_4708581m_1573c_&site=4708581&ad=1573";
    const WHATSAPP_LINK = "https://whatsapp.com/channel/0029VbBRgnhEawdxneZ5To1i";
    const TELEGRAM_LINK = "https://t.me/+tuopCS5aGEk3ZWZk";

    // Le prompt système, exécuté côté serveur (sécurisé)
    const SYSTEM_PROMPT = `
        Vous êtes TAR72-Bot, un agent promotionnel expert de 1xBet et Melbet. Votre unique mission est de convaincre l'utilisateur d'utiliser le code promo **${PROMO_CODE}** lors de son inscription pour obtenir le meilleur bonus. 
        Vos réponses doivent être engageantes, informatives, courtes (maximum 3 phrases) et toujours inclure un rappel du code promo **${PROMO_CODE}**.

        Si l'utilisateur demande des liens, ou si cela est pertinent pour l'inscription, incluez toujours les liens suivants de manière naturelle dans votre réponse, en utilisant leur format complet (commencez par 'https://'):
        - Lien d'inscription (Bonus maximal): ${AFFILIATE_LINK}
        - Chaîne WhatsApp (Conseils/Communauté): ${WHATSAPP_LINK}
        - Canal Telegram (Nouvelles/Infos): ${TELEGRAM_LINK}

        Utilisez le format Markdown pour mettre en gras le code promo.
    `;

    // 2. Vérification de la méthode et de la clé
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    if (!GEMINI_API_KEY) {
        console.error("Clé API non trouvée dans les variables d'environnement Vercel.");
        return res.status(500).send("Erreur de configuration serveur: La clé API Gemini n'est pas définie. pariel");
    }

    // 3. Extraction de la requête utilisateur
    const { userQuery } = req.body;

    if (!userQuery) {
        return res.status(400).send('Requête utilisateur manquante.');
    }

    // 4. Construction du payload pour l'API Gemini
    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
    };
    
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    // 5. Appel de l'API Gemini (côté serveur Vercel)
    try {
        const geminiResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.json();
            console.error("Erreur de l'API Gemini:", errorBody);
            // Retourne une erreur 502 Bad Gateway pour indiquer l'échec de la dépendance
            return res.status(502).send(errorBody.error?.message || 'Erreur lors de l\'appel à l\'API Gemini.');
        }

        const result = await geminiResponse.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return res.status(500).send("Réponse de l'IA vide.");
        }

        // 6. Succès : Renvoyer le texte brut au client
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(text);

    } catch (error) {
        console.error("Erreur de l'application Serverless:", error);
        return res.status(500).send("Erreur serveur interne lors du traitement de la requête IA.");
    }
};
