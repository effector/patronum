import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import Logo from '../../../logo.svg';

export default function HomePage() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="Welcome" description={siteConfig.tagline}>
      <header className="hero hero--primary">
        <div className="container">
          <Logo className="hero-logo" />
          <div className="space-x-3">
            <Link
              className="button button--primary button--lg"
              to="/docs/installation"
            >
              Getting started
            </Link>
            <Link className="button button--secondary button--lg" to="/methods">
              Review method list
            </Link>
          </div>
        </div>
      </header>
    </Layout>
  );
}
