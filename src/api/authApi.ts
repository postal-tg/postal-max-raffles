// Типы для ответа от API аутентификации
type AuthResponse = {
  access_token: string
  refresh_token: string
}

// Типы для window.WebApp
declare global {
  interface Window {
    WebApp?: {
      initData?: string
      close?: () => void
    }
  }
}

// Используем переменную окружения, если она задана, иначе пустая строка (относительный путь)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// Ключи для localStorage
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

/**
 * Сохраняет токены в localStorage
 */
function saveTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

/**
 * Получает сохраненный access token
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/**
 * Получает сохраненный refresh token
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * Проверяет, есть ли уже сохраненный токен
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken()
}

/**
 * Извлекает start_param из initData
 */
export function getStartParam(): string | null {
  const initData = window.WebApp?.initData
  if (!initData) {
    return null
  }

  const params = new URLSearchParams(initData)
  return params.get('start_param')
}

/**
 * Удаляет сохраненные токены
 */
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

/**
 * Выполняет аутентификацию через WebApp initData.
 * Получает initData, отправляет POST на /prize-draws/webapp/login и сохраняет токены.
 */
export async function login(): Promise<AuthResponse> {
  const initData = window.WebApp?.initData

  const response = await fetch(`${API_BASE_URL}/prize-draws/webapp/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(initData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Ошибка аутентификации: ${response.status} ${errorText}`)
  }

  const authData: AuthResponse = await response.json()
  saveTokens(authData.access_token, authData.refresh_token)

  return authData
}

/**
 * Обновляет access token используя refresh token.
 * Отправляет POST на /prize-draws/webapp/refresh и сохраняет новые токены.
 */
export async function refresh(): Promise<AuthResponse> {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    throw new Error('Refresh token не найден. Необходима повторная аутентификация.')
  }

  const response = await fetch(`${API_BASE_URL}/prize-draws/webapp/refresh`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${refreshToken}`,
    },
  })

  if (!response.ok) {
    // Если refresh не удался, очищаем токены
    clearTokens()
    const errorText = await response.text()
    throw new Error(`Ошибка обновления токена: ${response.status} ${errorText}`)
  }

  const authData: AuthResponse = await response.json()
  saveTokens(authData.access_token, authData.refresh_token)

  return authData
}
