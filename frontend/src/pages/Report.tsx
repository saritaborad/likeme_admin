import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {deleteReport, fetchReports, hostblock} from '../ApiService/_requests'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
import {ImgUrl} from '../const'

const Report: React.FC = () => {
  const [reports, setReport] = useState<any>([])

  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})

  const columns = [
    {
      value: 'user.profileimages',
      label: 'Profile Image',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <img src={`${ImgUrl + data[i]?.user?.profileimages}`} className='profile-img' alt='' />
        },
      },
    },
    {
      value: 'identity',
      label: 'Identity',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.user?.identity}</div>
        },
      },
    },
    {
      value: 'fullName',
      label: 'Full Name',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.user?.fullName}</div>
        },
      },
    },
    {
      value: 'is_fake',
      label: 'Host Type',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div className={`${data[i]?.is_fake == 1 ? 'badge badge-danger' : 'badge badge-success'}`}>{data[i]?.is_fake == 1 ? 'Fake' : 'Real'}</div>
        },
      },
    },
    {
      value: 'reason',
      label: 'Reason',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div className=''>{data[i]?.reason}</div>
        },
      },
    },
    {
      value: 'description',
      label: 'Description',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.description}</div>
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
            <div>
              {/* <button
                className='btn-comn-info me-2'
                onClick={() => {
                  // setNotificationData(data[i])
                  // setShow(true)
                }}
              >
                View  
              </button> */}
              <button
                className='btn-comn-submit me-2'
                onClick={() => {
                  blockHost(data[i]?.user?._id)
                  // setShow(true)
                }}
              >
                Block
              </button>
              <button className='btn-comn-danger me-2' onClick={() => deleteReportData(data[i]?._id)}>
                Delete Report
              </button>
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    fetchAllReport(option)
  }, [])

  const fetchAllReport = async (option?: any) => {
    const {data} = await fetchReports({options: option})
    setReport(data.reports)
    set_option({...option, totalRecord: data.totalRecord})
  }

  const deleteReportData = async (_id: string) => {
    const {data} = await deleteReport(_id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    fetchAllReport(option)
  }

  const blockHost = async (_id: string) => {
    const {data} = await hostblock(_id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    fetchAllReport(option)
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    fetchAllReport(option)
  }

  const handleDrop = (updatedData: any) => {
    setReport(updatedData)
    // Call your API to update data here
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 d-flex'>
            <div className='mb-3'>
              <h1>Reports</h1>
            </div>
          </div>
        </div>
        <div className='col-12 '>
          <div className='white-box-table card-shadow'>
            <RtdDatatableNew data={reports} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Report
