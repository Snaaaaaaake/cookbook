import { useEffect } from 'react';
import { Provider as StoreProvider } from 'react-redux';
import Head from 'next/head';
import store from '../src/store';
import FirebaseService from '../src/service/FirebaseService';
import FirebaseContext from '../src/components/context/FirebaseContext';
import { userAndListenerChangeThunkAction } from '../src/actions/actions';
import firebaseConfig from '../src/constants/firebaseConfig';
import '../styles/globals.css';

const firebaseService = new FirebaseService(firebaseConfig);

function MyApp({ Component, pageProps }) {
  // При первом запуске запускаем слушатель от бэкенда на смену пользователя,
  // а внутри на изменение избранного пользователя
  useEffect(() => {
    firebaseService.auth.onAuthStateChanged(authUser => {
        store.dispatch(userAndListenerChangeThunkAction(authUser, firebaseService));
    });
  }, []);

  return (<>
    <Head>
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossOrigin="anonymous" />
    </Head>

    <FirebaseContext.Provider value={firebaseService}>
      <StoreProvider store={store}>
        <Component {...pageProps} />
      </StoreProvider>
    </FirebaseContext.Provider>
  </>)
}

export default MyApp
