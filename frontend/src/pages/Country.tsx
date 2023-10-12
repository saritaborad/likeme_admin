import {useEffect, useState} from 'react'
import {toast} from 'react-toastify'
import {addCountryData, deleteCountryData, editCountryData, fetchAllCountry} from '../ApiService/_requests'
import {Modal} from 'react-bootstrap'
import AddCountry from '../Modals/AddCountry'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'

interface IState {
  fullname?: string
  profileimages?: string
  identity?: string
  is_fake?: number
}

const Country: React.FC = () => {
  const [user, setUser] = useState<IState[]>([])
  const [modalStates, setModalStates] = useState({update: false, show: false, countryInfo: ''})
  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})

  const columns = [
    {
      value: 'country_name',
      label: 'Country Name',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.country_name}</div>
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
              <button className='btn-comn-submit me-2' onClick={() => setModalStates({update: true, show: true, countryInfo: data[i]})}>
                Edit
              </button>
              <button className='btn-comn-danger me-2' onClick={() => deleteCountry(data[i]?._id)}>
                Delete
              </button>
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    getCountryList(option)
  }, [])

  const getCountryList = async (option?: any) => {
    const {data} = await fetchAllCountry({options: option})
    setUser(data.countries)
    setModalStates({show: false, update: false, countryInfo: ''})
    set_option({...option, totalRecord: data.totalRecord})
  }

  const deleteCountry = async (_id: string) => {
    const {data} = await deleteCountryData(_id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getCountryList(option)
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getCountryList(option)
  }

  const handleDrop = (updatedData: any) => {
    setUser(updatedData)
    // Call your API to update data here
  }

  const submitFormData = async (formData: any) => {
    const {data} = await addCountryData(formData)
    if (data.status === 200) {
      toast.success(data.message)
      getCountryList(option)
    }
  }

  const updateCountry = async (formData: any) => {
    const {data} = await editCountryData(formData)
    if (data.status === 200) {
      toast.success(data.message)
      getCountryList(option)
    }
  }

  const appModalClose = () => setModalStates({update: false, show: false, countryInfo: ''})

  return (
    <>
      <div className='container-fluid'>
        {/* <div className='row'>
          <div className='col-12 d-flex'>
          
          </div>
        </div> */}
        {/* <div className='col-12  mt-2'>
          <div className='table-custom-info card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex align-items-center mt-8'>
                <div className=' '>
                  <h1>Country List</h1>
                </div>
                <div className='ms-auto'>
                  <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, show: true})}>
                    Add Country
                  </button>
                </div>
              </div>
            </div>
            <RtdDatatableNew data={user} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
          </div>
        </div> */}

        <div className='col-12'>
          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex align-items-center my-4'>
                <div className=' '>
                  <h1>Country List</h1>
                </div>
                <div className='ms-auto'>
                  <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, show: true})}>
                    Add Country
                  </button>
                </div>
              </div>
            </div>
            <RtdDatatableNew data={user} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
          </div>
        </div>
        <Modal show={modalStates.show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <AddCountry update={modalStates.update} countryDetail={modalStates.countryInfo} submitFormData={submitFormData} updateCountry={updateCountry} appModalClose={appModalClose} />
        </Modal>
      </div>
    </>
  )
}

export default Country
