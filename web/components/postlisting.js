import Link from "next/link";
import client from "../client";
import imageUrlBuilder from "@sanity/image-url";

function urlFor(source) {
  return imageUrlBuilder(client).image(source);
}

function PostListing(props) {
  console.log(props);

  const { authorName = "", authorSlug = "", authorImage = "", desc, title, slug, publishedAt, categories = [] } = props;

  return (
    <>
      {slug && (
        <Link href="/post/[slug]" as={`/post/${slug.current}`}><a>
          <div className="flex flex-col space-y-4 p-4 rounded-2xl border transition duration-100 hover:shadow">
            <div className="flex space-x-4 justify-between">
              <h2 className="text-xl font-bold hover:underline">{title}</h2>
              <div>
                <div className="flex space-x-2 flex-row">
                  <p className="text-sm">
                    <span className="font-bold">By </span>
                    <Link href="/author/[slug]" as={`/author/${authorSlug.current}`}>
                      <a className="hover:underline">{authorName}</a>
                    </Link>
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

export default PostListing;
