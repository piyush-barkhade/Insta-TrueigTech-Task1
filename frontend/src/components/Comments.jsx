import { useState } from "react";
import api from "../api/api";

export default function Comments({ post }) {
  const [text, setText] = useState("");

  const submitComment = async () => {
    if (!text) return;
    await api.post(`/posts/${post._id}/comment`, { text });
    window.location.reload();
  };

  return (
    <div>
      {post.comments.map((c, i) => (
        <p key={i}>
          <b>{c.user.username}</b>: {c.text}
        </p>
      ))}

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
      />
      <button onClick={submitComment}>Post</button>
    </div>
  );
}
