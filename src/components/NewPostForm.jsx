import React, { useState } from "react";
import { db, storage } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function NewPostForm({ user }) {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;

    setLoading(true);
    let imageUrl = "";

    try {
      // Upload image if selected
      if (imageFile) {
        const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${imageFile.name}`);
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      // Add post to Firestore
      await addDoc(collection(db, "posts"), {
        uid: user.uid,
        email: user.email,
        content,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      // Reset form
      setContent("");
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add post");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-2">
      <textarea
        placeholder="Write a new post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="border p-2 w-full rounded"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="border p-2 w-full rounded"
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
