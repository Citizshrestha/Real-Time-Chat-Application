import { useState, useEffect, useRef } from "react";
import { FaUserPlus } from "react-icons/fa";
import PropTypes from "prop-types";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import { gsap } from "gsap";

const Register = ({ isLogin, setIsLogin }) => {
  const [userData, setUserData] = useState({ fullName: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    gsap.set(formRef.current, { opacity: 1 });
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo(
      formRef.current.querySelectorAll(".input-field"),
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", delay: 0.5 }
    );

    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)", delay: 1 }
    );
  }, []);

  const handleChangeUserData = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAuth = async () => {
    setIsLoading(true);
    setError(null);

    gsap.to(buttonRef.current, { scale: 0.95, duration: 0.3, ease: "power1.inOut" });

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        username: user.email?.split("@")[0],
        fullName: userData.fullName,
        image: "",
      });

      gsap.to(formRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: "power3.in",
        onComplete: () => alert("Registration Successful"),
      });
    } catch (error) {
      console.error("Registration Error:", error.message);
      setError("Registration Failed! " + error.message);
      gsap.to(formRef.current, {
        x: -10,
        duration: 0.1,
        repeat: 5,
        yoyo: true,
        ease: "power1.inOut",
      });
    } finally {
      setIsLoading(false);
      gsap.to(buttonRef.current, { scale: 1, duration: 0.3, ease: "power1.out" });
    }
  };

  const handleButtonHover = (enter) => {
    if (!isLoading) {
      gsap.to(buttonRef.current, {
        scale: enter ? 1.05 : 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br background-image  p-4">
      <div
        ref={formRef}
        className="bg-white bg-opacity-95 rounded-2xl shadow-lg p-6 w-full max-w-sm flex flex-col items-center"
      >
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-blue-900">Sign Up for WhisperWave</h1>
          <p className="text-sm text-gray-600 mt-1">Create an account to start chatting</p>
        </div>

        <div className="w-full flex flex-col gap-4">
          <input
            type="text"
            name="fullName"
            onChange={handleChangeUserData}
            className="input-field w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            placeholder="Full Name"
            required
          />
          <input
            type="email"
            name="email"
            onChange={handleChangeUserData}
            className="input-field w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            onChange={handleChangeUserData}
            className="input-field w-full p-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            placeholder="Password"
            required
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <button
            ref={buttonRef}
            disabled={isLoading}
            onClick={handleAuth}
            className={`w-full p-3 bg-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all ${
              isLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            onMouseEnter={() => handleButtonHover(true)}
            onMouseLeave={() => handleButtonHover(false)}
          >
            {isLoading ? (
              <>Processing...</>
            ) : (
              <>
                Register <FaUserPlus />
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-600 hover:text-blue-800 underline transition-colors"
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </section>
  );
};

Register.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  setIsLogin: PropTypes.func.isRequired,
};

export default Register;