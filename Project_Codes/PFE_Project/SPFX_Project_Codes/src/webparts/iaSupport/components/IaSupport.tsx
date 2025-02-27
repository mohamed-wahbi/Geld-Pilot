import * as React from 'react';
import styles from './IaSupport.module.scss';
const AOS = require("aos");
import "aos/dist/aos.css";

import { FaRobot } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import {IoCloseSharp} from "react-icons/io5"
import { GoogleGenerativeAI } from "@google/generative-ai";



const IaSupport: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string>("partners");
  const [userInput, setUserInput] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [chatHistory, setChatHistory] = React.useState<{ question: string; response: string }[]>([]);
  const [togelChatContent, setTogelChatContent] = React.useState<boolean>(false);
  const [selectedResponses, setSelectedResponses] = React.useState<number[]>([]);

  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyDVipXK95cVqjfkSMav0PrJcMG1Yb2hQXo";
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value);

  const sendMessage = async () => {
    if (!userInput.trim()) return;
    setIsLoading(true);

    try {
      const result = await model.generateContent(userInput);
      const response = result?.response?.text() || "No response received.";

      setChatHistory((prev) => [
        ...prev,
        { question: userInput, response: response.normalize("NFC") }
      ]);
      setUserInput("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setSelectedResponses([]);
  };

  React.useEffect(() => {
    AOS.init({ duration: 1500, once: true });
  }, []);



  return (
    <div className={styles.DashComp}>
      {/* Header Section */}
      <div className={styles.headerDash}>
        <div className={styles.titleDash}>
          <h5 className={styles.titleTextDash}>AI Support Tools</h5>
          <img
            src={require("../assets/logo-removebg-preview.png")}
            alt="logo"
            className={styles.logoImgDash}
          />
        </div>

        {/* Navigation Tabs */}
        <div className={styles.navLinks}>
          <p
            className={`${styles.link} ${activeTab === "partners" ? styles.active : ""}`}
            onClick={() => setActiveTab("partners")}
          >
            Smarty
          </p>
          <p
            className={`${styles.link} ${activeTab === "create" ? styles.active : ""}`}
            onClick={() => setActiveTab("create")}
          >
            Geld-Bot
          </p>
        </div>
      </div>

      <div className="DashContent">
        {activeTab === "partners" && (
          <div className="TechChatboot">
            <div className="chatTechHeader">
              <h3>Hello sir 👋</h3>
              <p>Need A Technical Refresh And A Quick PDF Report? Ask Your Questions To Me 🤔⁉️</p>
              {!togelChatContent && (
                <button
                  className="getStartBtn animated"
                  onClick={() => setTogelChatContent(!togelChatContent)}
                >
                  ⬇️
                </button>
              )}
            </div>
            {togelChatContent && (
              <div className="chatbotContainer">
                <h1 className="title">
                  <FaRobot className="robotIcon animated" /> SMARTY Assistant
                </h1>

                <div className="chatBox animatedBox">
                  {chatHistory.length > 0 && (
                    <button className="clearBtn" onClick={clearChat}>
                      <IoCloseSharp />
                    </button>
                  )}
                  {chatHistory.map(({ question, response }, index) => (
                    <div key={index} className="messageGroup">
                      <div className="message user">👤 {question}</div>
                      <div className="message bot">
                        <input
                          type="checkbox"
                          checked={selectedResponses.indexOf(index) !== -1}
                          style={{ marginRight: "5px" }}
                        />
                        🤖 {response}
                      </div>
                    </div>
                  ))}
                  {isLoading && <div className="loading">⏳ Génération en cours...</div>}
                </div>

                <div className="inputArea">
                  <input
                    type="text"
                    placeholder="Écrivez votre message..."
                    value={userInput}
                    onChange={handleUserInput}
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !userInput.trim()}
                    title="Envoyer le message"
                  >
                    <IoIosSend />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "create" && <div>ChatBot Microsoft virtual agent here ! To do....</div>}
      </div>
    </div>
  );
};

export default IaSupport;
