import styled, { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { FormEvent, useEffect, useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, provider, db } from './app';
import styles from './adminview.module.css';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import {
  faRightFromBracket,
  faGripVertical,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { LinkData } from './types';
import { Reorder, motion } from 'framer-motion';

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
  max-width: 600px;
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

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 2px solid ${({ theme }) => theme.linkBackground};
  background: ${({ theme }) => theme.linkBackground};
  color: ${({ theme }) => theme.linkForeground};
  border-radius: 0 16px 16px 0;
  width: 100%;
  text-decoration: none;
  transition:
    background-color 150ms ease-in-out,
    color 150ms ease-in-out;
`;

const Container = styled(motion.div)`
  display: flex;
  background: ${({ theme }) => theme.linkBackground};
  color: ${({ theme }) => theme.linkForeground};
  border-radius: 16px;
  width: 100%;
  text-decoration: none;
  padding: 20px 20px 20px 0;
  transition:
    background-color 150ms ease-in-out,
    color 150ms ease-in-out;
`;

const Text = styled.p`
  font-weight: 500;
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.4,
      staggerChildren: 0.08,
    },
  },
};

const variants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

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

  function saveChanges(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const formJson = Object.fromEntries(formData.entries());

    var tmp: LinkData[] = [];

    for (var i: number = 0; i < (links ? links.length : 0); i++) {
      tmp.push({
        title: formJson['title' + i.toString()] as string,
        url: formJson['url' + i.toString()] as string,
      });
    }
    setLinks(tmp);

    const contentRef = doc(db, 'bio', 'content');
    updateDoc(contentRef, {
      links: tmp,
    });
  }

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
              <form onSubmit={saveChanges} className={styles.form}>
                <Reorder.Group
                  className={styles.li}
                  values={links}
                  onReorder={setLinks}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {links.map((link, i) => (
                    <Reorder.Item
                      value={link}
                      key={link.url}
                      variants={variants}
                    >
                      <Container>
                        <FontAwesomeIcon
                          icon={faGripVertical}
                          className={styles.grip}
                        />
                        <TextContainer>
                          <div className={styles.inputGroup}>
                            <label className={styles.label}>Title</label>
                            <input
                              autoComplete="off"
                              name={'title' + i.toString()}
                              id={'title' + i.toString()}
                              className={styles.input}
                              defaultValue={link.title}
                            />
                          </div>
                          <div className={styles.inputGroup}>
                            <label className={styles.label}>Url</label>
                            <input
                              autoComplete="off"
                              name={'url' + i.toString()}
                              id={'url' + i.toString()}
                              className={styles.input}
                              defaultValue={link.url}
                            />
                          </div>
                        </TextContainer>
                      </Container>
                    </Reorder.Item>
                  ))}
                  <button type="submit" className={styles.saveButton}>
                    Save Changes
                  </button>
                </Reorder.Group>
              </form>
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
