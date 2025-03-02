import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { H1, H3, Body } from './Text';
import { Button } from './Button';
import * as errorService from '../services/error';
import { useTheme } from '../context/ThemeContext';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

/**
 * A wrapper component that uses the ErrorBoundaryClass with theme context
 */
const ErrorBoundary: React.FC<Props> = (props) => {
  const { colors } = useTheme();
  
  const styles = StyleSheet.create({
    errorContainer: {
      flex: 1,
      backgroundColor: colors.background.main,
      padding: 20, // Using a direct value instead of theme.spacing.lg
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      color: colors.status.error,
      textAlign: 'center',
    },
    content: {
      flex: 1,
    },
    message: {
      marginBottom: 32,
      textAlign: 'center',
      fontSize: 16,
      lineHeight: 24,
    },
    button: {
      marginVertical: 20,
    },
    detailsToggle: {
      padding: 12,
      borderRadius: 8,
      backgroundColor: colors.background.card,
      marginVertical: 12,
      alignItems: 'center',
    },
    detailsToggleText: {
      color: colors.primary,
    },
    details: {
      padding: 12,
      backgroundColor: colors.background.card,
      borderRadius: 8,
      marginTop: 8,
    },
    detailsTitle: {
      color: colors.text.primary,
      marginBottom: 4,
    },
    detailsText: {
      color: colors.text.secondary,
      fontFamily: 'monospace',
      fontSize: 12,
      marginBottom: 12,
    },
  });
  
  return <ErrorBoundaryClass {...props} styles={styles} />;
};

/**
 * ErrorBoundary catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundaryClass extends Component<Props & { styles: ReturnType<typeof StyleSheet.create> }, State> {
  constructor(props: Props & { styles: ReturnType<typeof StyleSheet.create> }) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to the error service
    errorService.handleError(error, {
      type: errorService.ErrorType.UI,
      context: { componentStack: errorInfo.componentStack },
    });

    // Update state with error details
    this.setState({ errorInfo });

    // Call the optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props & { styles: ReturnType<typeof StyleSheet.create> }): void {
    // Reset the error state if props change and resetOnPropsChange is true
    if (
      this.props.resetOnPropsChange &&
      this.state.hasError &&
      prevProps.children !== this.props.children
    ) {
      this.resetError();
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
  };

  toggleDetails = (): void => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails,
    }));
  };

  renderError = (): ReactNode => {
    const { error, errorInfo, showDetails } = this.state;
    const { styles } = this.props;

    return (
      <View style={styles.errorContainer}>
        <View style={styles.header}>
          <H1 style={styles.title}>Oops, Something Went Wrong</H1>
        </View>

        <ScrollView style={styles.content}>
          <Body style={styles.message}>
            {error ? errorService.getFriendlyErrorMessage({
              type: errorService.ErrorType.UI,
              message: error.message,
              timestamp: Date.now(),
            }) : 'An unexpected error occurred.'}
          </Body>

          <Button
            onPress={this.resetError}
            variant="primary"
            style={styles.button}
            title="Try Again"
          >
            Try Again
          </Button>

          {__DEV__ && (
            <>
              <TouchableOpacity onPress={this.toggleDetails} style={styles.detailsToggle}>
                <Body style={styles.detailsToggleText}>
                  {showDetails ? 'Hide Technical Details' : 'Show Technical Details'}
                </Body>
              </TouchableOpacity>

              {showDetails && (
                <View style={styles.details}>
                  <H3 style={styles.detailsTitle}>Error:</H3>
                  <Body style={styles.detailsText}>{error?.toString()}</Body>

                  {errorInfo && (
                    <>
                      <H3 style={styles.detailsTitle}>Component Stack:</H3>
                      <Body style={styles.detailsText}>{errorInfo.componentStack}</Body>
                    </>
                  )}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    );
  };

  render(): ReactNode {
    const { hasError } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }
      return this.renderError();
    }

    return children;
  }
}

export default ErrorBoundary; 