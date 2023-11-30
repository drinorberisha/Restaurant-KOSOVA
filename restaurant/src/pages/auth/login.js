import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import styles from './LoginPage.module.css'; // Adjust the path to your CSS module
import Image from "next/image";
import background from "../../../public/loginView.jpg";
import sticknote from "../../../public/sticknote.png"; // Import the sticknote.png for the logo
import menuImage from "../../../public/menu.jpg"; // Import the menu.png image
import { fetchUnpaidTableTotals, loginUser } from "@/utils/api";
import { useDispatch } from 'react-redux';
import { updateTotals, updateTableTotals} from "../../../store/features/tableTotalsSlice";
const LoginPage = () => {
  const [inputValue, setInputValue] = useState(""); 
  const router = useRouter();
  const dispatch = useDispatch();
 
  const checkPassword = async (password) => {
    try {
        const response = await loginUser(password);
        console.log(response);
        if (response && response.role){
            console.log('Password is correct');
            localStorage.setItem("userId",response.user_id);
            localStorage.setItem("userRole",response.role);
            localStorage.setItem("isActive", true);
        
              console.log("BEFORE FETCHUNPAIDTABLETOTALS");

              const response1 = await fetchUnpaidTableTotals();
              console.log("AFTER FETCHUNPAIDTABLETOTALS");

              console.log("TOTALS, TOTALS, TOTALS:", response1);
              dispatch(updateTotals(response1));
           
            router.push("/");
            // window.location.reload();

          } else {
            console.log('Error:', response.message);
            alert('Password incorrect');
            
        }
    } catch (error) {
        console.error('Error making the request:', error.response?.data?.message || error.message);
    }
  };
  const handleLogin = () =>{
    checkPassword(inputValue);
  }
  
  const handleKeypadClick = (number) => {
    if (inputValue.length < 4) {
        setInputValue(prevValue => prevValue + number);
    }
  };

  const clearPasswordInput = () => {
    setInputValue("");
  };

  const handleBackspaceClick = () => {
    setInputValue((prevValue) => prevValue.slice(0, -1)); // Remove the last character
  };
  const fetchTableTotals = async () => {
    try {
      // Replace with your actual API call
      const response = await fetchUnpaidTableTotals();
      console.log("AFTER LOGIN, totals of unpaid orders:",response);
        return response;
    } catch (error) {
      console.error('Error fetching table totals:', error);
      throw error;
    }
  };
  return (
    <div className={styles.background}>
      {/* <NavPage/> */}
      <Image src={menuImage} alt="Menu" className="z-0" />
      <div className="absolute text-center p-5 z-10 max-w-max left-1/2 transform -translate-x-1/2">
        <h2 className="mt-[-55px]">Login</h2>
        <Image src={sticknote} alt="Logo" className="w-25 mb-5" />
        <br />
        <input
          type="password"
          value={inputValue}
          placeholder="Pin"
          readOnly
          className="text-lg mb-6 w-72 h-10"
        />
        <div className="grid grid-cols-3 gap-2.5 w-56 m-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '\u232B'].map((key) => (
            <button
              key={key}
              onClick={key === 'C' ? clearPasswordInput : key === '\u232B' ? handleBackspaceClick : () => handleKeypadClick(key)}
              className="text-lg h-12 w-15"
            >
              {key}
            </button>
          ))}
        </div>
        <br />
        <button
          onClick={handleLogin}
          className="bg-green-500 w-72 py-3.5 text-lg"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
