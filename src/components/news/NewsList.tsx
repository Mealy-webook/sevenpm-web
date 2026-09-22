import type { NewsArticle } from "@/data/news";
import { NewsCard } from "@/components/news/NewsCard";

/**
 * The newsroom index (Figma 2231:12108).
 *
 * Six tiles on a three-column grid, 32px apart — which lands each one at
 * 403px on the 1272 column, the same width the homepage gives a news
 * photograph. No cards, no fills and no category chips: the comp strips the
 * index back to the photograph, the date and the headline.
 */
export function NewsList({ articles }: { articles: NewsArticle[] }) {
  return (
    <ul
      className="m-0 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 xl:grid-cols-3"
      data-reveal="up"
      data-reveal-stagger
    >
      {articles.map((article, index) => (
        <li key={article.slug}>
          <NewsCard article={article} priority={index < 3} />
        </li>
      ))}
    </ul>
  );
}
