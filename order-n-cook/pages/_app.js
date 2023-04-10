import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.css'
import { Helmet, HelmetProvider } from 'react-helmet-async';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {

  return (
    <HelmetProvider>
    <div class="col-12 d-flex flex-row justify-content-center">
    <Helmet>
                <style>{'body { background-color: #F8F7FF; }'}</style>
            </Helmet>
    <div class="d-flex flex-row justify-content-center col-lg-10 col-12" >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component  {...pageProps} />
    </div>
    </div>
    </HelmetProvider>
  );
}
export default MyApp;