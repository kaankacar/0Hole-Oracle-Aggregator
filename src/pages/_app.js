import 'tailwindcss/tailwind.css';
import { createGlobalStyle } from 'styled-components';
import '../styles/globals.css';
import Head from 'next/head';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Roboto', sans-serif;
  }
`;



function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>0hole Oracle Aggregator</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
