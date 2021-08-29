import client from "../../client";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";
import Latex from "react-latex";
import 'katex/dist/katex.min.css'

const serializers = {
  types: {
    code: (props) => (
      <pre data-language={props.node.language}>
        <code>{props.node.code}</code>
      </pre>
    ),
    latex: (props) => (
      <Latex>{"$"+props.node.body+"$"}</Latex>
    ),
  },
};

function urlFor(source) {
  return imageUrlBuilder(client).image(source);
}

function Post(props) {
  const {
    title = "Missing title",
    name = "Missing name",
    categories,
    authorImage,
    content = []
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
        blocks={content}
        imageOptions={{ w: 320, h: 240, fit: 'max' }}
        serializers={serializers}
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
  content
}`;

Post.getInitialProps = async function(ctx) {
  const { slug = "" } = ctx.query;
  return await client.fetch(query, { slug });
}

export default Post;
