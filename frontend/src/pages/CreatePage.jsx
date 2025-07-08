import {Link, useNavigate} from "react-router";
import {useState, useEffect} from "react";
import {ArrowLeftIcon} from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CreatePage = () => {
  //to keep track of inputs to note title and content
    const [title,setTitle]=useState("");
    const [content,setContent]=useState("");
    const [loading,setLoading]=useState(false); //becomes true after user submits the form
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate=useNavigate();
    const [searchParams] = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditing = Boolean(editId);
    const { user } = useAuth();

      //use effect not in base
    useEffect(() => {
      if (isEditing) {
        fetchNoteForEdit();
      }
    }, [editId]);

    const fetchNoteForEdit = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/notes/${editId}`);
        const note = response.data;
        setTitle(note.title);
        setContent(note.content);
      } catch (error) {
        console.error('Error fetching note:', error);
        if (error.response?.status === 429) {
          setError('Too many requests. Please try again later.');
        } else if (error.response?.status === 404) {
          setError('Note not found.');
          setTimeout(() => navigate('/'), 2000);
        } else {
          setError('Failed to fetch note. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };


    const handleSubmit=async(e)=>{
      e.preventDefault(); //prevents refereshed page from appearing after form is submitted
      // console.log(title);
      // console.log(content);
      if(!title.trim() || !content.trim()){ //trim is used to ensure that blank values aren't accepted
        toast.error("All fields are required");
        return ;
      }
      
      try{
        setLoading(true);
        setError('');
        setSuccess('');
        if (isEditing){
          await api.put(`/notes/${editId}`, { title: title.trim(), content: content.trim() });
          setSuccess('Note updated successfully!');
          toast.success("Note updated successfully!");
        } else{
            await api.post("/notes",{
            title: title.trim(),
            content: content.trim()
          });
          setSuccess('Note created successfully!');
          toast.success("Note created successfully!");
        }
        //navigate("/");
        setTimeout(() => {
          navigate('/');
        }, 1500);

      } catch(error){
        console.log("Error creating note", error);
        //toast.error("Failed to create note");
        if(error.response.status===429){
            setError('Too many requests. Please try again later.');
            toast.error("Slow down! You're creating notes too fast",{
              duartion: 4000,
              icon: "💀",
            });
        } else if (error.response?.status === 401) {
            setError('You are not authorized. Please log in again.');
            toast.error("Oops! It seems like you're not authorized. Please log in again.",{
              duartion: 4000,
              icon: "⛔",
            });
        } else{
          setError(`Failed to ${isEditing ? 'update' : 'create'} note. Please try again.`);
          toast.error(`Failed to ${isEditing ? 'update' : 'create'} note`);
        }
      } finally{;
        setLoading(false);
      }
    };
    const handleCancel = () => {
    if (title.trim() || content.trim()) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                {isEditing ? 'Edit Note' : 'Create New Note'}
              </h1>
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

          {/* Form Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Success Alert */}
              {success && (
                <div className="alert alert-success mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

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

              <form onSubmit={handleSubmit}>
                {/* Title Input */}
                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text text-lg font-medium">Title</span>
                    <span className="label-text-alt text-base-content/70">
                      {title.length}/100
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your note title..."
                    className="input input-bordered input-lg w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                    maxLength={100}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Content Textarea */}
                <div className="form-control mb-8">
                  <label className="label">
                    <span className="label-text text-lg font-medium">Content</span>
                    <span className="label-text-alt text-base-content/70">
                      {content.length}/5000
                    </span>
                  </label>
                  <textarea
                    placeholder="Write your note content here..."
                    className="textarea textarea-bordered h-64 text-base leading-relaxed"
                    value={content}
                    onChange={(e) => setContent(e.target.value.slice(0, 5000))}
                    maxLength={5000}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Action Buttons */}
                <div className="card-actions justify-end gap-3">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    disabled={loading || !title.trim() || !content.trim()}
                  >
                    {loading ? (
                      isEditing ? 'Updating...' : 'Creating...'
                    ) : (
                      isEditing ? 'Update Note' : 'Create Note'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Tips Card */}
          <div className="card bg-base-100 shadow-lg mt-6">
            <div className="card-body">
              <h3 className="card-title text-lg">💡 Tips for Better Notes</h3>
              <ul className="list-disc list-inside space-y-1 text-base-content/80">
                <li>Use descriptive titles to easily find your notes later</li>
                <li>Break down complex ideas into smaller paragraphs</li>
                <li>Use bullet points or numbered lists for better organization</li>
                <li>Add dates or tags in your content for better context</li>
              </ul>
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
  //         <Link to={"/"} className="btn btn-ghost mb-6">
  //           <ArrowLeftIcon className="size-5" />
  //           Back to Notes
  //         </Link>

  //         <div className="card bg-base-100">
  //           <div className="card-body">
  //             <h2 className="card-title text-2xl mb-4">Create New Note</h2>
  //             <form onSubmit={handleSubmit}>
  //               <div className="form-control mb-4">
  //                 <label className="label">
  //                   <span className="label-text">Title</span>
  //                 </label>
  //                 <input
  //                   type="text"
  //                   placeholder="Note Title"
  //                   className="input input-bordered"
  //                   value={title}
  //                   onChange={(e) => setTitle(e.target.value)}
  //                 />
  //               </div>

  //               <div className="form-control mb-4">
  //                 <label className="label">
  //                   <span className="label-text">Content</span>
  //                 </label>
  //                 <textarea
  //                   placeholder="Write your note here..."
  //                   className="textarea textarea-bordered h-32"
  //                   value={content}
  //                   onChange={(e) => setContent(e.target.value)}
  //                 />
  //               </div>

  //               <div className="card-actions justify-end">
  //                 <button type="submit" className="btn btn-primary" disabled={loading}>
  //                   {loading ? "Creating..." : "Create Note"}
  //                 </button>
  //               </div>
  //             </form>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};
export default CreatePage;