import './globals.css'
//import { AnalyticsWrapper } from './components/analytics';
//import { AnalyticsWrapper } from './components/GAnalytics';
// import { AnalyticsWrapper } from './components/GAnalyticsLib';
import Image from 'next/image'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}

      <head />

      <body>
        <div className="wrapper">{children}</div>
        <footer className="footer">
          <p>travel-ok.ai</p>
          <br />
          <p>
            Compiled by ☕ and{' '}
            <a target="_blank" rel="no-opener noreferrer" href="https://twitter.com/async_dime">
              @async_dime
            </a>
          </p>
        </footer>
      </body>
    </html>
  )
}
