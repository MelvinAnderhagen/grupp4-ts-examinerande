import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Rum } from "../types/rum";
import type { Bokning } from "../types/bokning";

export function RumDetaljSida() {
  const { id } = useParams<{ id: string }>();
  const [rum, setRum] = useState<Rum | null>(null);
  const [bokningar, setBokningar] = useState<Bokning[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3000/rum/${id}`).then((response) =>
        response.json(),
      ),
      fetch(`http://localhost:3000/bokningar?rumId=${id}`).then((response) =>
        response.json(),
      ),
    ])
      .then(([rumData, bokningarData]) => {
        setRum(rumData);
        setBokningar(bokningarData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fel vid hämtning av rumdetaljer:", error);
        setLoading(false);
      });
  }, [id]);
  if (loading) {
    return <div>Laddar rummets detaljer...</div>;
  }

  if (!rum) {
    return <div>Rummet hittades inte.</div>;
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
