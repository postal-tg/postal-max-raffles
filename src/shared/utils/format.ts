/**
 * Форматирует дату в формат DD.MM.YY
 */
export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String(date.getFullYear()).slice(-2)
  return `${day}.${month}.${year}`
}

/**
 * Форматирует число для отображения:
 * - >= 1,000,000 → "X.Xm" (миллионы)
 * - >= 1,000 → "X.Xk" (тысячи)
 * - < 1,000 → число как есть
 */
export const formatAmount = (amount: number): string => {
  if (amount >= 1000000) {
    const millions = amount / 1000000
    return `${millions.toFixed(1)}m`
  }
  if (amount >= 1000) {
    const thousands = amount / 1000
    return `${thousands.toFixed(1)}k`
  }
  return amount.toString()
}
