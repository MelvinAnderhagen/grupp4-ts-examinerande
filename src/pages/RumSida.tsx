import { Link } from "react-router-dom";

export function RumSida() {
  return (
    <div>
      <h2>Tillgängliga Grupprum</h2>
      <p>Här visas listan över alla grupprum i biblioteket.</p>
      <ul>
        <li>
          <Link to={`/rumdetaljsida/1`}>Rum</Link>{" "}
        </li>
      </ul>
    </div>
  );
}

export default RumSida;
