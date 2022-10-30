import { promiseWithTimeout } from '..'

describe('execWithTimeout', () => {
  test('should reject when timeout', () => {
    vi.useFakeTimers()
    let status = 'pending'

    const p = new Promise(resolve => {
      setTimeout(() => {
        resolve(null)
      }, 3000)
    })

    promiseWithTimeout(p, 1000)
      .then(() => {
        status = 'fulfilled'
      })
      .catch(() => {
        status = 'rejected'
      })
      .finally(() => {
        expect(status).toBe('rejected')
      })

    vi.runAllTimers()
  })

  test('should fulfilled within timeout', () => {
    vi.useFakeTimers()
    let foo: number
    let status = 'pending'

    const p = new Promise<number>(resolve => {
      setTimeout(() => {
        resolve(666)
      }, 1000)
    })

    promiseWithTimeout(p, 3000)
      .then(value => {
        foo = value
        status = 'fulfilled'
      })
      .catch(() => {
        status = 'rejected'
      })
      .finally(() => {
        expect(foo).toBe(666)
        expect(status).toBe('fulfilled')
      })

    vi.runAllTimers()
  })
})
