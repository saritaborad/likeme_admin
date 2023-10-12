import React, {useEffect, useState} from 'react'
import RtdDatatable from '../Common/DataTable/DataTable'
import {fetchAllHostHistory} from '../ApiService/_requests'
import {Link, useLocation} from 'react-router-dom'
import {ImgUrl} from '../const'
import moment from 'moment'

const HostHistory = () => {
  const {state}: any = useLocation()

  const [history, setHistory] = useState<any>()
  const [hostInfo, setHostInfo] = useState<any>()

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
      value: 'type',
      label: 'Spend In',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{['gift', 'call', 'stream', 'chat', 'match'][data[i]?.type - 1]}</div>
        },
      },
    },
    {
      value: 'user.fullName',
      label: 'User',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return (
            <Link to='/spendHistory' style={{color: '#6777ef'}} state={{user_id: data[i]?.user?._id}}>
              {data[i]?.user?.fullName}
            </Link>
          )
        },
      },
    },
    {
      value: 'host.fullName',
      label: 'Host',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.host?.fullName}</div>
        },
      },
    },
    {
      value: 'diamond',
      label: 'Diamonds',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.diamond}</div>
        },
      },
    },
    {
      value: 'host_paided',
      label: 'Payment',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className={`${data[i]?.host_paided == 1 ? 'badge badge-danger' : 'badge badge-success'}`}>{data[i]?.host_paided == 1 ? 'Unpaid' : 'Paid'}</div>
        },
      },
    },
    {
      value: 'createdAt',
      label: 'Date',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{moment(data[i]?.createdAt).format('DD-MM-YYYY hh:mm:ss')}</div>
        },
      },
    },
  ]

  useEffect(() => {
    getHistoryData(option)
    setHostInfo(state?.hostInfo)
  }, [state?.hostInfo, state?.agentInfo])

  const getHistoryData = async (option?: any) => {
    const {data} = await fetchAllHostHistory(state?.hostInfo?._id, option)
    setHistory(data)
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getHistoryData(option)
  }

  return (
    <div>
      <div className='col-12 card-shadow'>
        <div className='table-custom-info'>
          <div className='row'>
            <div className='col-12 d-flex align-items-center mt-10 mb-10'>
              <img src={ImgUrl + hostInfo?.profileimages} alt='' className='profile-img me-3' />

              <h3>
                <i> {hostInfo?.fullName}</i> 's work history
              </h3>

              <div className='ms-auto mb-2 me-2'>
                <div className='badge badge-submit me-2 px-12 py-3 fs-6' style={{borderRadius: '25px'}}>
                  Export
                </div>
                <div className='badge badge-success me-2 px-12 py-3 fs-6' style={{borderRadius: '25px'}}>
                  Total Paid - {history?.totalPaid}
                </div>
                <div className='badge badge-danger me-2 px-12 py-3 fs-6' style={{borderRadius: '25px'}}>
                  Total Unpaid - {history?.totalUnPaid}
                </div>
              </div>
            </div>
          </div>

          <RtdDatatable data={history?.history} columns={columns} option={option} tableCallBack={tableCallBack} />
        </div>
      </div>
    </div>
  )
}

export default HostHistory
