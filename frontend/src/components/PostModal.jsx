export default function PostModal({ post, close }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white flex w-[900px] h-[600px]">
        <img src={post.image} className="w-1/2 object-cover" />

        <div className="w-1/2 p-4 flex flex-col">
          <button onClick={close} className="self-end">
            ✕
          </button>
          <p className="font-semibold mb-4">{post.user.username}</p>
          <p>{post.caption}</p>
        </div>
      </div>
    </div>
  );
}
