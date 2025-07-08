import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon } from "lucide-react";
import { useAuth } from '../context/AuthContext';

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Error in fetching note", error);
        toast.error("Failed to fetch the note");
        console.error('Error fetching note:', error);
        if (error.response?.status === 429) {
          setError('Too many requests. Please try again later.');
        } else if (error.response?.status === 404) {
          setError('Note not found. It may have been deleted.');
        } else if (error.response?.status === 401) {
          setError('You are not authorized to view this note.');
        } else {
          setError('Failed to load note. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    //window.confirm
    if (!confirm("Are you sure you want to delete this note?  This action cannot be undone.")) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/",{ 
        state: { message: 'Note deleted successfully' }
      });
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
      console.error('Error deleting note:', error);
      if (error.response?.status === 429) {
        setError('Too many requests. Please try again later.');
      } else if (error.response?.status === 404) {
        setError('Note not found. It may have already been deleted.');
      } else {
        setError('Failed to delete note. Please try again.');
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

    const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
      // You could add a toast notification here
      alert('Note copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const shareNote = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: note.content,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center items-center min-h-[400px]">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-base-200 flex items-center justify-center">
  //       <LoaderIcon className="animate-spin size-10" />
  //     </div>
  //   );
  // }

   if (error) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
                <div className="card-actions justify-center mt-6">
                   <Link to="/" className="btn btn-primary">
                    Back to Notes
                  </Link>
                  <button 
                    className="btn btn-outline"
                    onClick={fetchNote}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <h2 className="text-2xl font-bold mb-4">Note Not Found</h2>
                <p className="text-base-content/70 mb-6">
                  The note you're looking for doesn't exist or has been deleted.
                </p>
                <Link to="/" className="btn btn-primary">
                  Back to Notes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Note Details</h1>
              <p className="text-base-content/70 mt-1">
                {user?.email}
              </p>
            </div>
            <Link to="/" className="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Notes
            </Link>
          </div>

          {/* Note Content Card */}
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              {/* Note Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{note.title}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Created: {formatDate(new Date(note.createdAt))}
                    </span>
                    {note.updatedAt !== note.createdAt && (
                      <span className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Updated: {formatDate(new Date(note.updatedAt))}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Note Content */}
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-base leading-relaxed">
                  {note.content}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="card-actions justify-end mt-8 gap-2">
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
                
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={shareNote}
                  title="Share note"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                  Share
                </button>

                <Link
                  to={`/create?edit=${note._id}`}
                  className="btn btn-primary btn-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </Link>

                <button
                  className={`btn btn-error btn-sm ${deleteLoading ? 'loading' : ''}`}
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {!deleteLoading && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>

          {/* Note Stats Card */}
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">📊 Note Statistics</h3>
              <div className="stats stats-vertical lg:stats-horizontal shadow">
                <div className="stat">
                  <div className="stat-title">Characters</div>
                  <div className="stat-value text-primary">{note.content.length}</div>
                  <div className="stat-desc">Including spaces</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Words</div>
                  <div className="stat-value text-secondary">
                    {note.content.trim().split(/\s+/).filter(word => word.length > 0).length}
                  </div>
                  <div className="stat-desc">Approximate count</div>
                </div>
                
                <div className="stat">
                  <div className="stat-title">Lines</div>
                  <div className="stat-value text-accent">
                    {note.content.split('\n').length}
                  </div>
                  <div className="stat-desc">Line breaks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="min-h-screen bg-base-200">
  //     <div className="container mx-auto px-4 py-8">
  //       <div className="max-w-2xl mx-auto">
  //         <div className="flex items-center justify-between mb-6">
  //           <Link to="/" className="btn btn-ghost">
  //             <ArrowLeftIcon className="h-5 w-5" />
  //             Back to Notes
  //           </Link>
  //           <button onClick={handleDelete} className="btn btn-error btn-outline">
  //             <Trash2Icon className="h-5 w-5" />
  //             Delete Note
  //           </button>
  //         </div>

  //         <div className="card bg-base-100">
  //           <div className="card-body">
  //             <div className="form-control mb-4">
  //               <label className="label">
  //                 <span className="label-text">Title</span>
  //               </label>
  //               <input
  //                 type="text"
  //                 placeholder="Note title"
  //                 className="input input-bordered"
  //                 value={note.title}
  //                 onChange={(e) => setNote({ ...note, title: e.target.value })}
  //               />
  //             </div>

  //             <div className="form-control mb-4">
  //               <label className="label">
  //                 <span className="label-text">Content</span>
  //               </label>
  //               <textarea
  //                 placeholder="Write your note here..."
  //                 className="textarea textarea-bordered h-32"
  //                 value={note.content}
  //                 onChange={(e) => setNote({ ...note, content: e.target.value })}
  //               />
  //             </div>

  //             <div className="card-actions justify-end">
  //               <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
  //                 {saving ? "Saving..." : "Save Changes"}
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};
export default NoteDetailPage;