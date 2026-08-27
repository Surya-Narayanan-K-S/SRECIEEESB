import Navbar from "@/components/layout/Navbar";
import Societies from "@/components/societies/Societies";
import Footer from "@/components/layout/Footer";
const SocietiesPage = () => {
    return (<div className="min-h-screen bg-background">
      <Navbar />
      <Societies />
      <Footer />
    </div>);
};
export default SocietiesPage;
