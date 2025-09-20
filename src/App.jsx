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
    // Надёжная отправка в Telegram (работает в webview/браузере)
    const sendToTelegram = (raw) => {
        const text = (raw || "").trim();
        if (!text) return;

        const message  = encodeURIComponent(text);
        const username = "VladyslavSmagin";

        // deep link в нативный Telegram-клиент
        const tgDeep = `tg://resolve?domain=${username}&text=${message}`;
        // веб-урл на случай, если deep link не сработал
        const tgWeb  = `https://t.me/${username}?text=${message}`;

        let fbTimer;
        const onVisibility = () => {
            // если страница ушла в фон (Телеграм открылся) — отменяем фоллбек
            if (document.hidden) {
                clearTimeout(fbTimer);
                document.removeEventListener("visibilitychange", onVisibility);
            }
        };
        document.addEventListener("visibilitychange", onVisibility);

        // используем переход вместо window.open (меньше шансов блокировки попапов)
        window.location.href = tgDeep;

        // если deep link не сработал — открываем веб через 700 мс
        fbTimer = setTimeout(() => {
            document.removeEventListener("visibilitychange", onVisibility);
            window.open(tgWeb, "_blank");
        }, 700);
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


