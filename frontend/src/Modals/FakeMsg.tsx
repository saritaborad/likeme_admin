import {Formik} from 'formik'
import React, {useState} from 'react'
import * as Yup from 'yup'
import {errorContainer, formAttr} from '../commonFun'

interface IPROPS {
  submitFormData?: any
  appModalClose?: any
}

const FakeMsg: React.FC<IPROPS> = ({submitFormData, appModalClose}) => {
  const [show, setShow] = useState(false)
  const [imgUrl, setImgUrl] = useState<any>()

  return (
    <div>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2 className='modal-title' id='add-notification-admin'>
            Add Message
          </h2>
          <button type='button' className='btn-close' onClick={appModalClose}></button>
        </div>
        <div className='modal-body'>
          <Formik
            enableReinitialize
            initialValues={{
              title: '',
            }}
            validationSchema={Yup.object({
              title: Yup.string().required('required.'),
            })}
            onSubmit={(formData, {resetForm}) => submitFormData(formData)}
          >
            {(runform) => (
              <form onSubmit={runform.handleSubmit}>
                <input type='hidden' name='_token' defaultValue='A0mI1xVDj1xatfxy7NK3jIJsupMl6dZXgyPhmK18' />{' '}
                <div className='form-group'>
                  <div className='form-check form-switch col-md-6 mt-4'>
                    <label htmlFor='Switch' className=''>
                      Turn on to add Image
                    </label>

                    <input
                      className='form-check-input'
                      type='checkbox'
                      // id={`mode${i}`}
                      // defaultChecked={data[i]?.enable === 1 ? true : false}
                      onChange={() => setShow(!show)}
                    />
                  </div>
                  <br />
                  {!show && (
                    <div id='add-title-cheat' className=''>
                      <div id='title-message-in'>
                        <label>Message</label>
                        <input type='text' name='title' id='title-message' className='form-control mt-2' required {...formAttr(runform, 'title')} />
                        {errorContainer(runform, 'title')}
                      </div>
                    </div>
                  )}
                  {show && (
                    <div className='d-flex flex-column mt-5' id='img-add-messag'>
                      <label>Select Images Only</label>
                      <label htmlFor='imagefile_message'>
                        <img height={120} width={120} className='MessageCheatFile mt-2' id='MessageCheatFile' src={imgUrl ? URL.createObjectURL(imgUrl) : 'https://likeme.live/assets/img/default.png'} />
                      </label>
                      <input
                        type='file'
                        name='title'
                        required
                        id='imagefile_message'
                        className='imagefile_message '
                        accept='image/x-png,image/jpeg,application/pdf'
                        hidden
                        onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setImgUrl(e.target.files?.[0] || null)
                          runform.setFieldValue('title', e.target.files?.[0])
                        }}
                      />
                    </div>
                  )}
                </div>
                <button type='submit' className='btn-comn-submit mt-8'>
                  Submit
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default FakeMsg
