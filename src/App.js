import React, { useState, useEffect } from 'react';
import './App.css';

const toRadians = (degrees) => {
  var pi = Math.PI;
  return degrees * (pi/180);
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  var R = 6371; // Radius de la terre
  var dLat = toRadians(lat2-lat1);
  var dLon = toRadians(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance en km
  return d;
}

const Card = ({ card, userLocation }) => {
  const distance = calculateDistance(userLocation.latitude, userLocation.longitude, card.latitude, card.longitude);
  const [showDescription, setShowDescription] = useState(false); // Ajout d'un état pour l'affichage de la description

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${card.latitude},${card.longitude}`;

  return (
    <div className="card" onClick={() => setShowDescription(!showDescription)}> {/* Ajout d'un gestionnaire d'événements onClick */}
      <img src={card.imageUrl} alt={card.title} /> 
      <h2>{card.title}</h2>
      <p>{card.localisation}</p>
      <p>Distance: {distance.toFixed(2)} km</p>
      {showDescription && 
        <div>
          <hr></hr>
          <p>{card.description}</p>
          <p><a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">Voir sur Google Maps</a></p>
        </div>
      } {/* Ajout du lien Google Maps qui ne s'affiche que si showDescription est vrai */}
    </div>
  );
}

const App = () => {
  const [userLocation, setUserLocation] = useState(null);
  const cards = [
    { title: 'Siège de la Fondation Charles de Gaulle', description: 'La fondation Charles-de-Gaulle (qui a pris la suite de l’institut Charles-de-Gaulle) s’emploie depuis 1971 à faire connaître et à perpétuer l’action du général de Gaulle (1890-1970), chef de la France libre à l’époque de la Seconde Guerre mondiale, et président de la République française de 1959 à 1969.', localisation: '75007 Paris', latitude: 48.8602, longitude: 2.3235, imageUrl: 'https://www.charles-de-gaulle.org/wp-content/uploads/2017/06/Immeuble-de-la-Fondation-au-5-rue-de-Solferino-1.jpg' },
    { title: 'Croix de Lorraine', description: 'La croix de Lorraine, aussi appelée croix d’Anjou, croix patriarcale et croix archiépiscopale, est un symbole de croix à deux traverses.', localisation: 'Colombey Les-Deux-Eglises', latitude: 48.2242, longitude: 4.8791, imageUrl: 'https://www.charles-de-gaulle.org/wp-content/uploads/2017/03/Colombey1972.jpg' },
    { title: 'La boisserie', description: `Le domaine de la Boisserie, ancienne résidence personnelle du général de Gaulle à Colombey-les-Deux-Églises en Haute-Marne, est depuis 19801 un musée ouvert à la visite dont le propriétaire est son fils, l'amiral Philippe de Gaulle.`, localisation: 'Colombey Les-Deux-Eglises', latitude: 48.2200, longitude: 4.8829, imageUrl: 'https://www.charles-de-gaulle.org/wp-content/uploads/2017/04/la-boisserie.jpg' },
    { title: 'Mémorial Charles de Gaulle', description: `Le mémorial Charles-de-Gaulle est un monument situé à Colombey-les-Deux-Églises dans la Haute-Marne. Retraçant, au travers de la personne de Charles de Gaulle (1890-1970), les grands événements historiques du xxe siècle.`, localisation: 'Colombey Les-Deux-Eglises', latitude: 48.2234, longitude: 4.8796, imageUrl: 'https://www.charles-de-gaulle.org/wp-content/uploads/2017/03/memorial.jpg' },
    { title: 'Maison natale de Charles de Gaulle', description: `La maison natale de Charles de Gaulle est un musée français situé à Lille, dans le Nord, en France. Auparavant, le musée était la maison des grands-parents maternels de Charles de Gaulle, où ce dernier naquit en 1890.`, localisation: 'Lille', latitude: 50.6461, longitude: 3.0585, imageUrl: 'https://www.charles-de-gaulle.org/wp-content/uploads/2021/06/2_ca-MNCDG_01_12_2020-26-bis-scaled.jpg' },
  ];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => console.log(error),
    );
  }, []);

  if (!userLocation) {
    return <div>Loading...</div>;
  }

   // Calcule la distance pour chaque carte
   const cardsWithDistance = cards.map(card => {
    const distance = calculateDistance(userLocation.latitude, userLocation.longitude, card.latitude, card.longitude);
    return { ...card, distance };
  });

  // Range les cards par distance
  const sortedCards = cardsWithDistance.sort((a, b) => a.distance - b.distance);


  return (
    <div className="App">
      {sortedCards.map((card, index) => (
        <Card key={index} card={card} userLocation={userLocation} />
      ))}
    </div>
  );
}

export default App;
