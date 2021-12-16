import { useQuery } from "react-query";
import {
  Link,
  Route,
  Switch,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { fetchCoinInfo, fetchCoinTicker } from "../api";
import Chart from "./Chart";
import Price from "./Price";
import { Helmet } from "react-helmet";

const Container = styled.div`
  padding: 0px 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  color: ${(props) => props.theme.accentColor};
  font-size: 30px;
  margin: 20px 0;
`;

const Icon = styled.div`
  width: 30px;
  height: 30px;
  margin-right: 10px;

  img {
    width: 30px;
    height: 30px;
  }
`;

const LoaderAnimation = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}
`;

const Loader = styled.div`
  display: flex;
  width: 100%;
  height: 50vh;
  margin: 0 auto;
  justify-content: center;
  align-items: center;

  &:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: ${LoaderAnimation} 1.2s linear infinite;
  }
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.cardColor};
  margin: 10px 0;
  border-radius: 15px;
  padding: 20px 20px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;

  span:first-child {
    font-size: 9px;
    padding-bottom: 5px;
    text-transform: uppercase;
  }
  span:last-child {
    font-size: 15px;
  }
`;

const Description = styled.div`
  color: ${(props) => props.theme.textColor};
  font-size: 15px;
  padding: 0 20px;

  span {
    line-height: 1.5em;
  }
`;

const Tabs = styled.div`
  box-shadow: rgb(0 0 0 / 15%) 0px 1px 1px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 20px 0;
  color: ${(props) => props.theme.bgColor};
`;

const Tab = styled.div<{ isActive: boolean }>`
  background-color: ${(props) =>
    props.isActive ? props.theme.accentColor : props.theme.cardColor};
  color: ${(props) =>
    props.isActive ? props.theme.bgColor : props.theme.textColor};
  transition: color 0.3s ease-in;
  transition: background-color 0.3s ease-in;
  border-radius: 10px;
  display: block;
  flex: 1 1 0%;
  font-size: 90%;
  font-weight: bold;
  padding: 5px;
  margin: 0 5px;
  text-align: center;
  text-transform: uppercase;
`;

interface RouteParams {
  cId: string;
}

interface RouteState {
  name: string;
}

interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  contract: string;
  platform: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

function Coin() {
  const { cId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch("/:cId/price");
  const chartMatch = useRouteMatch("/:cId/chart");
  /* const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<InfoData>();
  const [price, setPrice] = useState<PriceData>();
  useEffect(() => {
    (async () => {
      const infoData = await (
        await fetch(`https://api.coinpaprika.com/v1/coins/${cId}`)
      ).json();
      const priceData = await (
        await fetch(`https://api.coinpaprika.com/v1/tickers/${cId}`)
      ).json();
      setInfo(infoData);
      setPrice(priceData);
      setLoading(false);
    })();
  }, [cId]); */
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", cId],
    () => fetchCoinInfo(cId)
    // { refetchInterval: 5000 }
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", cId],
    () => fetchCoinTicker(cId)
    // { refetchInterval: 5000 }
  );
  const loading = infoLoading || tickersLoading;

  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? null : `${infoData?.name}`}
        </title>
      </Helmet>
      <Header>
        <Icon>
          <Link to={"/"}>
            <img
              src={`https://cryptoicon-api.vercel.app/api/icon/${infoData?.symbol.toLowerCase()}`}
              alt="icon"
            />
          </Link>
        </Icon>
        <Title>
          {state?.name ? state.name : loading ? null : `${infoData?.name}`}
        </Title>
      </Header>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>rank:</span>
              <span>{`${infoData?.rank}`}</span>
            </OverviewItem>
            <OverviewItem>
              <span>symbol:</span>
              <span>${`${infoData?.symbol.toUpperCase()}`}</span>
            </OverviewItem>
            <OverviewItem>
              <span>price:</span>
              <span>{`$${tickersData?.quotes.USD.price.toLocaleString()}`}</span>
            </OverviewItem>
          </Overview>
          <Description>
            <span>{`${infoData?.description}`}</span>
          </Description>
          <Overview>
            <OverviewItem>
              <span>TOTAL SUPPLY:</span>
              <span>{`${tickersData?.total_supply}`}</span>
            </OverviewItem>
            <OverviewItem>
              <span>MAX SUPPLY:</span>
              <span>{`${tickersData?.max_supply}`}</span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={priceMatch != null}>
              <Link to={`/${infoData?.id}/price`}>Price</Link>
            </Tab>
            <Tab isActive={chartMatch != null}>
              <Link to={`/${infoData?.id}/chart`}>Chart</Link>
            </Tab>
          </Tabs>

          <Switch>
            <Route path={`/:cId/price`}>
              <Price />
            </Route>
            <Route path={`/:cId/chart`}>
              <Chart coinId={cId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}

export default Coin;
