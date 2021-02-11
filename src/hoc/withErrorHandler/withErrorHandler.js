import React from 'react';
import Modal from '../../components/UI/Modal/Modal';
import useHttpErrorHandler from '../../hooks/http-error-handler';

const withErrorHandler = (WrappedComponent, axios) => {

  return props => {
    const [errorState, errorConfirmedHandler] = useHttpErrorHandler(axios);
    return (
      <React.Fragment>
        <Modal
          show={errorState}
          modalClosed={errorConfirmedHandler}>
          {errorState && errorState.message}
        </Modal>
        <WrappedComponent {...props} />
      </React.Fragment>
    );
  }
};

export default withErrorHandler;