import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
  Observable,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

async function refreshToken(client: ApolloClient<NormalizedCacheObject>) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation refreshToken {
          accessToken
        }
      `,
    });
    const newAccessToken = await data?.refreshToken;
    if (!newAccessToken) {
      throw new Error(`New access token not received`);
    }
    localStorage.setItem("accessToken", newAccessToken);
    return `bearer ${newAccessToken}`;
  } catch (error) {
    throw new Error(`Error getting access token: ${error}`);
  }
}

let retryCount = 0;
const maxRetryCount = 3;

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions.code === "UNAUTHENTICATED") {
        if (retryCount < maxRetryCount) {
          retryCount++;
          return new Observable((observer) => {
            refreshToken(client)
              .then((token) => {
                operation.setContext({
                  headers: {
                    authorization: token,
                  },
                });
                const forward$ = forward(operation);
                forward$.subscribe(observer);
              })
              .catch((error) => observer.error(error));
          });
        }
      }
    }
  }
});

const uploadLink = createUploadLink({
  uri: "http://localhost:6969/graphql",
  credentials: "include",
  headers: {
    "apollo-require-preflight": "true",
  },
});

export const client = new ApolloClient({
  uri: "http://localhost:6969/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getCommentsByPostId: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  link: ApolloLink.from([errorLink, uploadLink]),
});
