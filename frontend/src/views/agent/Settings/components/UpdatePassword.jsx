import { PasswordFormInput } from "@/components";
import { Button, Card, CardHeader } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useAuthContext } from "../../../../states/useAuthContext";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const UpdatePassword = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const { removeSession } = useAuthContext();

  const passwordSchema = yup.object({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required("Please confirm your password"),
  });

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onUpdatePassword = async (data) => {
    setLoading(true);
    try {
      const response = await axios.patch(
        "http://localhost:5000/api/v1/auth/update/password",
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire("Success", "Password updated successfully!", "success");
        removeSession();
        reset();
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update password",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card className="border">
      <CardHeader className="border-bottom">
        <h5 className="card-header-title">Update Password</h5>
        {user?.email && (
          <p className="mb-0">
            Your current email address is{" "}
            <span className="text-primary">{user?.email}</span>
          </p>
        )}
      </CardHeader>

      <form onSubmit={handleSubmit(onUpdatePassword)} className="card-body">
        <PasswordFormInput
          name="currentPassword"
          label="Current password"
          placeholder="Enter current password"
          containerClass="mb-3"
          control={control}
        />

        <PasswordFormInput
          name="newPassword"
          label="Enter new password"
          placeholder="Enter new password"
          containerClass="mb-3"
          control={control}
        />

        <PasswordFormInput
          name="confirmPassword"
          label="Confirm new password"
          placeholder="confirm new password"
          containerClass="mb-3"
          control={control}
        />

        <div className="text-end">
          <Button type="submit" variant="primary" className="mb-0">
            Change Password
          </Button>
        </div>
      </form>
    </Card>
  );
};
export default UpdatePassword;
