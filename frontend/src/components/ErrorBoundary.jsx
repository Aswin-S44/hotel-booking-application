import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global Error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        // <div style={{
        //   height: "100vh",
        //   display: "flex",
        //   flexDirection: "column",
        //   justifyContent: "center",
        //   alignItems: "center",
        //   background: "#f8f9fa"
        // }}>
        //   <h2>Something went wrong 😥</h2>
        //   <h5 style={{ color: "red" }}>{this.state.error?.message}</h5>
        //   <button style={{borderRadius:"10px", padding:"10px"}} onClick={this.handleReload}>
        //     Reload Page
        //   </button>
        // </div>
        <></>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
