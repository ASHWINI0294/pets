import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  isValidAmount,
  canConvert,
  convertSync,
  convertAmount,
  formatMoney,
  RATES,
  CURRENCIES,
} from './converterLogic.js'

describe('isValidAmount — edge cases', () => {
  it('rejects empty string', () => {
    assert.equal(isValidAmount(''), false)
  })

  it('rejects whitespace-only', () => {
    assert.equal(isValidAmount('   '), false)
  })

  it('rejects zero', () => {
    assert.equal(isValidAmount('0'), false)
  })

  it('rejects negative numbers', () => {
    assert.equal(isValidAmount('-5'), false)
    assert.equal(isValidAmount('-0.01'), false)
  })

  it('rejects non-numeric text', () => {
    assert.equal(isValidAmount('abc'), false)
    assert.equal(isValidAmount('12abc'), false)
  })

  it('rejects Infinity and NaN-like input', () => {
    assert.equal(isValidAmount('Infinity'), false)
    assert.equal(isValidAmount('NaN'), false)
  })

  it('accepts positive integers and decimals', () => {
    assert.equal(isValidAmount('1'), true)
    assert.equal(isValidAmount('100'), true)
    assert.equal(isValidAmount('0.01'), true)
    assert.equal(isValidAmount('99.99'), true)
  })

  it('accepts numeric values passed as numbers', () => {
    assert.equal(isValidAmount(50), true)
    assert.equal(isValidAmount(0), false)
    assert.equal(isValidAmount(-1), false)
  })
})

describe('canConvert — edge cases', () => {
  it('allows valid different currencies when not loading', () => {
    assert.equal(canConvert('100', 'USD', 'EUR', false), true)
  })

  it('blocks same From/To currency', () => {
    assert.equal(canConvert('100', 'USD', 'USD', false), false)
  })

  it('blocks invalid amount', () => {
    assert.equal(canConvert('', 'USD', 'EUR', false), false)
    assert.equal(canConvert('0', 'USD', 'EUR', false), false)
    assert.equal(canConvert('-10', 'USD', 'EUR', false), false)
  })

  it('blocks while loading', () => {
    assert.equal(canConvert('100', 'USD', 'EUR', true), false)
  })
})

describe('convertSync — math edge cases', () => {
  it('converts USD to EUR with known mock rate', () => {
    const result = convertSync(100, 'USD', 'EUR')
    assert.equal(result.converted, 92)
    assert.equal(result.rate, 0.92)
  })

  it('converts EUR to USD (inverse path)', () => {
    const result = convertSync(92, 'EUR', 'USD')
    assert.ok(Math.abs(result.converted - 100) < 1e-10)
  })

  it('handles tiny decimal amounts', () => {
    const result = convertSync(0.01, 'USD', 'JPY')
    assert.equal(result.converted, 1.495)
  })

  it('handles large amounts without overflowing', () => {
    const result = convertSync(1_000_000_000, 'USD', 'INR')
    assert.equal(result.converted, 83_120_000_000)
    assert.equal(Number.isFinite(result.converted), true)
  })

  it('same-currency conversion rate is 1', () => {
    const result = convertSync(50, 'GBP', 'GBP')
    assert.equal(result.converted, 50)
    assert.equal(result.rate, 1)
  })

  it('throws for unknown currency codes', () => {
    assert.throws(
      () => convertSync(10, 'USD', 'XYZ'),
      /Exchange rate not available/,
    )
  })

  it('round-trips USD → INR → USD approximately', () => {
    const toInr = convertSync(100, 'USD', 'INR')
    const back = convertSync(toInr.converted, 'INR', 'USD')
    assert.ok(Math.abs(back.converted - 100) < 1e-9)
  })
})

describe('convertAmount — async edge cases', () => {
  it('resolves with conversion when delay is 0', async () => {
    const result = await convertAmount(10, 'USD', 'CAD', 0)
    assert.ok(Math.abs(result.converted - 13.6) < 1e-10)
    assert.equal(result.from, 'USD')
    assert.equal(result.to, 'CAD')
  })

  it('rejects unknown currency even after delay', async () => {
    await assert.rejects(
      () => convertAmount(10, 'AAA', 'USD', 0),
      /Exchange rate not available/,
    )
  })
})

describe('formatMoney — edge cases', () => {
  it('formats USD with amount visible', () => {
    const text = formatMoney(100, 'USD')
    assert.match(text, /100/)
  })

  it('formats JPY without requiring fractional cents', () => {
    const text = formatMoney(1495, 'JPY')
    assert.match(text, /1,?495/)
  })
})

describe('data integrity', () => {
  it('every currency in CURRENCIES has a rate', () => {
    for (const { code } of CURRENCIES) {
      assert.equal(typeof RATES[code], 'number')
      assert.ok(RATES[code] > 0)
    }
  })

  it('USD base rate is 1', () => {
    assert.equal(RATES.USD, 1)
  })
})
