import Head from "next/head";
import Link from "next/link";

import client from "../../client";
import imageUrlBuilder from "@sanity/image-url";
import BlockContent from "@sanity/block-content-to-react";

import SyntaxHighlighter from "react-syntax-highlighter";
import { docco as syntaxTheme } from "react-syntax-highlighter/dist/esm/styles/hljs";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkRehype from "remark-rehype";
import "github-markdown-css";

import Comments from '../../components/comments'
import CommentForm from '../../components/commentform'

function CodeBlock({node, inline, className, children, ...props}) {
  const match = /language-(\w+)/.exec(className || '')
  return !inline && match ? (
    <SyntaxHighlighter style={syntaxTheme} language={match[1]} PreTag="div" children={String(children).replace(/\n$/, '')} {...props} />
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

const serializers = {
  types: {
    document: (props) => (
      <Markdown
        linkTarget="_blank"
        className="markdown-body"
        remarkPlugins={[remarkGfm, remarkMath, remarkRehype]}
        rehypePlugins={[rehypeKatex]}
        components={{code: CodeBlock}}>
        {props.node.markdown}
      </Markdown>
    ),
  },
};

function urlFor(source) {
  return imageUrlBuilder(client).image(source);
}

function Post(props) {
  const {
    id,
    title = "Missing title",
    desc = "Missing description",
    name = "Missing author name",
    categories = [],
    authorImage = "",
    authorSlug = "",
    comments = [],
    content = []
  } = props;

  return (
    <div className="relative top-16 space-y-4 flex flex-col p-4 items-center">
      <Head>
        <title>{title} | Blog</title>
        <meta property="og:title" content={title + " | Blog"} key="title"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="blog.stimsina.com"/>
        <meta property="og:description" content={desc}/>
      </Head>
      <div className="flex flex-col w-full space-y-4 lg:w-1/2">
        <div>
          <p className="text-gray-300">{categories && categories.sort().join(", ")}</p>
          <h1 className="font-bold text-4xl mb-2">{title}</h1>
          <div className="flex flex-row space-x-2">
            <p><span className="font-bold">By </span>
              <Link href="/author/[slug]" as={`/author/${authorSlug.current}`}>
                <a className="hover:underline">{name}</a>
              </Link>
            </p>
            {authorImage && (
              <div className="rounded-full overflow-hidden w-6 h-6">
                <img src={urlFor(authorImage).url()}/>
              </div>
            )}
          </div>
        </div>
        <div className="overflow-scroll-auto">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/katex.min.css" integrity="sha384-RZU/ijkSsFbcmivfdRBQDtwuwVqK7GMOw6IMvKyeWL2K5UAlyp6WonmB8m7Jd0Hn" crossorigin="anonymous"/>
            <BlockContent
              blocks={content}
              imageOptions={{ w: 320, h: 240, fit: 'max' }}
              serializers={serializers}
              {...client.config()}
            />
        </div>
      </div>
      <div className="flex flex-col w-full pt-16 lg:w-1/2">
        <Comments comments={comments.reverse()}/>
        <div className="flex flex-col items-center pt-4">
          <CommentForm _id={id}/>
        </div>
      </div>
    </div>
  );
}

// reverse comments array above to display newest first

const query = `*[_type == "post" && slug.current == $slug][0]{
  title,
  desc,
  "id": _id,
  "name": author->name,
  "categories": categories[]->title,
  "authorImage": author->image,
  "authorSlug": author->slug,
  "comments": *[_type == "comment" && post._ref == ^._id && approved == true]|order(_createdAt) {
      _id,
      name,
      email,
      comment,
      _createdAt
    },
  content
}`;

Post.getInitialProps = async function(ctx) {
  const { slug = "" } = ctx.query;
  return await client.fetch(query, { slug });
}

export default Post;
