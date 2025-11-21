import { useEffect, useState } from "react";
import api from "../api/axiosInstance.js";
import useAuth from "../hooks/useAuth.js";

function ProfilePage() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/users/me");
      setForm({ name: data.name || "", bio: data.bio || "" });
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to load profile details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      errs.name = "Name must be at least 2 characters";
    }
    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccess("");

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setServerError(Object.values(errs)[0]);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.put("/users/me", form);
      // Update auth context user
      login(
        {
          ...user,
          name: data.name,
          bio: data.bio,
        },
        localStorage.getItem("authToken")
      );
      setSuccess("Profile updated successfully");
    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center mt-3">
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="mb-3 text-center">Profile</h3>
            {serverError && (
              <div className="alert alert-danger">{serverError}</div>
            )}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email (read-only)</label>
                <input
                  className="form-control"
                  value={user?.email || ""}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Bio</label>
                <textarea
                  name="bio"
                  className="form-control"
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Short description about you"
                />
              </div>

              <button
                className="btn btn-primary w-100"
                disabled={loading}
                type="submit"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
