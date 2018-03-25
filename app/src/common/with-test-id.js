function withTestId(id) {
  return BaseComponent => {
    return props => <BaseComponent {...props} data-test-id={id} />;
  };
}

export default withTestId;
