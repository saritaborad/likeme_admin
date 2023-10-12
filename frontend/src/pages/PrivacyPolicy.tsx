import {useEffect, useRef, useState} from 'react'
import {CKEditor} from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import {uploadPlugin} from '../plugins/uploadPlugin'
import {errorContainer} from '../commonFun'
import {Formik} from 'formik'
import * as Yup from 'yup'
import {addPageData, getPageData} from '../ApiService/_requests'
import {toast} from 'react-toastify'

const PrivacyPolicy: React.FC = () => {
  const [description, setDescription] = useState('')
  const sendRef: any = useRef()

  useEffect(() => {
    getPage()
  }, [])

  const getPage = async () => {
    const {data} = await getPageData({type: 1})
    setDescription(data?.privacy_policy || '')
  }

  const inputHandler = (event: any, editor: any) => {
    setDescription(editor.getData())
    sendRef?.current?.setFieldValue('description', editor.getData())
  }

  const submitForm = async (formData: any) => {
    const {data} = await addPageData(formData)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
  }

  return (
    <>
      <div className='col-12 card-shadow'>
        <div className='card '>
          <div className='card-header d-flex align-items-center'>
            <h1>Privacy Policy</h1>
          </div>
          <div className='card-body'>
            <Formik
              innerRef={sendRef}
              enableReinitialize
              initialValues={{
                description: description || '',
                type: 1,
              }}
              validationSchema={Yup.object({
                description: Yup.string().required('Description is required.'),
              })}
              onSubmit={(formData, {resetForm}) => submitForm(formData)}
            >
              {(runform) => (
                <form onSubmit={runform.handleSubmit}>
                  <input type='hidden' name='_token' defaultValue='KWznUCpRW0PExa08gOtytrOUs5NdYiy989FkD7KS' />
                  <div className='form-group'>
                    <CKEditor
                      id='inputText'
                      data={description}
                      config={{
                        extraPlugins: [uploadPlugin],
                        link: {defaultProtocol: 'http://'},
                      }}
                      editor={ClassicEditor}
                      onChange={inputHandler}
                    />
                    {errorContainer(runform, 'description')}
                  </div>
                  <button type='submit' className='btn-comn-submit mt-5'>
                    Submit
                  </button>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  )
}

export default PrivacyPolicy
