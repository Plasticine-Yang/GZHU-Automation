import { createTransport } from 'nodemailer'
import { generateTemplate } from '../template'

interface EmailerConfig {
  /** @description 邮箱域名 -- 如 smtp.qq.com */
  host: string

  /** @description 用户名 -- 邮箱 */
  user: string

  /** @description 授权码 */
  pass: string
}

export const createEmailer = (config: EmailerConfig) => {
  const { host, user, pass } = config

  // create reusable transporter object using the default SMTP transport
  const transporter = createTransport({
    host,
    secure: true, // true for 465, false for other ports
    auth: {
      user, // generated ethereal user
      pass, // generated ethereal password
    },
  })

  return {
    async sendEmail(to: string, subject: string, content: string) {
      const html = generateTemplate(subject, content)
      await transporter.sendMail({
        from: user,
        to,
        subject,
        html,
      })
    },
  }
}
