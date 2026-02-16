import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

// Página 404 — design STRATA escuro industrial
const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
      {/* Grid isométrico — idêntico ao Hero */}
      <div className="iso-container" aria-hidden="true">
        {Array.from({ length: 120 }).map((_, i) => (
          <div key={i} className="iso-cell" style={{ animationDelay: `${Math.random() * 5}s` }} />
        ))}
      </div>

      <div className="relative z-10 text-center space-y-6">
        <h1 className="font-display text-8xl font-black text-primary">404</h1>
        <p className="text-xl text-muted-foreground">Page not found</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm tracking-wider uppercase px-8 py-3 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
