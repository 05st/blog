import Link from "next/link";
import Head from "next/head";
import client from "../client";
import PostsList from "../components/postslist";

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
      <div className="w-full md:w-1/2 flex flex-col items-center">
        <h1 className="font-bold text-2xl pt-4">Recent Posts</h1>
        <PostsList posts={props.posts}/>
      </div>
    </div>
  );
}

Index.getInitialProps = async () => ({
    posts: await client.fetch(`
      *[_type == "post"]|order(publishedAt desc)|{
        title,
        slug,
        desc,
        "id": _id,
        "authorName": author->name,
        "authorSlug": author->slug,
        "categories": categories[]->title,
        "authorImage": author->image,
        publishedAt,
      }
    `)
})

export default Index;
