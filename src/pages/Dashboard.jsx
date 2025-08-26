// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";

export default function Dashboard({ token }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 9;

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/search/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const flattened = res?.data?.flatMap((search) =>
        search.results.map((repo) => ({
          ...repo,
          keyword: search.keyword,
          createdAt: search.createdAt,
        }))
      );

      setRepos(flattened);
    } catch (err) {
      toast.error("Failed to load search history", err);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLast = currentPage * resultsPerPage;
  const indexOfFirst = indexOfLast - resultsPerPage;
  const currentResults = repos?.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(repos?.length / resultsPerPage);

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4 flex-grow-1">
        <h2 className="mb-4 text-center">Dashboard</h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : currentResults?.length === 0 ? (
          <p className="text-center text-muted">
            No searches yet. Try searching something!
          </p>
        ) : (
          <div className="row">
            {currentResults?.map((repo, idx) => (
              <div className="col-md-4 mb-3" key={idx}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{repo.name}</h5>
                    <p className="card-text">
                      {repo.description || "No description available."}
                    </p>
                    <p className="text-muted small mb-2">
                      From: <span className="badge bg-secondary">{repo.keyword}</span>{" "}
                      ({new Date(repo.createdAt).toLocaleString()})
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
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
