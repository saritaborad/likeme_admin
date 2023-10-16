import React, {useState} from 'react'
import {useAllCountry} from '../hooks/customHook'
import {errorContainer, formAttr} from '../commonFun'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {toast} from 'react-toastify'
import {addfakeUser} from '../ApiService/_requests'
import {useNavigate} from 'react-router-dom'

interface Image {
  url: string
  file: File | null
}

const AddFakeUser: React.FC = () => {
  const [images, setImages] = useState<Image[]>([])
  const country = useAllCountry()
  const navigate = useNavigate()

  const submitFormData = async (formData: any) => {
    if (!formData.images || formData.images.length === 0) {
      toast.error('No image selected')
      return
    }
    const formdata = new FormData()
    for (const key in formData) if (key !== 'images') formdata.append(key, formData[key])
    for (let i = 0; i < formData.images.length; i++) formdata.append(`images`, formData.images[i])

    const {data} = await addfakeUser(formdata)
    if (data.status === 200) {
      toast.success(data.message)
      navigate('/hosts')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files) {
      const newImages: Image[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const reader = new FileReader()

        reader.onload = (event) => {
          const imageUrl = event.target?.result as string
          newImages.push({url: imageUrl, file})
          if (newImages.length === files.length) {
            setImages([...images, ...newImages])
          }
        }

        reader.readAsDataURL(file)
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)
  }

  return (
    <div className='container-fluid'>
      <div className='row mt-8'>
        <div className='col-12'>
          <div className='card-shadow'>
            <div className='card'>
              <div className='card-header d-flex align-items-center'>
                <h2>Add Fake Host</h2>
              </div>
              <div className='card-body'>
                <Formik
                  enableReinitialize
                  initialValues={{
                    fullName: '',
                    age: '',
                    country_id: '',
                    bio: '',
                    about: '',
                  }}
                  validationSchema={Yup.object({
                    fullName: Yup.string().required('required.'),
                    age: Yup.number().required('required.'),
                    country_id: Yup.string().required('required.'),
                    bio: Yup.string().required('required.'),
                    about: Yup.string().required('required.'),
                  })}
                  onSubmit={(formData, {resetForm}) => {
                    submitFormData({...formData, images: images?.length > 0 && images.map((obj) => obj.file)})
                  }}
                >
                  {(runform) => (
                    <form onSubmit={runform.handleSubmit}>
                      <input type='hidden' name='_token' defaultValue='EjAY5yPivM7ZAH2SisFwbB3rRK2Fj1AFLwH6sPuE' />{' '}
                      <div className='row'>
                        <div className='form-group col-md-4'>
                          <label htmlFor='fullname'>Full Name</label>
                          <input autoComplete='off' className='fullname form-control mt-2' name='fullName' type='text' id='host-fullname' {...formAttr(runform, 'fullName')} />
                          {errorContainer(runform, 'fullName')}
                        </div>
                        <div className='form-group col-md-4'>
                          <label htmlFor='age of user'>Age</label>
                          <input className='fake_user_age form-control mt-2' name='age' type='number' id='age' {...formAttr(runform, 'age')} />
                          {errorContainer(runform, 'age')}
                        </div>
                        <div className='form-group col-md-4'>
                          <label htmlFor='contry'> Country</label>
                          <select className='form-control mt-2' name='country_id' id='agent-contry_add' {...formAttr(runform, 'country_id')}>
                            <option value='' disabled>
                              select country
                            </option>
                            {country?.length > 0 &&
                              country?.map((item: any, i) => {
                                return (
                                  <option key={i} value={item._id} id={item.country_name}>
                                    {item.country_name}
                                  </option>
                                )
                              })}
                          </select>
                          {errorContainer(runform, 'country_id')}
                        </div>
                      </div>
                      <div className='row mt-6'>
                        <div className='form-group col-md-6'>
                          <label>Bio</label>
                          <textarea className='form-control mt-2' id='host_bio' name='bio' {...formAttr(runform, 'bio')} />
                          {errorContainer(runform, 'bio')}
                        </div>
                        <div className='form-group col-md-6 '>
                          <label>About</label>
                          <textarea className='form-control mt-2' name='about' id='host_about' {...formAttr(runform, 'about')} />
                          {errorContainer(runform, 'about')}
                        </div>
                      </div>
                      <div id='myImg' className='d-flex mt-8'>
                        {images.map((image, index) => (
                          <div className='form-group position-relative' key={index}>
                            <img src={image.url} className='mx-2 rounded' style={{maxWidth: '100%', width: '100px', height: '100px'}} alt='' />
                            <div className='close-image' onClick={() => handleRemoveImage(index)}>
                              <i className='far fa-times-circle bg-dark rounded-circle text-white' />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className='row'>
                        <div className='d-flex flex-column mt-6'>
                          <input type='file' accept='image/png, image/gif, image/jpeg' id='productimages' name='images' multiple hidden onChange={handleImageUpload} />
                          <label htmlFor='productimages' style={{width: 200}} className='btn user-btn btn-dark'>
                            Select Images
                          </label>
                        </div>
                      </div>
                      <button type='submit' className='btn-comn-submit mt-4'>
                        Submit
                      </button>
                    </form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddFakeUser
