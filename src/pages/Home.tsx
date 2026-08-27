import { Link } from "react-router-dom";

export function Home() {
  return (
    <div>
      <h1>Välkommen till vår bokningssida!</h1>
      <p>Här kan du boka rum för dina studier</p>

      <ul>
        <li>
          <Link to="/rum">Tillgängliga grupprum</Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;

