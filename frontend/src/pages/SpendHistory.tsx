import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {fetchAllSpendHistory} from '../ApiService/_requests'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
import Loader from '../Images/loader.gif'

const SpendHistory: React.FC = () => {
  const [spendHistory, setSpendHistory] = useState<any>()
  const [loader, setLoader] = useState(true)
  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})
  const {state}: any = useLocation()

  const columns = [
    {
      value: 'spendIn',
      label: 'Spend In',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.spendIn}</div>
        },
      },
    },
    {
      value: 'caller',
      label: 'Caller',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.caller}</div>
        },
      },
    },

    {
      value: 'host',
      label: 'Host',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className=''>{data[i]?.host}</div>
        },
      },
    },
    {
      value: 'credit',
      label: 'Credit',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className=''>{data[i]?.credit}</div>
        },
      },
    },
    {
      value: 'debit',
      label: 'Debit',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className=''>{data[i]?.debit}</div>
        },
      },
    },
    {
      value: 'payment',
      label: 'Payment',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className={data[i]?.payment == 'Debit' ? `badge badge-danger` : `badge badge-success`}>{data[i]?.payment}</div>
        },
      },
    },
    {
      value: 'date',
      label: 'Date',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className=''>{data[i]?.date}</div>
        },
      },
    },
  ]

  useEffect(() => {
    getAllSpendHistory(option)
  }, [])

  const getAllSpendHistory = async (option?: any) => {
    const {data} = await fetchAllSpendHistory({...option, _id: state?.user_id})
    setSpendHistory(data)
    setLoader(false)
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getAllSpendHistory(option)
  }

  return (
    <div>
      <div className='col-12'>
        <div className='white-box-table  card-shadow'>
          <div className='row'>
            <ul className='d-flex my-5' id='pills-tab' role='tablist'>
              <h1 className='ms-4'>User spend</h1>
              <li className='badge badge-submit px-8 me-3 fs-5 ms-auto'>Total Purchase : {spendHistory?.total_purchase}</li>
              <li className='badge badge-success px-8 me-3 fs-5'>Total Gain Coin : {spendHistory?.total_gain} </li>
              <li className='badge badge-danger px-8 me-3 fs-5'>Total Spend Coin : {spendHistory?.total_spend} </li>
              <li className='badge badge-warning px-8 me-3 fs-5'>Available Balance : {spendHistory?.avail_bal} </li>
            </ul>
          </div>
          {loader ? (
            <div className='loader-info-main'>
              <img src={Loader} alt='loader' />
            </div>
          ) : (
            <RtdDatatableNew data={spendHistory?.data} columns={columns} option={option} tableCallBack={tableCallBack} />
          )}
        </div>
      </div>
    </div>
  )
}

export default SpendHistory
