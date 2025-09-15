import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "./Inputs";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

const CreateResumeForm = () => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleCreateResume = async (e) => {
    e.preventDefault();
    if (!title) {
      setError("Please enter resume title");
      return;
    }
    setError("");

    try {
      const res = await axiosInstance.post(API_PATHS.RESUME.CREATE, {
        title,
      });
      console.log(res.data?._id);
      if (res.data?._id) {
        navigate(`/resume/${res.data?._id}`);
      }
    } catch (err) {
      if (err.response && err.resonse.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Plese try again later.");
      }
    }
  };
  return (
    <div className="w-full max-w-md p-6 bg-white rounded-2xl border-gray-100 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Create New Resume
      </h3>
      <p className="text-gray-600 mb-8">
        Give your resume a title to get started. You can customize everything
        later.
      </p>

      <form onSubmit={handleCreateResume}>
        <Input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          label="Resume Title"
          placeHolder="Software engineer"
          type="text"
        />
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black rounded-2xl hover:scale-105 hover:shadow-xl hover:shadow-rose-200 transition-all"
        >
          Create Resume
        </button>
      </form>
    </div>
  );
};

export default CreateResumeForm;
