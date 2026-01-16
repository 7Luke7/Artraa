// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="ka">
        <head>
          <meta charset="utf-8" />
          <meta property="og:site_name" content="Artra" />
          <meta property="og:locale" content="ka_GE" />
          <meta name="language" content="Georgian" />
          <meta name="author" content="Artra" />
          <meta property="og:type" content="website" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
), {mode: 'async'});
