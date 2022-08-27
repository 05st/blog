import client from "../../client";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";
import PostsList from "../../components/postslist";
import Head from "next/head";

function urlFor(source) {
  return imageUrlBuilder(client).image(source);
}

function toPlainText(blocks = []) {
  return blocks
    .map(block => {
      if (block._type !== 'block' || !block.children) {
        return ''
      }
      return block.children.map(child => child.text).join('')
    })
    .join('\n')
}

function Author(props) {
  const {
    name,
    image,
    bio,
  } = props;
  return (
    <div className="relative top-16 flex flex-col items-center">
      <Head>
        <title>{name} | Blog</title>
        <meta property="og:title" content={name + " | Blog"} key="title"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="blog.stimsina.com"/>
        <meta property="og:description" content={toPlainText(bio)}/>
      </Head>
      <div className="w-full md:w-1/2 flex flex-col space-y-4 p-4">
        <div>
          <h1 className="font-bold text-2xl">{name}</h1>
          <div className="flex flex-row gap-4">
            <div className="flex flex-col">
              {image && (
                <div className="border shadow overflow-hidden w-64 h-64">
                  <img src={urlFor(image).url()}/>
                </div>
              )}
            </div>
            <BlockContent
              blocks={bio}
              imageOptions={{ w: 320, h: 240, fit: 'max' }}
              {...client.config()}
            />
          </div>
        </div>
        <div className="flex flex-col items-center space-y-4">
          <h1 className="font-bold text-2xl">Authored Posts</h1>
          <PostsList posts={props.posts}/>
        </div>
      </div>
    </div>
  );
}

const query = `*[_type == "author" && slug.current == $slug][0]{
  name,
  image,
  bio,
  "posts": *[_type == "post" && author->slug.current == $slug]|order(publishedAt desc){
      title,
      slug,
      desc,
      "authorName": author->name,
      "authorSlug": author->slug,
      "categories": categories[]->title,
      "authorImage": author->image,
      publishedAt,
    }
}`;

Author.getInitialProps = async function(ctx) {
  const { slug = "" } = ctx.query;
  return await client.fetch(query, { slug });
}

export default Author;
