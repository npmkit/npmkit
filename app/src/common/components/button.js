import styled from 'styled-components';

const Button = styled.button`
  background: ${props => (props.ghost ? 'transparent' : '#cb3837')};
  color: white;
  font-size: inherit;
  font-weight: bold;
  border: 0;
  border-radius: 2px;
`;

export default Button;
