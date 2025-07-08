import Navbar from "../components/Navbar";
import { useState } from "react";
import RateLimitedUI from "../components/RateLimitedUI"; 
import { useEffect } from "react";
//import axios from "axios";
//import { set } from "mongoose";
import toast from "react-hot-toast";
import NoteCard from "../components/NoteCard";
import api from "../lib/axios";
import NotesNotFound from "../components/NotesNotFound";
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [isRateLimited,setIsRateLimited]=useState(false);
  const [notes,setNotes]=useState([]);
  const [loading,setLoading]=useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotes=async()=>{
      try{
        setLoading(true);
        const res=await api.get("/notes"); //baseURL is specified in axios.js 
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimited(false);
      }catch(error){
        console.log("Error fetching notes");
        console.log(error.response);
        if(error.response?.status===429){
          setIsRateLimited(true);
        }
        else{
          toast.error("Failed to load notes");
        }
      }finally{
        setLoading(false);
      }
    };
    fetchNotes();
  },[]);
  const handleDelete = async (id) => {
    //if (window.confirm
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
      toast.success('Note deleted successfully');
    } catch (error) {
      console.error('Error deleting note:', error);
      if (error.response?.status === 429) {
        setError('Too many requests. Please try again later.');
      } else {
        setError('Failed to delete note. Please try again.');
      }
      toast.error('Failed to delete note');
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  // return (
  //   <div className="min-h-screen">
  //     <Navbar />

  //     {isRateLimited && <RateLimitedUI />}

  //     <div className="max-w-7xl mx-auto p-4 mt-6">
  //       {loading && <div className="text-center text-primary py-10">Loading notes...</div>}

  //       {notes.length === 0 && !loading && !isRateLimited && <NotesNotFound />}

  //       {notes.length > 0 && !isRateLimited && (
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //           {notes.map((note) => (
  //             <NoteCard key={note._id} note={note} setNotes={setNotes} />
  //           ))}
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Notes</h1>
              <p className="text-base-content/70 mt-1">
                Welcome back, {user?.email}
              </p>
            </div>
            <Link to="/create" className="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Note
            </Link>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
              <button 
                className="btn btn-sm btn-ghost"
                onClick={() => setError('')}
              >
                ✕
              </button>
            </div>
          )}

          {/* Notes Grid */}
          {notes.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-base-content/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
                <p className="text-base-content/70 mb-6">
                  Start creating your first note to organize your thoughts and ideas.
                </p>
                <Link to="/create" className="btn btn-primary">
                  Create Your First Note
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <div key={note._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <div className="card-body">
                    <h2 className="card-title text-lg line-clamp-2">
                      {note.title}
                    </h2>
                    <p className="text-sm text-base-content/70 mb-3">
                      {formatDate(new Date(note.createdAt))}
                    </p>
                    <p className="text-base-content/80 line-clamp-3 mb-4">
                      {note.content}
                    </p>
                    <div className="card-actions justify-end">
                      <Link 
                        to={`/note/${note._id}`}
                        className="btn btn-sm btn-outline"
                      >
                        View
                      </Link>
                      <Link 
                        to={`/create?edit=${note._id}`}
                        className="btn btn-sm btn-primary"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDelete(note._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stats Footer */}
          {notes.length > 0 && (
            <div className="mt-12 text-center">
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Total Notes</div>
                  <div className="stat-value text-primary">{notes.length}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default HomePage;