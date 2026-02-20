import "./Header.css";

const GIVEAWAY_BOT_URL = "https://max.ru/giveaway_bot";

export const Header = () => (
  <a
    className="header-container"
    href={GIVEAWAY_BOT_URL}
    target="_blank"
    rel="noopener noreferrer"
  >
    <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_874_2002)">
        <path
          d="M6.41992 0.496826C8.68449 0.497028 10.5204 2.33283 10.5205 4.59741C10.5205 6.86209 8.68455 8.6978 6.41992 8.698H4.50977V13.5193H0.37793V9.19409C0.37793 8.23751 0.916723 7.36181 1.77051 6.93042L6.3252 4.62866H0.37793V0.496826H6.41992ZM2.06836 7.00757C3.22028 7.35815 3.29964 8.53134 3.19531 9.07397L6.1377 5.06714C5.21936 5.50544 3.1201 6.50674 2.06836 7.00757Z"
          fill="white"
        />
        <path
          d="M6.41992 0.496826C8.68449 0.497028 10.5204 2.33283 10.5205 4.59741C10.5205 6.86209 8.68455 8.6978 6.41992 8.698H4.50977V13.5193H0.37793V9.19409C0.37793 8.23751 0.916723 7.36181 1.77051 6.93042L6.3252 4.62866H0.37793V0.496826H6.41992ZM2.06836 7.00757C3.22028 7.35815 3.29964 8.53134 3.19531 9.07397L6.1377 5.06714C5.21936 5.50544 3.1201 6.50674 2.06836 7.00757Z"
          fill="url(#paint0_linear_874_2002)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_874_2002"
          x1="1.11327"
          y1="0.496827"
          x2="12.0754"
          y2="10.799"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#40AAFE" />
          <stop offset="1" stopColor="#1D7CFF" />
        </linearGradient>
        <clipPath id="clip0_874_2002">
          <rect width="10.8889" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
    <div className="header-text">
      <span>Postal</span> — @giveaway_bot
    </div>
  </a>
);
