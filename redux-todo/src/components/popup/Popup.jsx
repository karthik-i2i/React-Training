import { useState } from "react";
import "./popup.css";

export default function Popup({ message, firstButtonName, firstButtonOnClick, firstButtonDisabled = false, 
                                secondButtonName, secondButtonOnClick, children, error, btnClassName }) {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      secondButtonOnClick();
    }, 300);
  }

  return (
    <div className={`popup-overlay ${closing ? "closing" : ""}`}>
      <div className={`popup-box ${closing ? "closing" : ""}`}>
        {message && <p>{message}</p>}
        {children}
        {error && <div className="error-box">{error}</div>}
        <div className="popup-btn-wrapper">
          {firstButtonName && (
            <button className="gradient-btn" disabled={firstButtonDisabled} style={{ width: "30%" }} onClick={firstButtonOnClick}>
              {firstButtonName}
            </button>
          )}
          {secondButtonName && (
            <button className={`gradient-btn ${btnClassName}`} style={{ width: "30%" }} onClick={handleClose}>
              {secondButtonName}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
