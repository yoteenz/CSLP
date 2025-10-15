import React, { useState } from 'react';

interface SubscribeNowProps {
  className?: string;
}

const SubscribeNow: React.FC<SubscribeNowProps> = ({ className = "" }) => {
  const [email, setEmail] = useState("");
  const [apiMessage, setApiMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSubscriptionFunction = (e: React.FormEvent) => {
    e.preventDefault();
    setApiMessage("");
    setIsLoading(true);
    
    // Simulate API call - Replace with your actual API endpoint
    setTimeout(() => {
      setIsLoading(false);
      setApiMessage("YOU'RE IN!");
    }, 1000);
  };

  return (
    <div className={`blur-box ${className}`}>
      <h1 className="text-center text-[#EB1C24] text-[10px] leading-[14px] whitespace-nowrap" style={{fontFamily: 'Futura PT Medium, sans-serif', fontWeight: '600'}}>
        A WHOLE NEW VIRTUAL SHOPPING EXPERIENCE AWAITS! <br />
        3D HAIR SALON OFFERING RAW HUMAN HAIR EXTENSIONS.
      </h1>
      <h1 className="text-[25px] font-covered sm:text-white text-[#909090] my-[3px] -mt-[2px] text-center" style={{fontFamily: 'Covered By Your Grace, cursive', fontWeight: 'normal'}}>
        SUBSCRIBE NOW!
      </h1>
      <form
        onSubmit={handleEmailSubscriptionFunction}
        className="flex flex-col gap-3 justify-center items-center w-full"
      >
        <h2 className="text-[10px] text-center text-black leading-[14px] -mt-[5px]" style={{fontFamily: 'Futura PT Medium, sans-serif', fontWeight: '600'}}>
          STAY CONNECTED & BE FIRST IN LINE TO RECEIVE UPDATES, EXCLUSIVE PERKS
          + ACCESS TO MEMBERS ONLY CONTENT.
        </h2>
        <input
          required
          value={email}
          type="email"
          className="text-[#909090] placeholder-[#909090] text-xs uppercase border-[1.4px] border-black p-1 sm:w-full w-[88%] !rounded-none focus:border-[#EB1C24] focus:outline-none"
          style={{
            fontFamily: 'Futura PT Medium, sans-serif', 
            fontWeight: '600',
            fontStyle: 'normal'
          }}
          placeholder="EMAIL ADDRESS*"
          onChange={(e) => {
            setEmail(e.target.value);
            setApiMessage("");
          }}
        />
        <div className="flex items-center flex-col">
          {apiMessage === "" ? (
            <input
              type="submit"
              className="text-[#EB1C24] uppercase text-xs bg-transparent border-none cursor-pointer"
              style={{fontFamily: 'Futura PT Medium, sans-serif', fontWeight: '600'}}
              value={isLoading ? "Processing..." : "SIGN UP"}
            />
          ) : (
            <label className="text-[#EB1C24] uppercase text-xs" style={{fontFamily: 'Futura PT Medium, sans-serif', fontWeight: '600'}}>
              {apiMessage}
            </label>
          )}
        </div>
      </form>
    </div>
  );
};

export default SubscribeNow;









