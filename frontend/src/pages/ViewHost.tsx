import React, {useState, useEffect} from 'react'
import RtdDatatable from '../Common/DataTable/DataTable'
import {blockUnblockHost, deleteImageById, deleteVideoById, fetchHostImages, fetchHostVideos, hostById, hostUpdate} from '../ApiService/_requests'
import {useLocation} from 'react-router-dom'
import {ImgUrl} from '../const'
import {Modal} from 'react-bootstrap'
import AddImage from '../Modals/AddImage'
import {toast} from 'react-toastify'
import ImageView from '../Modals/ImageView'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {errorContainer, formAttr} from '../commonFun'
import {useAllAgent, useAllCountry} from '../hooks/customHook'
import AddVideo from '../Modals/AddVideo'

const ViewHost: React.FC = () => {
  const [user, setUser] = useState([])
  const [images, setImages] = useState([])
  const [video, setVideo] = useState([])
  const [videos, setVideos] = useState([])
  const [img, setImg] = useState('')
  const [show, setShow] = useState(false)
  const [showVid, setShowVid] = useState(false)
  const [view, setView] = useState(false)
  const [hostData, setHostData] = useState<any>()
  const {state}: any = useLocation()
  const agents = useAllAgent()
  const country = useAllCountry()

  const [option, set_option] = useState({
    sizePerPage: 10,
    totalRecord: 10,
    page: 1,
    sort: 'createdAt',
    order: 'ASC',
    entries: true,
    showSearch: false,
    checkbox: false,
  })

  const columns = [
    {
      value: 'image',
      label: 'Image',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return data[i]?.image ? <img src={ImgUrl + data[i]?.image} className='profile-img' alt='' /> : null
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
                  setView(true)
                  setImg(data[i]?.image)
                  setVideo(data[i]?.video)
                }}
              >
                View
              </button>
              <button className='btn-comn-danger me-2' onClick={() => (data[i]?.image ? deleteImage(data[i]?._id) : deleteVideo(data[i]?._id))}>
                Delete
              </button>
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    if (state) {
      getAllImage(state.hostData._id)
      getAllVideo(state.hostData._id)
      getHost(state.hostData._id)
    }
  }, [state.hostData._id])

  const getAllImage = async (_id: string) => {
    const {data} = await fetchHostImages(_id)
    setImages(data.data)
  }

  const getAllVideo = async (_id: string) => {
    const {data} = await fetchHostVideos(_id)
    setVideos(data.data)
  }

  const getHost = async (_id: string) => {
    const {data} = await hostById(_id)
    setHostData(data)
  }

  const deleteImage = async (_id: string) => {
    const {data} = await deleteImageById(_id)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getAllImage(state.hostData._id)
  }

  const deleteVideo = async (_id: string) => {
    const {data} = await deleteVideoById(_id)
    data.status === 200 ? toast.success(data.message) : toast.error(data.message)
    getAllVideo(state.hostData._id)
  }

  const handleBlockUnblock = async () => {
    const {data} = await blockUnblockHost(hostData?._id, hostData?.is_block == 1 ? 0 : 1)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getHost(state.hostData._id)
  }

  const updateFakeHost = async (formData: any) => {
    const {data} = await hostUpdate(formData)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
  }

  const appModalClose = () => setShow(false)
  const videoClose = () => setShowVid(false)

  const tableCallBack = (option: any) => {
    set_option(option)
  }

  const handleDrop = (updatedData: any) => {
    setUser(updatedData)
    // Call your API to update data here
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='card-shadow mt-8'>
          <div className='card'>
            <div className='card-header d-flex align-items-center'>
              <h4>{hostData?.fullName}</h4>
              <span className='badge badge-pill badge-success badge-shadow'>{hostData?.is_fake == 1 ? 'Fake' : 'Real'}</span>
              <button id='unblock' className={`${hostData?.is_block == 1 ? 'btn btn-success' : 'btn btn-danger'} text-white`} onClick={handleBlockUnblock}>
                {hostData?.is_block == 1 ? 'Unblock' : 'Block'}
              </button>
            </div>

            <Formik
              enableReinitialize
              initialValues={{
                _id: hostData && hostData?._id,
                fullName: hostData?.fullName || '',
                agent_id: hostData?.agent_id || '',
                availabiltyHours: hostData?.availabiltyHours || '',
                intrests: hostData?.intrests?.toString() || '',
                age: hostData?.age || '',
                bio: hostData?.bio == 0 ? 0 : 1 || '',
                billingAddress: hostData?.billingAddress || 0,
                about: hostData?.about || 0,
                country_id: hostData?.country_id || 0,
                email: hostData?.email || 0,
                diamond_per_min: hostData?.diamond_per_min || 0,
              }}
              validationSchema={Yup.object({
                fullName: Yup.string().required('required.'),
                agent_id: Yup.string().required('required.'),
                availabiltyHours: Yup.number().required('required.'),
                intrests: Yup.string().required('required.'),
                age: Yup.number().required('required.'),
                bio: Yup.string().required('required.'),
                billingAddress: Yup.string().required('required.'),
                about: Yup.string().required('required.'),
                country_id: Yup.string().required('required.'),
                email: Yup.string().required('required.'),
                diamond_per_min: Yup.number().required('required.'),
              })}
              onSubmit={(formData, {resetForm}) => {
                updateFakeHost(formData)
              }}
            >
              {(runform) => (
                <form onSubmit={runform.handleSubmit}>
                  <input type='hidden' name='_token' defaultValue='EjAY5yPivM7ZAH2SisFwbB3rRK2Fj1AFLwH6sPuE' />
                  <input id='hostId' className=' form-control' readOnly name='id' type='text' hidden />
                  <div className='card-body' id='user-detail-form'>
                    <div>
                      <input className='requesCountrytHostId ' type='hidden' />
                    </div>
                    <div className='row'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='fullname'>Fullname</label>
                        <input className='fullname form-control mt-2' name='fullName' type='text' id='host-fullname' {...formAttr(runform, 'fullName')} />
                        {errorContainer(runform, 'fullName')}
                      </div>
                      <div className='form-group col-md-6'>
                        <label>Assign Agent</label>
                        <select className='form-control mt-2' name='agent_id' id='all-agent_id' {...formAttr(runform, 'agent_id')}>
                          {agents?.length &&
                            agents.map((item: any, i) => (
                              <option value={item._id} key={i}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                        {errorContainer(runform, 'agent_id')}
                      </div>
                    </div>
                    <div className='row mt-6'>
                      <div className='form-group col-md-6'>
                        <label htmlFor='AvailabiltyHours'>Availabilty Hours</label>
                        <input type='number' name='availabiltyHours' className='form-control mt-2' id='availabiltyHours' {...formAttr(runform, 'availabiltyHours')} />
                        {errorContainer(runform, 'availabiltyHours')}
                      </div>
                      <div className='form-group col-md-6'>
                        <div className='row '>
                          <div className='form-group col-md-9'>
                            <label>Intrests</label>
                            <input type='text' name='intrests' className='form-control mt-2' id='host_intrests' {...formAttr(runform, 'intrests')} />
                            {errorContainer(runform, 'intrests')}
                          </div>
                          <div className='form-group col-md-3'>
                            <label>Age</label>
                            <input type='number' name='age' className='form-control mt-2' id='host_age' {...formAttr(runform, 'age')} />
                            {errorContainer(runform, 'age')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='row mt-6'>
                      <div className='form-group col-md-6'>
                        <label>Bio</label>
                        <textarea className='form-control mt-2' id='host_bio' name='bio' {...formAttr(runform, 'bio')} />
                        {errorContainer(runform, 'bio')}
                      </div>
                      <div className='form-group col-md-6'>
                        <label>Billing Address</label>
                        <textarea className='form-control mt-2' name='billingAddress' id='host_billingAddress' {...formAttr(runform, 'billingAddress')} />
                        {errorContainer(runform, 'billingAddress')}
                      </div>
                    </div>
                    <div>
                      <div className='row mt-6'>
                        <div className='form-group col-md-6 '>
                          <label>About</label>
                          <textarea className='form-control mt-2' name='about' id='host_about' {...formAttr(runform, 'about')} />
                          {errorContainer(runform, 'about')}
                        </div>
                        <div className='form-group col-md-6 '>
                          <label>Country</label>
                          <select className='form-control mt-2' name='country_id' id='all-country' {...formAttr(runform, 'country_id')}>
                            {country &&
                              country?.length > 0 &&
                              country.map((item: any, i) => (
                                <option value={item._id} key={i}>
                                  {item.country_name}
                                </option>
                              ))}
                          </select>
                          {errorContainer(runform, 'country_id')}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className='row mt-6'>
                        <div className='form-group col-md-6 '>
                          <label>Email</label>
                          <input type='text' name='email' className='form-control mt-2' id='host_email' {...formAttr(runform, 'email')} />
                          {errorContainer(runform, 'email')}
                        </div>
                        <div className='form-group col-md-6 '>
                          <label>Diamond / Min</label>
                          <input type='number' name='diamond_per_min' className='form-control mt-2' id='host_diamond_per_min' {...formAttr(runform, 'diamond_per_min')} />
                          {errorContainer(runform, 'diamond_per_min')}
                        </div>
                      </div>
                    </div>

                    <button type='submit' className='btn-comn-submit mt-8'>
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
        <div className='row cutome-g g-5 mt-8 '>
          <div className='col-12 col-md-6'>
            <div className='table-custom-info card-shadow'>
              <div className='row'>
                <div className='col-12 d-flex align-items-center mt-4'>
                  <h2>Images</h2>
                  <button className='btn-comn-submit ms-auto me-2' onClick={() => setShow(true)}>
                    Add Image
                  </button>
                </div>
              </div>
              <RtdDatatable data={images} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
            </div>
          </div>
          <div className='col-12 col-md-6'>
            <div className='table-custom-info card-shadow'>
              <div className='row'>
                <div className='col-12 d-flex align-items-center mt-4'>
                  <h2>Videos</h2>
                  <button className='btn-comn-submit ms-auto me-2' onClick={() => setShowVid(true)}>
                    Add Video
                  </button>
                </div>
              </div>
              <RtdDatatable data={videos} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
            </div>
          </div>
        </div>

        <Modal show={show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <AddImage HostId={hostData?._id} appModalClose={appModalClose} getAllImage={getAllImage} />
        </Modal>

        <Modal show={showVid} onHide={() => videoClose()} size='lg' className='cust-comn-modal' centered>
          <AddVideo HostId={hostData?._id} appModalClose={videoClose} getAllVideo={getAllVideo} />
        </Modal>

        <Modal show={view} onHide={() => setView(false)} size='lg' className='cust-comn-modal' centered>
          <ImageView image={img} setView={setView} video={video} />
        </Modal>
      </div>
    </>
  )
}

export default ViewHost
