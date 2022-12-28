import React from 'react'

export default function Pagination({ totalResult, postPerPage, setCurrentPage }) {

  const pages = []

  for (let index = 1; index <= Math.ceil(totalResult / postPerPage); index++) {
    pages.push(index)

  }
  return <>
    <nav aria-label="Page navigation example">
      <ul className="pagination justify-content-center">
        <li className="page-item disabled">
          <a className="page-link">Previous</a>
        </li>
        {
          pages.map((page, index) => {
            return (
              <li key={index} onClick={() => { setCurrentPage(page) }} className="page-item"><a className="page-link" href="#">{page}</a></li>
            )
          })
        }
        <li className="page-item">
          <a className="page-link" href="#">Next</a>
        </li>
      </ul>
    </nav>
  </>
}
