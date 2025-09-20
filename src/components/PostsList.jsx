import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";

export default function PostsList({ currentUser }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete post");
    }
  };

  const trailingActions = (post) => (
    <TrailingActions>
      {post.uid === currentUser.uid && (
        <SwipeAction
          destructive={true}
          onClick={() => handleDelete(post.id)}
        >
          <div className="flex items-center justify-center h-full bg-red-500 text-white px-4">
            Delete
          </div>
        </SwipeAction>
      )}
    </TrailingActions>
  );

  return (
    <SwipeableList>
      {posts.map((post) => (
        <SwipeableListItem
          key={post.id}
          trailingActions={trailingActions(post)}
        >
          <div className="bg-white p-4 rounded shadow mb-2">
            <p className="text-sm text-gray-600">{post.email}</p>
            <p className="mt-1">{post.content}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="post"
                className="mt-2 rounded max-h-60 w-full object-cover"
              />
            )}
          </div>
        </SwipeableListItem>
      ))}
    </SwipeableList>
  );
}
