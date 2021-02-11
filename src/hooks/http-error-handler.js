import { useState, useEffect } from 'react';

const useHttpErrorHandler = httpClient => {

  const [errorState, setErrorState] = useState(null);

  const reqInterceptor = httpClient.interceptors.request.use(
    request => {
      setErrorState(null);
      return request
    },
    error => Promise.reject(error)
  );

  const resInterceptor = httpClient.interceptors.response.use(
    response => response,
    error => {
      const message = `Sorry, ${error.message || 'something go wrong'}, please try again later :(`;
      setErrorState({
        ...error,
        message: message
      });
      return Promise.reject(error);
    });

  const errorConfirmedHandler = () => {
    setErrorState(null);
  }

  useEffect(() => {
    return () => {
      httpClient.interceptors.request.eject(reqInterceptor);
      httpClient.interceptors.response.eject(resInterceptor);
    }
  }, [reqInterceptor, resInterceptor, httpClient.interceptors.request, httpClient.interceptors.response]);

  return [errorState, errorConfirmedHandler];
};

export default useHttpErrorHandler;