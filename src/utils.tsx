import { Outlet, Navigate } from 'react-router-dom'
import {
  useAnchorWallet,
} from "@solana/wallet-adapter-react";

const PrivateRoutes = () => {
    let wallet = useAnchorWallet()
    let admin = "GubeRYFQHMMYDkNFgmXoB8EzD8LF78HuG2aLGLkrc4ht";
    console.log(wallet?.publicKey.toBase58())
    return(
        wallet?.publicKey.toBase58() == admin ? <Outlet/> : <Navigate to="/"/>
    )

}

export default PrivateRoutes