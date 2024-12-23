import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { apiFinalRegister } from "../../apis/authen";

const FinalRegister = () => {
  const { token } = useParams(); // Lấy status từ URL
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await apiFinalRegister(token);
        if (response?.message === "Account verified successfully!") {
          swal("Success", response?.message, "success").then(() => {
            navigate("/login");
          });
        }
      } catch (error) {
        swal("Error", error?.response?.data?.message, "error").then(() => {
          navigate("/login"); 
        });
      }
    };
    verifyAccount();
  }, [token]);

  return <div>Processing your registration...</div>;
};

export default FinalRegister;
