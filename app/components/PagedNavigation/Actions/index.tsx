import { Link, useParams } from "@remix-run/react";
import { useState } from "react";
import { FontSet } from "../../FontSet";

interface ActionsProps {
  onGoToParent?: () => void;
  toggleActions: () => void;
}

export default function Actions({ onGoToParent, toggleActions }: ActionsProps) {
  const [clipboardNotification, setClipboardNotification] = useState(false);
  const { articleUrl } = useParams();

  function onCopyUrl() {
    navigator?.clipboard?.writeText(window.location.href);
    setClipboardNotification(true);
    setTimeout(() => setClipboardNotification(false), 2000);
  }

  return (
    <div className="Actions">
      <div className="Actions__menu">
        <div className="Actions__menuBar">
          {onGoToParent ? (
            <button onClick={onGoToParent}>{`< Back`}</button>
          ) : (
            <div />
          )}
          <div className="Actions__menuBar-right">
            {onGoToParent && (
              <a href={articleUrl} rel="noopener noreferrer" target="_blank">
                Original &#x2197;
              </a>
            )}
            <div className="Actions__menuBar-clipboard-container">
              <button onClick={onCopyUrl}>&#128279;</button>
              {clipboardNotification && (
                <div className="Actions__menuBar-clipboard">
                  Página copiada al portapapeles!
                </div>
              )}
            </div>
            <FontSet />
          </div>
        </div>
      </div>
      <div className="Actions__home" onClick={toggleActions} />
    </div>
  );
}
