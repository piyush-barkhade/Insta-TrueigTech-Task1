import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.get(`/posts/${id}`).then((res) => setPost(res.data));
  }, []);

  if (!post) return null;

  return (
    <div>
      <img src={post.image} width="400" />
      <p>{post.caption}</p>
      {post.comments.map((c, i) => (
        <p key={i}>
          <b>{c.user.username}</b>: {c.text}
        </p>
      ))}
    </div>
  );
}
