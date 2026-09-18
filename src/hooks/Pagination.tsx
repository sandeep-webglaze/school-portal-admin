import { useMemo, useState } from 'react';

function usePagination(data: any[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const [srno, setSrno] = useState(1);
  const maxPage = Math.ceil(data.length / itemsPerPage);

  const currentData = useMemo(() => {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    setSrno(begin);
    return data.slice(begin, end);
  }, [data, itemsPerPage, currentPage]);

  function next() {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }

  function prev() {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  function jump(page: number) {
    const pageNumber = Math.max(1, page);
    setCurrentPage((currentPage) => Math.min(pageNumber, maxPage));
  }

  return { next, prev, srno, jump, currentData, currentPage, maxPage };
}

export default usePagination;
