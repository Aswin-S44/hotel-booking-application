import clsx from "clsx";
import { useEffect, useState } from "react";
import { FaArrowUpLong } from "react-icons/fa6";

const BackToTop = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      key="back-to-top-node"
      className={clsx("back-top", {
        "back-top-show": showScrollTop,
      })}
      style={{ cursor: "pointer" }}
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    >
      <span className="back-top-icon" style={{ pointerEvents: "none" }}>
        <FaArrowUpLong />
      </span>
    </div>
  );
};

export default BackToTop;
