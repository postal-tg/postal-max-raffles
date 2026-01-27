import { useEffect, useState, useRef } from 'react'
import './App.css'
import { Header } from './shared/ui/Header/Header'
import { HeroBlock } from './shared/ui/HeroBlock/HeroBlock'
import { raffleApi, type RaffleData } from './api/raffleApi'
import { login } from './api/authApi'

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${day}.${month}.${year}`
}

function App() {
  const [raffleData, setRaffleData] = useState<RaffleData | null>(null)
  const [loading, setLoading] = useState(true)
  const initialized = useRef(false)

  useEffect(() => {
    // Предотвращаем повторный вызов в StrictMode
    if (initialized.current) {
      return
    }
    initialized.current = true

    const initializeApp = async () => {
      try {
        setLoading(true)
        // Сначала выполняем аутентификацию
        await login()
        // Затем загружаем данные розыгрыша
        const data = await raffleApi.getRaffleData()
        setRaffleData(data)
      } catch (error) {
        console.error('Ошибка инициализации приложения:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, [])

  if (loading || !raffleData) {
    return (
      <div className="app">
        <Header />
        <main className="app-main app-main--center">
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


  const { channels, endsDateTime, isParticipating, isFinished } = raffleData
  const allSubscribed = channels.every((channel) => channel.isSubscribed)
  const endDateObj = endsDateTime ? new Date(endsDateTime) : null

  if (isFinished) {
    return <div className="app">
    <Header />
    <main className="app-main app-main--center">
      <div className="raffle-end-row-container">
        <div className="raffle-end-row-container__info">
          <svg width="67" height="67" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M61 33.5C61 18.3122 48.6878 6 33.5 6C18.3122 6 6 18.3122 6 33.5C6 48.6878 18.3122 61 33.5 61V67C14.9985 67 0 52.0015 0 33.5C0 14.9985 14.9985 0 33.5 0C52.0015 0 67 14.9985 67 33.5C67 52.0015 52.0015 67 33.5 67V61C48.6878 61 61 48.6878 61 33.5Z" fill="#5392DC"/>
            <path d="M30.4336 15.376C30.4336 13.7191 31.7767 12.376 33.4336 12.376C35.0904 12.376 36.4336 13.7191 36.4336 15.376V33.2393L49.0732 45.8789C50.2448 47.0505 50.2448 48.9495 49.0732 50.1211C47.9017 51.2927 46.0026 51.2927 44.8311 50.1211L31.3125 36.6025C30.7499 36.0399 30.4336 35.2771 30.4336 34.4814V15.376Z" fill="#5392DC"/>
          </svg>
          <span className="raffle-end-row__label">Розыгрыш уже завершен</span>
        </div>
        <button className="close-button" onClick={() => {
          if (window.WebApp?.close) {
            window.WebApp.close()
          }
        }}>Закрыть</button>
      </div>
    </main>
  </div>
  }

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <HeroBlock allSubscribed={allSubscribed} />
        <div className="content-block">
          <div className="raffle-end-row-container">
            {endDateObj && (
              <div className="raffle-end-row">
                <span className="raffle-end-row__label">Розыгрыш кончится:</span>
                <span className="raffle-end-row__date">{formatDate(endDateObj)}</span>
              </div>
            )}
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
            {channels.map((channel) => (
              <div key={channel.id} className="channel-card">
                <span className="channel-card__name">{channel.title}</span>
                {channel.isSubscribed && (
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
