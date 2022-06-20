//import 'tailwindcss/tailwind.css'
import '../styles.css'
import 'animate.css';
import type { AppProps } from 'next/app'
import {createInstance, MatomoProvider} from "@jonkoops/matomo-tracker-react";
import MatomoTracker from "@jonkoops/matomo-tracker";

const App = ({ Component, pageProps }: AppProps) => {

  const instance : MatomoTracker = createInstance({
    urlBase: process.env.NEXT_PUBLIC_MATOMO_URL as string,
    siteId: parseInt(process.env.NEXT_PUBLIC_MATOMO_SID as string),
    configurations: {
      disableCookies: true,
      setRequestMethod: 'POST'
    }
  })

  return (
      <MatomoProvider value={instance}>
        <Component {...pageProps} />
      </MatomoProvider>
  )
}
export default App
