type Mode = "percentage" | "pages";

interface NavigationBarProps {
  mode: Mode;
  totalPagesArray: string[];
  page: number;
  readPercentage: number;
}

export default function NavigationBar({
  mode,
  totalPagesArray,
  page,
  readPercentage,
}: NavigationBarProps) {
  if (mode === "pages") {
    return (
      <>
        <div className="NavigationBar__footerInfo">{`página ${page}`}</div>
        <div className="NavigationBar__readPages">
          {totalPagesArray.map((_, i) => (
            <div
              key={i}
              className={
                i + 1 === page
                  ? "NavigationBar__page-current"
                  : "NavigationBar__page"
              }
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="NavigationBar__footerInfo">{readPercentage}%</div>
      <div className="NavigationBar__readPercentage">
        <div
          className="NavigationBar__readPercentageBar"
          style={{ width: `${readPercentage}%` }}
        />
      </div>
    </>
  );
}
