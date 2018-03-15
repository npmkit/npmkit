import styled from 'styled-components';

const Button = styled.button`
  background: ${props =>
    props.ghost ? 'transparent' : props.theme.colors.primary};
  color: white;
  padding: 0.25rem;
  font: inherit;
  line-height: 1;
  font-weight: bold;
  border: 0;
  border-radius: 2px;

  &:focus {
    outline: none;
    background: #eee;
  }
`;

export default Button;
