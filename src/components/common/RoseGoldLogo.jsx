import React from "react";

export default function RoseGoldLogo() {
  return (
    <>
    <style>{`
      :root {
        --rose-gold: #b87333;
        --dark-bg: #120f13;
      }

      .logo-container {
        background-color: var(--dark-bg);
        padding: 40px;
        text-align: center;
        font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
        display: inline-block;
        border-radius: 12px;
      }

      .ai-logo {
        width: 150px;
        height: auto;
        filter: drop-shadow(0 0 15px rgba(184, 115, 51, 0.3));
        transition: transform 0.3s ease;
        cursor: pointer;
      }

      .ai-logo:hover {
        transform: translateY(-5px) scale(1.05);
      }

      .logo-text h1 {
        color: #ffffff;
        font-weight: 800;
        letter-spacing: 8px;
        font-size: 24px;
        margin: 15px 0 5px 0;
        text-shadow: 0 4px 10px rgba(0,0,0,0.5);
      }

      .subtitle {
        color: rgba(255, 255, 255, 0.6);
        font-size: 10px;
        letter-spacing: 3px;
        text-transform: uppercase;
        margin: 0;
      }

      .subtitle span {
        color: var(--rose-gold);
        font-weight: bold;
      }
    `}
    </style>
    <div className="logo-container">
      <svg
        className="ai-logo"
        viewBox="0 0 150 150"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circular background */}
        <circle cx="75" cy="75" r="70" fill="rgba(184, 115, 51, 0.1)" stroke="#b87333" strokeWidth="2" />
        
        {/* AI text with rose gold styling */}
        <text
          x="75"
          y="85"
          fontSize="64"
          fontWeight="800"
          textAnchor="middle"
          fill="#b87333"
          fontFamily="'Inter', sans-serif"
          letterSpacing="2"
        >
          AI
        </text>
        
        {/* Decorative accent lines */}
        <line x1="30" y1="75" x2="50" y2="75" stroke="#b87333" strokeWidth="2" opacity="0.6" />
        <line x1="100" y1="75" x2="120" y2="75" stroke="#b87333" strokeWidth="2" opacity="0.6" />
      </svg>
      
      <div className="logo-text">
        <h1>KCF AI</h1>
        <p className="subtitle">Powered by <span>AI</span></p>
      </div>
    </div>
    </>
  );
}