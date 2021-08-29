import Link from "next/link";
import client from "../client";

function Index(props) {
  const { posts = [] } = props;
  return (
    <div>
      <p>blog.stimsina.com</p>
      {posts.map(
        ({ _id, title = '', slug = '', _updatedAt = '' }) =>
          slug && (
            <li key={_id}>
              <Link href="/posts/[slug]" as={`/posts/${slug.current}`}>
                <a>{title}</a>
              </Link>{' '}
              ({new Date(_updatedAt).toDateString()})
            </li>
          )
      )}
    </div>
  );
}

Index.getInitialProps = async () => ({
    posts: await client.fetch(`
      *[_type == "post" && publishedAt < now()]|order(publishedAt desc)
    `)
})

export default Index;
