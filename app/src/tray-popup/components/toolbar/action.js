import styled from 'styled-components';
import Button from '~/common/components/button';

const ToolbarAction = styled(Button).attrs({ ghost: true })`
  transition: color 200ms ease;
  font-size: 1.25rem;
  color: #999;

  &:hover {
    color: #333;
  }
`;

export default ToolbarAction;
