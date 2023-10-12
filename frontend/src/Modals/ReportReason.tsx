import {Formik} from 'formik'
import React from 'react'
import * as Yup from 'yup'
import {errorContainer, formAttr} from '../commonFun'

interface IPROPS {
  update?: any
  reasonInfo?: any
  submitFormData?: any
  updateReason?: any
  appModalClose?: any
}
const ReportReasonModal: React.FC<IPROPS> = ({update, reasonInfo, submitFormData, updateReason, appModalClose}) => {
  return (
    <div>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2 className='modal-title' id='gifts-one'>
            {update ? 'Edit Report Reason' : 'Add Report Reason'}
          </h2>
          <button type='button' className='btn-close' onClick={appModalClose}></button>
        </div>
        <div className='modal-body'>
          <Formik
            enableReinitialize
            initialValues={{
              _id: reasonInfo && reasonInfo?._id,
              title: reasonInfo?.title || '',
            }}
            validationSchema={Yup.object({
              title: Yup.string().required('required.'),
            })}
            onSubmit={(formData, {resetForm}) => {
              update ? updateReason(formData) : submitFormData(formData)
            }}
          >
            {(runform) => (
              <form onSubmit={runform.handleSubmit}>
                <div>
                  <input type='hidden' name='_token' defaultValue='DHABN9R9DWP9QKL2Ajh9kcg9ohGCSQPkI97CoVcM' /> <input id='reportResonId' name='id' className='form-control' type='hidden' />
                  <div className='form-group'>
                    <label>Reason Title</label>
                    <input type='text' className='form-control mt-2' required name='title' id='report-resone-title' {...formAttr(runform, 'title')} />
                    {errorContainer(runform, 'title')}
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
    </div>
  )
}

export default ReportReasonModal
