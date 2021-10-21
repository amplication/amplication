import { string, bool, object } from "yup";

export const CreateGitFormSchema = object().shape({
  name: string()
    .min(2, "Git repo name require minimum of 2 characters")
    .required("Repo name is missing"),
  public: bool().required("Must select if repo is public"),
});
