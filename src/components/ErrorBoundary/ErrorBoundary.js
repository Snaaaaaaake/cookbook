import { Component } from 'react';
import ErrorComponent from '../ErrorComponent/ErrorComponent';

export default class ErrorBoundary extends Component {
    constructor() {
      super();
      this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
      return { hasError: error };
    }
    render() {
      if (this.state.hasError) {
        return <ErrorComponent error={this.state.hasError} />
      }
      return this.props.children; 
    }
  }