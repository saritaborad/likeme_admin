import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {addGifts, deleteGift, editGift, fetchAllgifts} from '../ApiService/_requests'
import {Modal} from 'react-bootstrap'
import AddGift from '../Modals/AddGift'
import {ImgUrl} from '../const'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
// import AddGift from '../Modals/AddGift'

interface IState {
  fullname?: string
  profileimages?: string
  identity?: string
  is_fake?: number
}

const Gift: React.FC = () => {
  const [gifts, setGifts] = useState<IState[]>([])
  const [modalStates, setModalStates] = useState({update: false, show: false, giftInfo: ''})

  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})

  const columns = [
    {
      value: 'images',
      label: 'Image',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <img src={`${ImgUrl + data[i]?.images}`} className='profile-img' alt='' />
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
      value: 'action',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return (
            <div>
              <button className='btn-comn-submit me-2' onClick={() => setModalStates({update: true, show: true, giftInfo: data[i]})}>
                Edit
              </button>
              <button className='btn-comn-danger me-2' onClick={() => deleteGiftData(data[i]?._id)}>
                Delete
              </button>
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    getAllGifts(option)
  }, [])

  const deleteGiftData = async (_id: string) => {
    const {data} = await deleteGift(_id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getAllGifts(option)
  }

  const getAllGifts = async (option?: any) => {
    const {data} = await fetchAllgifts({options: option})
    setGifts(data.gifts)
    setModalStates({show: false, update: false, giftInfo: ''})
    set_option({...option, totalRecord: data.totalRecord})
  }

  const submitFormData = async (formData: any) => {
    const {data} = await addGifts(formData)
    if (data.status === 200) {
      toast.success(data.message)
      getAllGifts(option)
    }
  }

  const updateGift = async (formData: any) => {
    const {data} = await editGift(formData)
    if (data.status === 200) {
      toast.success(data.message)
      getAllGifts(option)
    }
  }

  const appModalClose = () => setModalStates({update: false, show: false, giftInfo: ''})

  const tableCallBack = (option: any) => {
    set_option(option)
    getAllGifts(option)
  }

  const handleDrop = (updatedData: any) => {
    setGifts(updatedData)
    // Call your API to update data here
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='col-12  mt-2'>
          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex align-items-center my-4'>
                <div className=' '>
                  <h1>Gifts</h1>
                </div>
                <div className='ms-auto'>
                  <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, show: true})}>
                    Add Gift
                  </button>
                </div>
              </div>
            </div>
            <RtdDatatableNew data={gifts} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
          </div>
        </div>

        <Modal show={modalStates.show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <AddGift update={modalStates.update} giftInfo={modalStates.giftInfo} submitFormData={submitFormData} updateGift={updateGift} appModalClose={appModalClose} />
        </Modal>
      </div>
    </>
  )
}

export default Gift
