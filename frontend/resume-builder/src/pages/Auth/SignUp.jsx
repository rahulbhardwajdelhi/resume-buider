import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const SignUp = ({setCurrentPage}) => {
  const [profilePic, setProfilePic] = useState(null); 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if(!fullName) {
      setError("Please enter full name.");
      return;
    }

    if(!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if(!password){
      setError("Please enter pasword.");
      return;
    }

    setError("");

    try { 
      // First register user (without image)
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, { 
        name: fullName,
        email,
        password,
        profileImageUrl: "",
      });
      const {token} = response.data;
      if (token) {
        localStorage.setItem("token", token);

        // If profile image chosen, upload it after auth (protected route)
        if (profilePic) {
          try {
            const formData = new FormData();
            formData.append("image", profilePic);
            const uploadRes = await axiosInstance.post(
              API_PATHS.IMAGE.UPLOAD_IMAGE,
              formData,
              { headers: { "Content-Type": "multipart/form-data" } }
            );
            updateUser({
              ...response.data,
              profileImageUrl: uploadRes?.data?.imageUrl || null,
            });
          } catch (imgErr) {
            // Image upload failure shouldn't block signup
            updateUser(response.data);
          }
        } else {
          updateUser(response.data);
        }
        navigate("/dashboard");
      }     
    } catch (error) {
      if(error.response && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError("Something went wrong. Please try again!");
      }
    }
  }
  return (
    <div className="w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center"> 
      <h3 className="text-lg font-semibold text-black">Create an Account</h3> 
      <p className="text-xs text-slate-700 mt-[5px] mb-6">
        Join us today by entering your details below.
      </p>

      <form onSubmit={handleSignUp}>

        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
          <Input
            value={fullName}
            onChange={({ target }) => setFullName(target.value)} 
            label="Full Name"
            placeholder="Enter your name" 
            type="text"
          />

          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="Enter your mail address"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Enter your password"
            type="password"
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            SIGN UP
          </button>

          <p className="text-[13px] ☐text-slate-800 mt-3">
            Already an account?{" "}
            <button
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => {
              setCurrentPage("login");
            }}
            >
              Login
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}

export default SignUp
