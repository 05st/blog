import client from "../../client"
import BlockContent from '@sanity/block-content-to-react'

function Post(props) {
  const {
    title = "Missing title",
    name = "Missing name",
    categories,
    body = []
  } = props;
  return (
    <article>
      <h1>{title}</h1>
      <span>By {name}</span>
      {categories && (
        <ul>
          Posted in
          {categories.map(category => <li key={category}>{category}</li>)}
        </ul>
      )}
      <BlockContent
        blocks={body}
        {...client.config()}
      />
    </article>
  );
}

const query = `*[_type == "post" && slug.current == $slug][0]{
  title,
  "name": author->name,
  "categories": categories[]->title,
  body
}`;

Post.getInitialProps = async function(ctx) {
  const { slug = "" } = ctx.query;
  return await client.fetch(query, { slug });
}

export default Post;
