import { TextField, ToggleField } from "@amplication/design-system";

import "@rmwc/snackbar/styles";
import { Form, Formik } from "formik";
import React from "react";

import { match } from "react-router-dom";

import "./ApplicationAuthSettingForm.scss"
type Props = {
  match: match<{ application: string }>;
};

const CLASS_NAME = "application-auth-settings-form";

function ApplicationAuthSettingForm({ match }: Props) {

  return (
    <div className={CLASS_NAME}>
      
        <Formik
        initialValues={{
          http: true,
          jwt:false,
          authentication_method: "http",
              }}
              onSubmit={() => { }}
        >
        {(formik) => {
          
            return (
              <Form>
                <h3>Authentication Providers</h3> 
                    
                
                <select name="authentication_method" onChange={(e) => {
                  if (e.target.value === "http") {
                    formik.setFieldValue("http", true);
                    formik.setFieldValue("jwt", false);
                  }
                  else {
                    formik.setFieldValue("jwt", true);
                    formik.setFieldValue("http", false);
                  }
                  formik.handleChange(e)
                }
                }>
                  <option selected value="http">Basic HTTP</option>
                  <option value="jwt">JWT</option>
                </select>
                <div style={{marginTop :"10px"}}>
                <ToggleField
                    name="http"
                    label="Basic HTTP"
                    disabled={!false}
                    
                  />
                  </div>
                  <div style={{marginTop :"10px"}}>
                        <ToggleField
                    name="jwt"
                    label="JWT"
                    disabled={!false}
                    
                  />
                  </div>
                
                    <hr />

                    <h3>Default Credentials</h3>
              
            
                <TextField
                  name="dbName"
                  autoComplete="off"
                  label="App Default User Name"
                />
                <TextField
                  name="dbPort"
                  type="number"
                  autoComplete="off"
                  label="App Default Password"
                />
               
              </Form>
            );
          }}
        </Formik>
     
    </div>
  );
}

export default ApplicationAuthSettingForm;
