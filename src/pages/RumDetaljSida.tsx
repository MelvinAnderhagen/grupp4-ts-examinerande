import { useParams } from "react-router";
import { useState, useEffect } from "react";
import type { Rum } from "../types/rum";
import type { Bokning } from "../types/bokning";

export function RumDetaljSida() {
  const { id } = useParams<{ id: string }>();
  const [rum, setRum] = useState<Rum | null>(null);
  const [bokningar, setBokningar] = useState<Bokning[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`http://localhost:3000/rum/${id}`).then(
        (res) => res.json() as Promise<Rum>,
      ),
      fetch(`http://localhost:3000/bokningar`).then(
        (res) => res.json() as Promise<Bokning[]>,
      ),
    ])
      .then(([rumData, allaBokningar]) => {
        setRum(rumData);

        const rummetsBokningar = allaBokningar.filter(
          (bokningar) => String(bokningar.roomId) === String(id),
        );
        setBokningar(rummetsBokningar);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Fel vid hämtning av data.", error);
        setLoading(false);
      });
  }, [id]);
  if (loading) {
    return <p>Laddar rummets detaljer...</p>;
  }

  if (!rum) {
    return <p>Rummet hittades inte.</p>;
  }

  return (
    <>
      <div>
        <h2>{rum.name}</h2>
        <p>Kapacitet: {rum.capacity}</p>
        <p>Plats: {rum.plats}</p>
        <p>Utrustning: </p>
        <ul>
          {rum.utrustning.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Bokningar för detta rum:</h3>
        {bokningar.length === 0 ? (
          <p>Inga bokningar hittades för detta rum.</p>
        ) : (
          <ul>
            {bokningar.map((bokning) => (
              <li key={bokning.id}>
                <p>{bokning.bokningsEmail}</p>
                <p>{bokning.date}</p>
                <p>
                  {bokning.startTime} - {bokning.endTime}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default RumDetaljSida;
