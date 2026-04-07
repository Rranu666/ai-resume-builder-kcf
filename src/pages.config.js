import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import Templates from './pages/Templates.jsx';
import About from './pages/About';
import Contact from './pages/Contact';
import Analytics from './pages/Analytics';
import TemplatePreview from './pages/TemplatePreview';
import Profile from './pages/Profile';
import PhotoEditor from './pages/PhotoEditor';
import PDFTools from './pages/PDFTools';
import VersionCompare from './pages/VersionCompare';
import InterviewPrep from './pages/InterviewPrep';
import CareerRoadmap from './pages/CareerRoadmap';
import CoverLetter from './pages/CoverLetter';
import Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Dashboard": Dashboard,
    "Editor": Editor,
    "Templates": Templates,
    "About": About,
    "Contact": Contact,
    "Analytics": Analytics,
    "TemplatePreview": TemplatePreview,
    "Profile": Profile,
    "PhotoEditor": PhotoEditor,
    "PDFTools": PDFTools,
    "VersionCompare": VersionCompare,
    "InterviewPrep": InterviewPrep,
    "CareerRoadmap": CareerRoadmap,
    "CoverLetter": CoverLetter,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: Layout,
};