import SOFTSTAKING_CONTRACT_ABI from "./abis/SoftStaking_ABI.json";
const SOFTSTAKING_ADDRESS = import.meta.env.VITE_SOFTSTAKING_ADDRESS;

const Constants = { SOFTSTAKING_ADDRESS, SOFTSTAKING_CONTRACT_ABI };

export default Constants;