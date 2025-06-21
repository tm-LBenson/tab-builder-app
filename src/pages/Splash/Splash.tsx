import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Header from "./components/Header";

export default function Splash() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 font-sans">
      <Navbar />
      <Header />
      <Footer />
    </div>
  );
}
