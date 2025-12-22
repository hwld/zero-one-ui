/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },

  // これを指定することで、`/todo-2.html`ではなく`/todo-2/index.html`のようなファイルが生成され、
  // firebase hostingで`/todo-2`にアクセスすると`/todo-2/index.html`が返ってくるようになる。
  // が、メタデータは`/todo-2/index.txt`に存在するのだが、next.jsは`/todo-2.txt`を読むため、404エラーになる。
  // (https://github.com/vercel/next.js/issues/59986#issuecomment-1902073854)
  // そこで、このオプションは使用せず、firebase hostingのcleanUrlsを使用して、ファイルをアップロードするときにhtml拡張子を削除し、
  // `/todo-2`にアクセスしたときに`/todo-2`を返すようにする
  // trailingSlash: true,
};

module.exports = nextConfig;
