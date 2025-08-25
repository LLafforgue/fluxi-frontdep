import "../styles/globals.css";
import Head from "next/head";
import { useState} from "react";
import { useRouter } from "next/router";
import { Provider } from "react-redux";
import user from "../reducers/user";
import Sidebar from "../components/Sidebar";
import useMobile from "../hook/useMobile";
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import ids from "@/reducers/ids";


const reducers = combineReducers({ user, ids });
const persistConfig = { key: 'Fluxi', storage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
const persistor = persistStore(store);

function App({ Component, pageProps }) {
  const router = useRouter();
  const isMobile = useMobile();
  const noSidebarRoutes = ["/login"];
  const showSidebar = !noSidebarRoutes.includes(router.pathname);

  const [sidebarOpen, setSidebarOpen] = useState(false);


  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <title>Fluxi</title>
          <link rel="icon" href="../image/favicon.svg" sizes="any" />
        </Head>
        <div className="flex h-screen overflow-hidden font-DMSans">
          {/* Sidebar */}
          {showSidebar && (
            <>
              {isMobile ? (
                sidebarOpen && (
                  <div className="fixed inset-0 z-40 flex">
                    <div
                      className="fixed inset-0 bg-black/50"
                      onClick={() => setSidebarOpen(false)}
                      aria-label="Fermer le menu latéral"
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (e.key === "Escape" || e.key === "Enter")
                          setSidebarOpen(false);
                      }}
                    />
                    <div className="relative z-50 w-64 bg-[#d1d2d3] text-white">
                      <Sidebar closeSidebar={() => setSidebarOpen(false)} />
                    </div>
                  </div>
                )
              ) : (
                <div className="hidden md:block text-white">
                  <Sidebar />
                </div>
              )}
            </>
          )}
          <div className="flex-1 overflow-auto relative">
            {isMobile && showSidebar && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-4 bg-none border-none text-2xl cursor-pointer"
                aria-label="Ouvrir le menu latéral"
              >
                ☰
              </button>
            )}
            <main className="relative z-0">
                <Component {...pageProps} />
            </main>
          </div>
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
