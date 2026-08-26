import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    this.setState({ errorInfo });

    // Report to analytics in production
    if (import.meta.env.PROD) {
      // Could integrate with Sentry, LogRocket, etc.
      console.error("Production error:", {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      const isChunkError = error?.message?.includes("ChunkLoadError") ||
        error?.message?.includes("Loading chunk") ||
        error?.message?.includes("dynamically imported module");

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "#08080c",
            color: "#94a3b8",
            fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
            padding: "2rem",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "44rem" }}>
            {/* Error icon */}
            <div
              style={{
                width: "6.4rem",
                height: "6.4rem",
                margin: "0 auto 2rem",
                borderRadius: "50%",
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f87171"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            {/* Title */}
            <h2
              style={{
                fontSize: "2.2rem",
                fontWeight: 700,
                color: "#f1f5f9",
                marginBottom: "0.8rem",
                letterSpacing: "-0.02em",
              }}
            >
              {isChunkError ? "Update Available" : "Something went wrong"}
            </h2>

            {/* Description */}
            <p
              style={{
                fontSize: "1.4rem",
                color: "#64748b",
                marginBottom: "2.4rem",
                lineHeight: 1.6,
                maxWidth: "36rem",
                margin: "0 auto 2.4rem",
              }}
            >
              {isChunkError
                ? "A new version is available. Please refresh to get the latest updates."
                : "An unexpected error occurred. You can try again or reload the page."}
            </p>

            {/* Error details (dev only) */}
            {import.meta.env.DEV && error && (
              <details
                style={{
                  marginBottom: "2rem",
                  textAlign: "left",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "1.2rem",
                  padding: "1.2rem",
                  fontSize: "1.2rem",
                  color: "#64748b",
                  fontFamily: "monospace",
                  maxHeight: "12rem",
                  overflow: "auto",
                }}
              >
                <summary style={{ cursor: "pointer", marginBottom: "0.8rem", color: "#94a3b8" }}>
                  Error details
                </summary>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </details>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={this.handleRetry}
                style={{
                  padding: "1rem 2.4rem",
                  background: "linear-gradient(135deg, #818cf8, #a78bfa)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "9999px",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 20px rgba(129,140,248,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 30px rgba(129,140,248,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 20px rgba(129,140,248,0.3)";
                }}
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                style={{
                  padding: "1rem 2.4rem",
                  background: "rgba(255,255,255,0.06)",
                  color: "#f1f5f9",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "9999px",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.1)";
                  e.target.style.borderColor = "rgba(255,255,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255,255,255,0.06)";
                  e.target.style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
