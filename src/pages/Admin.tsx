import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../theme';
import { useEffect, useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../app';
import styles from './admin.module.css';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { doc, getDoc } from 'firebase/firestore';

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

export default function Admin() {
  const [authorized, setAuthorized] = useState(false);
  const [curEmail, setCurEmail] = useState('');
  const [loading, setLoading] = useState(true);
  var validEmails = [] as string[];

  const handleClick = () => {
    signInWithPopup(auth, provider).then((result) => {
      const docRef = doc(db, 'bio', 'admin');
      setLoading(true);
      getDoc(docRef).then((doc) => {
        if (doc.exists()) {
          validEmails = doc.data().users;

          setAuthorized(
            validEmails.includes(result.user.email ? result.user.email : '')
          );
          setCurEmail(result.user.email ? result.user.email : '');
          localStorage.setItem(
            'email',
            result.user.email ? result.user.email : ''
          );
          setLoading(false);
        }
      });
    });
  };

  useEffect(() => {
    const docRef = doc(db, 'bio', 'admin');
    setLoading(true);
    getDoc(docRef).then((doc) => {
      if (doc.exists()) {
        validEmails = doc.data().users;

        setAuthorized(
          validEmails.includes(
            localStorage.getItem('email')
              ? (localStorage.getItem('email') as string)
              : ''
          )
        );
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
                <h2 className={styles.header}>
                  {curEmail == ''
                    ? `To access the admin page, please sign in.`
                    : `This email is not an admin. Please try again.`}
                </h2>
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
            Signed in
          </Main>
        </div>
      )}
    </ThemeProvider>
  );
}
