import { Route, Routes } from "react-router-dom";
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";

const App = () => {
  return (
    /*<AuthProvider>
      <div className="min-h-screen bg-base-200">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Header />
                <NotesPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </AuthProvider>*/
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>NodeScribe</h1>
      <p>App is working!</p>
    </div>

    //Authentication first, then homepage is displayed
    // <div className="relative h-full w-full">
    //   <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#00FF9D40_100%)]" />
    //   <Routes>
    //     <Route path="/" element={<HomePage />} />
    //     <Route path="/create" element={<CreatePage />} />
    //     <Route path="/note/:id" element={<NoteDetailPage />} />
    //   </Routes>
    // </div>
  );
};

export default App;