import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {ImgUrl} from '../const'
import {fetchAllStreamHistory, fetchStreamHistoryDayWise} from '../ApiService/_requests'
import moment from 'moment'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'

const StreamHistory = () => {
  const [hostInfo, setHostInfo] = useState<any>()
  const [streamHistory, setStreamHistory] = useState<any>()
  const [dayWise, setDayWise] = useState<any>()
  const {state}: any = useLocation()
  const [date, setDate] = useState<any>({from: '', to: '', _id: state?.hostInfo?._id})

  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})

  const columns = [
    {
      value: 'no',
      label: 'No',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{i + 1}</div>
        },
      },
    },
    {
      value: 'stream_date',
      label: 'Date',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.stream_date}</div>
        },
      },
    },
    {
      value: 'total_duration',
      label: 'Spend Time (m:s)',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return (
            <div>
              {Math.floor(data[i]?.total_duration / 60)} : {Math.floor(data[i]?.total_duration % 60)}
            </div>
          )
        },
      },
    },
    {
      value: 'stream_count',
      label: 'Session Count',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.stream_count}</div>
        },
      },
    },
  ]

  const columns1 = [
    {
      value: 'no',
      label: 'No',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{i + 1}</div>
        },
      },
    },
    {
      value: 'start',
      label: 'Start Time',
      options: {
        filter: false,
        sort: false,

        customBodyRender: (data: any, i: number) => {
          return <div>{moment(data[i]?.start).format('DD-MM-YYYY HH:mm:ss')}</div>
        },
      },
    },
    {
      value: 'end',
      label: 'End Time',
      options: {
        filter: false,
        sort: false,

        customBodyRender: (data: any, i: number) => {
          return <div>{moment(data[i]?.end).format('DD-MM-YYYY HH:mm:ss')}</div>
        },
      },
    },
    {
      value: 'password',
      label: 'Spend Time (m:s)',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          let start: any = new Date(data[i]?.start)
          let end: any = new Date(data[i]?.end)
          const differenceInSeconds = (end - start) / 1000
          return (
            <div>
              {Math.floor(differenceInSeconds / 60)} : {Math.floor(differenceInSeconds % 60)}
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    setHostInfo(state?.hostInfo)
    getStreamHistory(option)
  }, [state?.hostInfo])

  const getStreamHistory = async (option?: any) => {
    const {data} = await fetchAllStreamHistory({options: option, _id: state?.hostInfo?._id})
    setStreamHistory(data)
    set_option({...option, totalRecord: data.totalRecord})
  }

  const getStreamHistoryDaywise = async (filtered?: any) => {
    let from = filtered.from ? filtered.from : filtered.to
    let to = filtered.to ? filtered.to : filtered.from
    const {data} = await fetchStreamHistoryDayWise({...filtered, from, to})
    setDayWise(data)
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getStreamHistory(option)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate({...date, [e.target.name]: e.target.value})
    getStreamHistoryDaywise({...date, [e.target.name]: e.target.value})
  }

  return (
    <div className='row'>
      <div className='col-6'>
        <div className='col-12  mt-6'>
          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <div className='d-flex my-10 '>
                <div className='d-flex align-items-center '>
                  <img src={ImgUrl + hostInfo?.profileimages} alt='' className='profile-img me-3' />
                  <h3>
                    <i> {hostInfo?.fullName}</i> 's Day Wise
                  </h3>
                </div>
                <div className='ms-auto d-flex'>
                  <div className='me-4'>
                    <label htmlFor='fromDate'>From Date</label>
                    <input className='form-control mt-2' type='date' id='fromDate' name='from' value={date.from ? date.from : date.to} onChange={(e) => handleChange(e)} />
                  </div>
                  <div className=''>
                    <label htmlFor='toDate'>To Date</label>
                    <input className='form-control mt-2' type='date' id='toDate' name='to' value={date.to ? date.to : date.from} onChange={(e) => handleChange(e)} />
                  </div>
                </div>
              </div>
            </div>

            <RtdDatatableNew data={dayWise} columns={columns} option={{}} tableCallBack={tableCallBack} />
          </div>
        </div>
      </div>
      <div className='col-6'>
        <div className='col-12  mt-6'>
          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex align-items-center mt-10 mb-10 ms-4'>
                <img src={ImgUrl + hostInfo?.profileimages} alt='' className='profile-img me-3' />

                <h3>
                  <i> {hostInfo?.fullName}</i> 's Stream history
                </h3>

                <div className='d-flex ms-auto mb-2 me-2'>
                  <div className='bg-dark me-2 px-12 py-1 fw-bold' style={{borderRadius: '25px', color: 'white'}}>
                    Session Count : {streamHistory?.totalRecord}
                  </div>
                  <div className='bg-dark me-2 px-12 py-1 fw-bold' style={{borderRadius: '25px', color: 'white'}}>
                    Session Time : {Math.floor(streamHistory?.session_time / 60)} : {Math.floor(streamHistory?.session_time % 60)}
                  </div>
                </div>
              </div>
            </div>
            <RtdDatatableNew data={streamHistory?.data} columns={columns1} option={option} tableCallBack={tableCallBack} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StreamHistory
