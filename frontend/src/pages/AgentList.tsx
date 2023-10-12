import {useEffect, useState} from 'react'
import {addAgent, deleteAgent, editAgent, fetchAllagents} from '../ApiService/_requests'
import {toast} from 'react-toastify'
import {Modal} from 'react-bootstrap'
import AddAgentModal from '../Modals/AddAgent'
import {Link} from 'react-router-dom'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'

interface IState {
  fullname?: string
  profileimages?: string
  identity?: string
  is_fake?: number
}

const AgentList: React.FC = () => {
  const [agent, setAgent] = useState<IState[]>([])
  const [show, setShow] = useState(false)
  const [update, setUpdate] = useState(false)
  const [agentDetail, setAgentDetail] = useState('')
  const [selectedItem, setSelectedItem] = useState('All')

  const [option, set_option] = useState({sizePerPage: 3, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'ASC'})

  const columns = [
    {
      value: 'images',
      label: 'Profile Image',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <img src={`http://localhost:5000/${data[i]?.images}`} className='profile-img' alt='' />
        },
      },
    },
    {
      value: 'name',
      label: 'Name',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.name}</div>
        },
      },
    },
    {
      value: 'email_id',
      label: 'Email',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.email_id}</div>
        },
      },
    },
    {
      value: 'password',
      label: 'Password',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.password}</div>
        },
      },
    },
    {
      value: 'phone_no',
      label: 'Phone No',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.phone_no}</div>
        },
      },
    },
    {
      value: 'country.country_name',
      label: 'Country',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.country?.country_name}</div>
        },
      },
    },
    {
      value: 'status',
      label: 'Status',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.status == 0 ? 'Offline' : 'Live'}</div>
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
              <button
                className='btn-comn-submit me-2'
                onClick={() => {
                  setShow(true)
                  setUpdate(true)
                  setAgentDetail(data[i])
                }}
              >
                Edit
              </button>
              <button className='btn-comn-danger me-2' onClick={() => deleteAgentById(data[i]?._id)}>
                Delete
              </button>
              <Link to='/agentHost' state={{agentInfo: data[i]}} className='btn-comn-warning me-2'>
                Hosts
              </Link>
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    getAgentData(option)
  }, [])

  const getAgentData = async (option?: any) => {
    const {data} = await fetchAllagents({options: option})
    setAgent(data.agents)
    set_option({...option, totalRecord: data.totalRecord})
  }

  const deleteAgentById = async (id: string) => {
    const {data} = await deleteAgent(id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getAgentData(option)
  }

  const submitFormData = async (formData: any, resetForm: any) => {
    const {data} = await addAgent(formData)

    if (data.status === 200) {
      toast.success(data.message)
      setShow(false)
      getAgentData(option)
    }
  }

  const updateAgent = async (formData: any, resetForm: any) => {
    const {data} = await editAgent(formData)

    if (data.status === 200) {
      setShow(false)
      toast.success(data.message)
      getAgentData()
    }
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getAgentData(option)
  }

  const handleDrop = (updatedData: any) => {
    setAgent(updatedData)
    // Call your API to update data here
  }

  const appModalClose = () => {
    setShow(false)
    setUpdate(false)
    setAgentDetail('')
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='col-12 '>
          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex align-items-center my-3'>
                <div className='comn-inr-title '>
                  <h1>Agent List</h1>
                </div>
                <div className='ms-auto mb-2 me-2 mt-5'>
                  <button className='btn-comn-submit me-2' onClick={() => setShow(true)}>
                    Add Agent
                  </button>
                </div>
              </div>
            </div>
            <RtdDatatableNew data={agent} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
          </div>
        </div>

        <Modal show={show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <AddAgentModal update={update} agentInfo={agentDetail} submitFormData={submitFormData} updateAgent={updateAgent} appModalClose={appModalClose} />
        </Modal>
      </div>
    </>
  )
}
export default AgentList
