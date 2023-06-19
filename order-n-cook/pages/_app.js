import Head from "next/head";
import "bootstrap/dist/css/bootstrap.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "../styles/globals.css";
import { Provider } from "react-redux";
import { store, persistor } from "../redux/index";
import { PersistGate } from "redux-persist/integration/react";
import Navbar from "../components/general/user_navbar";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <HelmetProvider>
          <Navbar />
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
      </PersistGate>
    </Provider>
  );
}
export default MyApp;
