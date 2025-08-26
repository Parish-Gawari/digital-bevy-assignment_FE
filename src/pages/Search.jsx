import { useState } from "react";
import api from "../api";
import { toast } from "react-toastify";

export default function Search({ token }) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    try {
      const res = await api.post(
        "/search",
        { keyword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res?.data?.results || []);
    } catch (err) {
      toast.error("Search failed. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

 
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">🔍 Search GitHub Repositories</h2>


      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter a keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown} 
        />
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {results?.length > 0 ? (
        <div className="row">
          {results?.map((repo) => (
            <div className="col-md-4 mb-3" key={repo.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{repo.full_name}</h5>
                  <p className="card-text">
                    {repo.description || "No description available."}
                  </p>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    View Repo
                  </a>
                </div>
                <div className="card-footer text-muted small">
                  ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No results yet. Try searching for something!</p>
      )}
    </div>
  );
}
