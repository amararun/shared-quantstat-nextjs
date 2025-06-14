import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { LogProvider } from '@/providers/log-provider'
import TopNavigation from '@/components/TopNavigation'
import Footer from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'QuantStats & Technicals',
  description: 'Your AI-powered research analyst',
  viewport: 'width=device-width, initial-scale=1.0',
  icons: {
    icon: '/FXLOGO.png',
    apple: '/FXLOGO.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/FXLOGO.png" />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <LogProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Navigation */}
            <TopNavigation />

            {/* Main content */}
            <main className="flex-grow">
              {children}
            </main>

            {/* Footer */}
            <Footer />

            {/* Statcounter Code */}
            <Script id="statcounter-setup" strategy="afterInteractive">
              {`
                var sc_project = 13047808;
                var sc_invisible = 1;
                var sc_security = "b480b311";
              `}
            </Script>
            <Script 
              src="https://www.statcounter.com/counter/counter.js" 
              strategy="afterInteractive"
              async
            />
            <noscript>
              <div className="statcounter">
                <a title="web stats" href="https://statcounter.com/" target="_blank" rel="noopener noreferrer">
                  <img 
                    className="statcounter" 
                    src="https://c.statcounter.com/13047808/0/b480b311/1/" 
                    alt="web stats" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </a>
              </div>
            </noscript>
            {/* End of Statcounter Code */}
          </div>
        </LogProvider>
      </body>
    </html>
  )
}
