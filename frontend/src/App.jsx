import { useState } from "react";
import "./App.css";

import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import RadarScreen from "./screens/RadarScreen";
import ReservationsScreen from "./screens/ReservationsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import DetailScreen from "./screens/DetailScreen";
import BottomNav from "./components/BottomNav";

function App() {
  const [activeScreen, setActiveScreen] = useState("Inicio");
  const [previousScreen, setPreviousScreen] = useState("Buscar");
  const [selectedMatch, setSelectedMatch] = useState(null);

  function goToDetail(match, originScreen = "Buscar") {
    setSelectedMatch(match);
    setPreviousScreen(originScreen);
    setActiveScreen("Detalle");
  }

  function goBackFromDetail() {
    setActiveScreen(previousScreen);
  }

  const showBottomNav = activeScreen !== "Detalle";

  return (
    <main className="prototype-page single-mode">
      <section className="phone-frame">
        <div className="screen">
          {activeScreen === "Inicio" && (
            <HomeScreen onNavigate={setActiveScreen} />
          )}

          {activeScreen === "Buscar" && (
            <SearchScreen onShowDetail={(match) => goToDetail(match, "Buscar")} />
          )}

          {activeScreen === "Radar" && (
            <RadarScreen onShowDetail={(match) => goToDetail(match, "Radar")} />
          )}

          {activeScreen === "Reservas" && (
            <ReservationsScreen onNavigate={setActiveScreen} />
          )}

          {activeScreen === "Perfil" && <ProfileScreen />}

          {activeScreen === "Detalle" && (
            <DetailScreen
              selectedMatch={selectedMatch}
              onBack={goBackFromDetail}
              onGoToProfile={() => setActiveScreen("Perfil")}
            />
          )}

          {showBottomNav && (
            <BottomNav active={activeScreen} onChange={setActiveScreen} />
          )}
        </div>
      </section>
    </main>
  );
}

export default App;