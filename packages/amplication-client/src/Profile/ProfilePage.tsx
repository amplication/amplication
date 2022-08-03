import React, {useState} from "react";
import { Modal } from 
import ProfileForm from "./ProfileForm";

const ProfilePage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsOpen(false)
  }
  return (
    <div>
      <Modal onCloseEvent={handleCloseModal} open={isOpen} fullScreen><div>helllo</div></Modal>
      <h2>User Profile</h2>
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
