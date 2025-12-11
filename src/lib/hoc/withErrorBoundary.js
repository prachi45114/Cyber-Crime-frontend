import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state to show fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        this.setState({ errorInfo });
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

const withErrorBoundary = (WrappedComponent, fallback = null) => {
    return function WithErrorBoundary(props) {
        return (
            <ErrorBoundary fallback={fallback}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
};

export default withErrorBoundary;
