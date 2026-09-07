import { Link } from "react-router";

export const navOrder = 1;
export const navTitle = "Hem";

export function Home() {
  return (
    <div>
      <h1>Välkommen till vår bokningssida!</h1>
      <p>Här kan du boka rum för dina studier</p>

      <ul>
        <li>
          <Link to="/rumsida">Tillgängliga grupprum</Link>
        </li>
      </ul>
    </div>
  );
}

export default Home;
