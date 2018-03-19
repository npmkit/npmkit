import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulseBackgroundAnimation = keyframes`
  0% { opacity: 0.2; }
  50% { opacity: 1; }
  100% { opacity: 0.2; }
`;

const Container = styled.div`
  animation: ${pulseBackgroundAnimation} 2s linear infinite;
  padding: 0.5rem 0.75rem;
  align-items: center;
  height: 3.15rem;
  display: flex;
  width: 100%;
`;

const Avatar = styled.div`
  background: #999;
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const Details = styled.div`
  padding-left: 0.5rem;
  flex-direction: column;
  display: flex;
  flex: 1;
`;

const Name = styled.div`
  background-color: #666;
  margin: 0.1rem 0;
  height: 0.9rem;
  width: 120px;
`;

const Path = styled.div`
  background-color: #999;
  margin: 0.1rem 0;
  height: 0.65rem;
  width: 190px;
`;

const ItemPlaceholder = () => (
  <Container>
    <Avatar />
    <Details>
      <Name />
      <Path />
    </Details>
  </Container>
);

const ContentPlaceholder = () => (
  <React.Fragment>
    <ItemPlaceholder />
    <ItemPlaceholder />
    <ItemPlaceholder />
  </React.Fragment>
);

export default ContentPlaceholder;
