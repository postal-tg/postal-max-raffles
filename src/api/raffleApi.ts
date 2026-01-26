// Типы для API
export type Channel = {
  name: string
  subscribed: boolean
}

export type RaffleData = {
  channels: Channel[]
  isParticipating: boolean
  endDate: string // ISO date string
}

// Моковые данные
const mockRaffleData: RaffleData = {
  channels: [
    { name: 'Канал 1', subscribed: true },
    { name: 'Канал 2', subscribed: false },
    { name: 'Канал 3', subscribed: true },
    { name: 'Канал 4', subscribed: false },
  ],
  isParticipating: false,
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // через 7 дней
}

// Моковый API сервис
export const raffleApi = {
  // Получить данные розыгрыша
  async getRaffleData(): Promise<RaffleData> {
    // Имитация задержки сети
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    // Возвращаем моковые данные
    return Promise.resolve(mockRaffleData)
  },
}
