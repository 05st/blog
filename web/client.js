import sanity from "@sanity/client";

const client = sanity({
  projectId: "flk6xzu9",
  dataset: "production",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN
});

export default client;
