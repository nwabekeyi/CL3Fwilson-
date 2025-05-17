
 import React, { useEffect } from "react";
 import "./assets/css/style.css";
 import "./assets/css/responsive.css";
 import AOS from "aos";
 import "aos/dist/aos.css";
 import AppRoutes from './routes';

 const App = () => {
   useEffect(() => {
     AOS.init();
   }, []);
 
   return (
     <div style={{display:'flex', justifyContent:'center', width:'100vw'}}>
      {/* <p>Welcome to CL3Fwilson</p> */}
       <AppRoutes />
     </div>
   );
 };
 
 export default App;
 