// Типы для API (snake_case)
type ApiMandatoryChannel = {
  channel_id: number
  title: string
  is_subscribed: boolean
}

type ApiRaffleData = {
  prize_draw_id: number
  title: string
  ends_datetime?: string
  participants_count: number
  participants_amount: number
  is_finished: boolean
  is_participating: boolean
  mandatory_channels: ApiMandatoryChannel[]
}

// Внутренние типы (camelCase)
export type Channel = {
  id: number
  title: string
  isSubscribed: boolean
}

export type RaffleData = {
  endsDateTime?: string
  participantsCount: number
  participantsAmount: number
  isFinished: boolean
  channels: Channel[]
  isParticipating: boolean // Пока по дефолту false, позже будет с бекенда
}

// Функция трансформации API данных во внутренний формат
function transformApiRaffleData(apiData: ApiRaffleData): RaffleData {
  return {
    endsDateTime: apiData.ends_datetime,
    participantsCount: apiData.participants_count,
    participantsAmount: apiData.participants_amount,
    isFinished: apiData.is_finished,
    channels: apiData.mandatory_channels.map((channel) => ({
      id: channel.channel_id,
      title: channel.title,
      isSubscribed: channel.is_subscribed,
    })),
    isParticipating: apiData.is_participating, // По дефолту false, позже будет с бекенда
  }
}

// Моковые данные в формате API (snake_case)
const mockApiRaffleData: ApiRaffleData = {
  prize_draw_id: 1,
  title: 'Тестовый розыгрыш',
  ends_datetime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // через 7 дней
  participants_count: 0,
  participants_amount: 0,
  is_finished: false,
  is_participating: false,
  mandatory_channels: [
    { channel_id: 1, title: 'Канал 1', is_subscribed: true },
    { channel_id: 2, title: 'Канал 2', is_subscribed: false },
    { channel_id: 3, title: 'Канал 3', is_subscribed: true },
    { channel_id: 4, title: 'Канал 4', is_subscribed: false },
  ],
}

// Моковый API сервис
export const raffleApi = {
  // Получить данные розыгрыша
  async getRaffleData(): Promise<RaffleData> {
    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    // Имитация получения данных с бекенда
    // В реальном приложении здесь будет fetch запрос:
    // const response = await fetch('/api/raffle')
    // const apiData: ApiRaffleData = await response.json()
    
    // Трансформируем данные из snake_case в camelCase
    return transformApiRaffleData(mockApiRaffleData)
  },
}
