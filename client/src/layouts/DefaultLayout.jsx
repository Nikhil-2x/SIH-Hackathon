import Navbar from "../components/Navbar";

const DefaultLayout = ({ children }) => (
  <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
    <Navbar />
    {children}
  </div>
);

export default DefaultLayout;
