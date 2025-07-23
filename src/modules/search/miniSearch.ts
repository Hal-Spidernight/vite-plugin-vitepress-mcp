import MiniSearch from "minisearch";
import path from "node:path";
import fs from "node:fs";
import { getPathPrefix } from "../../utils/usePaths";

/**
 * Search VitePress documentation using MiniSearch.
 * @param query
 * @param buildMode
 * @returns
 */
export async function searchByMiniSearch(query: string, buildMode = false) {
  console.log("search query:", query);
  console.log("buildMode:", buildMode);
  const index = new MiniSearch({
    fields: ["title", "content", "relativePath"], // fields to index for full-text search
    storeFields: ["id", "title", "content", "relativePath", "excerpt"],
  });

  const pathPrefix = getPathPrefix();

  //build時は.vitepress/distへ出力
  let buildPath = "";
  if (buildMode) {
    // ビルドモードの場合、.vitepressフォルダはプロジェクトルートにあると仮定
    buildPath = "dist";
  }

  // 検索用インデックスを生成・保存
  const indexPath = path.resolve(pathPrefix, ".vitepress", buildPath, "search-index.json");

  const searchIndex = JSON.parse(fs.readFileSync(indexPath, "utf-8")) || [];
  index.addAll(searchIndex); // add documents to the index

  const results = index.search(query, {
    fuzzy: 0.2, // fuzzy search with a distance of 2
    prefix: true, // enable prefix search
    boost: { title: 2 }, // boost title matches
  });
  return results;
}
