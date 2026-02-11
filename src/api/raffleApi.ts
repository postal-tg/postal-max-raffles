import { getAccessToken, refresh } from './authApi'

// Типы для API (snake_case)
type ApiMandatoryChannel = {
  channel_id: number
  title: string
  is_subscribed: boolean
  photo: string | null
}

type ApiRaffleData = {
  prize_draw_id: number
  title: string
  ends_datetime?: string
  participants_count: number
  participants_amount: number
  is_finished: boolean
  is_participant: boolean
  mandatory_channels: ApiMandatoryChannel[]
  all_subscribed: boolean
}

type ApiParticipateResponse = {
  success: boolean
  message: string
  participants_count: number
}

// Внутренние типы (camelCase)
export type Channel = {
  id: number
  title: string
  isSubscribed: boolean
  photo: string | null
}

export type RaffleData = {
  endsDateTime?: string
  participantsCount: number
  participantsAmount: number
  isFinished: boolean
  channels: Channel[]
  isParticipating: boolean
  isAllSubscribed: boolean
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
      photo: channel.photo,
    })),
    isParticipating: apiData.is_participant,
    isAllSubscribed: apiData.all_subscribed, // По дефолту false, позже будет с бекенда
  }
}

// Используем переменную окружения, если она задана, иначе пустая строка (относительный путь)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

/**
 * Выполняет fetch запрос с автоматической обработкой 401 ошибок.
 * При получении 401 автоматически обновляет токен через refresh и повторяет запрос.
 */
async function fetchWithAuth(url: string, options: RequestInit): Promise<Response> {
  let response = await fetch(url, options)

  // Если получили 401, пытаемся обновить токен
  if (response.status === 401) {
    await refresh()
    
    // Обновляем Authorization header с новым токеном
    const newAccessToken = getAccessToken()
    if (!newAccessToken) {
      throw new Error('Не удалось получить новый access token')
    }

    const newOptions: RequestInit = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${newAccessToken}`,
      },
    }

    // Повторяем оригинальный запрос с новым токеном
    response = await fetch(url, newOptions)
  }

  return response
}

export const raffleApi = {
  // Получить данные розыгрыша
  async getRaffleData(raffleUuid: string): Promise<RaffleData> {
    const accessToken = getAccessToken()
    
    if (!accessToken) {
      throw new Error('Access token не найден. Необходима аутентификация.')
    }

    const response = await fetchWithAuth(
      `${API_BASE_URL}/prize-draws/webapp/uuid/${raffleUuid}/check-subscriptions`,
      {
        method: 'GET',
        headers: {
          "Accept": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ошибка загрузки данных розыгрыша: ${response.status} ${errorText}`)
    }

    const apiData: ApiRaffleData = await response.json()
    
    // Трансформируем данные из snake_case в camelCase
    return transformApiRaffleData(apiData)
  },

  // Получить данные розыгрыша в режиме preview
  async getRafflePreviewData(raffleUuid: string): Promise<RaffleData> {
    const accessToken = getAccessToken()

    if (!accessToken) {
      throw new Error('Access token не найден. Необходима аутентификация.')
    }

    const response = await fetchWithAuth(
      `${API_BASE_URL}/prize-draws/webapp/uuid/${raffleUuid}/preview`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ошибка загрузки preview розыгрыша: ${response.status} ${errorText}`)
    }

    const apiData: ApiRaffleData = await response.json()
    return transformApiRaffleData(apiData)
  },

  // Отправить запрос на участие в розыгрыше
  async participate(raffleUuid: string): Promise<ApiParticipateResponse> {
    const accessToken = getAccessToken()

    if (!accessToken) {
      throw new Error('Access token не найден. Необходима аутентификация.')
    }

    const response = await fetchWithAuth(
      `${API_BASE_URL}/prize-draws/webapp/uuid/${raffleUuid}/participate`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Ошибка участия в розыгрыше: ${response.status} ${errorText}`)
    }

    const data: ApiParticipateResponse = await response.json()
    return data
  },
}
