import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import SocialProof from "@/components/landing/SocialProof";
import ModuleCards from "@/components/landing/ModuleCards";
import Showcase from "@/components/landing/Showcase";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

// Página principal da landing page — monta todos os componentes na ordem STRATA
const Landing = () => {
    return (
        <div className="min-h-screen bg-[#050505] selection:bg-brand-emerald selection:text-black font-body text-white overflow-x-hidden">
            {/* Noise Overlay global */}
            <div className="fixed inset-0 pointer-events-none z-[999] bg-noise opacity-[0.03] mix-blend-overlay" />

            <Navbar />
            <main>
                <Hero />
                <SocialProof />
                <ModuleCards />
                <Showcase />
                <Pricing />
                <FAQ />
            </main>
            <Footer />
        </div>
    );
};

export default Landing;
