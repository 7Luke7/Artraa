"use server"
/**
 * Server-side error logging.
 *
 * Replaces the `console.log(error)` that used to sit in every catch block. The
 * problem was never that they logged - it is what a whole error object carries
 * once it reaches production stdout.
 *
 * A node-postgres error is the clearest case. Printing it whole prints its
 * `detail` too, and for a unique violation that reads
 *
 *   Key (email)=(someone@example.com) already exists.
 *
 * so every duplicate registration wrote a real address into the logs. `where`
 * and `internalQuery` leak query text and row values the same way.
 *
 * So: the message and the code, which are what identify the failure, and the
 * stack only outside production, which is where it is worth having.
 */

const PRODUCTION = process.env.NODE_ENV === "production"

/**
 * @param context where it happened, e.g. "auth/login" - enough to find the
 *                catch block without a stack
 * @param error   whatever was caught; need not be an Error
 */
export function logError(context, error) {
    if (!(error instanceof Error)) {
        // Something threw a non-Error. Its shape is unknown, so it is described
        // rather than printed.
        console.error(`[${context}] non-error thrown: ${typeof error}`)
        return
    }

    const code = error.code ? ` code=${error.code}` : ""
    console.error(`[${context}] ${error.name}: ${error.message}${code}`)

    if (!PRODUCTION && error.stack) {
        console.error(error.stack)
    }
}
