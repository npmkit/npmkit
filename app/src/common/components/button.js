import styled from 'styled-components';

const Button = styled.button`
  background-color: ${props =>
    props.ghost ? 'transparent' : props.theme.colors.primary};
  color: white;
  padding: 0.25rem;
  font: inherit;
  line-height: 1;
  font-weight: bold;
  border: 0;
  border-radius: 2px;

  &:focus {
    background-color: #eee;
    outline: none;
  }
`;

export default Button;
