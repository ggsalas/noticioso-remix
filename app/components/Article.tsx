export default function Article({ content, onGoNextItem }: any) {
  const { title, description, pubDate, link } = content;

  return (
    <article className="Article">
      <div className="Article__columns">
        <h2>{title}</h2>
        <button onClick={onGoNextItem}>Next</button>
        <div dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </article>
  );
}
