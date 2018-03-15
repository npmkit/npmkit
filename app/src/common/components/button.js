import styled from 'styled-components';

const Button = styled.button`
  background: ${props =>
    props.ghost ? 'transparent' : props.theme.colors.primary};
  color: white;
  padding: 0.25rem;
  line-height: 1;
  font-size: inherit;
  font-weight: bold;
  border: 0;
  border-radius: 2px;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary};
  }
`;

export default Button;
