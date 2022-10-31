// @ts-ignore
import React from 'react'

import { Card, Container } from './style'

interface Props {
  title: string
  content: string
}

const EmailTemplate = (props: Props) => {
  const { title, content } = props

  return (
    <Container>
      <header>
        <h1>{title}</h1>
      </header>
      <main>
        <Card>
          <p>{content}</p>
        </Card>
      </main>
    </Container>
  )
}

export default EmailTemplate
