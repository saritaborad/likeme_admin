import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {addReportReson, deleteReportReson, fetchAllReportReson, updateReportReson} from '../ApiService/_requests'
import {Modal} from 'react-bootstrap'
import ReportReasonModal from '../Modals/ReportReason'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'

const ReportReason: React.FC = () => {
  const [reportReason, setReportReason] = useState([])
  const [modalStates, setModalStates] = useState({update: false, show: false, reasonInfo: ''})

  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})

  const columns = [
    {
      value: 'title',
      label: 'Title',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.title}</div>
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
              <button className='btn-comn-submit me-2' onClick={() => setModalStates({update: true, show: true, reasonInfo: data[i]})}>
                Edit
              </button>
              <button className='btn-comn-danger me-2' onClick={() => deleteReason(data[i]?._id)}>
                Delete
              </button>
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    getReportReason(option)
  }, [])

  const getReportReason = async (option?: any) => {
    const {data} = await fetchAllReportReson({options: option})
    setReportReason(data.data)
    setModalStates({update: false, show: false, reasonInfo: ''})
    set_option({...option, totalRecord: data.totalRecord})
  }

  const deleteReason = async (_id: string) => {
    const {data} = await deleteReportReson(_id)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getReportReason(option)
  }

  const submitFormData = async (formData: any) => {
    const {data} = await addReportReson(formData)
    if (data.status === 200) {
      toast.success(data.message)
      getReportReason(option)
    }
  }

  const updateReason = async (formData: any) => {
    const {data} = await updateReportReson(formData)
    if (data.status === 200) {
      toast.success(data.message)
      getReportReason(option)
    }
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getReportReason(option)
  }

  const handleDrop = (updatedData: any) => {
    setReportReason(updatedData)
    // Call your API to update data here
  }

  const appModalClose = () => setModalStates({update: false, show: false, reasonInfo: ''})

  return (
    <>
      <div className='container-fluid'>
        <div className='col-12'>
          <div className='white-box-table card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex my-8'>
                <div className=''>
                  <h1>Report Reasons</h1>
                </div>
                <div className='ms-auto'>
                  <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, show: true})}>
                    Add Report Reasons
                  </button>
                </div>
              </div>
            </div>
            <RtdDatatableNew data={reportReason} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
          </div>
        </div>
        <Modal show={modalStates.show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <ReportReasonModal update={modalStates.update} reasonInfo={modalStates.reasonInfo} submitFormData={submitFormData} updateReason={updateReason} appModalClose={appModalClose} />
        </Modal>
      </div>
    </>
  )
}

export default ReportReason
