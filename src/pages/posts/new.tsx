import { useRouter } from "next/router";
import { useState } from "react";
import { CreatePostInput } from "../../schema/post.schema";
import { trpc } from "../../utils/trpc";

function CreatePostPage() {
  const [values, setValues] = useState<CreatePostInput>({
    title: "",
    body: "",
    tags: [],
  });

  const router = useRouter();

  const { mutate, error, isLoading } = trpc.useMutation(["posts.create-post"], {
    onSuccess: ({ id }) => {
      alert("update success");
      router.push(`/posts/${id}`);
    },
    onError: () => {
      alert("this is error");
    },
  });

  const handleOnClick = () => {
    mutate(values);
    setValues({
      title: "",
      body: "",
      tags: [],
    });
  };

  if (isLoading) {
    return <p>Updating databse</p>;
  }
  return (
    <div>
      {error && error.message}

      <h1>Create posts</h1>
      <input
        type="text"
        placeholder="Your post title"
        value={values.title}
        onChange={(e) => setValues({ ...values, title: e.target.value })}
      />
      <br />
      <textarea
        placeholder="Your post body"
        value={values.body}
        onChange={(e) => setValues({ ...values, body: e.target.value })}
      />
      <br />
      <input
        type="text"
        placeholder="Enter Tags"
        value={values.tags}
        onChange={(e) =>
          setValues({ ...values, tags: e.target.value.split(",") })
        }
      />
      <button onClick={handleOnClick}>Create post</button>
    </div>
  );
}

export default CreatePostPage;
