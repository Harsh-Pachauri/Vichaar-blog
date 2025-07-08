import React from 'react';
import '../../Css/Pagination.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { TiMinus } from 'react-icons/ti';

const Pagination = ({ page, pages, changePage }) => {
  // Guard clause: Don't render anything if pages is invalid
  if (!pages || pages <= 1 || !Number.isInteger(pages)) return null;

  function numberRange(start, end) {
    const length = end - start;
    if (length <= 0) return [];
    return Array.from({ length }, (_, i) => i + start);
  }

  let middlePagination;

  if (pages <= 5) {
    middlePagination = [...Array(pages)].map((_, index) => (
      <button
        key={index + 1}
        onClick={() => changePage(index + 1)}
        disabled={page === index + 1}
      >
        {index + 1}
      </button>
    ));
  } else {
    const startValue = Math.floor((page - 1) / 5) * 5;

    if (page > 5) {
      if (pages - page >= 5) {
        middlePagination = (
          <>
            <button onClick={() => changePage(1)}>1</button>
            <button disabled>...</button>
            <button onClick={() => changePage(startValue)}>{startValue}</button>
            {numberRange(startValue, startValue + 5).map((num) => (
              <button
                key={num}
                onClick={() => changePage(num)}
                disabled={page === num}
              >
                {num}
              </button>
            ))}
            <button disabled>...</button>
            <button onClick={() => changePage(pages)}>{pages}</button>
          </>
        );
      } else {
        let rangeStart = pages - 5 <= 1 ? 1 : pages - 5;
        middlePagination = (
          <>
            <button onClick={() => changePage(1)}>1</button>
            <button disabled>...</button>
            {numberRange(rangeStart, pages + 1).map((num) => (
              <button
                key={num}
                onClick={() => changePage(num)}
                disabled={page === num}
              >
                {num}
              </button>
            ))}
          </>
        );
      }
    } else {
      middlePagination = (
        <>
          {numberRange(1, 6).map((num) => (
            <button
              key={num}
              onClick={() => changePage(num)}
              disabled={page === num}
            >
              {num}
            </button>
          ))}
          <button disabled>...</button>
          <button onClick={() => changePage(pages)}>{pages}</button>
        </>
      );
    }
  }

  return (
    <div className="pagination">
      <button
        className="pagination__prev"
        onClick={() => changePage(page - 1)}
        disabled={page === 1}
      >
        {page === 1 ? <TiMinus color="gray" /> : <FaChevronLeft />}
      </button>

      {middlePagination}

      <button
        className="pagination__next"
        onClick={() => changePage(page + 1)}
        disabled={page === pages}
      >
        {page === pages ? <TiMinus color="gray" /> : <FaChevronRight />}
      </button>
    </div>
  );
};

export default Pagination;
