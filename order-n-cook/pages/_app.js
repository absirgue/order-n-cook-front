import Head from "next/head";
import "bootstrap/dist/css/bootstrap.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "../styles/globals.css";
import { Provider } from "react-redux";
import store from "../redux/reducer";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <div className="col-12 d-flex flex-row justify-content-center">
          <Helmet>
            <style>{"body { background-color: #F8F7FF; }"}</style>
          </Helmet>
          <div className="d-flex flex-row justify-content-center col-12">
            <Head>
              <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
              />
            </Head>
            <Component {...pageProps} />
          </div>
        </div>
      </HelmetProvider>
    </Provider>
  );
}
export default MyApp;
