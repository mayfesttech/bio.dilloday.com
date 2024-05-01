import { LinkData } from '../types';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './editinglink.module.css';
import { Reorder } from 'framer-motion';

export default function EditingLink(props: LinkData) {
  const TextContainer = styled.a`
    display: block;
    border: 2px solid ${({ theme }) => theme.linkBackground};
    background: ${({ theme }) => theme.linkBackground};
    color: ${({ theme }) => theme.linkForeground};
    border-radius: 0 16px 16px 0;
    width: 100%;
    text-decoration: none;
    transition:
      background-color 150ms ease-in-out,
      color 150ms ease-in-out;

    &:hover {
      background: ${({ theme }) => theme.linkBackgroundHover};
      color: ${({ theme }) => theme.linkForegroundHover};
    }
  `;

  const Container = styled(motion.div)`
    display: flex;
    background: ${({ theme }) => theme.linkBackground};
    color: ${({ theme }) => theme.linkForeground};
    border-radius: 16px;
    width: 100%;
    text-decoration: none;
    transition:
      background-color 150ms ease-in-out,
      color 150ms ease-in-out;
  `;

  const Text = styled.p`
    font-weight: 500;
  `;

  const variants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    // <Container href={url} variants={variants}>
    //
    //   <Text>{title}</Text>
    // </Container>
    <Reorder.Item value={props} id={props.url}>
      <Container>
        <FontAwesomeIcon icon={faGripVertical} className={styles.grip} />
        <TextContainer href={props.url}>
          <Text>{props.title}</Text>
        </TextContainer>
      </Container>
    </Reorder.Item>
  );
}
