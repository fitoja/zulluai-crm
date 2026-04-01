import React, { useEffect, useState } from "react";
import "./home.scss";
import Layout from "../layout";

const Home = () => {
  const [videos, setVideos] = useState({});
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");

  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmCatDelete, setConfirmCatDelete] = useState(null); // New state for Category Delete

  const [toast, setToast] = useState(null);

  const [newCatName, setNewCatName] = useState("");
  const [isAddingCat, setIsAddingCat] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    views: "",
    file: null,
  });

  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch("https://api.zulluai.com/api/homeVideo/all");
      const data = await res.json();

      if (data.success) {
        setVideos(data.videos);
        setCategories(data.categories);
        if (!activeCategory && data.categories.length > 0) {
          setActiveCategory(data.categories[0]);
        }
      }
    } catch (err) {
      showToast("Failed to load videos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      setIsAddingCat(true);
      const res = await fetch("https://api.zulluai.com/api/categories/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName }),
      });
      const data = await res.json();

      if (data.success) {
        showToast("Category added!");
        setNewCatName("");
        fetchVideos();
      } else {
        showToast(data.msg || "Error adding category", "error");
      }
    } catch {
      showToast("Failed to add category", "error");
    } finally {
      setIsAddingCat(false);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const catName = confirmCatDelete;
      const catRes = await fetch("https://api.zulluai.com/api/categories/all");
      const catData = await catRes.json();
      const target = catData.data.find((c) => c.name === catName);

      if (!target) return showToast("Category ID not found", "error");

      const res = await fetch(
        `https://api.zulluai.com/api/categories/delete/${target._id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        showToast("Category deleted");
        if (activeCategory === catName) setActiveCategory("");
        fetchVideos();
      }
    } catch {
      showToast("Error deleting category", "error");
    } finally {
      setConfirmCatDelete(null);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, file });
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.file || !form.category || !form.title) {
      return showToast("Fill all fields", "error");
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("category", form.category);
    formData.append("views", form.views || "0");
    formData.append("videoFile", form.file);

    try {
      setUploading(true);
      const res = await fetch("https://api.zulluai.com/api/homeVideo/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        showToast("Uploaded successfully 🚀");
        setShowModal(false);
        setForm({ title: "", category: "", views: "", file: null });
        setPreview(null);
        fetchVideos();
      }
    } catch {
      showToast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `https://api.zulluai.com/api/homeVideo/delete/${confirmDelete}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        showToast("Deleted successfully");
        fetchVideos();
      } else {
        showToast("Delete failed", "error");
      }
    } catch {
      showToast("Error deleting", "error");
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <Layout>
      <div className="home-page">
        <div className="header">
          <h2>Videos</h2>
          <div className="header-actions">
            <form className="add-cat-form" onSubmit={handleAddCategory}>
              <input
                placeholder="New Category..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
              <button type="submit" disabled={isAddingCat}>
                +
              </button>
            </form>
            <button
              className="upload-main-btn"
              onClick={() => setShowModal(true)}
            >
              + Upload Video
            </button>
          </div>
        </div>

        <div className="category-tabs">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`tab-item ${activeCategory === cat ? "active" : ""}`}
            >
              <button onClick={() => setActiveCategory(cat)}>{cat}</button>
              <span
                className="del-cat"
                onClick={() => setConfirmCatDelete(cat)}
              >
                ×
              </span>
            </div>
          ))}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="video-grid">
            {videos[activeCategory]?.length > 0 ? (
              videos[activeCategory].map((vid) => (
                <div className="video-card" key={vid.id}>
                  <video src={vid.videoUrl} controls />
                  <div className="info">
                    <h4>{vid.title}</h4>
                    <p>{vid.author}</p>
                    <div className="bottom-row">
                      <span>{vid.views} views</span>
                      <button
                        className="delete-btn"
                        onClick={() => setConfirmDelete(vid.id)}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No videos in this category yet.</p>
            )}
          </div>
        )}

        {/* MODAL: UPLOAD VIDEO */}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Upload Video</h3>
              <form onSubmit={handleUpload}>
                <input
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <input
                  placeholder="Views (1.5K)"
                  value={form.views}
                  onChange={(e) => setForm({ ...form, views: e.target.value })}
                />
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <input type="file" onChange={handleFileChange} />
                {preview && (
                  <video className="preview" src={preview} controls />
                )}
                <div className="actions">
                  <button type="submit">
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="cancel"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: DELETE VIDEO CONFIRM */}
        {confirmDelete && (
          <div className="modal">
            <div className="modal-content small">
              <h3>Delete Video?</h3>
              <p>This action cannot be undone.</p>
              <div className="actions">
                <button className="actions-btn-delete" onClick={handleDelete}>
                  Yes, Delete
                </button>
                <button
                  className="actions-btn-cancel"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: DELETE CATEGORY CONFIRM */}
        {confirmCatDelete && (
          <div className="modal">
            <div className="modal-content small">
              <h3>Delete Category?</h3>
              <p>
                Are you sure you want to delete <b>{confirmCatDelete}</b>? This
                will also hide videos linked to it.
              </p>
              <div className="actions">
                <button
                  className="actions-btn-delete"
                  onClick={handleDeleteCategory}
                >
                  Yes, Delete
                </button>
                <button
                  className="actions-btn-cancel"
                  onClick={() => setConfirmCatDelete(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      </div>
    </Layout>
  );
};

export default Home;
