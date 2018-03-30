import styled from 'styled-components';

const Input = styled.input`
  border: 0;
  padding: 0.25rem 0.5rem;
  font: inherit;
  border-radius: 2px;

  &:focus {
    background-color: #eee;
    outline: none;
  }
`;

export default Input;
