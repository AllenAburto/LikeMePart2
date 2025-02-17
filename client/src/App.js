import { useState, useEffect } from "react";
import { FaHeart, FaEdit, FaTrashAlt } from "react-icons/fa";
import "./App.css";

const API_URL = "http://localhost:3000/posts";

function App() {
  const [posts, setPosts] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [img, setImg] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editPostId, setEditPostId] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error al obtener posts:", error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (titulo.length > 25 || descripcion.length > 255) {
      alert("El título no puede tener más de 25 caracteres y la descripción más de 255.");
      return;
    }

    if (!titulo || !img || !descripcion) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const nuevoPost = { titulo, img, descripcion };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoPost),
      });

      if (!res.ok) throw new Error("Error al crear el post");

      const data = await res.json();
      setPosts([data, ...posts]);
      setTitulo("");
      setImg("");
      setDescripcion("");
    } catch (error) {
      console.error("Error en la solicitud POST:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`${API_URL}/${postId}/like`, { method: "PUT" });

      if (!res.ok) throw new Error("Error al actualizar los likes");

      const updatedPost = await res.json();
      setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: updatedPost.likes } : post)));
    } catch (error) {
      console.error("Error al hacer like:", error);
    }
  };

  const handleEdit = (post) => {
    setEditPostId(post.id);
    setTitulo(post.titulo);
    setImg(post.img);
    setDescripcion(post.descripcion);
  };

  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`${API_URL}/${postId}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Error al eliminar el post");

      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error al eliminar el post:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (titulo.length > 25 || descripcion.length > 255) {
      alert("El título no puede tener más de 25 caracteres y la descripción más de 255.");
      return;
    }

    if (!titulo || !img || !descripcion) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const updatedPost = { titulo, img, descripcion };

    try {
      const res = await fetch(`${API_URL}/${editPostId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPost),
      });

      if (!res.ok) throw new Error("Error al actualizar el post");

      const data = await res.json();
      setPosts(posts.map((post) => (post.id === editPostId ? data : post)));
      setEditPostId(null);
      setTitulo("");
      setImg("");
      setDescripcion("");
    } catch (error) {
      console.error("Error al actualizar el post:", error);
    }
  };

  return (
    <div className="container">
      <h1>{editPostId ? "Editar Post" : "Registra Tu Post"}</h1>

      <form onSubmit={editPostId ? handleUpdate : handleSubmit} className="form">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="URL de imagen"
          value={img}
          onChange={(e) => setImg(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <button type="submit">{editPostId ? "Actualizar Post" : "Publicar Post"}</button>
      </form>

      <h2>Posts Registrados</h2>

      <div className="post-grid">
        {posts.length === 0 ? (
          <p>Sin Post Registrados</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-img-container">
                <img src={post.img} alt={post.titulo} className="post-img" />
              </div>
              <div className="post-content">
                <h3>{post.titulo}</h3>
                <p>{post.descripcion}</p>
              </div>
              <div className="post-actions">
                <button className="edit-btn" onClick={() => handleEdit(post)}>
                  <FaEdit />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(post.id)}>
                  <FaTrashAlt />
                </button>
              </div>
              <div className="like-container" onClick={() => handleLike(post.id)}>
                <FaHeart className="heart-icon" />
                <span className="like-count">{post.likes}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;