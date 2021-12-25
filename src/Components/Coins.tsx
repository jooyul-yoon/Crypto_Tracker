/* eslint-disable jsx-a11y/alt-text */
import { Helmet } from "react-helmet";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { isDarkAtom } from "../atoms";
import Loader from "./Loader";
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
  margin-right: 10px;
  img {
    height: 40px;
  }
`;
const Title = styled.h1`
  color: ${(props) => props.theme.titleColor};
  font-size: 30px;
  font-weight: bold;
  margin: 20px 0;
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
const CoinsList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: space-between;
  margin: 10px 0;
`;
const Coin = styled.li`
  color: ${(props) => props.theme.textColor};
  background-color: ${(props) => props.theme.cardColor};
  margin: 0px 5px 10px 5px;
  border-radius: 15px;
  a {
    display: flex;
    align-items: center;
    transition: color 0.2s ease-in;
    padding: 10px;

    span {
      margin-left: 7px;
      color: ${(props) => props.theme.accentColor};
      font-size: 9px;
    }
  }
  &:hover {
    a {
      color: ${(props) => props.theme.accentColor};
    }
  }
`;
const Icon = styled.img`
  width: 25px;
  height: 25px;
  margin-right: 10px;
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}

function Coins() {
  /* 
  const [coins, setCoins] = useState<CoinInterface[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const response = await fetch("https://api.coinpaprika.com/v1/coins");
      const json = await response.json();
      setCoins(json.slice(0, 100));
      setLoading(false);
    })();
  }, []); 
  */
  const isDark = useRecoilValue(isDarkAtom);
  const setDarkAtom = useSetRecoilState(isDarkAtom);
  const toggleTheme = () => setDarkAtom((prev) => !prev);
  const { isLoading, data } = useQuery<ICoin[]>("allCoins", fetchCoins);

  return (
    <Container>
      <Helmet>
        <title>Crypto Tracker</title>
      </Helmet>
      <Header>
        <HomeIcon>
          <Link to={"/crypto_tracker"}>
            <img src="https://cdn.iconscout.com/icon/premium/png-256-thumb/cryptocurrency-2627304-2174937.png"></img>
          </Link>
        </HomeIcon>
        <Title>Crypto</Title>
        <BtnContainer>
          <ThemeToggle isDark={isDark} onClick={toggleTheme}>
            <SunIcon />
            <MoonIcon />
          </ThemeToggle>
        </BtnContainer>
      </Header>
      {isLoading ? (
        <Loader />
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <Coin key={coin.id}>
              <Link
                to={{
                  pathname: `/crypto_tracker/${coin.id}/price`,
                  state: { name: coin.name },
                }}
              >
                <Icon
                  src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                />
                {coin.name}
                <span>{coin.symbol}</span>
              </Link>
            </Coin>
          ))}
        </CoinsList>
      )}
    </Container>
  );
}

export default Coins;
