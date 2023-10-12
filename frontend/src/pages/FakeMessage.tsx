import {useEffect, useState} from 'react'
import RtdDatatable from '../Common/DataTable/DataTable'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'
import {addMessage, deleteMessageById, fetchAllMessages} from '../ApiService/_requests'
import {Modal} from 'react-bootstrap'
import FakeMsg from '../Modals/FakeMsg'
import {ImgUrl} from '../const'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'

interface IState {
  fullname?: string
  profileimages?: string
  identity?: string
  is_fake?: number
}

const FakeMessage: React.FC = () => {
  const [messageList, setMessageList] = useState<IState[]>([])
  const [modalStates, setModalStates] = useState({update: false, show: false, messageInfo: ''})

  const [option, set_option] = useState({sizePerPage: 3, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})

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
            <button className='btn-comn-danger' onClick={() => deleteMessage(data[i]._id)}>
              Delete
            </button>
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
  }

  const deleteMessage = async (_id: string) => {
    const {data} = await deleteMessageById(_id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getMessages(option)
  }

  const submitFormData = async (formData: any) => {
    const {data} = await addMessage(formData)
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

  const appModalClose = () => setModalStates({update: false, show: false, messageInfo: ''})

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
                  <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, show: true})}>
                    Add Message
                  </button>
                </div>
              </div>
            </div>
            <RtdDatatableNew data={messageList} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
          </div>
        </div>
        <Modal show={modalStates.show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <FakeMsg submitFormData={submitFormData} appModalClose={appModalClose} />
        </Modal>
      </div>
    </>
  )
}

export default FakeMessage
