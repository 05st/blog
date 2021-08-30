import Link from "next/link";
import Head from "next/head";
import client from "../client";
import imageUrlBuilder from "@sanity/image-url";

function urlFor(source) {
  return imageUrlBuilder(client).image(source);
}

function PostListing(props) {
  const { authorName = "", authorImage = "", desc, title, slug, publishedAt, categories = []} = props;

  return (
    <>
      {slug && (
        <Link href="/posts/[slug]" as={`/posts/${slug.current}`}><a>
          <div className="flex flex-col space-y-4 p-4 rounded-2xl border transition duration-100 hover:shadow">
            <div className="flex space-x-4 justify-between">
              <h2 className="text-xl font-bold hover:underline">{title}</h2>
              <div>
                <div className="flex space-x-2 flex-row">
                  <p className="text-sm">
                    <span className="font-bold">By</span> {authorName}
                  </p>
                  {authorImage && (
                    <div className="w-5 h-5 rounded-full overflow-hidden">
                      <img src={urlFor(authorImage).url()}/>
                    </div>
                  )}
                </div>
                <p className="text-sm">
                  <span className="font-bold">Published</span> {new Date(publishedAt).toDateString()}
                </p>
              </div>
            </div>
            <p>{desc}</p>
            <p className="my-auto text-gray-300 text-sm truncate overflow-hidden whitespace-nowrap">
              {categories.sort().join(", ")}
            </p>
          </div>
        </a></Link>
      )}
    </>
  );
}

function PostsGrid(props) {
  const { posts = [] } = props;
  return (
    <div className="flex flex-col space-y-4 p-4">
      {posts.map(PostListing)}
    </div>
  );
}

function Index(props) {
  return (
    <div className="relative top-16 flex flex-col items-center">
      <Head>
        <title>Recent Posts | Blog</title>
        <meta property="og:title" content="Recent Posts | Blog" key="title"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="blog.stimsina.com"/>
        <meta property="og:description" content="Posts about computer science, programming, and mathematics."/>
      </Head>
      <div className="md:w-1/2 flex flex-col items-center">
        <h1 className="font-bold text-2xl pt-4">Recent Posts</h1>
        <PostsGrid posts={props.posts}/>
      </div>
    </div>
  );
}

Index.getInitialProps = async () => ({
    posts: await client.fetch(`
      *[_type == "post" && publishedAt < now()]|order(publishedAt desc)|{
        title,
        slug,
        desc,
        "authorName": author->name,
        "categories": categories[]->title,
        "authorImage": author->image,
        publishedAt,
      }
    `)
})

export default Index;
