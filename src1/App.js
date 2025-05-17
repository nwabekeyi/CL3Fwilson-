

 import React, { useEffect } from "react";
 import "./assets/css/style.css";
 import "./assets/css/responsive.css";
 import AOS from "aos";
 import "aos/dist/aos.css";
 import Routes from "./routes";
 
 const App = () => {
   useEffect(() => {
     AOS.init();
   }, []);
 
   return (
     <div>
       <Routes />
     </div>
   );
 };
 
 export default App;
 