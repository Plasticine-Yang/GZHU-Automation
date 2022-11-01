// @ts-ignore
import React from 'react'
import { renderToString } from 'react-dom/server'

import EmailTemplate from './EmailTemplate'

/**
 * @description 生成邮件 html 模板字符串
 */
export const generateTemplate = (title: string, content: string) => {
  return renderToString(<EmailTemplate title={title} content={content} />)
}
