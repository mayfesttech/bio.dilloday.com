import {
  faInstagram,
  faSpotify,
  faTiktok,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons';
import styled, { ThemeProvider } from 'styled-components';
import Link from './components/Link';
import Social from './components/Social';
import { theme } from './theme';
import { useEffect, useState } from 'react';
import { LinkData } from './types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './app';
import MailingList from './components/MailingList';
import Links from './components/Links';
import { AnimatePresence } from 'framer-motion';

const Background = styled.img`
  width: 100%;
  min-height: 240px;
  max-height: 320px;
  object-fit: cover;
  object-position: center;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  padding: 64px 32px;
  box-sizing: border-box;
  position: relative;
`;

const Logo = styled.img`
  width: 100%;
  max-width: 120px;
  margin-bottom: 16px;
  border-radius: 50%;
  position: absolute;
  top: -76px;
  border: 8px solid ${({ theme }) => theme.background};
`;

const Title = styled.h1`
  margin: 0;
`;

const Description = styled.p`
  margin: 0;
`;

const Socials = styled.div`
  display: flex;
  margin: 16px 0;
  gap: 4px;
`;

const Loading = styled.p`
  opacity: 0.75;
`;

const Footer = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.footerText};
  margin: 32px 0;
`;

function App() {
  const [status, setStatus] = useState('Dilloading links...');
  const [links, setLinks] = useState<LinkData[] | null>(null);
  useEffect(() => {
    getDoc(doc(db, 'bio', 'content'))
      .then((doc) => {
        if (doc.exists()) {
          setLinks(doc.data().links);
        }
      })
      .catch((error) => {
        setStatus(`Error getting links: ${error}`);
      });
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <AnimatePresence>
        <Background src="/background.jpg" />
        <Main>
          <Logo src="/logo.png" />
          <Title>Dillo Day</Title>
          <Description>
            The largest student-run music festival in the nation.
          </Description>
          <Socials>
            <Social
              icon={faInstagram}
              link="https://www.instagram.com/dillo_day/"
            />
            <Social icon={faTiktok} link="https://www.tiktok.com/@dilloday" />
            <Social
              icon={faSpotify}
              link="https://open.spotify.com/user/dillo_day"
            />
            <Social icon={faXTwitter} link="https://twitter.com/Dillo_Day" />
          </Socials>
          {links ? (
            <Links>
              {links.map((link) => <Link key={link.title} {...link} />) || (
                <Loading>{status}</Loading>
              )}
            </Links>
          ) : (
            <Loading>{status}</Loading>
          )}

          <MailingList />
          <Footer>
            Copyright © Mayfest Productions {new Date().getFullYear()}
          </Footer>
        </Main>
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default App;