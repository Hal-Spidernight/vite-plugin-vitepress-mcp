import MiniSearch from "minisearch";
import path from "node:path";
import fs from "node:fs";
export async function search(query: string) {
  const index = new MiniSearch({
    fields: ["title", "content", "relativePath"], // fields to index for full-text search
    storeFields: ["id", "title", "content", "relativePath", "excerpt"],
  });
  const indexPath = path.resolve(process.cwd(), ".vitepress/search-index.json");
  // console.log("indexPath:", indexPath);
  const searchIndex = JSON.parse(fs.readFileSync(indexPath, "utf-8")) || [];
  index.addAll(searchIndex); // add documents to the index

  const results = index.search(query, {
    fuzzy: 0.2, // fuzzy search with a distance of 2
    prefix: true, // enable prefix search
    boost: { title: 2 }, // boost title matches
  });
  return results;
}
