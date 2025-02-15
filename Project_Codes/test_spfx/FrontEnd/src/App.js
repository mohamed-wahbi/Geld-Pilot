import React from 'react'
import "./App.css"
import A from "./A.png"

const App = () => {
  return (
    <div className='InfoPlatformComp'>
      <div className='TitreComp'>Key Factors of the "Alight MEA" Financial Management Platform</div>
      <div className='CardInfoComp'>
        <div className='cardInfoItem' style={{"flex-direction": "row"}}>
          <img src={A} alt='abc'/>
          <div className='descInfo'>
            <h4>Digitization and Automation of Processes</h4>
            <p>Transformation of old Excel files into dynamic web interfaces with automated functionalities. This reduces manual errors, speeds up corrective interventions, and improves financial management.</p>
          </div>
        </div>

        <div className='cardInfoItem' style={{"flex-direction": "row-reverse"}}>
          <img src={A} alt='abc'/>
          <div className='descInfo'>
            <h4>Integration with Dataverse for Optimized Data Management</h4>
            <p>Centralized storage of financial data in Dataverse to prevent issues related to large data volumes. This ensures better organization, improved accessibility, and increased reliability of financial information.</p>
          </div>
        </div>

        <div className='cardInfoItem' style={{"flex-direction": "row"}}>
          <img src={A} alt='abc'/>
          <div className='descInfo'>
            <h4>Financial Analysis and Dynamic Reporting with Power BI</h4>
            <p>Integration of financial results with interactive Power BI dashboards. This approach allows decision-makers to quickly identify trends, anticipate issues, and take preventive corrective actions based on accurate analyses.</p>
          </div>
        </div>

        <div className='cardInfoItem' style={{"flex-direction": "row-reverse"}}>
          <img src={A} alt='abc'/>
          <div className='descInfo'>
            <h4>Automation and Intelligent Assistance</h4>
            <p>Implementation of automated workflows via Power Automate for critical financial alerts and notifications. Additionally, the integration of a chatbot with Power Virtual Agent helps financial agents quickly obtain precise information on financial data.</p>
          </div>
        </div>

        <div className='cardInfoItem' style={{"flex-direction": "row"}}>
          <img src={A} alt='abc'/>
          <div className='descInfo'>
            <h4>Predicting Financial Success Rate with AI</h4>
            <p>Utilization of artificial intelligence models to analyze financial data and predict the success rate of implemented economic strategies. Through machine learning, the platform can identify potential risks and recommend adjustments to improve financial performance.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
