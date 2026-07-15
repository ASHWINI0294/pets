/**
 * Event Loop demo helper
 * ----------------------
 * `setTimeout` schedules a *macrotask*. When you `await delay(ms)`, JavaScript:
 * 1. Pauses the async function and returns a Promise to the caller
 * 2. Continues other work on the call stack
 * 3. After `ms`, the timer callback runs (macrotask queue)
 * 4. That resolves the Promise → microtask runs → async function resumes
 *
 * So this tiny helper is a practical way to talk about Promises + the Event Loop.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
