// @ts-ignore
import React from 'react'
import { renderToString } from 'react-dom/server'

import { ServerStyleSheet } from 'styled-components'

import EmailTemplate from './EmailTemplate'

/**
 * @description 生成邮件 html 模板字符串
 */
export const generateTemplate = (title: string, content: string) => {
  const sheet = new ServerStyleSheet()

  const html = renderToString(
    sheet.collectStyles(<EmailTemplate title={title} content={content} />),
  )

  const template = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${sheet.getStyleTags()}
      </head>
      <body>
        ${html}
      </body>
    </html>
  `

  return template.trim()
}
