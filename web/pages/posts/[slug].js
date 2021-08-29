import client from "../../client"
import imageUrlBuilder from '@sanity/image-url'
import BlockContent from '@sanity/block-content-to-react'

function urlFor(source) {
  return imageUrlBuilder(client).image(source);
}

function Post(props) {
  const {
    title = "Missing title",
    name = "Missing name",
    categories,
    authorImage,
    portableTextWithLatex = [],
    body = []
  } = props;

  return (
    <article>
      <h1>{title}</h1>
      <span>By {name}</span>

      {authorImage && (
        <div>
          <img src={urlFor(authorImage).width(50).url()}/>
        </div>
      )}

      {categories && (
        <ul>
          Posted in
          {categories.map(category => <li key={category}>{category}</li>)}
        </ul>
      )}

      <BlockContent
        blocks={portableTextWithLatex}
        imageOptions={{ w: 320, h: 240, fit: 'max' }}
        {...client.config()}
      />
    </article>
  );
}

const query = `*[_type == "post" && slug.current == $slug][0]{
  title,
  "name": author->name,
  "categories": categories[]->title,
  "authorImage": author->image,
  portableTextWithLatex,
  body
}`;

Post.getInitialProps = async function(ctx) {
  const { slug = "" } = ctx.query;
  return await client.fetch(query, { slug });
}

export default Post;
