const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export default class Customer {
  email: string;
  firstName: string;
  lastName: string;

  constructor(email: string, firstName: string, lastName: string) {
    // Generate
    if (!EMAIL_REGEX.test(email)) {
      throw new Error("Invalid email");
    }
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
