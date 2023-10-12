import React, {useState, useEffect} from 'react'
import RtdDatatable from '../Common/DataTable/DataTable'
import {fetchAllSortPurchased, notiSortPurchased} from '../ApiService/_requests'
import {Modal} from 'react-bootstrap'
import SendMessage from '../Modals/sendMessage'
import {toast} from 'react-toastify'

const TopPurchase = () => {
  const [purchase, setPurchase] = useState()
  const [show, setShow] = useState(false)
  const [userId, setUserId] = useState('')

  const [option, set_option] = useState({
    sizePerPage: 10,
    totalRecord: 10,
    page: 1,
    sort: 'createdAt',
    order: 'ASC',
    entries: true,
    showSearch: true,
    checkbox: false,
  })

  const columns = [
    {
      value: 'user.fullName',
      label: 'User Name',

      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.user?.fullName}</div>
        },
      },
    },

    {
      value: 'email',
      label: 'Email',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.user?.email}</div>
        },
      },
    },
    {
      value: 'diamond',
      label: 'Total Diamond',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.diamond_}</div>
        },
      },
    },
    {
      value: 'count',
      label: 'Purchase count',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.count}</div>
        },
      },
    },

    {
      value: 'action',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return (
            <button
              type='button'
              className='btn btn-dark noty'
              onClick={() => {
                setShow(true)
                setUserId(data[i]?.user?._id)
              }}
            >
              Send &nbsp; <i className='fas fa-bell' />
            </button>
          )
        },
      },
    },
  ]

  useEffect(() => {
    getAllSpendHistory(option)
  }, [])

  const getAllSpendHistory = async (option?: any) => {
    const {data} = await fetchAllSortPurchased()
    setPurchase(data)
  }

  const submitFormData = async (formData: any) => {
    const {data} = await notiSortPurchased({...formData, _id: userId})
    setShow(false)
    if (data.status === 200) {
      toast.success(data.message)
    }
  }

  const tableCallBack = (option: any) => {
    set_option(option)
  }

  const appModalClose = () => setShow(false)

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-12 d-flex'>
          <div className='mb-3'>
            <h1>Most Purchases User</h1>
          </div>
        </div>
      </div>
      <div className='col-12'>
        <div className='table-custom-info'>
          <RtdDatatable data={purchase} columns={columns} option={option} tableCallBack={tableCallBack} />
        </div>
      </div>
      <Modal show={show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
        <SendMessage submitFormData={submitFormData} appModalClose={appModalClose} />
      </Modal>
    </div>
  )
}

export default TopPurchase
