import {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import {ImgUrl} from '../const'
import {fetchHostSummary} from '../ApiService/_requests'

const HostSummary = () => {
  const {state}: any = useLocation()
  const [hostInfo, setHostInfo] = useState<any>()
  const [summary, setSummary] = useState<any>()
  const [filter, setFilter] = useState<any>({_id: state?.hostInfo?._id, payment: 0, from: 0, to: 0})

  useEffect(() => {
    setHostInfo(state.hostInfo)
    getHistoryData(filter)
  }, [state.hostInfo])

  const handleChange = (e: any) => {
    const {name, value} = e.target
    setFilter({...filter, [name]: value})
    getHistoryData({...filter, [name]: value})
  }

  const getHistoryData = async (filtered: any) => {
    let from = filtered.from ? filtered.from : filtered.to
    let to = filtered.to ? filtered.to : filtered.from
    const {data} = await fetchHostSummary({...filtered, from, to})
    setSummary(data)
  }

  return (
    <div className='container-fluid '>
      <div className='row'>
        <div className='col-6 '>
          <div className='card-shadow'>
            <div className='card '>
              <div className='card-header d-flex align-items-center'>
                <h1>Filter</h1>
              </div>
              <div className='card-body'>
                <div className='row'>
                  <div className='col-4'>
                    <label>Payment</label>
                    <select className='form-control mt-2 ' name='payment' id='payment' required onChange={(e) => handleChange(e)}>
                      <option value={0}>All</option>
                      <option value={2}>Paid</option>
                      <option value={1}>Unpaid</option>
                    </select>
                  </div>
                  <div className='col-4'>
                    <label>From Date</label>
                    <input className='form-control  mt-2 ' type='date' id='from' name='from' value={filter.from ? filter.from : filter.to} onChange={(e) => handleChange(e)} />
                  </div>
                  <div className='col-4'>
                    <label>To Date</label>
                    <input className='form-control  mt-2 ' type='date' id='to' name='to' value={filter.to ? filter.to : filter.from} onChange={(e) => handleChange(e)} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='row mt-10'>
        <div className='col-6'>
          <div className='card-shadow'>
            <div className='card '>
              <div className='card-header mt-6 ms-10'>
                <h4 className='mr-auto col-8 '>
                  <img alt='imagedfdf' src={ImgUrl + hostInfo?.profileimages} className='profile-img' />
                  &nbsp;&nbsp;&nbsp;
                  <i id='host_name'>{hostInfo?.fullName}</i>
                </h4>
              </div>

              <div className='card-body' id='user-detail-form'>
                <div>
                  <input className='requesCountrytHostId ' type='hidden' />
                </div>
                <div className='ms-10 fs-4 fw-bold' style={{color: '#6c757d'}}>
                  Total Public Streams : <i className='fas fa-video mx-3' />
                  {summary?.public_streams}
                </div>
                <div className='m-10 fs-4 fw-bold' style={{color: '#6c757d'}}>
                  Total Streaming Time : <i className='fas fa-clock mx-3' /> {Math.round(summary?.streaming_time / 60)} : {Math.round(summary?.streaming_time % 60)}
                </div>

                <hr />
                <div className='m-10 fs-4 fw-bold' style={{color: '#6c757d'}}>
                  Total Gift Diamond : <i className='fas fa-gifts mx-3' />
                  {summary?.gift}
                </div>
                <div className='m-10 fs-4 fw-bold' style={{color: '#6c757d'}}>
                  Total Call Diamond : <i className='fas fa-phone mx-3' /> {summary?.call}
                </div>
                <div className='m-10 fs-4 fw-bold' style={{color: '#6c757d'}}>
                  Private Stream Diamond : <i className='fas fa-video mx-3' />
                  {summary?.stream}
                </div>
                <div className='m-10 fs-4 fw-bold' style={{color: '#6c757d'}}>
                  Total Chat Diamond : <i className='fas fa-weixin mx-3' /> {summary?.chat}
                </div>
                <div className='m-10 fs-4 fw-bold' style={{color: '#6c757d'}}>
                  Total Match Call Diamond : <i className='fas fa-phone mx-3' /> {summary?.match}
                </div>

                <hr />
                <hr />
                <div className='m-10 fs-4 fw-bold' style={{color: '#6c757d'}}>
                  Diamond Grand Total :
                  <i className='fas fa-phone mx-3' />
                  {summary?.total}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HostSummary
