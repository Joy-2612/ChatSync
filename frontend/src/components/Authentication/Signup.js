import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import "./Signup.css";

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "ChatApp");
      data.append("cloud_name", "dmkrlx7h6");
      // fetch("https://api.cloudinary.com/v1/piyushproj/image/upload", {
      fetch("https://api.cloudinary.com/v1_1/dmkrlx7h6/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return (
    <div className="signup-container">
      <label>Name</label>
      <input
        type="text"
        placeholder="Enter Your Name"
        onChange={(e) => setName(e.target.value)}
      />
      <label>Email Address</label>
      <input
        type="email"
        placeholder="Enter Your Email Address"
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Password</label>
      <div className="password-input">
        <input
          type={show ? "text" : "password"}
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="show-hide-button" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
      <label>Confirm Password</label>
      <div className="password-input">
        <input
          type={show ? "text" : "password"}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmpassword(e.target.value)}
        />
        <button className="show-hide-button" onClick={handleClick}>
          {show ? "Hide" : "Show"}
        </button>
      </div>
      <label>Upload your Picture</label>
      <input
        type="file"
        className="pic-input"
        accept="image/*"
        onChange={(e) => postDetails(e.target.files[0])}
      />
      <button
        className="signup-button"
        onClick={submitHandler}
        disabled={picLoading}
      >
        {picLoading ? "Loading..." : "Sign Up"}
      </button>
    </div>
  );
};

export default Signup;
