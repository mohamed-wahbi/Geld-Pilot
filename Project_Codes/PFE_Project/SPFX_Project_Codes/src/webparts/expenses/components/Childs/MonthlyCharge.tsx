import * as React from 'react';
 const AOS = require("aos");
import "aos/dist/aos.css";










const MonthlyCharge: React.FC = () => {

 

  React.useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);

  return (
    <div> 
      Monthly charge
    </div>
  );
};

export default MonthlyCharge;
