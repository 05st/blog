import sanity from "@sanity/client";

const client = sanity({
  projectId: "flk6xzu9",
  dataset: "production",
  useCdn: true
});

export default client;
