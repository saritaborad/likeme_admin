import React, {useEffect, useState} from 'react'
import './tablestylenew.scss'

export default function RtdDatatableNew(props) {
  const [option, set_option] = useState(props.option)
  const [timer, setTimer] = useState(null)
  const [data, set_Data] = useState(props.data)
  const [columns, set_columns] = useState(props.columns)
  const [size_per_page, set_size_per_page] = useState([10, 25, 50, 100, 250])
  const [currentPage, setCurrentPage] = useState(props.option.page)
  const [allChecked, setAllChecked] = useState(false)
  const [items, setItems] = useState([])
  const [draggedIndex, setDraggedIndex] = useState(null)
  const pagearray = Array.from({length: Math.ceil((option.totalRecord || 0) / option.sizePerPage)}, (_, i) => i + 1)
  const pageRange = 3
  const pages = pagearray.slice(currentPage - pageRange < 0 ? 0 : currentPage - pageRange, currentPage + pageRange > pagearray.length ? pagearray.length : currentPage + pageRange + 1)

  useEffect(() => {
    set_option(props.option)
    set_Data(props.data)
    set_columns(props.columns)
    set_size_per_page([10, 25, 50, 100, 250])
  }, [props.option, props.data, props.columns])

  const tableCall = (e) => {
    let value = e.target.value
    let name = e.target.name
    let tmp_option = option
    tmp_option['page'] = 1
    if (value !== '') {
      tmp_option[name] = parseInt(value)
      set_option(tmp_option)
      props.tableCallBack(tmp_option)
    }
  }
  const search_object_change = (e, field) => {
    console.log(e.target)
    let tmp_option = option
    let temp_search = tmp_option.search
    temp_search[field.value] = e.target.value
    let name = e.target.name
    let value = e.target.value
    let column = field.value
    tmp_option['search'] = temp_search
    set_option(tmp_option)
    if (name === 'search') {
      if (timer) {
        clearTimeout(timer)
        setTimer(null)
      }
      setTimer(
        setTimeout(() => {
          let temp = {column_name: value}
          let temp_2 = {}
          temp_2[`${column}`] = temp['column_name']
          delete temp['column_name']
          props.tableCallBack(tmp_option)
        }, 1000)
      )
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
    tmp_option['page'] = pageNumber
    set_option(tmp_option)
    props.tableCallBack(tmp_option)
    setCurrentPage(pageNumber)
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
      <div className='table-outer-border-class'>
        <div className='row align-items-center custom-table-hdr text-center'>
          {option?.showSearch && (
            <div className='col-md-4 ms-auto pt-3 pt-md-0'>
              <div className='position-relative seacrh-icon-right'>
                <input type='search' name='search' className='form-control' onChange={tableCall} placeholder='Search ...' />
                <svg width='19' height='19' viewBox='0 0 19 19' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path d='M7.95473 1C6.57921 1 5.23459 1.40787 4.09089 2.17204C2.94719 2.93622 2.05579 4.02236 1.5294 5.29313C1.00301 6.5639 0.865287 7.96222 1.13364 9.31126C1.40199 10.6603 2.06436 11.8995 3.03699 12.8721C4.00963 13.8447 5.24884 14.507 6.59793 14.7754C7.94701 15.0437 9.34538 14.906 10.6162 14.3796C11.887 13.8533 12.9732 12.9619 13.7374 11.8182C14.5016 10.6746 14.9095 9.32997 14.9095 7.9545C14.9093 6.11009 14.1766 4.34125 12.8723 3.03706C11.5681 1.73286 9.7992 1.00012 7.95473 1V1Z' stroke='#5e5873' strokeWidth='1.875' strokeMiterlimit='10' />
                  <path d='M13.143 13.1431L18.0001 18' stroke='#5e5873' strokeWidth='1.875' strokeMiterlimit='10' strokeLinecap='round' />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className='table-responsive table-custom-info rtd-table-main-div'>
          <table className='table mb-0'>
            <thead>
              <tr>
                {columns?.map((column, i) => {
                  return column.options['sort'] ? (
                    <th key={i} className={column.options.class ? column.options.class : ''}>
                      <div onClick={() => sortHandler(column.value)}>
                        {column.label}
                        {column.value !== option['sort'] ? (
                          <>
                            <button type='button' className='border-0 bg-transparent p-0 sorting-top'>
                              <svg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M5 0.5L10 5.5H0L5 0.5Z' fill='#5E5873' />
                              </svg>
                            </button>
                            <button type='button' className='border-0 bg-transparent p-0 sorting-bottom'>
                              <svg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path d='M5 5.5L10 0.5H0L5 5.5Z' fill='#5E5873' />
                              </svg>
                            </button>
                          </>
                        ) : column.value === option['sort'] && option['order'] === 'ASC' ? (
                          <button type='button' className='border-0 bg-transparent p-0 sorting-top'>
                            <svg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'>
                              <path d='M5 0.5L10 5.5H0L5 0.5Z' fill='#5E5873' />
                            </svg>
                          </button>
                        ) : (
                          <button type='button' className='border-0 bg-transparent p-0 sorting-bottom'>
                            <svg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'>
                              <path d='M5 5.5L10 0.5H0L5 5.5Z' fill='#5E5873' />
                            </svg>
                          </button>
                        )}
                      </div>
                      <div>
                        {column.options.search && (
                          <div className='d-md-flex align-items-center ms-auto mt-2 pt-md-0 seacrh-icon-right'>
                            <input type='search' name='search' className='form-control w-100' value={option?.search[column?.value] ? option?.search[column?.value] : ''} onChange={(e) => search_object_change(e, column)} placeholder='Search ...' />
                          </div>
                        )}
                      </div>
                    </th>
                  ) : (
                    <th key={i} className={column.options.class ? column.options.class : ''}>
                      <span className='content' dangerouslySetInnerHTML={{__html: column.label}} />
                      {column.options.search && (
                        <div className='d-md-flex align-items-center ms-auto mt-2 pt-md-0 seacrh-icon-right'>
                          <input type='search' name='search' className='form-control  w-100' value={option.search[column.value] ? option.search[column.value] : ''} onChange={(e) => search_object_change(e, column)} placeholder='Search ...' />
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((val, i) => {
                  let no = i + 1 + option.sizePerPage * (option.page - 1)
                  return (
                    <tr key={i}>
                      {columns.map((col, index) => {
                        return (
                          <td key={index} className={col.options.class ? col.options.class : ''}>
                            {col.options.customBodyRender ? col.options.customBodyRender(data, i, no) : data[i][col.value]}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              ) : (
                <tr className='p-md-5 p-3 m-md-5 text-center'>
                  <td colSpan={columns.length}>
                    <p className='text-center'>Sorry, no matching records found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className='row align-items-center m-0 custom-table-btm text-center'>
          {option.totalRecord > 0 && (
            <div className='col-12 p-0'>
              <div className='d-sm-flex align-items-center text-center'>
                <div className='custom-table-page text-sm-start'>
                  Showing {parseInt((option.page - 1) * option.sizePerPage + 1)} to {parseInt((option.page - 1) * option.sizePerPage + option.sizePerPage) > option.totalRecord ? option.totalRecord : parseInt((option.page - 1) * option.sizePerPage + option.sizePerPage)} of {option.totalRecord} entries
                </div>
                <div className='ms-auto d-sm-flex align-items-center mt-3 mt-sm-0'>
                  <div className='me-3'>
                    <label className='d-flex align-items-center custom-select-label'>
                      Show
                      <select name='sizePerPage' className='form-select form-control mx-2' defaultValue={option.sizePerPage} onChange={(e) => tableCall(e)}>
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
                  </div>
                  <div className='pagination-custom-info mt-3 mt-sm-0 d-flex align-items-center'>
                    <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} style={{cursor: 'pointer'}}>
                      <span aria-hidden='true' style={{cursor: 'pointer'}}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='18px' height='18px' viewBox='0 0 24 24' fill='none' stroke='#000' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='feather feather-chevron-left'>
                          <polyline points='15 18 9 12 15 6'></polyline>
                        </svg>
                      </span>
                    </button>
                    {pages.map((page, index) => (
                      <div onClick={() => handlePageChange(page)} key={index} className={currentPage == page ? 'page-item-main active' : 'page-item-main'} style={{cursor: 'pointer'}}>
                        {page}
                      </div>
                    ))}
                    <button disabled={Math.ceil(option.totalRecord / option.sizePerPage) <= currentPage} onClick={() => handlePageChange(currentPage + 1)} style={{cursor: 'pointer'}}>
                      <span aria-hidden='true' style={{cursor: 'pointer'}}>
                        <svg xmlns='http://www.w3.org/2000/svg' width='18px' height='18px' viewBox='0 0 24 24' fill='none' stroke='#000' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='feather feather-chevron-right'>
                          <polyline points='9 18 15 12 9 6'></polyline>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  )
}
