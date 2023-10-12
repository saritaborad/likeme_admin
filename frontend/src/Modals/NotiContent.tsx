import {Formik} from 'formik'
import React from 'react'
import * as Yup from 'yup'
import {errorContainer, formAttr} from '../commonFun'

interface IPROPS {
  update?: any
  notiInfo?: any
  submitFormData?: any
  updateNotiData?: any
  appModalClose?: any
}

const NotiContent: React.FC<IPROPS> = ({update, notiInfo, submitFormData, updateNotiData, appModalClose}) => {
  return (
    <div>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2 className='modal-title' id='add-notification-admin'>
            {update ? 'Edit Notification Content' : 'Add Notification Content'}
          </h2>
          <button type='button' className='btn-close' onClick={appModalClose}></button>
        </div>
        <div className='modal-body'>
          <Formik
            enableReinitialize
            initialValues={{
              _id: notiInfo && notiInfo?._id,
              title: notiInfo?.title || '',
              description: notiInfo?.description || '',
            }}
            validationSchema={Yup.object({
              title: Yup.string().required('required.'),
              description: Yup.string().required('required.'),
            })}
            onSubmit={(formData, {resetForm}) => {
              update ? updateNotiData(formData) : submitFormData(formData)
            }}
          >
            {(runform) => (
              <form onSubmit={runform.handleSubmit}>
                <input type='hidden' name='_token' defaultValue='A0mI1xVDj1xatfxy7NK3jIJsupMl6dZXgyPhmK18' />{' '}
                <div className='form-group mt-4'>
                  <label>Title</label>
                  <input type='text' name='title' id='title' className='form-control mt-2' required {...formAttr(runform, 'title')} />
                  {errorContainer(runform, 'title')}
                </div>
                <div className='form-group mt-4'>
                  <label htmlFor='Description'>Description</label>
                  <textarea className='form-control mt-2' name='description' id='Description' {...formAttr(runform, 'description')} />
                  {errorContainer(runform, 'description')}
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

export default NotiContent
