export default function Article({
  articleId,
  kdb,
  lang,
}: {
  articleId: string;
  kdb: any;
  lang: "json" | "yaml";
}) {
  const article = kdb[articleId] || fallbackArticle;

  const html = [
    article ? article.description.text : "",
    partToText(article.example, lang),
    partToText(article.exploit, lang),
    partToText(article.remediation, lang),
  ].join("");

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function partToText(part: any, lang: "json" | "yaml"): string {
  if (!part || !part.sections) {
    return "";
  }

  return part.sections
    .map((section: any) => {
      if (section.text) {
        return section.text;
      }
      if (section.code) {
        const code = section.code[lang];
        return `<pre>${code}</pre>`;
      }
    })
    .join("");
}

const fallbackArticle = {
  description: {
    text: `<p>Whoops! Looks like there has been an oversight and we are missing a page for this issue.</p>
           <p><a href="https://apisecurity.io/contact-us/">Let us know</a> the title of the issue, and we make sure to add it to the encyclopedia.</p>`,
  },
};
