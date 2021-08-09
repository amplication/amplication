import { TextField, ToggleField } from "@amplication/design-system";

import "@rmwc/snackbar/styles";
import { Form, Formik } from "formik";
import React from "react";

import { match } from "react-router-dom";
import "./ApplicationForm.scss";
type Props = {
  match: match<{ application: string }>;
};

const CLASS_NAME = "application-form";

function ApplicationAuthSettingForm({ match }: Props) {

  return (
    <div className={CLASS_NAME}>
      
        <Formik
      
              initialValues={{}}
      
              onSubmit={() => { }}
        >
          {(formik) => {
            return (
              <Form>
                <h3>Authentication Providers</h3>
               
                
                    <TextField name="dbHost" autoComplete="off" label="Default Provider" value={ "Basic HTTP"}/>
                  <ToggleField
                    name="http"
                    label="Basic HTTP"
                    />
                    <br />
                        <ToggleField
                    name="jwt"
                    label="JWT"
              />
                
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
