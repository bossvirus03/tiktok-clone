import React, { useEffect } from "react";
import PostFeed from "../components/PostFeed";

import { useQuery } from "@apollo/client";
import { GET_ALL_POST } from "../graphql/queries/getPosts";

function Feed() {
  const loadMoreRef = React.useRef(null);

  const { data, loading, fetchMore } = useQuery(GET_ALL_POST, {
    variables: { skip: 0, take: 2 },
  });

  const loadMorePosts = async () => {
    try {
      await fetchMore({
        variables: {
          skip: data?.getPosts.length || 0,
          take: 2,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          const newPosts = fetchMoreResult.getPosts.filter(
            (newPost) => !prev.getPosts.some((post) => post.id === newPost.id)
          );
          return {
            getPosts: [...prev.getPosts, ...newPosts],
          };
        },
      });
      console.log(data);
    } catch (error) {
      console.error("Error fetching more posts:", error);
    }
  };
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("Observer triggered");
          loadMorePosts();
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMorePosts]);

  console.log(data?.getPosts);

  return (
    <div className="pt-[80px] w-[calc(100%-90px)] max-w-[690px] ">
      {data?.getPosts.map((post, index: number) => (
        <PostFeed key={index} post={post} />
      ))}
      <div className="h-20" ref={loadMoreRef}></div>
    </div>
  );
}

export default Feed;
