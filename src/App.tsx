import { useEffect, useState, useRef } from 'react'
import './App.css'
import { Header } from './shared/ui/Header/Header'
import { HeroBlock } from './shared/ui/HeroBlock/HeroBlock'
import { raffleApi, type RaffleData } from './api/raffleApi'
import { getParsedStartParam, login } from './api/authApi'
import { formatDate, formatAmount } from './shared/utils/format'
import fireIcon from './assets/images/fire.png'
import fireworkIcon from './assets/images/firework.png'
import exclamationIcon from './assets/images/exclamation.png'
import notFoundIcon from './assets/images/not_found.png'
import checkIcon from './assets/images/check.png'
// Для использования мок-данных из JSON файла:
// import mockData from './mocks/raffleMockData.json'

function App() {
  const [raffleData, setRaffleData] = useState<RaffleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isParticipatingLoading, setIsParticipatingLoading] = useState(false)
  const [raffleId, setRuffleId] = useState<string | null>(null)

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
        // Сначала проверяем наличие UUID розыгрыша и режим (preview / обычный)
        const parsed = getParsedStartParam()
        if (!parsed) {
          // Если UUID отсутствует, не делаем запросы к бекенду
          setLoading(false)
          return
        }

        const { raffleUuid, isPreview } = parsed
        setRuffleId(raffleUuid)
        // Выполняем аутентификацию
        await login()
        // Загружаем данные розыгрыша (preview или обычный эндпоинт)
        const data = isPreview
          ? await raffleApi.getRafflePreviewData(raffleUuid)
          : await raffleApi.getRaffleData(raffleUuid)
        setRaffleData(data)
      } catch (error) {
        console.error('Ошибка инициализации приложения:', error)
      } finally {
        setLoading(false)
      }
    }

    // ===== ИСПОЛЬЗОВАНИЕ МОК-ДАННЫХ ИЗ JSON =====
    // Раскомментируйте следующие строки для использования мок-данных:
    // import mockData from './mocks/raffleMockData.json'
    // setLoading(true)
    // const data = mockData.active as RaffleData // Можно изменить на mockData.participating, mockData.finished и т.д.
    // setRaffleData(data)
    // setLoading(false)
    // return
    // =============================================

    initializeApp()
  }, [])

  if (!raffleId) {
    return <div className="app">
      <Header />
      <main className="app-main app-main--center">
        <div className="raffle-end-row-container" style={{ gap: '8px', marginTop: 'auto' }}>
          <div className="raffle-end-row-container__info">
            <div>
              <h1 className="not-found-title">Розыгрыш не найден</h1>
              <p className="not-found-description">Вы открыли приложение без<br />ссылки на розыгрыш</p>
            </div>
          </div>
          <div className="raffle-end-row-container__info raffle-end-row-container__info--gap-20">
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M47.3433 26C47.3433 14.2124 37.7876 4.65672 26 4.65672C14.2124 4.65672 4.65672 14.2124 4.65672 26C4.65672 37.7876 14.2124 47.3433 26 47.3433V52C11.6406 52 0 40.3594 0 26C0 11.6406 11.6406 0 26 0C40.3594 0 52 11.6406 52 26C52 40.3594 40.3594 52 26 52V47.3433C37.7876 47.3433 47.3433 37.7876 47.3433 26Z" fill="#5392DC" />
              <path d="M28.5938 20.9219V37.8281H23.3125V20.9219H28.5938ZM23 16.5625C23 15.8125 23.2708 15.1979 23.8125 14.7188C24.3542 14.2396 25.0573 14 25.9219 14C26.7865 14 27.4896 14.2396 28.0312 14.7188C28.5729 15.1979 28.8438 15.8125 28.8438 16.5625C28.8438 17.3125 28.5729 17.9271 28.0312 18.4062C27.4896 18.8854 26.7865 19.125 25.9219 19.125C25.0573 19.125 24.3542 18.8854 23.8125 18.4062C23.2708 17.9271 23 17.3125 23 16.5625Z" fill="#5392DC" />
            </svg>

            <div>
              <h2 className="not-found-subtitle">Участникам</h2>
              <p className="not-found-description">Чтобы принять участие, перейдите по ссылке из канала, где опубликован розыгрыш</p>
            </div>  <div> <h2 className="not-found-subtitle">Администраторам</h2>
              <p className="not-found-description">Если вы администратор, создайте или управляйте розыгрышами через бота</p>
            </div>
          </div>

        </div>
        <button className="close-button close-button--not-found" onClick={() => {
          if (window.WebApp?.close) {
            window.WebApp.close()
          }
        }}>Закрыть</button>
      </main>
    </div>
  }

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


  const { channels, endsDateTime, participantsAmount, participantsCount, isParticipating, isFinished, isAllSubscribed } = raffleData
  const endDateObj = endsDateTime ? new Date(endsDateTime) : null

  const handleParticipateClick = async () => {
    // Предотвращаем повторные клики
    if (isParticipatingLoading || isParticipating || !raffleId) {
      return
    }

    try {
      setIsParticipatingLoading(true)
      const response = await raffleApi.participate(raffleId)

      if (response.success) {
        setRaffleData((prev) =>
          prev
            ? {
              ...prev,
              isParticipating: !prev.isParticipating,
              participantsCount: response.participants_count,
            }
            : prev
        )
      } else {
        console.error('Не удалось принять участие в розыгрыше:', response.message)
      }
    } catch (error) {
      console.error('Ошибка при участии в розыгрыше:', error)
    } finally {
      setIsParticipatingLoading(false)
    }
  }

  if (isFinished) {
    return <div className="app">
      <Header />
      <main className="app-main app-main--center">
        <div className="raffle-end-row-container">
          <div className="raffle-end-row-container__info">
            <svg width="67" height="67" viewBox="0 0 67 67" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M61 33.5C61 18.3122 48.6878 6 33.5 6C18.3122 6 6 18.3122 6 33.5C6 48.6878 18.3122 61 33.5 61V67C14.9985 67 0 52.0015 0 33.5C0 14.9985 14.9985 0 33.5 0C52.0015 0 67 14.9985 67 33.5C67 52.0015 52.0015 67 33.5 67V61C48.6878 61 61 48.6878 61 33.5Z" fill="#5392DC" />
              <path d="M30.4336 15.376C30.4336 13.7191 31.7767 12.376 33.4336 12.376C35.0904 12.376 36.4336 13.7191 36.4336 15.376V33.2393L49.0732 45.8789C50.2448 47.0505 50.2448 48.9495 49.0732 50.1211C47.9017 51.2927 46.0026 51.2927 44.8311 50.1211L31.3125 36.6025C30.7499 36.0399 30.4336 35.2771 30.4336 34.4814V15.376Z" fill="#5392DC" />
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
        <HeroBlock allSubscribed={isAllSubscribed} />
        <div className="content-block">
          <div className="raffle-end-row-container">
            <div className="raffle-end-row">
              <span className="raffle-end-row__label">{endDateObj ? 'Розыгрыш кончится:' : 'Участников:'}</span>
              {
                endDateObj ? (
                  <span className="raffle-end-row__condition">{formatDate(endDateObj)}</span>
                ) : (
                  <span className="raffle-end-row__condition">{participantsCount} из {formatAmount(participantsAmount)}</span>
                )
              }
            </div>
            <button
              className={`participate-button ${isParticipating ? 'participate-button--participating' : ''} ${!isAllSubscribed ? 'participate-button--disabled' : ''}`}
              type="button"
              disabled={!isAllSubscribed || isParticipating || isParticipatingLoading}
              onClick={handleParticipateClick}
            >
              <img
                src={isParticipating ? fireworkIcon : fireIcon}
                alt={isParticipating ? "Вы уже участвуете" : "Участвовать"}
              />
              <span className="participate-button__text">
                {isParticipating ? "Вы уже участвуете" : "Участвовать"}
              </span>
            </button>
          </div>
          <div>
            <div className="info-header">
              <img src={exclamationIcon} alt="Восклицательный знак" />
              <span className="info-header__text">Дополнительная информация</span>
            </div>
            <p className="consent-text">
              Нажимая кнопку «Участвовать» вы подтверждаете свое согласие с политикой обработки персональных данных и пользовательским соглашением
            </p>
          </div>
        </div>
        {channels.length > 0 && (
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
                  <img
                    src={channel.photo || notFoundIcon}
                    alt={channel.title}
                    className="channel-card__logo"
                  />
                  <span className="channel-card__name">{channel.title}</span>
                  {channel.isSubscribed && (
                    <img
                      src={checkIcon}
                      alt="Подписан"
                      className="channel-card__icon"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>)}
      </main>
    </div>
  )
}

export default App
