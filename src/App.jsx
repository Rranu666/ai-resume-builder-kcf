import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import VisualEditAgent from '@/lib/VisualEditAgent'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Suspense } from 'react';
import { lazy } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ResumeLoader from '@/components/common/ResumeLoader';
import Login from './pages/Login';

// Lazy load heavy pages
const ATSAnalysis = lazy(() => import('./pages/ATSAnalysis'));
const ATSScanner = lazy(() => import('./pages/ATSScanner'));
const InterviewPracticeLanding = lazy(() => import('./pages/InterviewPracticeLanding'));
const InterviewRoulette = lazy(() => import('./pages/InterviewRoulette'));
const RedTeamResume = lazy(() => import('./pages/RedTeamResume'));
const TailorResume = lazy(() => import('./pages/TailorResume'));
const CareerTimeMachine = lazy(() => import('./pages/CareerTimeMachine'));
const SalaryNegotiator = lazy(() => import('./pages/SalaryNegotiator'));
const LinkedInGhostwriter = lazy(() => import('./pages/LinkedInGhostwriter'));
const CareerHub = lazy(() => import('./pages/CareerHub'));
const VoiceMockInterview = lazy(() => import('./pages/VoiceMockInterview'));
const JobMarketIntel = lazy(() => import('./pages/JobMarketIntel'));

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, isAuthenticated, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    // auth_required and other errors: allow guest access, don't block the app
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="/ats-analysis/:resumeId" element={
        <LayoutWrapper currentPageName="ATSAnalysis">
          <Suspense fallback={<ResumeLoader />}>
            <ATSAnalysis />
          </Suspense>
        </LayoutWrapper>
      } />
      <Route path="/ATSScanner" element={
        <LayoutWrapper currentPageName="ATSScanner">
          <Suspense fallback={<ResumeLoader />}>
            <ATSScanner />
          </Suspense>
        </LayoutWrapper>
      } />
      <Route path="/interview-practice" element={
        <LayoutWrapper currentPageName="InterviewPracticeLanding">
          <Suspense fallback={<ResumeLoader />}>
            <InterviewPracticeLanding />
          </Suspense>
        </LayoutWrapper>
      } />
      <Route path="/InterviewRoulette" element={
        <LayoutWrapper currentPageName="InterviewRoulette">
          <Suspense fallback={<ResumeLoader />}>
            <InterviewRoulette />
          </Suspense>
        </LayoutWrapper>
      } />
      <Route path="/RedTeamResume" element={
        <LayoutWrapper currentPageName="RedTeamResume">
          <Suspense fallback={<ResumeLoader />}>
            <RedTeamResume />
          </Suspense>
        </LayoutWrapper>
      } />
      <Route path="/TailorResume" element={
        <LayoutWrapper currentPageName="TailorResume">
          <Suspense fallback={<ResumeLoader />}>
            <TailorResume />
          </Suspense>
        </LayoutWrapper>
      } />
      <Route path="/CareerTimeMachine" element={
        <LayoutWrapper currentPageName="CareerTimeMachine">
          <Suspense fallback={<ResumeLoader />}>
            <CareerTimeMachine />
          </Suspense>
        </LayoutWrapper>
      } />
      <Route path="/SalaryNegotiator" element={
        <LayoutWrapper currentPageName="SalaryNegotiator">
          <Suspense fallback={<ResumeLoader />}>
            <SalaryNegotiator />
          </Suspense>
        </LayoutWrapper>
      } />
      <Route path="/LinkedInGhostwriter" element={
        <LayoutWrapper currentPageName="LinkedInGhostwriter">
          <Suspense fallback={<ResumeLoader />}>
            <LinkedInGhostwriter />
          </Suspense>
        </LayoutWrapper>
      } />
      <Route path="/CareerHub" element={
        <LayoutWrapper currentPageName="CareerHub">
          <Suspense fallback={<ResumeLoader />}>
            <CareerHub />
          </Suspense>
        </LayoutWrapper>
      } />
      <Route path="/VoiceMockInterview" element={
        <LayoutWrapper currentPageName="VoiceMockInterview">
          <Suspense fallback={<ResumeLoader />}>
            <VoiceMockInterview />
          </Suspense>
        </LayoutWrapper>
      } />
      <Route path="/JobMarketIntel" element={
        <LayoutWrapper currentPageName="JobMarketIntel">
          <Suspense fallback={<ResumeLoader />}>
            <JobMarketIntel />
          </Suspense>
        </LayoutWrapper>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Suspense fallback={<ResumeLoader />}>
            <NavigationTracker />
            <AuthenticatedApp />
          </Suspense>
        </Router>
        <Toaster />
        <VisualEditAgent />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App