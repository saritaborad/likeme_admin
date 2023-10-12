import React, {useEffect, useState} from 'react'
import ReactPaginate from 'react-paginate'
import './tablestyle.scss'

export default function RtdDatatable(props) {
  const [option, set_option] = useState(props.option)
  const [data, set_Data] = useState(props.data)
  const [columns, set_columns] = useState(props.columns)
  const [size_per_page, set_size_per_page] = useState([10, 25, 50, 100])
  const [currentPage, setCurrentPage] = useState(1)
  const [allChecked, setAllChecked] = useState(false)
  const [items, setItems] = useState([])
  const [draggedIndex, setDraggedIndex] = useState(null)

  useEffect(() => {
    set_option(props.option)
    set_Data(props.data)
    setItems(props.data)
    set_columns(props.columns)
    set_size_per_page([10, 25, 50, 100])
  }, [props.option, props.data, props.columns])

  const tableCall = (e) => {
    let value = e.target.value
    let name = e.target.name
    let tmp_option = option
    if (name === 'search') {
      if (value !== '' && value.length > 0) {
        tmp_option[name] = value
      } else {
        tmp_option[name] = ''
      }
      set_option(tmp_option)
      props.tableCallBack(tmp_option)
    } else {
      if (value !== '') {
        tmp_option[name] = parseInt(value)
        tmp_option['page'] = 1
        set_option(tmp_option)
        props.tableCallBack(tmp_option)
      }
    }
  }

  const sortHandler = (field) => {
    let tmp_option = option
    if (field === tmp_option['sort']) {
      tmp_option['order'] === 'DESC' ? (tmp_option['order'] = 'ASC') : (tmp_option['order'] = 'DESC')
    } else {
      tmp_option['order'] = 'ASC'
      tmp_option['sort'] = field
    }
    set_option(tmp_option)
    props.tableCallBack(tmp_option)
  }

  const handlePageChange = (pageNumber) => {
    let tmp_option = option
    tmp_option['page'] = pageNumber['selected'] + 1
    setCurrentPage(pageNumber['selected'] + 1)
    set_option(tmp_option)
    props.tableCallBack(tmp_option)
  }

  const handleAllCheck = (isChecked) => {
    setAllChecked(isChecked)
    const newItems = items.map((item) => ({...item, checked: isChecked}))
    setItems(newItems)
    props.checkboxCallback(newItems)
  }

  const handleItemCheck = (isChecked, currentItem) => {
    const newItems = items.map((item) => (item._id === currentItem._id ? {...item, checked: isChecked} : item))
    setItems(newItems)
    const allChecked = newItems.every((item) => item.checked)
    setAllChecked(allChecked)
    props.checkboxCallback(newItems)
  }

  const handleDragStart = (index, e) => {
    const dragImg = new Image()
    // dragImg.src = process.env.PUBLIC_URL + '/media/drag.png'

    const xOffset = dragImg.width / 2
    const yOffset = dragImg.height / 2

    e.dataTransfer.setDragImage(dragImg, xOffset, yOffset)
    setDraggedIndex(index)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (targetIndex) => {
    if (draggedIndex !== null) {
      const updatedData = [...data]
      const [draggedItem] = updatedData.splice(draggedIndex, 1)
      updatedData.splice(targetIndex, 0, draggedItem)
      setDraggedIndex(null)
      set_Data(updatedData)
      props.onDrop(updatedData)
    }
  }

  return (
    option && (
      <div className=''>
        {option.entries && (
          <div className='d-sm-flex align-items-center custom-table-hdr text-center'>
            <label className='d-flex align-items-center custom-select-label'>
              Show
              <select name='sizePerPage' className='form-select mx-2' defaultValue={option.sizePerPage} onChange={tableCall}>
                {size_per_page.map((val, i) => {
                  return (
                    <option key={i} value={val}>
                      {val}
                    </option>
                  )
                })}
              </select>
              entries
            </label>
            {props?.option?.showSearch && (
              <div className='ms-auto pt-3 pt-sm-0'>
                <div className='position-relative seacrh-icon-right'>
                  <input type='search' name='search' className='form-control' onChange={tableCall} placeholder='Search ...' />
                  <svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M13.7854 12.5103L10.6117 9.38471C11.3758 8.38292 11.7883 7.16353 11.7869 5.91059C11.7869 2.71021 9.14306 0.106445 5.89344 0.106445C2.64382 0.106445 0 2.71021 0 5.91059C0 9.11098 2.64382 11.7147 5.89344 11.7147C7.16566 11.7161 8.4038 11.3099 9.421 10.5574L12.5947 13.683C12.7554 13.8244 12.9649 13.8999 13.1803 13.894C13.3957 13.8881 13.6006 13.8011 13.753 13.6511C13.9054 13.501 13.9936 13.2992 13.9997 13.0871C14.0057 12.8749 13.929 12.6686 13.7854 12.5103ZM1.68384 5.91059C1.68384 5.09063 1.93073 4.28907 2.39329 3.6073C2.85584 2.92552 3.51329 2.39414 4.2825 2.08035C5.0517 1.76657 5.89811 1.68447 6.71469 1.84443C7.53127 2.0044 8.28135 2.39925 8.87008 2.97905C9.4588 3.55886 9.85972 4.29757 10.0222 5.10178C10.1846 5.90599 10.1012 6.73958 9.7826 7.49713C9.46399 8.25467 8.92443 8.90216 8.23217 9.35771C7.5399 9.81326 6.72602 10.0564 5.89344 10.0564C4.7774 10.0551 3.70745 9.61788 2.91828 8.84067C2.12912 8.06346 1.68518 7.00973 1.68384 5.91059Z'
                      fill='#7B838A'
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}
        <div className='table-responsive rtd-table-main-div'>
          <table className='table mb-0'>
            <thead>
              <tr>
                {option.checkbox && (
                  <th>
                    <div className='custom-checkbox'>
                      <label className='custom-lbl-part'>
                        <input type='checkbox' id='' onChange={(e) => handleAllCheck(e.target.checked)} checked={allChecked} />
                        <span className='custom-checkbox-class'></span>
                      </label>
                    </div>
                  </th>
                )}

                {columns?.map((column, i) => {
                  return column.options['sort'] ? (
                    <th key={i} onClick={() => sortHandler(column.value)}>
                      {column.label}
                      {column?.options?.sort &&
                        (column.value !== option['sort'] ? (
                          <>
                            <button type='button' className='border-0 bg-transparent p-0 sorting-top'>
                              <svg width='10' height='7' viewBox='0 0 10 7' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M0 4.95L1.413 6.365L1.414 6.364L4.95 2.829L8.486 6.363L9.894 4.955L4.95 0L0 4.95Z' fill='#7B838A' />
                              </svg>
                            </button>
                            <button type='button' className='border-0 bg-transparent p-0 sorting-bottom'>
                              <svg width='10' height='7' viewBox='0 0 10 7' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M4.94988 6.80055L0.00488281 1.84455L1.41288 0.435547L4.94988 3.97055L8.48488 0.435547L9.89988 1.84955L4.94988 6.80055Z' fill='#7B838A' />
                              </svg>
                            </button>
                          </>
                        ) : column.value === option['sort'] && option['order'] === 'ASC' ? (
                          <button type='button' className='border-0 bg-transparent p-0 sorting-top'>
                            <svg width='10' height='7' viewBox='0 0 10 7' fill='none' xmlns='http://www.w3.org/2000/svg'>
                              <path d='M0 4.95L1.413 6.365L1.414 6.364L4.95 2.829L8.486 6.363L9.894 4.955L4.95 0L0 4.95Z' fill='#7B838A' />
                            </svg>
                          </button>
                        ) : (
                          <button type='button' className='border-0 bg-transparent p-0 sorting-bottom'>
                            <svg width='10' height='7' viewBox='0 0 10 7' fill='none' xmlns='http://www.w3.org/2000/svg'>
                              <path d='M4.94988 6.80055L0.00488281 1.84455L1.41288 0.435547L4.94988 3.97055L8.48488 0.435547L9.89988 1.84955L4.94988 6.80055Z' fill='#7B838A' />
                            </svg>
                          </button>
                        ))}
                    </th>
                  ) : (
                    <th key={i}>{column.label}</th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {items?.length > 0 ? (
                items.map((val, i) => {
                  return (
                    <tr key={i} draggable onDragStart={(e) => handleDragStart(i, e)} onDragOver={handleDragOver} onDrop={() => handleDrop(i)}>
                      {option.checkbox && (
                        <td>
                          <div className='custom-checkbox'>
                            <label className='custom-lbl-part'>
                              <input type='checkbox' id={`checkbox-${i}`} onChange={(e) => handleItemCheck(e.target.checked, val)} checked={val.checked} />
                              <span className='custom-checkbox-class'></span>
                            </label>
                          </div>
                        </td>
                      )}
                      {columns.map((col, index) => {
                        return <td key={index}>{col.options.customBodyRender ? col.options.customBodyRender(data, i) : data[i][col.value]}</td>
                      })}
                    </tr>
                  )
                })
              ) : (
                <tr className='p-md-5 p-3 m-md-5 '>
                  <td colSpan={columns.length}>
                    <p className='text-center'>Sorry, no matching records found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className=''>
          {option.totalRecord > 0 && (
            <div className='row align-items-center custom-table-btm text-center'>
              <div className='col-md-4 text-md-start p-0'>
                <div className='custom-table-page'>
                  Showing {parseInt((currentPage - 1) * option.sizePerPage + 1)} to {parseInt((currentPage - 1) * option.sizePerPage + option.sizePerPage) > option.totalRecord ? option.totalRecord : parseInt((currentPage - 1) * option.sizePerPage + option.sizePerPage)} of {option.totalRecord} entries
                </div>
              </div>

              <div className='col-md-8 pt-3 pt-md-0 ms-md-auto text-md-end text-center p-0'>
                <div className='pagination-custom-info'>
                  <ReactPaginate
                    className='pagination justify-content-md-end justify-content-center'
                    pageClassName='page-item'
                    activeClassName='active'
                    breakLabel='...'
                    breakLinkClassName='page-link'
                    breakClassName='page-item'
                    previousLabel={
                      <span aria-hidden='true'>
                        <svg width='6' height='10' viewBox='0 0 6 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path fillRule='evenodd' clipRule='evenodd' d='M5.70711 0.292893C6.09763 0.683417 6.09763 1.31658 5.70711 1.70711L2.41421 5L5.70711 8.29289C6.09763 8.68342 6.09763 9.31658 5.70711 9.70711C5.31658 10.0976 4.68342 10.0976 4.29289 9.70711L0.292893 5.70711C-0.0976311 5.31658 -0.0976311 4.68342 0.292893 4.29289L4.29289 0.292893C4.68342 -0.0976311 5.31658 -0.0976311 5.70711 0.292893Z' fill='#333333' />
                        </svg>
                      </span>
                    }
                    previousClassName='page-item'
                    nextLabel={
                      <span aria-hidden='true'>
                        <svg width='6' height='10' viewBox='0 0 6 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path fillRule='evenodd' clipRule='evenodd' d='M0.292894 9.70711C-0.0976307 9.31658 -0.0976307 8.68342 0.292894 8.29289L3.58579 5L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683418 0.292893 0.292894C0.683417 -0.0976312 1.31658 -0.0976312 1.70711 0.292894L5.70711 4.29289C6.09763 4.68342 6.09763 5.31658 5.70711 5.70711L1.70711 9.70711C1.31658 10.0976 0.683418 10.0976 0.292894 9.70711Z' fill='#333333' />
                        </svg>
                      </span>
                    }
                    nextClassName='page-item'
                    pageLinkClassName='page-link'
                    pageRangeDisplayed={2}
                    onPageActive={option.page}
                    pageCount={Math.ceil(option.totalRecord / option.sizePerPage)}
                    renderOnZeroPageCount={null}
                    onPageChange={handlePageChange.bind()}
                    forcePage={0}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  )
}
