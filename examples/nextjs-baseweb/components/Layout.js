import React from 'react';
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationList,
  StyledNavigationItem,
} from 'baseui/header-navigation';
import { StyledLink } from 'baseui/link';
import { Button } from 'baseui/button';
import Link from 'next/link';

function NavBar() {
  return (
    <HeaderNavigation>
      <StyledNavigationList $align={ALIGN.left}>
        <StyledNavigationItem>
          <Link href="/">
            <a>RocketRides</a>
          </Link>
        </StyledNavigationItem>
      </StyledNavigationList>
      <StyledNavigationList $align={ALIGN.center} />
      <StyledNavigationList
        $align={ALIGN.right}
        style={{ marginRight: '1.5rem' }}
      >
        <StyledNavigationItem>
          <StyledLink href="https://formium.io/docs">Docs</StyledLink>
        </StyledNavigationItem>
        <StyledNavigationItem>
          <StyledLink href="https://github.com/formium/formium">
            Source
          </StyledLink>
        </StyledNavigationItem>
      </StyledNavigationList>
    </HeaderNavigation>
  );
}

function Layout({ children }) {
  return (
    <>
      <NavBar />
      {children}
      <style global jsx>
        {`
          body {
            margin: 0;
            padding: 0;
          }
        `}
      </style>
    </>
  );
}

export default Layout;
