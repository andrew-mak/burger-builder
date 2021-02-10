import React, { useEffect, useState } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {

  return props => {

    const [errorState, setErrorState] = useState(false);

    const reqInterceptor = axios.interceptors.request.use(req => req,
      error => Promise.reject(error));

    const resInterceptor = axios.interceptors.response.use(res => res,
      error => {
        setErrorState(error);
        return Promise.reject(error);
      });

    const errorConfirmedHandler = () => {
      setErrorState(false);
    }

    useEffect(() => {
      return () => {
        axios.interceptors.request.eject(reqInterceptor);
        axios.interceptors.response.eject(resInterceptor);
      }
    }, [reqInterceptor, resInterceptor]);

    let message = 'Something go wrong...';
    if (errorState) message = `Sorry, ${errorState.message}, please try again later :(`;

    return (
      <Aux>
        <Modal
          show={errorState}
          modalClosed={errorConfirmedHandler}>
          {message}
        </Modal>
        <WrappedComponent {...props} />
      </Aux>
    );
  }
};

export default withErrorHandler;