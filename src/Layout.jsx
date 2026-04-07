import React, { useState, useEffect } from "react";
import KCFBot from "@/components/common/KCFBot";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { FileText, Home, Sparkles, User as UserIcon, Mail, Info, Heart, TrendingUp, LogOut, Settings as SettingsIcon, BrainCircuit, Target, PenLine, ScanSearch, Zap, Shield, Wand2, Clock, DollarSign, Linkedin, Rocket, Mic, BarChart3 } from "lucide-react";
import AnimatedLogo from "@/components/common/AnimatedLogo";
import KLogo from "@/components/common/KLogo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// Removed import: import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ResumeLoader from "@/components/common/ResumeLoader";

// Custom Avatar Component to replace Radix UI Avatar
const CustomAvatar = ({ src, alt, fallback, className, fallbackClassName }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false); // Reset error state when `src` prop changes
  }, [src]);

  // If `src` is provided and there's no image error, try to render the image
  if (src && !imageError) {
    return (
      <div className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}>
        <img
          className="aspect-square h-full w-full object-cover"
          src={src}
          alt={alt}
          onError={() => setImageError(true)} // Set error if image fails to load
        />
      </div>
    );
  }

  // Fallback: either image failed or src was not provided
  return (
    <div className={`relative flex shrink-0 overflow-hidden rounded-full items-center justify-center ${className} ${fallbackClassName}`}>
      <span className="text-sm font-medium leading-none">{fallback}</span>
    </div>
  );
};

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: FileText,
    requiresAuth: true,
  },
  {
    title: "Templates",
    url: createPageUrl("Templates"),
    icon: Sparkles,
  },
  {
    title: "Analytics", 
    url: createPageUrl("Analytics"),
    icon: TrendingUp,
    requiresAuth: true,
  },
  {
    title: "Free Interview Practice",
    url: createPageUrl("InterviewPrep"),
    icon: BrainCircuit,
    requiresAuth: true,
  },
  {
    title: "Career Roadmap",
    url: createPageUrl("CareerRoadmap"),
    icon: Target,
    requiresAuth: true,
  },
  {
    title: "Cover Letter AI",
    url: createPageUrl("CoverLetter"),
    icon: PenLine,
    requiresAuth: true,
  },
  {
    title: "ATS Scanner",
    url: createPageUrl("ATSScanner"),
    icon: ScanSearch,
    requiresAuth: true,
  },
  {
    title: "Career Hub",
    url: "/CareerHub",
    icon: Rocket,
    requiresAuth: true,
    badge: "NEW",
  },
  {
    title: "Interview Roulette",
    url: "/InterviewRoulette",
    icon: Zap,
    requiresAuth: true,
    badge: "Daily",
  },
  {
    title: "AI Red Team Attack",
    url: "/RedTeamResume",
    icon: Shield,
    requiresAuth: true,
    badge: "NEW",
  },
  {
    title: "Auto-Tailor Resume",
    url: "/TailorResume",
    icon: Wand2,
    requiresAuth: true,
    badge: "NEW",
  },
  {
    title: "Career Time Machine",
    url: "/CareerTimeMachine",
    icon: Clock,
    requiresAuth: true,
    badge: "NEW",
  },
  {
    title: "Salary Negotiator",
    url: "/SalaryNegotiator",
    icon: DollarSign,
    requiresAuth: true,
    badge: "NEW",
  },
  {
    title: "LinkedIn Ghostwriter",
    url: "/LinkedInGhostwriter",
    icon: Linkedin,
    requiresAuth: true,
    badge: "NEW",
  },
  {
    title: "Voice Mock Interview",
    url: "/VoiceMockInterview",
    icon: Mic,
    requiresAuth: true,
    badge: "NEW",
  },
  {
    title: "Job Market Intel",
    url: "/JobMarketIntel",
    icon: BarChart3,
    requiresAuth: true,
    badge: "NEW",
  },
];

const secondaryItems = [
  {
    title: "About Us",
    url: createPageUrl("About"),
    icon: Info,
  },
  {
    title: "Contact",
    url: createPageUrl("Contact"),
    icon: Mail,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const isLanding = currentPageName === "Home";
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);
  // dark sidebar already via CSS

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authed = await base44.auth.isAuthenticated();
      if (authed) {
        const user = await base44.auth.me();
        setCurrentUser(user);
        setIsGuestMode(false);
      } else {
        setCurrentUser(null);
        setIsGuestMode(true);
      }
    } catch (error) {
      setCurrentUser(null);
      setIsGuestMode(true);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    base44.auth.logout(createPageUrl("Home"));
  };

  const handleLogin = (e) => {
    if (e) e.preventDefault();
    base44.auth.redirectToLogin();
  };

  if (isLoading) {
    return <ResumeLoader />;
  }

  if (isLanding) {
    return (
      <div>
        {/* Top Navigation Bar for Landing */}
        <nav className="fixed top-0 w-full z-40" style={{ background: "rgba(6, 11, 18, 0.95)", backdropFilter: "blur(24px)", borderBottom: "1px solid rgba(52,211,153,0.08)" }}>
          <div className="max-w-7xl mx-auto px-6 py-2">
            <div className="flex items-center justify-between gap-6">

              {/* Logo */}
              <Link to={createPageUrl("Home")} className="flex items-center flex-shrink-0 hover:opacity-90 transition-opacity">
                <AnimatedLogo size="md" showText={true} textColor="light" />
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
                {[
                  { label: "Templates", to: createPageUrl("Templates") },
                  { label: "Interview", to: "/interview-practice", badge: "Free", mobileLabel: "Interview" },
                  { label: "ATS Scanner", to: createPageUrl("ATSScanner"), mobileLabel: "ATS" },
                  { label: "About", to: createPageUrl("About") },
                  { label: "Contact", to: createPageUrl("Contact") },
                ].map(item => (
                  <Link
                    key={item.label}
                    to={item.to}
                    className="relative flex items-center gap-1 px-2 lg:px-3.5 py-2 rounded-lg text-xs lg:text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 group whitespace-nowrap"
                  >
                    <span className="hidden lg:inline">{item.label}</span>
                    <span className="lg:hidden">{item.mobileLabel || item.label.split(" ")[0]}</span>
                    {item.badge && (
                      <span className="text-[8px] font-black px-1 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black leading-none">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {currentUser ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 ring-2 ring-emerald-500/30 hover:ring-emerald-500/60 transition-all">
                        <CustomAvatar
                          src={currentUser.avatar}
                          alt={currentUser.full_name}
                          fallback={currentUser.full_name?.charAt(0) || 'U'}
                          className="h-9 w-9"
                          fallbackClassName="bg-gradient-to-br from-emerald-800 to-cyan-800 text-emerald-300"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount style={{ background: "#0d1420", border: "1px solid rgba(52,211,153,0.15)" }}>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1 max-w-[200px]">
                          <p className="text-sm font-semibold text-white leading-tight truncate">{currentUser.full_name}</p>
                          <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem asChild className="text-slate-300 focus:text-white focus:bg-white/5">
                        <Link to={createPageUrl("Dashboard")}>
                          <FileText className="mr-2 h-4 w-4 text-emerald-400" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="text-slate-300 focus:text-white focus:bg-white/5">
                        <Link to={createPageUrl("Profile")}>
                          <UserIcon className="mr-2 h-4 w-4 text-cyan-400" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/5" />
                      <DropdownMenuItem onClick={handleLogout} className="text-rose-400 focus:text-rose-300 focus:bg-rose-500/10">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={handleLogin}
                      className="hidden sm:flex text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium px-4"
                    >
                      Log In
                    </Button>
                    <Button
                      onClick={handleLogin}
                      className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-sm px-5 h-9 rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300"
                    >
                      Get Started Free
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content with padding for fixed nav */}
        <div>
          {children}
        </div>

        <KCFBot />

        {/* Enhanced Footer */}
        <footer className="relative bg-[#060b12] text-white py-16 border-t border-emerald-500/10 overflow-hidden">
          {/* 3D background elements */}
          <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-violet-900/15 pointer-events-none" />
          {/* Orbs */}
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-violet-600/12 blur-3xl pointer-events-none" style={{ animation: "pulse 6s ease-in-out infinite 2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/6 blur-3xl pointer-events-none" />
          {/* Floating particles */}
          <div className="absolute top-8 left-[15%] w-1.5 h-1.5 rounded-full bg-emerald-400/50 animate-bounce pointer-events-none" style={{ animationDuration: "3s" }} />
          <div className="absolute top-16 left-[45%] w-1 h-1 rounded-full bg-cyan-400/40 animate-bounce pointer-events-none" style={{ animationDuration: "4s", animationDelay: "1s" }} />
          <div className="absolute top-12 right-[20%] w-1.5 h-1.5 rounded-full bg-violet-400/50 animate-bounce pointer-events-none" style={{ animationDuration: "5s", animationDelay: "0.5s" }} />
          <div className="absolute bottom-12 left-[30%] w-1 h-1 rounded-full bg-pink-400/40 animate-bounce pointer-events-none" style={{ animationDuration: "3.5s", animationDelay: "1.5s" }} />
          <div className="absolute bottom-8 right-[35%] w-1.5 h-1.5 rounded-full bg-emerald-300/40 animate-bounce pointer-events-none" style={{ animationDuration: "4.5s", animationDelay: "0.8s" }} />

          <div className="container mx-auto px-6 relative z-10">
            <div className="mb-12">
              <div className="flex justify-center mb-8">
                <KLogo size={120} />
              </div>
              <p className="text-gray-400 text-sm max-w-2xl text-center">
                Build professional, ATS-optimized resumes with AI assistance and stunning templates.
              </p>
            </div>

            <div className="space-y-8">
              {/* Explore More from Us */}
              <div>
                <h4 className="font-semibold mb-4 text-white">Explore More from Us</h4>
                <ul className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <li><Link to={createPageUrl("Templates")} className="hover:text-green-400 transition-colors">Free Resume Templates</Link></li>
                  <li>·</li>
                  <li><Link to="/interview-practice" className="hover:text-green-400 transition-colors">Interview Practice</Link></li>
                  <li>·</li>
                  <li><a href="https://kindnesscommunity.ai/" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">KindnessCommunity AI</a></li>
                  <li>·</li>
                  <li><a href="https://kindnesscommunity.ai/bible-reader" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">Bible Reader</a></li>
                  <li>·</li>
                  <li><a href="https://kindnesscommunityfoundation.com/kindwave" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">KindWave</a></li>
                  <li>·</li>
                  <li><a href="https://kindnesscommunityfoundation.com/kindcalmunity" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">KindCalmunity</a></li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold mb-4 text-white">Company</h4>
                <ul className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <li><Link to={createPageUrl("About")} className="hover:text-green-400 transition-colors">About Us</Link></li>
                  <li>·</li>
                  <li><a href="https://kindnesscommunityfoundation.com/jointeam" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">Join Our Team</a></li>
                  <li>·</li>
                  <li><a href="https://kindnesscommunityfoundation.com/blog" target="_blank" rel="noopener noreferrer" className="hover:text-green-400 transition-colors">Blog</a></li>
                  <li>·</li>
                  <li><Link to={createPageUrl("Contact")} className="hover:text-green-400 transition-colors">Contact</Link></li>
                  <li>·</li>
                  <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
                  <li>·</li>
                  <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
                </ul>
              </div>

              {/* AI Career Tools */}
              <div>
                <h4 className="font-semibold mb-4 text-white">AI Career Tools</h4>
                <ul className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <li><Link to="/CareerHub" className="hover:text-green-400 transition-colors">Career Hub</Link></li>
                  <li>·</li>
                  <li><Link to="/InterviewRoulette" className="hover:text-green-400 transition-colors">Interview Roulette</Link></li>
                  <li>·</li>
                  <li><Link to="/RedTeamResume" className="hover:text-green-400 transition-colors">AI Red Team Attack</Link></li>
                  <li>·</li>
                  <li><Link to="/TailorResume" className="hover:text-green-400 transition-colors">AI Resume Tailoring</Link></li>
                  <li>·</li>
                  <li><Link to="/CareerTimeMachine" className="hover:text-green-400 transition-colors">Career Time Machine</Link></li>
                  <li>·</li>
                  <li><Link to="/SalaryNegotiator" className="hover:text-green-400 transition-colors">Salary Negotiator</Link></li>
                  <li>·</li>
                  <li><Link to="/LinkedInGhostwriter" className="hover:text-green-400 transition-colors">LinkedIn Ghostwriter</Link></li>
                  <li>·</li>
                  <li><Link to="/VoiceMockInterview" className="hover:text-green-400 transition-colors">Voice Mock Interview</Link></li>
                  <li>·</li>
                  <li><Link to="/JobMarketIntel" className="hover:text-green-400 transition-colors">Job Market Intel</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-emerald-500/10 mt-12 pt-8 flex flex-col items-center gap-3 text-center">
              <p className="text-gray-300 text-sm font-medium">© 2026 Kindness Community Foundation. All rights reserved.</p>
              <p className="text-gray-400 text-sm">Developed by KCF LLC, A California, USA company serving the world.</p>
              <p className="text-gray-400 text-sm flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-red-500 fill-red-500 inline" /> for our community
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[#060b12]">
        <Sidebar className="border-r border-emerald-500/10" style={{ background: "linear-gradient(180deg, #080d14 0%, #0d1420 100%)" }}>
          <SidebarHeader className="border-b border-white/5 p-5">
            <Link to={createPageUrl("Home")} className="flex items-center hover:opacity-80 transition-opacity">
              <AnimatedLogo size="md" showText={true} textColor="light" />
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            {/* Guest Mode Notice */}
            {isGuestMode && (
              <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4 hidden sm:block">
                <h3 className="font-semibold text-emerald-300 text-xs mb-2">🎯 Guest Mode</h3>
                <p className="text-slate-400 text-xs mb-2">Browse as guest or sign up!</p>
                <Button size="sm" onClick={handleLogin} className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-xs h-8">
                  Sign Up Free
                </Button>
              </div>
            )}

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-3">
                Main Features
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isRestricted = item.requiresAuth && isGuestMode;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild={!isRestricted}
                          className={`hover:bg-emerald-500/10 hover:text-emerald-400 transition-all duration-300 rounded-xl mb-2 group ${
                            location.pathname === item.url ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-400'
                          } ${isRestricted ? 'opacity-40' : ''}`}
                          onClick={isRestricted ? handleLogin : undefined}
                        >
                          {isRestricted ? (
                            <div className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                              <item.icon className="w-5 h-5" />
                              <span className="font-medium">{item.title}</span>
                              <span className="ml-auto text-xs text-yellow-600">🔒</span>
                            </div>
                          ) : (
                            <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                              <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                              <span className="font-medium">{item.title}</span>
                              {item.badge && (
                                <span className="ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black leading-none">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-3">
                Information
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {secondaryItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-cyan-500/10 hover:text-cyan-400 transition-all duration-300 rounded-xl mb-2 group ${
                          location.pathname === item.url ? 'bg-cyan-500/15 text-cyan-300' : 'text-slate-400'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {!isGuestMode && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-3">
                  Quick Stats
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="px-3 py-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400">Resumes</span>
                      <span className="ml-auto font-semibold text-white">3</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-slate-400">Avg ATS Score</span>
                      <span className="ml-auto font-semibold text-emerald-400">94%</span>
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </SidebarContent>

          <SidebarFooter className="border-t border-emerald-500/10 p-6">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start h-auto p-0">
                    <div className="flex items-center gap-3 w-full">
                      <CustomAvatar
                        src={currentUser.avatar}
                        alt={currentUser.full_name}
                        fallback={currentUser.full_name?.charAt(0) || 'U'}
                        className="h-10 w-10"
                        fallbackClassName="bg-gradient-to-r from-emerald-800 to-cyan-800 text-emerald-300"
                      />
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-semibold text-white text-sm truncate">{currentUser.full_name}</p>
                        <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={createPageUrl("Profile")}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-y-2">
                <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold hover:from-emerald-400 hover:to-cyan-400">
                  Sign In
                </Button>
                <p className="text-xs text-center text-slate-600">
                  Join thousands of users!
                </p>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-[#060b12]/90 backdrop-blur-xl border-b border-white/5 px-5 py-3 md:hidden">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-white/5 text-slate-400 p-2 rounded-lg transition-colors duration-300" />
              <Link to={createPageUrl("Home")} className="flex items-center">
                <AnimatedLogo size="sm" showText={true} textColor="light" />
              </Link>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>

      <KCFBot />
      
      <style>{`
        :root {
          --color-mint-white: #F7FFF6;
          --color-soft-green: #BCEBCB;
          --color-fresh-green: #87D68D;
          --color-sage: #93B48B;
          --color-blue-gray: #8491A3;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </SidebarProvider>
  );
}