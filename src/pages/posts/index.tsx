import Link from "next/link";
import { map } from "zod";
import { trpc } from "../../utils/trpc";

function PostListingPage() {
  const { data, isLoading } = trpc.useQuery(["posts.posts"]);

  if (isLoading) {
    return <p>Fetching from database...</p>;
  }

  return (
    <div>
      {data?.map((post) => {
        return (
          <article key={post.id}>
            <p>{post.title}</p>
            <p>
              Tags:
              {post.PostTag.map((tag) => {
                return ` [${tag.tagName}] `;
              })}
            </p>
            <Link href={`/posts/${post.id}`}>Read post</Link>
          </article>
        );
      })}
    </div>
  );
}

export default PostListingPage;
