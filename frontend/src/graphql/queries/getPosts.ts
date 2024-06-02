import { gql } from "@apollo/client";

export const GET_ALL_POST = gql`
  query GetPosts($skip: Int!, $take: Int!) {
    getPosts(skip: $skip, take: $take) {
      id
      text
      video
      user {
        id
        fullname
        email
      }
      likes {
        id
        userId
        postId
      }
    }
  }
`;
