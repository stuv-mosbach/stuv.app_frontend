import React, {ReactNode, useEffect} from 'react';
import Head from 'next/head';
import classNames from "classnames";
import {useMatomo} from "@jonkoops/matomo-tracker-react";
import Snowfall from "react-snowfall";

type Props = {
  children?: ReactNode
  title?: string,
  disablePullToRefresh?: boolean
}

const Layout = ({children, title, disablePullToRefresh}: Props) => {

  /*  const darkMode = useSelector(selectDarkMode);
    const auth = useSelector(selectUserInfo)
    const dispatch = useDispatch();*/

  const { trackPageView, trackEvent } = useMatomo()

  useEffect(() => {
    trackPageView({});
  }, [])

  let style = {};
  if (disablePullToRefresh) style = {overscrollBehaviorY: "contain"};

  return (
      <div className={classNames('dark')}>
        <Head>
          <title>{`${title ? title + " |" : ""} DHBW Mosbach Vorlesungsplan`}</title>
          <meta charSet="utf-8"/>
          <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
          <meta name="description" content="Vorlesungsplan der DHBW-Mosbach und Bad Mergentheim."/>
          <meta name="theme-color" content="#9e1010"/>

          <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png"/>
          <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png"/>
          <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png"/>
          <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png"/>
          <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png"/>
          <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png"/>
          <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png"/>
          <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png"/>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png"/>
          <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
          <link rel="manifest" href="/manifest.json"/>
          <meta name="msapplication-TileColor" content="#ffffff"/>
          <meta name="msapplication-TileImage" content="/ms-icon-144x144.png"/>
          <meta name="theme-color" content="#ffffff"/>
        </Head>
        <header>
        </header>
        <main className="bg-gradient-to-b from-zinc-900 to-slate-900 {/*from-zinc-900 to-[#02395e]*/}" style={style}>

          {/*<Snowfall />*/}

          <div className="">
            {children}
          </div>

        </main>
      </div>
  )
};

export default Layout
