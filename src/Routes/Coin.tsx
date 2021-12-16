import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled, { keyframes } from "styled-components";

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
`;

const Icon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const LoaderAnimation = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}
`;

const Loader = styled.span`
  display: flex;
  width: 80px;
  height: 80px;
  margin: 0 auto;

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
  background-color: rgba(0, 0, 0, 0.6);
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
  const [loading, setLoading] = useState(true);
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
  }, [cId]);

  return (
    <Container>
      <Header>
        <Icon
          src={`https://cryptoicon-api.vercel.app/api/icon/${info?.symbol.toLowerCase()}`}
        />
        <Title>
          {state?.name ? state.name : loading ? <Loader /> : `${info?.name}`}
        </Title>
      </Header>
      {loading ? null : (
        <>
          <Overview>
            <OverviewItem>
              <span>RANK:</span>
              <span>{`${info?.rank}`}</span>
            </OverviewItem>
            <OverviewItem>
              <span>SYMBOL:</span>
              <span>${`${info?.symbol.toUpperCase()}`}</span>
            </OverviewItem>
            <OverviewItem>
              <span>OPEN SOURCE:</span>
              <span>{`${info?.open_source}`}</span>
            </OverviewItem>
          </Overview>
          <Description>
            <span>{`${info?.description}`}</span>
          </Description>
          <Overview>
            <OverviewItem>
              <span>TOTAL SUPPLY:</span>
              <span>{`${price?.total_supply}`}</span>
            </OverviewItem>
            <OverviewItem>
              <span>MAX SUPPLY:</span>
              <span>{`${price?.max_supply}`}</span>
            </OverviewItem>
          </Overview>
        </>
      )}
    </Container>
  );
}

export default Coin;
