export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR' | 'AUD' | 'CAD'

export interface ExchangeRateResponse {
  amount: number
  base: string
  date: string
  rates: Record<string, number>
}
