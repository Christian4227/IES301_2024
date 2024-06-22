import "@/styles/globals.css";
import React from "react";
import PropTypes from "prop-types";
import { AuthProvider } from "@/context/Auth";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
