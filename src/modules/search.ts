import MiniSearch from "minisearch";
import path from "node:path";
import fs from "node:fs";
export async function search(query: string, buildMode = false) {
  console.log("search query:", query);
  console.log("buildMode:", buildMode);
  const index = new MiniSearch({
    fields: ["title", "content", "relativePath"], // fields to index for full-text search
    storeFields: ["id", "title", "content", "relativePath", "excerpt"],
  });

  //.vitepressフォルダを検索
  const cliArgs = process.argv.slice(2);
  //NOTE: "npm run dev docs"のように実行した場合、cliArgs[0]は"dev"になる
  let pathPrefix = process.cwd();
  if (cliArgs.length >= 2) {
    const targetPathPrefix = cliArgs[1];
    pathPrefix = path.resolve(process.cwd(), targetPathPrefix);
  }

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
