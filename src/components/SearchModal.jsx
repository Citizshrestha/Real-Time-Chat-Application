import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { RiSearchLine } from "react-icons/ri";
import defaultAvatar from "../../public/assets/default.jpg";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import PropTypes from "prop-types"
const SearchModal = ({ startChat }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);

    const openModal = () => setIsModalOpen(!isModalOpen);
    const closeModal = () => setIsModalOpen(!isModalOpen);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            alert("Please enter username you want to search");
            return;
        }

        try {
            const normalizedSearchTerm = searchTerm.toLowerCase();
            const q = query(
                collection(db, "users"),
                where("username", ">=", normalizedSearchTerm),
                where("username", "<=", normalizedSearchTerm + "\uf8ff")
            );
            const querySnapshot = await getDocs(q);

            const foundUsers = [];
            querySnapshot.forEach((doc) => {
                foundUsers.push(doc.data());
            });
            if (foundUsers.length === 0) {
                alert("No users found");
            }
            setUsers(foundUsers);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <button onClick={openModal} className="bg-[#D9F2ED] w-[35px] h-[35px] p-2 flex items-center justify-center rounded-lg">
                <RiSearchLine color="#01AA85" className="w-[18px] h-[18px]" />
            </button>
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex justify-center items-center bg-[#00170cb7]" onClick={closeModal}>
                    <div className="relative w-full max-w-md max-h-full p-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative bg-[#0c58b4] w-[100%] rounded-md shadow-lg">
                            <div className="flex items-center justify-between p-4 border-b border-gray-300 md:p-5">
                                <h3 className="text-xl font-semibold text-white">Search Chat</h3>
                                <button onClick={closeModal} className="text-white bg-transparent hover:bg-[#d9f2ed] hover:text-[#01AA85] rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center">
                                    <FaXmark size={20} />
                                </button>
                            </div>
                            <div className="p-4 md:p-5">
                                <div className="space-y-4">
                                    <div className="flex gap-2">
                                        <input 
                                            onChange={(e) => setSearchTerm(e.target.value)} 
                                            type="text" 
                                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg outline-none w-full p-2.5" 
                                            placeholder="Search users" 
                                        />
                                        <button onClick={handleSearch} className="px-3 py-2 text-white bg-blue-900 rounded-lg">
                                            <FaSearch />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    {users?.map((user) => (
                                        <div  
                                            key={user.username}
                                            className="flex items-start gap-3 bg-[#15eabc34] p-3 mb-5 rounded-lg cursor-pointer border border-[#ffffff20] shadow-lg"
                                            onClick={() => { 
                                                startChat(user);
                                                closeModal();
                                            }}
                                        >
                                            <img src={user.image || defaultAvatar} className="h-[40px] w-[40px] rounded-full" alt="" />
                                            <span>
                                                <h2 className="p-0 font-semibold text-white text-[18px]">{user.fullName}</h2>
                                                <p className="text-[13px] text-white">@{user.username}</p>
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

SearchModal.propTypes = {
  startChat: PropTypes.func.isRequired,
};
export default SearchModal;