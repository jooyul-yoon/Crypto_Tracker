import { useQuery } from "react-query";
import {
  Link,
  Route,
  Switch,
  useLocation,
  useParams,
  useRouteMatch,
} from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTicker } from "../api";
import Chart from "./Chart";
import Price from "./Price";
import { Helmet } from "react-helmet";
import Loader from "./Loader";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";
import { ReactComponent as MoonIcon } from "../icons/moon.svg";
import { ReactComponent as SunIcon } from "../icons/sun.svg";

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
const HomeIcon = styled.div`
  img {
    height: 40px;
  }
`;
const Title = styled.h1`
  color: ${(props) => props.theme.textColor};
  margin: 0 10px;
  font-size: 30px;
  font-weight: bold;
`;
const Icon = styled.div`
  width: 30px;
  height: 30px;

  img {
    width: 30px;
    height: 30px;
  }
`;
const BtnContainer = styled.div`
  position: absolute;
  right: 0;
  margin: 5px;
`;
const ThemeToggle = styled.button<{ isDark: boolean }>`
  background: ${({ theme }) => theme.gradient};
  border: 2px solid ${({ theme }) => theme.toggleBorder};
  border-radius: 30px;
  cursor: pointer;
  display: flex;
  font-size: 0.5rem;
  justify-content: space-between;
  margin: 0 auto;
  overflow: hidden;
  padding: 0.3rem;
  position: relative;
  width: 4rem;
  height: 2rem;
  svg {
    height: auto;
    width: 1.3rem;
    transition: all 0.3s linear;
    // sun icon
    &:first-child {
      transform: ${(props) =>
        props.isDark ? "translateY(100px)" : `translateY(0px)`};
      }
    
    // moon icon
    &:last-child {
      transform: ${(props) =>
        !props.isDark ? "translateY(100px)" : `translateY(0px)`};
      }
      }
    }
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
  box-shadow: rgb(0 0 0 / 15%) 0px 1px 1px;
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
const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 0;
  color: ${(props) => props.theme.bgColor};
`;
const Tab = styled.div<{ isActive: boolean }>`
  background-color: ${(props) =>
    props.isActive ? props.theme.tabBgColor : props.theme.cardColor};
  color: ${(props) =>
    props.isActive ? props.theme.cardColor : props.theme.textColor};
  transition: color 0.3s ease-in;
  transition: background-color 0.3s ease-in;
  border-radius: 10px;
  display: block;
  box-shadow: rgb(0 0 0 / 15%) 0px 1px 1px;
  flex: 1 1 0%;
  font-size: 90%;
  font-weight: bold;
  margin: 0 5px;
  text-align: center;
  text-transform: uppercase;
  a {
    display: block;
    padding: 10px 0;
    width: 100%;
    height: 100%;
  }
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

  const { cId } = useParams<RouteParams>();
  const { state } = useLocation<RouteState>();
  const priceMatch = useRouteMatch("/:cId/price");
  const chartMatch = useRouteMatch("/:cId/chart");
  const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(
    ["info", cId],
    () => fetchCoinInfo(cId),
    { refetchInterval: 5000 }
  );
  const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
    ["tickers", cId],
    () => fetchCoinTicker(cId),
    { refetchInterval: 5000 }
  );
  const loading = infoLoading || tickersLoading;
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleTheme = () => setDarkAtom((prev) => !prev);

  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? null : `${infoData?.name}`}
        </title>
      </Helmet>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header>
            <HomeIcon>
              <Link to={"/crypto_tracker"}>
                <img
                  src="https://cdn.iconscout.com/icon/premium/png-256-thumb/currency-2627304-2174937.png"
                  alt="home-logo"
                />
              </Link>
            </HomeIcon>
            <Title>
              {state?.name ? state.name : loading ? null : `${infoData?.name}`}
            </Title>
            <Icon>
              <img
                src={`https://cryptoicon-api.vercel.app/api/icon/${infoData?.symbol.toLowerCase()}`}
                alt="coin-icon"
              />
            </Icon>

            <BtnContainer>
              <ThemeToggle isDark={isDark} onClick={toggleTheme}>
                <SunIcon />
                <MoonIcon />
              </ThemeToggle>
            </BtnContainer>
          </Header>
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
              <span>{`$${parseFloat(
                tickersData!.quotes.USD.price.toFixed(2)
              ).toLocaleString()}`}</span>
            </OverviewItem>
          </Overview>
          {/* <Description>
            <span>{`${infoData?.description}`}</span>
          </Description> */}
          <Overview>
            <OverviewItem>
              <span>TOTAL SUPPLY:</span>
              <span>{`${tickersData?.total_supply.toLocaleString()}`}</span>
            </OverviewItem>
            <OverviewItem>
              <span>MAX SUPPLY:</span>
              <span>{`${tickersData?.max_supply.toLocaleString()}`}</span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={priceMatch != null}>
              <Link to={`/crypto_tracker/${infoData?.id}/price`}>Price</Link>
            </Tab>
            <Tab isActive={chartMatch != null}>
              <Link
                to={{
                  pathname: `/crypto_tracker/${infoData?.id}/chart`,
                  state: { data: tickersData },
                }}
              >
                Chart
              </Link>
            </Tab>
          </Tabs>

          <Switch>
            <Route path={`/crypto_tracker/:cId/price`}>
              <Price coinId={cId} />
            </Route>
            <Route path={`/crypto_tracker/:cId/chart`}>
              <Chart coinId={cId} />
            </Route>
          </Switch>
        </>
      )}
    </Container>
  );
}

export default Coin;
