import DefaultTheme from "vitepress/theme";
import { theme, useOpenapi } from "vitepress-openapi/client";
import "vitepress-openapi/dist/style.css";

import spec from "../../public/openapi.json";

export default {
  extends: DefaultTheme,
  async enhanceApp({ app }) {
    useOpenapi({
      spec,
    });

    theme.enhanceApp({ app });
  },
};
