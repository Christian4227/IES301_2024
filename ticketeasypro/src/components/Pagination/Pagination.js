const Pagination = ({ totalPages, currentPage, onPageChange }) => {
	const maxPagesToShow = 7;

	const getPageNumbers = () => {
		let pages = [];
		const halfRange = Math.floor(maxPagesToShow / 2);

		if (totalPages <= maxPagesToShow) {
			pages = Array.from({ length: totalPages }, (_, i) => i + 1);
		} else {
			if (currentPage <= halfRange + 1) {
				pages = [...Array(maxPagesToShow - 2).keys()].map(x => x + 1);
				pages.push('...');
				pages.push(totalPages);
			} else if (currentPage >= totalPages - halfRange) {
				pages = [1, '...'];
				pages.push(...Array.from({ length: maxPagesToShow - 2 }, (_, i) => totalPages - (maxPagesToShow - 3) + i));
			} else {
				pages = [1, '...'];
				pages.push(...Array.from({ length: maxPagesToShow - 4 }, (_, i) => currentPage - halfRange + 1 + i));
				pages.push('...');
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<nav aria-label="Page navigation example" className="flex justify-end">
			<ul className="pagination flex list-none pl-0 rounded my-2">
				<li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
					<button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
						Anterior
					</button>
				</li>
				{pageNumbers.map((page, index) => (
					<li key={index} className={`page-item ${page === currentPage ? 'active' : ''}`}>
						{page === '...' ? (
							<span className="page-link">...</span>
						) : (
							<button className="page-link" onClick={() => onPageChange(page)}>
								{page}
							</button>
						)}
					</li>
				))}
				<li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
					<button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
						Próximo
					</button>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;