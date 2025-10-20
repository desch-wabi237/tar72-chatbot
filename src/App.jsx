import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- Définitions et Constantes Globales ---
const PROMO_CODE = "TAR72";
const BOT_NAME = "TAR72PRONOSTIC";

// Liens affiliés et sociaux
const AFFILIATE_LINK_1XBET = "https://refpa58144.com/L?tag=d_4708581m_1573c_&site=4708581&ad=1573";
const AFFILIATE_LINK_MELBET = "https://melbet-affiliate-link-a-remplacer.com/promo/TAR72";
const WHATSAPP_LINK = "https://whatsapp.com/channel/0029VbBRgnhEawdxneZ5To1i";
const TELEGRAM_LINK = "https://t.me/+tuopCS5aGEk3ZWZk";

// La route API
const API_ROUTE = "/api/chat";

// --- LOGIQUE D'INTÉGRATION GEMINI ---
const getAiResponse = async (userQuery, maxRetries = 5) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await fetch(API_ROUTE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userQuery }) 
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `Erreur Serverless: ${response.status} ${response.statusText}`);
            }

            const text = await response.text();
            
            if (text) {
                return text;
            } else {
                throw new Error("Réponse de l'API vide ou mal formée.");
            }

        } catch (error) {
            console.error("Tentative API échouée:", error);
            if (attempt === maxRetries - 1) {
                return `🚨 Erreur de connexion au service IA : ${error.message}. Code promo : **${PROMO_CODE}**.`;
            }
            const delay = Math.pow(2, attempt) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return `🚨 Erreur interne. Le service IA est temporairement indisponible. Code promo : **${PROMO_CODE}**.`;
};

// --- Composant Principal de l'Application ---
const App = () => {
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            text: `👋 Bonjour ! Je suis **${BOT_NAME}**, votre assistant expert pour les meilleurs bonus de paris sportifs. Je vous aide à obtenir le **BONUS MAXIMAL** sur 1xBet et Melbet grâce au code **${PROMO_CODE}**. 🎯`, 
            sender: 'bot', 
            isTyping: false 
        }
    ]);
    const [input, setInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const formatMessageText = useCallback((text) => {
        let parts = text.split(/(\s(https?:\/\/[^\s]+))/g);
        const regexBold = /\*\*(.*?)\*\*/g;

        return parts.map((part, index) => {
            if (part.startsWith(' https://') || part.startsWith('https://')) {
                const url = part.trim();
                let display = url.length > 50 ? url.substring(0, 50) + '...' : url;
                
                if (url === AFFILIATE_LINK_1XBET) display = "🎰 S'inscrire sur 1xBet";
                if (url === AFFILIATE_LINK_MELBET) display = "⚽ S'inscrire sur Melbet";
                if (url === WHATSAPP_LINK) display = "💬 Rejoindre WhatsApp";
                if (url === TELEGRAM_LINK) display = "📢 Rejoindre Telegram";
                
                return (
                    <a 
                        key={index} 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="link-anchor"
                    >
                        {display}
                    </a>
                );
            }
            
            const textWithBold = part.split(regexBold).map((subPart, i) => {
                if (i % 2 === 1) {
                    return <strong key={i} className="promo-code-bold">{subPart}</strong>;
                }
                return subPart;
            });

            return <span key={index}>{textWithBold}</span>;
        });
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        const trimmedInput = input.trim();
        if (!trimmedInput) return;
        
        const newUserMessage = { 
            id: Date.now(), 
            text: trimmedInput, 
            sender: 'user', 
            isTyping: false 
        };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        
        setIsBotTyping(true);
        let botResponseText = "";

        try {
            botResponseText = await getAiResponse(trimmedInput);
        } catch (error) {
            console.error("Erreur de traitement:", error);
            botResponseText = "🚨 Une erreur de traitement inattendue est survenue.";
        } finally {
            setIsBotTyping(false);
        }

        setTimeout(() => {
            const newBotMessage = {
                id: Date.now() + 1,
                text: botResponseText,
                sender: 'bot',
                isTyping: false
            };
            setMessages(prev => [...prev, newBotMessage]);
        }, 300); 
    };

    // --- Composant d'une Bulle de Message ---
    const MessageBubble = ({ message }) => {
        const isBot = message.sender === 'bot';
        
        return (
            <div className={`message-row ${isBot ? 'bot-row' : 'user-row'}`}>
                {isBot && (
                    <div className="bot-avatar">
                        <div className="avatar-icon">🤖</div>
                    </div>
                )}
                <div 
                    className={`message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}`}
                >
                    {formatMessageText(message.text)}
                </div>
                {!isBot && (
                    <div className="user-avatar">
                        <div className="avatar-icon">👤</div>
                    </div>
                )}
            </div>
        );
    };

    // --- Rendu de l'interface ---
    return (
        <div className="app-container">
            {/* Styles CSS Purs Intégrés */}
            <style jsx="true">{`
                /* Variables de couleurs modernes */
                :root {
                    --color-primary: #f59e0b;
                    --color-secondary: #10b981;
                    --color-background: #0f172a;
                    --color-card: #1e293b;
                    --color-bot-bubble: #334155;
                    --color-user-bubble: #2563eb;
                    --color-text-light: #f8fafc;
                    --color-promo-code: #facc15;
                    --color-button-text: #0f172a;
                    --color-1xbet: #1d4ed8;
                    --color-melbet: #f59e0b;
                    --color-whatsapp: #25D366;
                    --color-telegram: #0088cc;
                    --gradient-primary: linear-gradient(135deg, #f59e0b, #fbbf24);
                    --gradient-secondary: linear-gradient(135deg, #10b981, #34d399);
                }

                /* Styles globaux */
                .app-container {
                    min-height: 100vh;
                    background: var(--color-background);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px;
                    font-family: 'Segoe UI', system-ui, sans-serif;
                    position: relative;
                    background-image: 
                        radial-gradient(circle at 10% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 20%),
                        radial-gradient(circle at 90% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 20%);
                }
                
                .chat-card {
                    width: 100%;
                    max-width: 1024px;
                    height: 90vh;
                    display: flex;
                    flex-direction: column;
                    border-radius: 20px;
                    box-shadow: 
                        0 25px 50px -12px rgba(0, 0, 0, 0.5),
                        0 0 0 1px rgba(255, 255, 255, 0.1);
                    background: var(--color-card);
                    overflow: hidden;
                    backdrop-filter: blur(10px);
                }

                /* Header amélioré */
                .chat-header {
                    padding: 20px;
                    background: linear-gradient(135deg, #1e293b, #334155);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                }
                
                .chat-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: var(--gradient-primary);
                }

                .header-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .logo-container {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: var(--gradient-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 18px;
                    color: var(--color-button-text);
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                }

                .header-text {
                    display: flex;
                    flex-direction: column;
                }

                .header-title {
                    font-size: 22px;
                    font-weight: 800;
                    color: var(--color-text-light);
                    margin: 0;
                }

                .header-subtitle {
                    font-size: 14px;
                    color: var(--color-promo-code);
                    font-weight: 600;
                }

                .status-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .status-dot {
                    height: 10px;
                    width: 10px;
                    border-radius: 50%;
                    transition: all 0.3s;
                }

                .status-dot.typing {
                    background: var(--color-secondary);
                    animation: pulse 1.5s infinite;
                    box-shadow: 0 0 10px var(--color-secondary);
                }

                .status-dot.idle {
                    background: #6b7280;
                }

                @keyframes pulse {
                    0%, 100% { 
                        opacity: 1;
                        transform: scale(1);
                    }
                    50% { 
                        opacity: 0.7;
                        transform: scale(1.1);
                    }
                }

                /* Boutons d'inscription */
                .register-buttons-container {
                    display: flex;
                    gap: 10px;
                }

                .register-button {
                    padding: 10px 20px;
                    font-size: 14px;
                    font-weight: 700;
                    border-radius: 12px;
                    transition: all 0.3s ease;
                    color: white;
                    text-decoration: none;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                    border: none;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }

                .register-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.5s;
                }

                .register-button:hover::before {
                    left: 100%;
                }

                .register-button.xbet {
                    background: linear-gradient(135deg, var(--color-1xbet), #3b82f6);
                }

                .register-button.xbet:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(29, 78, 216, 0.4);
                }

                .register-button.melbet {
                    background: linear-gradient(135deg, var(--color-melbet), #fbbf24);
                }

                .register-button.melbet:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
                }

                /* Zone des messages */
                .messages-area {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    background: 
                        radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.05) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.05) 0%, transparent 50%);
                }

                /* Message rows avec avatars */
                .message-row {
                    display: flex;
                    align-items: flex-end;
                    gap: 8px;
                    margin-bottom: 16px;
                }

                .bot-row {
                    justify-content: flex-start;
                }

                .user-row {
                    justify-content: flex-end;
                }

                .bot-avatar, .user-avatar {
                    flex-shrink: 0;
                }

                .avatar-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                }

                /* Bulles de message améliorées */
                .message-bubble {
                    max-width: 70%;
                    padding: 16px 20px;
                    border-radius: 18px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                    font-size: 15px;
                    line-height: 1.5;
                    word-wrap: break-word;
                    color: var(--color-text-light);
                    position: relative;
                }

                .bot-bubble {
                    background: var(--color-bot-bubble);
                    border-bottom-left-radius: 4px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .user-bubble {
                    background: var(--color-user-bubble);
                    border-bottom-right-radius: 4px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .promo-code-bold {
                    font-weight: 800;
                    color: var(--color-promo-code);
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }
                
                .link-anchor {
                    font-size: 14px;
                    font-weight: 700;
                    text-decoration: none;
                    color: #4ade80;
                    background: rgba(16, 185, 129, 0.2);
                    padding: 8px 16px;
                    border-radius: 8px;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    margin: 6px 0;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                }

                .link-anchor:hover {
                    background: rgba(16, 185, 129, 0.3);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }

                /* Indicateur de frappe */
                .typing-indicator-container {
                    display: flex;
                    justify-content: flex-start;
                    margin-bottom: 16px;
                }

                .typing-indicator-dots {
                    padding: 16px 20px;
                    border-radius: 18px;
                    background: var(--color-bot-bubble);
                    border-bottom-left-radius: 4px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .dot {
                    height: 8px;
                    width: 8px;
                    background: var(--color-promo-code);
                    border-radius: 50%;
                    animation: bounce 1.4s infinite;
                }

                .dot:nth-child(2) { animation-delay: 0.1s; }
                .dot:nth-child(3) { animation-delay: 0.2s; }

                @keyframes bounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }

                /* Zone de saisie */
                .input-form {
                    padding: 20px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    background: rgba(30, 41, 59, 0.8);
                    backdrop-filter: blur(10px);
                    gap: 12px;
                }

                .chat-input {
                    flex: 1;
                    padding: 16px 20px;
                    border-radius: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.05);
                    color: var(--color-text-light);
                    font-size: 15px;
                    outline: none;
                    transition: all 0.3s ease;
                }

                .chat-input:focus {
                    border-color: var(--color-primary);
                    background: rgba(255, 255, 255, 0.08);
                    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
                }

                .chat-input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .chat-button {
                    padding: 16px 28px;
                    border-radius: 16px;
                    font-weight: 700;
                    transition: all 0.3s ease;
                    background: var(--gradient-primary);
                    color: var(--color-button-text);
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
                }

                .chat-button:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
                }

                .chat-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                /* Pied de page amélioré */
                .footer-links {
                    position: absolute;
                    bottom: 16px;
                    right: 16px;
                    display: flex;
                    gap: 16px;
                    align-items: center;
                    background: rgba(30, 41, 59, 0.9);
                    padding: 12px 20px;
                    border-radius: 16px;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                }

                .footer-link {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    text-decoration: none;
                    color: var(--color-text-light);
                    font-weight: 600;
                    font-size: 13px;
                    padding: 8px 16px;
                    border-radius: 10px;
                    transition: all 0.3s ease;
                }

                .footer-link.whatsapp {
                    background: rgba(37, 211, 102, 0.1);
                    border: 1px solid rgba(37, 211, 102, 0.3);
                }

                .footer-link.whatsapp:hover {
                    background: rgba(37, 211, 102, 0.2);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
                }

                .footer-link.telegram {
                    background: rgba(0, 136, 204, 0.1);
                    border: 1px solid rgba(0, 136, 204, 0.3);
                }

                .footer-link.telegram:hover {
                    background: rgba(0, 136, 204, 0.2);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(0, 136, 204, 0.3);
                }

                .promo-badge {
                    background: var(--gradient-primary);
                    color: var(--color-button-text);
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-weight: 800;
                    font-size: 12px;
                    margin-left: 8px;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .chat-card {
                        height: 95vh;
                        border-radius: 0;
                        max-width: 100%;
                    }

                    .chat-header {
                        padding: 16px;
                        flex-wrap: wrap;
                        gap: 12px;
                    }

                    .header-title {
                        font-size: 18px;
                    }

                    .register-buttons-container {
                        width: 100%;
                        justify-content: center;
                    }

                    .register-button {
                        flex: 1;
                        text-align: center;
                        padding: 12px 16px;
                    }

                    .message-bubble {
                        max-width: 85%;
                        font-size: 14px;
                        padding: 14px 18px;
                    }

                    .input-form {
                        padding: 16px;
                    gap: 10px;
                    flex-wrap: wrap;
                    align-items: center;
                    justify-content: space-between;
                    position: sticky;
                        bottom: 0;
                        background: var(--color-card);
                        z-index: 10;
                    }

                    .chat-input {
                        flex: 1 1 70%;
                        min-width: 0;
                        padding: 14px 16px;
                        font-size: 14px;
                    }

                    .chat-button {
                        flex: 1 1 25%;
                        min-width: 80px;
                        padding: 14px 16px;
                        font-size: 14px;
                    }

                    .footer-links {
                        position: fixed;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        border-radius: 0;
                        justify-content: center;
                        padding: 10px 16px;
                        background: rgba(15, 23, 42, 0.95);
                    }

                    .footer-link {
                        font-size: 12px;
                        padding: 6px 12px;
                    }

                    .promo-badge {
                        display: none;
                    }

                    .avatar-icon {
                        width: 28px;
                        height: 28px;
                        font-size: 14px;
                    }
                }

                @media (max-width: 480px) {
                    .app-container {
                        padding: 8px;
                    }

                    .messages-area {
                        padding: 16px;
                    }

                    .header-content {
                        gap: 8px;
                    }

                    .logo-container {
                        width: 32px;
                        height: 32px;
                        font-size: 16px;
                    }

                    .header-title {
                        font-size: 16px;
                    }

                    .header-subtitle {
                        font-size: 12px;
                    }
                }
            `}</style>

            <div className="chat-card">
                
                {/* En-tête du Chatbot */}
                <div className="chat-header">
                    <div className="header-content">
                        <div className="logo-container">
                            T72
                        </div>
                        <div className="header-text">
                            <h1 className="header-title">
                                {BOT_NAME}
                            </h1>
                            <span className="header-subtitle">
                                Code Promo: {PROMO_CODE}
                            </span>
                        </div>
                    </div>
                    
                    <div className="status-container">
                        <span className={`status-dot ${isBotTyping ? 'typing' : 'idle'}`}></span>
                    </div>

                    <div className="register-buttons-container">
                        <a 
                            href={AFFILIATE_LINK_1XBET} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="register-button xbet"
                        >
                            🎰 1xBet
                        </a>
                        <a 
                            href={AFFILIATE_LINK_MELBET} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="register-button melbet"
                        >
                            ⚽ Melbet
                        </a>
                    </div>
                </div>

                {/* Zone des Messages */}
                <div className="messages-area">
                    {messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))}
                    
                    {/* Indicateur de saisie du bot */}
                    {isBotTyping && (
                        <div className="typing-indicator-container">
                            <div className="typing-indicator-dots">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Zone de Saisie */}
                <form onSubmit={handleSend} className="input-form">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="💬 Posez votre question ou demandez le code promo..."
                        disabled={isBotTyping} 
                        className="chat-input"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isBotTyping} 
                        className="chat-button"
                    >
                        Envoyer 🚀
                    </button>
                </form>
            </div>
            
            {/* Pied de page amélioré */}
            <div className="footer-links">
                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="footer-link whatsapp">
                    💬 WhatsApp
                </a>
                <a href={TELEGRAM_LINK} target="_blank" rel="noopener noreferrer" className="footer-link telegram">
                    📢 Telegram
                </a>
                <span className="promo-badge">
                    {PROMO_CODE}
                </span>
            </div>
        </div>
    );
};

export default App;