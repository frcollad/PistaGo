function ReservationsScreen({ onNavigate }) {
  return (
    <div className="reservas-empty">
      <div className="empty-icon">🎾</div>
      <h2>Aún no tienes reservas guardadas</h2>
      <p>
        En esta primera versión, la reserva se finaliza en la app del club.
        Aquí podrás guardar tus oportunidades favoritas.
      </p>
      <button className="main-btn" onClick={() => onNavigate("Buscar")}>
        Buscar pista ahora
      </button>
    </div>
  );
}

export default ReservationsScreen;
