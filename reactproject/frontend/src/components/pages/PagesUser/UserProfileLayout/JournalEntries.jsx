import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const RecentJournalEntries = () => {
  const [user, setUser] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const fetchUser = JSON.parse(user);

      fetch(`http://localhost:8081/fetchUserEntry/user/${fetchUser.userID}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("No entry found");
          }
          return response.json();
        })
        .then((data) => {
          setUser(fetchUser);
          setEntries(data.entries);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      navigate("/Login");
    }
  }, [navigate]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="bg-light border border-secondary-subtle rounded shadow p-2">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className=" p-2">
        <div className="d-flex justify-content-between border-bottom pt-2 px-1">
          <div>
            <h5>Journal entries</h5>
          </div>
          <div>
            <Link
              to="/all-entries"
              className="orangerText"
              style={{ cursor: "pointer" }}
            >
              View All
            </Link>
          </div>
        </div>
        {error ? (
          <div>
            <p>{error}</p>
          </div>
        ) : entries.length === 0 ? (
          <div>
            <p>No entries available.</p>
          </div>
        ) : (
          <div style={{ height: "35vh", overflowY: "scroll" }}>
            {entries.map((entry) => (
              <div key={entry.entryID} className="pe-1 mt-1">
                <div className="journalEntries d-flex align-items-start flex-column rounded ps-2 py-2">
                  <p className="m-0">
                    {entry.title} - {formatDate(entry.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentJournalEntries;
