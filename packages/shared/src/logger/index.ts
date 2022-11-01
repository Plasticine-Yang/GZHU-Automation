import { createEmailer } from '../email'

const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = process.env

const emailer =
  (EMAIL_HOST &&
    EMAIL_USER &&
    EMAIL_PASS &&
    createEmailer({ host: EMAIL_HOST, user: EMAIL_USER, pass: EMAIL_PASS })) ||
  null

type LoggerFn = Console['log'] | Console['error']
const baseLog = async (
  subject: string,
  title: string,
  content: string,
  logger: LoggerFn,
) => {
  logger(`${title}: ${content}`)
  emailer && (await emailer.sendEmail(EMAIL_USER!, subject, title, content))
}

const createLogger = (subject: string) => {
  return {
    async log(title: string, content: any) {
      await baseLog(subject, `[INFO] - ${title}`, String(content), console.log)
    },
    async error(title: string, content: any) {
      await baseLog(
        subject,
        `[ERROR] - ${title}`,
        String(content),
        console.error,
      )
    },
  }
}

export { createLogger }
