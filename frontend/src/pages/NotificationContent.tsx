import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {Modal} from 'react-bootstrap'
import NotiContent from '../Modals/NotiContent'
import {addNotiContent, deleteNotiContent, getNotiContent, updateNotiContent} from '../ApiService/_requests'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
import {useAuth} from '../app/modules/auth'

interface IState {
  fullname?: string
  profileimages?: string
  identity?: string
  is_fake?: number
}

const NotificationContent: React.FC = () => {
  const [notiContentList, setNotiContentList] = useState<IState[]>([])
  const [modalStates, setModalStates] = useState({update: false, show: false, notiInfo: ''})
  const {currentUser} = useAuth()

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
              {!currentUser?.is_tester && (
                <>
                  <button className='btn-comn-submit me-2' onClick={() => setModalStates({update: true, show: true, notiInfo: data[i]})}>
                    Edit
                  </button>
                  <button className='btn-comn-danger me-2' onClick={() => delNotiContentData(data[i]?._id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    getNotiContentData(option)
  }, [])

  const getNotiContentData = async (option?: any) => {
    const {data} = await getNotiContent({options: option})
    setNotiContentList(data.data)
    setModalStates({update: false, show: false, notiInfo: ''})
    set_option({...option, totalRecord: data.totalRecord})
  }

  const submitFormData = async (formData: any) => {
    const {data} = await addNotiContent(formData)
    if (data.status === 200) {
      toast.success(data.message)
      getNotiContentData(option)
    }
  }

  const updateNotiData = async (formData: any) => {
    const {data} = await updateNotiContent(formData)
    if (data.status === 200) {
      toast.success(data.message)
      getNotiContentData(option)
    }
  }

  const delNotiContentData = async (_id: string) => {
    const {data} = await deleteNotiContent(_id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getNotiContentData(option)
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getNotiContentData(option)
  }

  const appModalClose = () => setModalStates({update: false, show: false, notiInfo: ''})

  const handleDrop = (updatedData: any) => {
    setNotiContentList(updatedData)
    // Call your API to update data here
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='col-12 card-shadow mt-2'>
          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex align-items-center my-4'>
                <div className=' '>
                  <h1>Notification Content</h1>
                </div>
                <div className='ms-auto'>
                  {!currentUser?.is_tester && (
                    <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, show: true})}>
                      Add Notification Content
                    </button>
                  )}
                </div>
              </div>
            </div>
            <RtdDatatableNew data={notiContentList} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
          </div>
          {/* <div className='table-custom-info'>
            <div className='row'>
              <div className='col-12 d-flex my-6'>
                <div className=''>
                  <h1>Notification Content</h1>
                </div>
                <div className='ms-auto'>
                  <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, show: true})}>
                    Add Notification Content
                  </button>
                </div>
              </div>
            </div>
            <RtdDatatable data={notiContentList} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
          </div> */}
        </div>
        <Modal show={modalStates.show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <NotiContent update={modalStates.update} notiInfo={modalStates.notiInfo} submitFormData={submitFormData} updateNotiData={updateNotiData} appModalClose={appModalClose} />
        </Modal>
      </div>
    </>
  )
}

export default NotificationContent
