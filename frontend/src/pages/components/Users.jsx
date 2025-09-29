


const Users = ({ name, username , onDelete, userId, isCurrentUser}) => {
  return (
    <li
      key={"hello"}
      className="p-3  gap-7 border-none bg-[rgba(153,0,255,0.51)] h-[200px] w-60 flex flex-col text-white rounded-[20px] transition duration-500 hover:-translate-y-[2px] shadow-lg hover:shadow-[3px_3px_25px_rgba(0,0,0,0.5)]"
    >
      <div className="flex flex-col overflow-auto custom-scrollbar gap-1 mt-3">
        <p>
          Name:<span>{name}</span>
        </p>
        <p>
          Username:<span>{username}</span>
        </p>
      </div>
      <div className="flex flex-row justify-between p-2 ">
        <button
          className="bg-green-500
                                    rounded-full
                                    w-20 h-9 
                                    shadow-lg
                                    cursor-pointer 
                                    hover:scale-110 
                                    hover:-translate-y-0.5 
                                    hover:shadow-[0_2px_20px_rgba(0,255,0,0.6)]
                                    transition ease-in-out 
                                    delay-150 
                                    duration-500 
                                    "
        >
          Update
        </button>
        <button
          onClick ={()=>onDelete(userId)} className="bg-red-500
                                    rounded-full
                                    w-20 h-9 
                                    shadow-lg
                                    cursor-pointer 
                                    hover:scale-110 
                                    hover:-translate-y-0.5 
                                    hover:shadow-[0_2px_20px_rgba(255,0,0,0.6)]
                                    transition ease-in-out 
                                    delay-150 
                                    duration-500 
                                    "
        >
          {isCurrentUser ? "!Delete" : "Delete"}
        </button>
      </div>
    </li>
  );
};

export default Users;
