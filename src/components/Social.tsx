import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

const Container = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 6px;
  min-width: 40px;
  min-height: 40px;
  max-width: 40px;
  max-height: 40px;
  font-size: 36px;
  color: ${({ theme }) => theme.primary};
  transition: background 150ms ease-in-out;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

interface SocialProps {
  icon: IconDefinition;
  link: string;
}

export default function Social({ icon, link }: SocialProps) {
  return (
    <Container href={link} target="_blank" rel="noreferrer">
      <FontAwesomeIcon icon={icon} />
    </Container>
  );
}
