import MiniSearch from "minisearch";

const index = new MiniSearch({
  fields: ["title", "description"], // fields to index for full-text search
});

export function search(query: string) {
  const results = index.search(query, {
    fuzzy: 0.2, // fuzzy search with a distance of 2
    prefix: true, // enable prefix search
    boost: { title: 2 }, // boost title matches
  });
  return results;
}
