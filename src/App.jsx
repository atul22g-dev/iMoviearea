import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./component/home/Home"));
const Page = lazy(() => import("./component/page/Page"));

function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              background: "#08080c",
              color: "#94a3b8",
              fontSize: "1.4rem",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "3.2rem",
                  height: "3.2rem",
                  border: "2.5px solid rgba(255,255,255,0.06)",
                  borderTopColor: "#818cf8",
                  borderRadius: "50%",
                  margin: "0 auto 1.2rem",
                  animation: "spin 0.7s linear infinite",
                }}
              />
              <span>Loading…</span>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Page" element={<Page />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
