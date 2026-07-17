export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'INR'
  | 'AUD'
  | 'CAD'
  | 'CHF'
  | 'CNY'
  | 'SGD'

export interface CurrencyMeta {
  code: CurrencyCode
  name: string
  symbol: string
}

export interface ConversionResult {
  amount: number
  from: CurrencyCode
  to: CurrencyCode
  converted: number
  rate: number
}
