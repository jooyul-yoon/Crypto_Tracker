import { useParams } from "react-router-dom";

interface RouteParams {
  cId: string;
}

function Coin() {
  const { cId } = useParams<RouteParams>();
  return <h1>Coin: {cId}</h1>;
}

export default Coin;
