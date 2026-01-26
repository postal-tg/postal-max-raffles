import { useEffect, useState } from 'react'
import './App.css'
import { Header } from './shared/ui/Header/Header'
import { HeroBlock } from './shared/ui/HeroBlock/HeroBlock'
import { raffleApi, type RaffleData } from './api/raffleApi'

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${day}.${month}.${year}`
}

function App() {
  const [raffleData, setRaffleData] = useState<RaffleData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRaffleData = async () => {
      try {
        setLoading(true)
        const data = await raffleApi.getRaffleData()
        setRaffleData(data)
      } catch (error) {
        console.error('Ошибка загрузки данных розыгрыша:', error)
      } finally {
        setLoading(false)
      }
    }

    loadRaffleData()
  }, [])

  if (loading || !raffleData) {
    return (
      <div className="app">
        <Header />
        <main className="app-main app-main--loading">
          <div className="loader">
            <div className="loader__balls">
              <div className="loader__ball loader__ball--top"></div>
              <div className="loader__ball loader__ball--bottom"></div>
            </div>
            <div className="loader__text">Проверяем наличие подписок на каналы</div>
          </div>
        </main>
      </div>
    )
  }

  const { channels, endDate, isParticipating } = raffleData
  const allSubscribed = channels.every((channel) => channel.subscribed)
  const endDateObj = new Date(endDate)

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <HeroBlock allSubscribed={allSubscribed} />
        <div className="content-block">
          <div className="raffle-end-row-container">
            <div className="raffle-end-row">
              <span className="raffle-end-row__label">Розыгрыш кончится:</span>
              <span className="raffle-end-row__date">{formatDate(endDateObj)}</span>
            </div>
            <button 
              className={`participate-button ${isParticipating ? 'participate-button--participating' : ''} ${!allSubscribed ? 'participate-button--disabled' : ''}`}
              type="button"
              disabled={!allSubscribed}
            >
              <img 
                src={isParticipating ? "./src/assets/images/firework.png" : "./src/assets/images/fire.png"} 
                alt={isParticipating ? "Вы уже участвуете" : "Участвовать"} 
              />
              <span className="participate-button__text">
                {isParticipating ? "Вы уже участвуете" : "Участвовать"}
              </span>
            </button>
          </div>
          <div>
            <div className="info-header">
            <img src={"./src/assets/images/exclamation.png"} alt="Восклицательный знак" />
              <span className="info-header__text">Дополнительная информация</span>
            </div>
            <p className="consent-text">
              Нажимая кнопку «Участвовать» вы подтверждаете свое согласие с политикой обработки персональных данных и пользовательским соглашением
            </p>
          </div>
        </div>
        <div className="content-block">
          <div className="channels-header">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="channels-header__icon"
            >
              <rect width="22" height="22" rx="11" fill="#2869B6" />
              <path
                d="M9.33568 14.7643L6.88875 9.51362L12.0496 4.89314C12.712 4.30011 13.7589 4.51454 14.1349 5.32024L17.2388 11.9732C17.6171 12.7841 17.0998 13.7291 16.2128 13.8474L9.33568 14.7643Z"
                fill="white"
              />
              <path
                d="M8.26515 15.0872L5.97114 10.1593L5.19612 10.4867C4.54182 10.7631 4.24613 11.5262 4.54336 12.1713L5.77321 14.8405C6.0617 15.4666 6.80055 15.7437 7.42964 15.4617L8.26515 15.0872Z"
                fill="white"
              />
              <path
                d="M8.87688 15.597L8.58801 15.7499L9.26178 17.2146C9.5392 17.8177 10.2469 18.0896 10.8568 17.8272L11.6163 17.5005C12.2607 17.2233 12.5405 16.4622 12.2292 15.8336L11.9016 15.1722L8.87688 15.597Z"
                fill="white"
              />
            </svg>
            <span className="channels-header__text">Каналы для подписки</span>
          </div>
          <div className="channels-list">
            {channels.map((channel, index) => (
              <div key={index} className="channel-card">
                <span className="channel-card__name">{channel.name}</span>
                {channel.subscribed && (
                  <img 
                    src="./src/assets/images/check.png" 
                    alt="Подписан" 
                    className="channel-card__icon"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
