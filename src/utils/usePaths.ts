import path from "node:path";

/**
 * Get the path prefix for the VitePress project.
 * @returns
 * @private
 */
export function getPathPrefix() {
  //.vitepressフォルダを検索
  const cliArgs = process.argv.slice(2);
  //NOTE: "npm run dev docs"のように実行した場合、cliArgs[0]は"dev"になる
  let pathPrefix = process.cwd();
  if (cliArgs.length >= 2) {
    const targetPathPrefix = cliArgs[1];
    pathPrefix = path.resolve(process.cwd(), targetPathPrefix);
  }
  return pathPrefix;
}
