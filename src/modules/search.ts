import MiniSearch from "minisearch";

export async function search(query: string) {
  const index = new MiniSearch({
    fields: ["title", "description"], // fields to index for full-text search
  });
  const searchIndex = ((await (await fetch(`${process.cwd()}/.vitepress/search-index.json`)).json()) as any[]) || [];

  index.addAll(searchIndex); // add documents to the index

  const results = index.search(query, {
    fuzzy: 0.2, // fuzzy search with a distance of 2
    prefix: true, // enable prefix search
    boost: { title: 2 }, // boost title matches
  });
  return results;
}
