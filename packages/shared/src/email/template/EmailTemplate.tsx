// @ts-ignore
import React from 'react'

interface Props {
  title: string
  content: string
}

const EmailTemplate = (props: Props) => {
  const { title, content } = props

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px',
        background: '#21222c',
        color: 'white',
      }}
    >
      <header>
        <h1>{title}</h1>
      </header>
      <main>
        <div
          style={{
            padding: '40px',
            background: '#282a36',
            borderRadius: '20px',
          }}
        >
          <p>{content}</p>
        </div>
      </main>
    </section>
  )
}

export default EmailTemplate
