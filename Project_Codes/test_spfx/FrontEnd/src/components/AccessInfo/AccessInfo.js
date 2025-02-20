import React from 'react'
import "../AccessInfo/accessInfo.css"
import imageTof from "../../assets/1739358030269.jpeg"
import logoAuth from "../../assets/10780255_19198219.jpg" // Ajouter le chemin vers ton logo d'autorisation

const AccessInfo = () => {
    return (
        <div className='MainContent'>
            <div className="container">
                <div className="text-section">
                    {/* Logo d'autorisation */}
                    <img src={logoAuth} alt="Logo d'autorisation" className="auth-logo" />

                    <h1 className="title">
                        Accès à la plateforme Geld Pilot
                    </h1>
                    <p className="description">
                        L'accès à cette plateforme et l'autorisation d'inscription sont gérés
                        par la responsable financière, <strong>Madame Rayhane Tarchoun</strong>. Pour
                        s'authentifier et créer un compte afin de suivre les statuts et les
                        tableaux de bord personnalisés sur la gestion financière chez Alight
                        MEA, veuillez la contacter directement.
                    </p>
                </div>

                {/* Card Profil */}
                <div className="profile-card">
                    <img
                        src={imageTof}
                        alt="Rayhane Tarchoun"
                        className="profile-image"
                    />
                    <h2 className="profile-name">
                        Rayhane Tarchoun
                    </h2>
                    <p className="profile-position">Responsable Financière</p>
                    <p className="profile-email">
                        <a href="mailto:rayhan.tarchoun@alight.eu" className='emailLink' style={{"color":"white","textDecoration":"none"}}>📧 rayhan.tarchoun@alight.eu</a>
                    </p>
                </div>

            </div>
            <button className='homebtn'> 🏠 Go Home</button>
        </div>
    )
}

export default AccessInfo;
