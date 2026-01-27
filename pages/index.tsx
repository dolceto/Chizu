// pages/index.tsx
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({theme}) => theme.spacing.md};
  background-color: ${({theme}) => theme.colors.background};
`;

const Title = styled.h1`
  color: ${({theme}) => theme.colors.text};
  font-family: ${({theme}) => theme.fonts.body};
  margin-bottom: ${({theme}) => theme.spacing.md};
`;

export default function Home() {
  return (
    <Container>
      <Title>Next.js Boilerplate</Title>
    </Container>
  );
}
