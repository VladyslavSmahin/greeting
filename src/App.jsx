import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
    const [stage, setStage] = useState("greeting"); // greeting -> main -> approval
    const [customText, setCustomText] = useState("");
    const mainRef = useRef(null);
    const randomBtnRef = useRef(null);

    // Show greeting for 5s, then reveal main
    useEffect(() => {
        const t = setTimeout(() => setStage("main"), 5000);
        return () => clearTimeout(t);
    }, []);

    // Open Telegram DM with prefilled text (fallback to share url)
    const sendToTelegram = (text) => {
        const message = encodeURIComponent(text || "");
        if (!message) return;
        const username = "VladyslavSmagin"; // твой @username
        const tgDeep = `tg://resolve?domain=${username}&text=${message}`;
        const tgShare = `https://t.me/share/url?url=&text=${message}`;

        // Пытаемся открыть нативный клиент Telegram
        const win = window.open(tgDeep, "_blank");
        // Если нативный протокол недоступен (десктоп без клиента) — откроется веб-шаринг
        setTimeout(() => {
            try { if (!win || win.closed) window.open(tgShare, "_blank"); } catch (_) {
                window.open(tgShare, "_blank");
            }
        }, 400);
    };

    // "Убегающая" анимация по наведению (оставим как эффект), но клик теперь тоже отправляет сообщение
    const moveRandomButton = () => {
        const btn = randomBtnRef.current;
        if (!btn) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const bw = btn.offsetWidth;
        const bh = btn.offsetHeight;

        const maxX = Math.max(0, vw - bw);
        const maxY = Math.max(0, vh - bh);

        const randomX = Math.random() * maxX;
        const randomY = Math.random() * maxY;

        btn.style.transform = `translate(${randomX}px, ${randomY}px)`;
    };

    // Быстрые варианты
    const quickOptions = [
        "Ну давай-давай,коли?",
        "На вихідних мені зручніше може бути",
        "Зустрінемось))",
        "Ти себе бачив?😁",
        "Ну не знаю - не знаю",
    ];

    const handleAndConfirm = (text) => {
        sendToTelegram(text);
        setStage("approval");
    };

    return (
        <div className="app">
            {stage === "greeting" && (
                <div className="greeting">Ангеліна, добрєйший день, радий що завітала</div>
            )}

            {stage === "main" && (
                <div ref={mainRef} className="main-content" aria-live="polite">
                    <div className="achieves">
            <span className="done">
              Чи буде на то ваша ласка погодитись на побачення зі мною <span className="done_1">?)</span>
            </span>
                        <span className="agree">Тицяй кнопочку знизу</span>
                    </div>

                    <div className="buttons">
                        {/* Главная кнопка теперь тоже отправляет текст */}


                        {/* Три быстрых варианта */}
                        <div className="options">
                            {quickOptions.map((txt, i) => (
                                <button key={i} className="option-btn" onClick={() => handleAndConfirm(txt)}>
                                    {txt}
                                </button>
                            ))}
                        </div>
                        <button className="button-small" onClick={() => handleAndConfirm("не знаю, а може знаю )))))")}>не знаю не знаю</button>
                        {/* Кастомное сообщение */}
                        <div className="send-box">
                            <input
                                className="send-input"
                                type="text"
                                placeholder="Напиши свій варіант…"
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                            />
                            <button
                                className="send-btn"
                                onClick={() => handleAndConfirm(customText)}
                                disabled={!customText.trim()}
                            >
                                Надіслати в Telegram
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {stage === "approval" && (
                <div className="approval-container">
                    <div className="approval-text">Дяякую! Повідомлення вже летить у Telegram ☺️</div>
                    <a className="approval-link" href="https://t.me/VladyslavSmagin" target="_blank" rel="noreferrer">
                        Мій телеграм
                    </a>
                    <div className="approval-text">Або можем подзвонити️</div>
                    <a className="approval-num" href="tel:+380937284298">+380937284298</a>
                </div>
            )}
        </div>
    );
}


