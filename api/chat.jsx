export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message manquant" });

  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  const model = "mistralai/Mistral-7B-Instruct-v0.2";

  const prompt = `
Tu es un assistant amical chargé de parler du code promo 1XBET TAR72.
Ton rôle : encourager l'utilisateur à s'inscrire avec ce code et rejoindre nos chaînes Telegram/WhatsApp.
Réponds de manière fluide, naturelle, humaine.
Utilisateur : ${message}
`;

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    const result = await response.json();
    const reply = result[0]?.generated_text || "Désolé, je n’ai pas compris.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Erreur de connexion à l'IA." });
  }
}
