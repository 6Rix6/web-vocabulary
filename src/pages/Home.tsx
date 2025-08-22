import { Link } from "react-router-dom";
import PWABadge from "../components/PWABadge";

export default function Home() {
  const title: string = "Hello World!";

  return (
    <div className="App">
      <h1>{title}</h1>
      <Link to="/vocabulary">ボタン</Link>
      <PWABadge />
    </div>
  );
}
