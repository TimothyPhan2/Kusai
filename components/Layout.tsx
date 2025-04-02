import { BODY, HEAD, HTML, LINK, META, SCRIPT, TITLE } from "@fartlabs/htx";

export interface LayoutProps {
  children?: string[];
}

export function Layout({ children }: LayoutProps) {
  return "<!DOCTYPE html>" + (
    <HTML>
      <HEAD>
        <META charset="UTF-8" />
        <TITLE>Anime Song Quiz</TITLE>
        <META
          name="description"
          content="Test your anime music knowledge!"
        />
        <LINK
          rel="stylesheet"
          type="text/css"
          href="https://css.fart.tools"
        />
        <SCRIPT>
          {`
            console.log('Page loaded');
            window.onerror = function(msg, url, line) {
              console.error('Error:', msg);
              console.error('URL:', url);
              console.error('Line:', line);
              return false;
            };
          `}
        </SCRIPT>
      </HEAD>
      <BODY>
        {children?.join("")}
      </BODY>
    </HTML>
  );
}
