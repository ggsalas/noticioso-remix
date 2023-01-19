import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_URL =
  "https://www.perfil.com/noticias/sociedad/para-los-fiscales-los-testimonios-de-los-acusados-son-insuficientes-y-no-logran-refutar-las-pruebas-en-su-contra.phtml";

export default function Articles() {
  const navigate = useNavigate();
  const [url, setUrl] = useState<string>(DEFAULT_URL);

  const readArticleHandler = () => {
    const encodedUrl = encodeURIComponent(url);

    navigate(`/articles/${encodedUrl}`);
  };

  return (
    <div>
      <input
        type="text"
        onChange={(e) => setUrl(e.target.value)}
        defaultValue={DEFAULT_URL}
      />

      <button type="button" onClick={readArticleHandler}>
        Read Article
      </button>
    </div>
  );
}
