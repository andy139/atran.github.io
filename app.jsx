/* app.jsx — entry */
function App() {
  return (
    <>
      <window.Navbar />
      <window.Hero />
      <window.NowTicker />
      <window.Work />
      <window.About />
      <window.Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
