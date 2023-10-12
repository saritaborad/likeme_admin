import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {fetchAllPurchaseHistory, getPackageName} from '../ApiService/_requests'
import moment from 'moment'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'

const UserPurchase: React.FC = () => {
  const [packageName, setPackageName] = useState<any>()
  const [purchase, setPurchase] = useState<any>()
  const [filter, setFilter] = useState<any>({gain_type: 0, package_name: 'com.videocall.randomcallapps', from: '', to: ''})

  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})

  const columns = [
    {
      value: 'type',
      label: 'Gain By',

      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          console.log(data[i]?.type == 1 ? 'Purchase' : 'Rewarded')
          return <div>{data[i]?.type == 1 ? 'Purchase' : 'Rewarded'}</div>
        },
      },
    },
    {
      value: 'fullName',
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
      label: 'Diamond',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.diamond}</div>
        },
      },
    },
    {
      value: 'GPA_TOKEN',
      label: 'GPA',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.GPA_TOKEN || '-'}</div>
        },
      },
    },
    {
      value: 'createdAt',
      label: 'Date',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{moment(data[i]?.createdAt).format('DD-MM-YYYY hh:mm:ss')}</div>
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
            <Link className='btn-comn-info' to={'/spendHistory'} state={{user_id: data[i]?.user?._id}}>
              Spend History
            </Link>
          )
        },
      },
    },
  ]

  useEffect(() => {
    getAllPackageName()
    getPurchaseHistory(option, filter)
  }, [])

  const getPurchaseHistory = async (option?: any, filtered?: any) => {
    let from = filtered.from ? filtered.from : filtered.to
    let to = filtered.to ? filtered.to : filtered.from
    const {data} = await fetchAllPurchaseHistory({options: option, ...{...filtered, from, to}})
    setPurchase(data)
    set_option({...option, totalRecord: data.totalRecord})
  }

  const getAllPackageName = async (option?: any) => {
    const {data} = await getPackageName()
    setPackageName(data)
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getPurchaseHistory(option, filter)
  }

  const handleFilter: any = async (e: any) => {
    setFilter({...filter, [e.target.name]: e.target.value})
    getPurchaseHistory(option, {...filter, [e.target.name]: e.target.value})
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 d-flex'>
            <div className='mb-3'>
              <h1>User Purchases</h1>
            </div>
          </div>
        </div>
        <div className='col-12'>
          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <ul className='d-flex my-8' id='pills-tab' role='tablist'>
                <li className='pe-4'>
                  <select className='form-control' name='gain_type' value={filter.gain_type} onChange={(e) => handleFilter(e)}>
                    <option value='0'>Gain Type</option>
                    <option value='1'>Purchased</option>
                    <option value='2'>Rewarded</option>
                  </select>
                </li>

                <li className='pe-4'>
                  <select className='form-control px-4' name='package_name' value={filter.package_name} onChange={(e) => handleFilter(e)}>
                    {packageName?.length > 0 &&
                      packageName?.map((item: any, i: number) => (
                        <option value={item.package_name} key={i}>
                          {item.device_type == 1 ? 'Android' : 'IOS'} - {item.app_name}
                        </option>
                      ))}
                  </select>
                </li>
                <li className='pe-4'>
                  <input className='form-control' type='date' id='from' name='from' value={filter.from ? filter.from : filter.to} data-date-format='DD MMMM YYYY' onChange={(e) => handleFilter(e)} />
                </li>
                <li className='pe-4'>
                  <input className='form-control' type='date' id='to' name='to' value={filter.to ? filter.to : filter.from} onChange={(e) => handleFilter(e)} />
                </li>

                <div className='badge badge-info px-8 me-2 ms-auto fs-5'>
                  {purchase?.grandTotal} &nbsp;&nbsp;
                  <i className='fas fa-coins' style={{color: 'white'}} />
                </div>
                <Link to='/topPurchaser' className='badge badge-submit px-8  fs-5'>
                  <i className='fas fa-sort me-2' style={{color: 'white'}} />
                  Top Purchaser &nbsp;&nbsp;
                </Link>
              </ul>
            </div>
            <RtdDatatableNew data={purchase?.data} columns={columns} option={option} tableCallBack={tableCallBack} />
          </div>
        </div>
      </div>
    </>
  )
}

export default UserPurchase
