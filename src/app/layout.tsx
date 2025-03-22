import React from 'react';
import { OverlayProvider } from '@/context/OverlayContext';
import { CartProvider } from "@/context/CartContext";
import './styles.css';
import '@/styles/globals.scss';
import Footer from '@/layouts/Footer';
import Header from '@/layouts/Header';

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'iPhosha',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <Header />
        <OverlayProvider>
          <CartProvider>
            <main>{children}</main>
          </CartProvider>
        </OverlayProvider>
        <Footer />
      </body>
    </html>
  )
}
