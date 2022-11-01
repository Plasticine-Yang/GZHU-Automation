import { createEmailer } from '../email'

const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = process.env

const emailer =
  (EMAIL_HOST &&
    EMAIL_USER &&
    EMAIL_PASS &&
    createEmailer({ host: EMAIL_HOST, user: EMAIL_USER, pass: EMAIL_PASS })) ||
  null

type LoggerFn = Console['log'] | Console['error']
const baseLog = (
  subject: string,
  title: string,
  content: string,
  logger: LoggerFn,
) => {
  logger(`${title}: ${content}`)
  emailer && emailer.sendEmail(EMAIL_USER!, subject, title, content)
}

const createLogger = (subject: string) => {
  return {
    log(title: string, content: any) {
      baseLog(subject, `[INFO] - ${title}`, String(content), console.log)
    },
    error(title: string, content: any) {
      baseLog(subject, `[ERROR] - ${title}`, String(content), console.error)
    },
  }
}

export { createLogger }
