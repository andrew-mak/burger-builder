import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {

  return class extends Component {

    constructor(props) {
      super(props);
      this.state = {
        hasError: false,
      }
      this.reqInterceptor = axios.interceptors.request.use(req => req,
        error => Promise.reject(error));

      this.resInterceptor = axios.interceptors.response.use(res => res,
        error => {
          this.setState({ hasError: error });
          return Promise.reject(error);
        });
    }
//it might be worth using componentDidMount to intercept errors but Modal with message wouldn't be shown

    errorConfirmedHandler = () => {
      this.setState({ hasError: false });
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }

    render() {
      let message = 'Something go wrong...';
      if (this.state.hasError.message) message = `Sorry, ${this.state.hasError.message}, please try again later :(`;

      return (
        <Aux>
          <Modal
            show={this.state.hasError}
            modalClosed={this.errorConfirmedHandler}>
            {message}
          </Modal>
          <WrappedComponent {...this.props} />
        </Aux>
      );
    }
  }
};

export default withErrorHandler;