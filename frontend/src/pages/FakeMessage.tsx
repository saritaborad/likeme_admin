import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {addMessage, deleteMessageById, fetchAllMessages} from '../ApiService/_requests'
import {Modal} from 'react-bootstrap'
import FakeMsg from '../Modals/FakeMsg'
import {ImgUrl} from '../const'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
import {useAuth} from '../app/modules/auth'
import Loader from '../Images/loader.gif'
import {DeleteConfirmModal} from '../Modals/DeleteConfirmModal'

const FakeMessage: React.FC = () => {
  const [messageList, setMessageList] = useState<any>([])
  const [modalStates, setModalStates] = useState({update: false, show: false, rowVal: '', deleteConfirm: false})
  const [loader, setLoader] = useState(true)
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
        customBodyRender: (data: any, i: number) => (data[i]?.type == 1 ? <img src={ImgUrl + data[i]?.title} className='profile-img' alt='' /> : <div>{data[i]?.title}</div>),
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
            !currentUser?.is_tester && (
              <button className='btn-comn-danger' onClick={() => setModalStates({...modalStates, rowVal: data[i]?._id, deleteConfirm: true})}>
                Delete
              </button>
            )
          )
        },
      },
    },
  ]

  useEffect(() => {
    getMessages(option)
  }, [])

  const getMessages = async (option?: any) => {
    const {data} = await fetchAllMessages({options: option})
    setMessageList(data.data)
    set_option({...option, totalRecord: data.totalRecord})
    setModalStates({show: false, update: false, rowVal: '', deleteConfirm: false})
    setLoader(false)
  }

  const deleteMessage = async () => {
    const {data} = await deleteMessageById(modalStates.rowVal)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getMessages(option)
  }

  const submitFormData = async (formData: any) => {
    const form = new FormData()
    form.append('title', formData.title)

    const {data} = await addMessage(form)

    if (data.status === 200) {
      toast.success(data.message)
      getMessages(option)
    }
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getMessages(option)
  }

  const handleDrop = (updatedData: any) => {
    setMessageList(updatedData)
    // Call your API to update data here
  }

  const appModalClose = () => setModalStates({...modalStates, update: false, show: false, rowVal: ''})

  return (
    <>
      <div className='container-fluid'>
        <div className='col-12'>
          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex align-items-center my-4'>
                <div className=' '>
                  <h1>Messages</h1>
                </div>
                <div className='ms-auto'>
                  {!currentUser?.is_tester && (
                    <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, show: true})}>
                      Add Message
                    </button>
                  )}
                </div>
              </div>
            </div>
            {loader ? (
              <div className='loader-info-main'>
                <img src={Loader} alt='loader' />
              </div>
            ) : (
              <RtdDatatableNew data={messageList} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
            )}
          </div>
        </div>
        <Modal show={modalStates.show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <FakeMsg submitFormData={submitFormData} appModalClose={appModalClose} />
        </Modal>

        <Modal show={modalStates.deleteConfirm} onHide={() => setModalStates({...modalStates, deleteConfirm: false})} size='lg' className='cust-comn-modal' centered>
          <DeleteConfirmModal setDelete={setModalStates} setConfirmDel={deleteMessage} />
        </Modal>
      </div>
    </>
  )
}

export default FakeMessage
