import App from 'next/app';
import { Provider as StyletronProvider } from 'styletron-react';
import { styletron, debug } from '../styletron';
import { LightTheme, BaseProvider, styled } from 'baseui';
import Layout from '../components/Layout';

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
        <BaseProvider theme={LightTheme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </BaseProvider>
      </StyletronProvider>
    );
  }
}
