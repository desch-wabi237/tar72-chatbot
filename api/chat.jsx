export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message manquant" });

  // 👉 Mets ta clé ici directement (juste pour tester)
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  const model = "mistralai/Mistral-7B-Instruct-v0.2";

  const prompt = `
Tu es un assistant amical qui aide à promouvoir le code promo 1XBET TAR72.
Ton rôle : expliquer les avantages, encourager à s'inscrire avec le code TAR72, 
et proposer de rejoindre nos groupes Telegram et WhatsApp.
Réponds toujours de manière humaine et engageante.
Utilisateur : ${message}
`;

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });

    const result = await response.json();
    console.log("Réponse HF :", result);

    const reply =
      Array.isArray(result) && result[0]?.generated_text
        ? result[0].generated_text
        : result?.generated_text || "Je n’ai pas compris ta question.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Erreur IA :", error);
    res.status(500).json({ reply: "Erreur de connexion à l'IA." });
  }
}
