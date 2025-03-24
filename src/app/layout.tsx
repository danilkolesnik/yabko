import React from 'react';
import { OverlayProvider } from '@/context/OverlayContext';
import { CartProvider } from "@/context/CartContext";
import './styles.css';
import '@/styles/globals.scss';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';
import CallButton from '@/layouts/CallButton/CallButton';

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'iPhosha',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
      <OverlayProvider>
        <CartProvider>
          <Header />
              <main>
                {children}
                <CallButton />
              </main>
          <Footer />
        </CartProvider>
        </OverlayProvider>
      </body>
    </html>
  )
}
