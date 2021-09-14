import React, {ReactNode, useEffect} from 'react';
import Head from 'next/head';
import classNames from "classnames";

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({children, title = 'This is the default title'}: Props) => {

/*  const darkMode = useSelector(selectDarkMode);
  const auth = useSelector(selectUserInfo)
  const dispatch = useDispatch();*/


  return (
    <div className={classNames(true && ' dark',)}>
      <Head>
        <title>{title} | {"StuV Vorlesungsplan"}</title>
        <meta charSet="utf-8"/>
        <meta name="viewport" content="initial-scale=1.0, width=device-width"/>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <header>
      </header>
      <main className="bg-gradient-to-b from-gray-900 to-red-900">

        <div className="">
          {children}
        </div>

      </main>
    </div>
  )
};

export default Layout
