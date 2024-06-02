import { useEffect, useRef } from "react";
import { Post } from "../gql/graphql";
import { Link } from "react-router-dom";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { IoIosShareAlt } from "react-icons/io";
import { IoChatboxEllipses } from "react-icons/io5";

function PostFeed({ post }: { post: Post }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    video.current?.play();
  });
  return (
    <>
      <div id="PostFeed" className="flex border-b py-6">
        <div className="cursor-pointer">
          <img
            src={
              post.user.image ? post.user.image : "https://picsum.photos/200"
            }
            alt=""
            className="rounded-full max-h-[60px]"
            width={60}
          />
        </div>
        <div className="pl-3 w-full px-4">
          <div className="flex items-center justify-between pb-0.5">
            <Link to={`/profile/${post.user.id}`}>
              <span className="font-bold hover:underline cursor-pointer">
                UserName
              </span>
              <span className="text-[13px] font-light text-gray-500 pl-1 cursor-pointer">
                {post.user.fullname}
              </span>
            </Link>
            <button className="border text-[15px] px-[21px] py-0.5 border-[#F02C56] text-[#F02C56] hover:bg-[#ffeef2] font-semibold rounded-md">
              Follow
            </button>
          </div>
          <div className="text-[15px] pb-0.5 break-words md:max-w-[480px] max-w-[300px]">
            This is some text
          </div>
          <div className="text-[14px] text-gray-500 pb-0.5">
            #fun #bossvirus03 #nestjs-graphQL-prisma
          </div>
          <div className="text-[14px] pb-0.5 flex items-center font-semibold">
            <BsMusicNoteBeamed size={17} />
            <div className="px-1">Go back home</div>
            <AiFillHeart size={20} />
          </div>
          <div className="mt-2.5 flex">
            <Link to={`/post/${post.id}`}>
              <div className="flex flex-col items-center justify-center w-full h-full">
                <div className="relative flex-grow h-[779px] w-[438px] flex items-center bg-black rounded-xl overflow-hidden">
                  <video
                    className="absolute w-full h-full object-contain rounded-xl"
                    ref={video}
                    loop
                    muted
                    src={`http://localhost:6969${post.video}`}
                  />
                  <img
                    src="src/assets/images/tiktok-logo-white.png"
                    alt=""
                    width={90}
                    className="absolute right-2 bottom-14"
                  />
                </div>
              </div>
            </Link>
            <div className="relative mr-[75px]">
              <div className="absolute bottom-0 pl-2 flex flex-col items-center gap-y-2">
                <div>
                  <button className="rounded-full bg-gray-200 p-2 cursor-pointer">
                    <AiFillHeart size={25} color="black" />
                  </button>
                  <span className="block text-center text-lg to-gray-800 font-semibold">
                    {post.likes?.length}
                  </span>
                </div>
                <div>
                  <button className="rounded-full bg-gray-200 p-2 cursor-pointer">
                    <IoIosShareAlt size={25} color="black" />
                  </button>
                  <span className="block text-center text-lg to-gray-800 font-semibold">
                    100K
                  </span>
                </div>
                <div>
                  <button className="rounded-full bg-gray-200 p-2 cursor-pointer">
                    <IoChatboxEllipses size={25} color="black" />
                  </button>
                  <span className="block text-center text-lg to-gray-800 font-semibold">
                    900
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostFeed;
