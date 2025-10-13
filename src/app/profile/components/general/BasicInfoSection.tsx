import { User } from "@/types/user";
import { FC, useState } from "react";
import { arrowRightIcon } from "../../../../components/icon/icon";
import useUpdateUser from "../../_hooks/useUpdateUser";
import { EditPasswordForm } from "../password/EditPasswordForm";
import { EditForm } from "./EditForm";
import ProfilePicSection from "./ProfilePicSection";

interface BasicInfoSectionProps {
  user: User;
}

const BasicInfoSection: FC<BasicInfoSectionProps> = ({ user }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const { mutate: updateUser } = useUpdateUser(user.id!);

  const handleOpenEditForm = () => setShowEditForm(true);
  const handleOpenPasswordForm = () => setShowPasswordForm(true);
  const handleClosePasswordForm = () => setShowPasswordForm(false);

  return (
    <section>
      {showEditForm && (
        <EditForm
          onClose={() => setShowEditForm(false)}
          initialFirstName={user?.firstName}
          initialLastName={user?.lastName}
          initialEmail={user?.email}
        />
      )}

      {showPasswordForm && (
        <EditPasswordForm onClose={handleClosePasswordForm} />
      )}

      <div className="bg-white w-full mt-8 rounded-2xl">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#0290d1]">
            Profile & Contact Info
          </h2>
        </div>
        <ProfilePicSection user={user} />
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <span className="text-gray-600 font-semibold">First Name</span>
          <div className="flex items-center">
            <span className="text-gray-800 mr-2">{user?.firstName}</span>
            <div
              onClick={
                user?.provider === "GOOGLE" ? undefined : handleOpenEditForm
              }
              className={`cursor-pointer ${
                user?.provider === "GOOGLE"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && user?.provider !== "GOOGLE")
                  handleOpenEditForm();
              }}
            >
              {arrowRightIcon}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-2xl">
          <span className="text-gray-600 font-semibold">Last Name</span>
          <div className="flex items-center">
            <span className="text-gray-800 mr-2">{user?.lastName}</span>
            <div
              onClick={
                user?.provider === "GOOGLE" ? undefined : handleOpenEditForm
              }
              className={`cursor-pointer ${
                user?.provider === "GOOGLE"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && user?.provider !== "GOOGLE")
                  handleOpenEditForm();
              }}
            >
              {arrowRightIcon}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white w-full mt-8 rounded-2xl">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#0290d1]">
            Contact info & Privacy
          </h2>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <span className="text-gray-600 font-semibold">Email</span>
          <div className="flex items-center">
            <span className="text-gray-800 mr-2">{user?.email}</span>
            <div
              onClick={
                user?.provider === "GOOGLE" ? undefined : handleOpenEditForm
              }
              className={`cursor-pointer ${
                user?.provider === "GOOGLE"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && user?.provider !== "GOOGLE")
                  handleOpenEditForm();
              }}
            >
              {arrowRightIcon}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 rounded-2xl">
          <span className="text-gray-600 font-semibold">Password</span>
          <div className="flex items-center">
            <span className="text-gray-800 mr-2">******</span>
            <div
              onClick={handleOpenPasswordForm}
              className={`cursor-pointer ${
                user?.provider === "GOOGLE"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" && user?.provider !== "GOOGLE")
                  handleOpenPasswordForm();
              }}
            >
              {arrowRightIcon}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BasicInfoSection;
