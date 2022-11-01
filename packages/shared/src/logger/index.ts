import { createEmailer } from '../email'

const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = process.env

const emailer =
  (EMAIL_HOST &&
    EMAIL_USER &&
    EMAIL_PASS &&
    createEmailer({ host: EMAIL_HOST, user: EMAIL_USER, pass: EMAIL_PASS })) ||
  null

type Logger = Console['log'] | Console['error']
const baseLog = (subject: string, content: any, logger: Logger) => {
  logger(`${subject}: ${content}`)
  emailer && emailer.sendEmail(EMAIL_USER!, subject, content)
}

const log = (subject: string, content: any) =>
  baseLog(`[INFO] - ${subject}`, content, console.log)

const error = (subject: string, content: any) =>
  baseLog(`[ERROR] - ${subject}`, content, console.error)

const logger = {
  log,
  error,
}

export default logger
