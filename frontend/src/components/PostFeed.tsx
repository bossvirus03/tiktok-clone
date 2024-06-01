import { useEffect, useRef } from "react";
import { Post } from "../gql/graphql";

function PostFeed({ post }: { post: Post }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    video.current?.play();
  });
  return (
    <>
      <div id="PostFeed" className="flex border-b py-6">
        <div className="cursor-pointer">
          <img src="" alt="" className="rounded-full max-h-[60px]" />
        </div>
      </div>
    </>
  );
}

export default PostFeed;
