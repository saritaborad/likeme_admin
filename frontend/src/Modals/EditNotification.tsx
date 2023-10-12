import {Formik, FormikProps} from 'formik'
import React, {useRef} from 'react'
import * as Yup from 'yup'
import {errorContainer, formAttr} from '../commonFun'

interface IPROPS {
  submitFormData?: any
  notificationData?: any
  appModalClose?: any
}

const EditNotification: React.FC<IPROPS> = ({notificationData, submitFormData, appModalClose}) => {
  return (
    <div className='modal-content'>
      <div className='modal-header'>
        <h3 className='modal-title' id='edit-notification'>
          Edit Notification
        </h3>
        <button type='button' className='btn-close' onClick={appModalClose}></button>
      </div>
      <div className='modal-body'>
        <Formik
          enableReinitialize
          initialValues={{
            _id: notificationData?._id,
            title: notificationData?.title ? notificationData?.title : '',
            description: notificationData?.description ? notificationData?.description : '',
          }}
          validationSchema={Yup.object({
            title: Yup.string().required('required.'),
            description: Yup.string().required('required.'),
          })}
          onSubmit={(formData, {resetForm}) => {
            submitFormData({...formData})
          }}
        >
          {(runform) => (
            <form method='post' onSubmit={runform.handleSubmit}>
              <input type='hidden' name='_token' defaultValue='iybw3ylRTQ7mpkUJxg9ahYBTvpDuoS2XgBfoY6U8' /> <input id='NotificationId' name='id' className='form-control' type='hidden' defaultValue={8251} />
              <div className='form-group'>
                <label>Title</label>
                <input type='text' className='form-control mt-2' required name='title' {...formAttr(runform, 'title')} />
                {errorContainer(runform, 'title')}
              </div>
              <div className='form-group mt-3'>
                <label>Description</label>
                <input type='text' className='form-control mt-2' required name='description' {...formAttr(runform, 'description')} />
                {errorContainer(runform, 'description')}
              </div>
              <button type='submit' className='btn-comn-submit mt-5'>
                Edit Notification
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default EditNotification
