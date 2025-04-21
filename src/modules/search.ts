import MiniSearch from "minisearch";
// import searchIndex from "../dist/search-index.json";

export async function search(query: string) {
  const index = new MiniSearch({
    fields: ["title", "description"], // fields to index for full-text search
  });
  // console.log("index", index);
  const searchIndex = (await (await fetch(`${process.cwd()}/.vitepress/search-index.json`)).json()) || [];

  index.addAll(searchIndex); // add documents to the index

  const results = index.search(query, {
    fuzzy: 0.2, // fuzzy search with a distance of 2
    prefix: true, // enable prefix search
    boost: { title: 2 }, // boost title matches
  });
  return results;
}
