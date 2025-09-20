import { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
    const [stage, setStage] = useState("greeting"); // greeting -> main -> approval
    const [isRandomDisabled, setIsRandomDisabled] = useState(false);
    const mainRef = useRef(null);
    const randomBtnRef = useRef(null);

    // Show greeting for 5s, then reveal main
    useEffect(() => {
        const t = setTimeout(() => setStage("main"), 5000);
        return () => clearTimeout(t);
    }, []);

    // Move the "random" button to a random location within viewport on hover
    const moveRandomButton = () => {
        if (isRandomDisabled) return;
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

        // через 1 секунду после улёта скрываем кнопку и показываем уведомление
        setTimeout(() => setIsRandomDisabled(true), 1000);
    };

    const handleApproveClick = () => {
        const el = mainRef.current;
        if (el) {
            el.style.transition = "opacity 2s";
            el.style.opacity = "0";
            setTimeout(() => setStage("approval"), 2000);
        } else {
            setStage("approval");
        }
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
                        <button className="button" onClick={handleApproveClick}>Ну добре вже</button>
                        {!isRandomDisabled ? (
                            <button
                                ref={randomBtnRef}
                                className="random-button"
                                onMouseEnter={moveRandomButton}
                            >
                                Ну я подумаю
                            </button>
                        ) : (
                            <div className="random-disabled">
                                Ця кнопка недоступна ☹️ <br /> Користуйся вищею ↑
                            </div>
                        )}
                    </div>
                </div>
            )}

            {stage === "approval" && (
                <div className="approval-container">
                    <div className="approval-text">Дяякую, напиши мені про це, будь-ласка☺️</div>
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
