import MiniSearch from "minisearch";
import searchIndex from "../../.vitepress/search-index.json";

const index = new MiniSearch({
  fields: ["title", "description"], // fields to index for full-text search
});

index.addAll(searchIndex); // add documents to the index

// console.log("index", index);

export function search(query: string) {
  const results = index.search(query, {
    fuzzy: 0.2, // fuzzy search with a distance of 2
    prefix: true, // enable prefix search
    boost: { title: 2 }, // boost title matches
  });
  return results;
}


