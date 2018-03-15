import T from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const noop = () => {};

const TrayContainer = styled.div`
  height: inherit;
`;

/**
 * Use native DnD events on document since Electron injects custom `path` prop
 * with full absolute path which is required
 * @see https://electronjs.org/docs/api/file-object
 */
class Tray extends React.Component {
  static propTypes = {
    onDragEnter: T.func,
    onDragLeave: T.func,
    onDragOver: T.func,
    onDrop: T.func,
    onKeyPress: T.func,
    onKeyDown: T.func,
  };

  static defaultProps = {
    onDragEnter: noop,
    onDragLeave: noop,
    onDragOver: noop,
    onDrop: noop,
    onKeyPress: noop,
    onKeyDown: noop,
  };

  componentWillMount() {
    document.addEventListener('dragenter', this.handleDragEnter);
    document.addEventListener('dragleave', this.handleDragLeave);
    document.addEventListener('dragover', this.handleDragOver);
    document.addEventListener('drop', this.handleDrop);
    document.addEventListener('keypress', this.handleKeyPress);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('dragenter', this.handleDragEnter);
    document.removeEventListener('dragleave', this.handleDragLeave);
    document.removeEventListener('dragover', this.handleDragOver);
    document.removeEventListener('drop', this.handleDrop);
    document.removeEventListener('keypress', this.handleKeyPress);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleDragEnter = event => {
    this.props.onDragEnter(event);
  };

  handleDragLeave = event => {
    this.props.onDragLeave(event);
  };

  handleDragOver = event => {
    event.preventDefault();
    this.props.onDragOver(event);
  };

  handleDrop = event => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onDrop(event);
  };

  handleKeyPress = event => {
    this.props.onKeyPress(event);
  };

  handleKeyDown = event => {
    this.props.onKeyDown(event);
  };

  render() {
    // Drop proxied DnD events
    const filteredProps = Object.keys(this.props).reduce(
      (nextProps, propName) => {
        return Tray.defaultProps.hasOwnProperty(propName)
          ? nextProps
          : { ...nextProps, [propName]: this.props[propName] };
      },
      {}
    );
    return <TrayContainer {...filteredProps} />;
  }
}

export default Tray;
