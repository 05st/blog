import PostListing from "./postlisting";

function PostsList(props) {
  const { posts = [] } = props;
  return (
    <div className="flex flex-col space-y-4 p-4">
      {posts.map(PostListing)}
    </div>
  );
}

export default PostsList;
