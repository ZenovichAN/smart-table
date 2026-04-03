export function initPagination(elements, createPage) {
    const {pages, fromRow, toRow, totalRows} = elements;
    let pageCount;

    const getPages = (current, total, visibleCount) => {
        const half = Math.floor(visibleCount / 2);
        let start = Math.max(1, current - half);
        let end = Math.min(total, start + visibleCount - 1);

        start = Math.max(1, end - visibleCount + 1);

        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }

        return result;
    };

    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.firstElementChild.remove();

    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;

        if (action) switch(action.name) {
            case 'prev': page = Math.max(1, page - 1); break;
            case 'next': page = Math.min(pageCount, page + 1); break;
            case 'first': page = 1; break;
            case 'last': page = pageCount; break;
        }

        return Object.assign({}, query, {
            limit,
            page
        });
    }

    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);

        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));

        fromRow.textContent = (page - 1) * limit + 1;
        toRow.textContent = Math.min((page * limit), total);
        totalRows.textContent = total;
    }

    return {
        updatePagination,
        applyPagination
    };
}