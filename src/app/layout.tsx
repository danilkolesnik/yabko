import React from 'react';
import './styles.css';
import '@/styles/globals.scss';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Ябко',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
