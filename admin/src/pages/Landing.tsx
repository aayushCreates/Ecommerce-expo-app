import { SignInButton, SignUpButton } from "@clerk/react";
import {
  ShoppingBag,
  Users,
  BarChart3,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-base-200 text-base-content selection:bg-primary selection:text-primary-content">
      {/* Navbar */}
      <nav className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-50 border-b border-base-300 px-4 lg:px-12">
        <div className="flex-1">
          <a className="btn btn-ghost text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-primary" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ShoppyAdmin
            </span>
          </a>
        </div>
        <div className="flex gap-4">
          <SignInButton mode="modal">
            <button className="btn btn-outline btn-sm md:btn-md border-base-300 hover:border-primary">
              Log In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="btn btn-primary btn-sm md:btn-md shadow-lg shadow-primary/20">
              Get Started
            </button>
          </SignUpButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48 px-6">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-base-300/50 border border-base-content/10 mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">
              Welcome to ShoppyAdmin
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
            Manage your{" "}
            <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent italic">
              Ecommerce Empire
            </span>{" "}
            with ease.
          </h1>

          <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            The all-in-one administrative dashboard for modern online stores.
            Track orders, manage customers, and scale your business globally.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignUpButton mode="modal">
              <button className="btn btn-primary btn-lg px-8 group shadow-xl shadow-primary/30">
                Start Managing Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
