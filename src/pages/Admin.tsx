import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import { useEffect, useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider, db } from '../app';
import styles from './admin.module.css';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { doc, getDoc } from 'firebase/firestore';
import { LinkData } from '../types';
import Link from '../components/Link';
import Links from '../components/Links';

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

const StatusText = styled.p`
  opacity: 0.75;
  height: 256px;
`;

export default function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(
    'To access the admin page, please sign in.'
  );

  const [links, setLinks] = useState<LinkData[] | null>(null);

  useEffect(() => {
    if (authorized) {
      getDoc(doc(db, 'bio', 'content'))
        .then((doc) => {
          if (doc.exists()) {
            setLinks(doc.data().links);
          }
        })
        .catch((error) => {
          setStatus(`Error getting links: ${error}`);
        });

      // no need to show loading status if load times are fast
      const timeout = setTimeout(() => {
        setStatus('Dilloading links...');
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [authorized]);

  var validEmails = [] as string[];

  const handleClick = () => {
    signInWithPopup(auth, provider).then((result) => {
      const docRef = doc(db, 'bio', 'admin');
      setLoading(true);
      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            validEmails = doc.data().users;

            if (
              validEmails.includes(result.user.email ? result.user.email : '')
            ) {
              setAuthorized(true);
              setStatus('Dilloading links...');
            } else {
              setAuthorized(false);
              setStatus('This email is not an admin. Please try agin.');
            }
            localStorage.setItem(
              'email',
              result.user.email ? result.user.email : ''
            );
            setLoading(false);
          }
        })
        .catch((error) => {
          setStatus('Error logging in. Please try again');
        });
    });
  };

  useEffect(() => {
    const docRef = doc(db, 'bio', 'admin');
    setLoading(true);
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        validEmails = doc.data().users;

        if (
          validEmails.includes(
            localStorage.getItem('email')
              ? (localStorage.getItem('email') as string)
              : ''
          )
        ) {
          setAuthorized(true);
          setStatus('Dilloading links...');
        } else {
          setAuthorized(false);
          setStatus('To access the admin page, please sign in.');
        }

        setLoading(false);
      }
    });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      {authorized == false ? (
        <div>
          <Background src="/background.jpg" />
          <Main>
            <Logo src="/logo.png" />
            {loading ? null : (
              <div className={styles.contentContainer}>
                <h2 className={styles.header}>{status}</h2>
                <div onClick={handleClick} className={styles.buttonContainer}>
                  <p className={styles.signInText}>Sign in with </p>
                  <FontAwesomeIcon
                    className={styles.googleButton}
                    icon={faGoogle}
                  />
                </div>
              </div>
            )}
          </Main>
        </div>
      ) : (
        <div>
          <Background src="/background.jpg" />
          <Main>
            <Logo src="/logo.png" />
            {links ? (
              <Links>
                {links.map((link) => (
                  <Link key={link.title} {...link} />
                ))}
              </Links>
            ) : (
              <StatusText>{status}</StatusText>
            )}
            <SignOut
              setAuthorized={setAuthorized}
              setLoading={setLoading}
              setStatus={setStatus}
            />
          </Main>
        </div>
      )}
    </ThemeProvider>
  );
}

type SignOutProps = {
  setAuthorized: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
};

function SignOut(props: SignOutProps) {
  const handleClick = () => {
    props.setLoading(true);
    signOut(auth)
      .then(() => {
        localStorage.clear();
        props.setAuthorized(false);
        props.setStatus('To access the admin page, please sign in.');
        props.setLoading(false);
      })
      .catch((error) => {
        props.setStatus('Error signing out! Please try again.');
        props.setLoading(false);
      });
  };

  return (
    <div onClick={handleClick} className={styles.buttonContainer}>
      <p className={styles.signInText}>Sign Out</p>
      <FontAwesomeIcon
        className={styles.googleButton}
        icon={faRightFromBracket}
      />
    </div>
  );
}
