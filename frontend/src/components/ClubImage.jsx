const LOGOS = {
  "La Pobla Indoor": "/logos/lapoblaindoor.png",
  "Bonpadel": "/logos/bonpadel.png",
  "Interclub Meliana": "/logos/interclubmeliana.png",
};

function ClubImage({ club, size = 46 }) {
  const logo = LOGOS[club];
  const initials = club
    .split(" ")
    .filter((w) => w.length > 2)
    .map((w) => w[0])
    .slice(0, 3)
    .join("")
    .toUpperCase();

  return (
    <div
      className="club-avatar"
      style={{ width: size, height: size, minWidth: size }}
    >
      {logo ? (
        <img
          src={logo}
          alt={club}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export default ClubImage;
