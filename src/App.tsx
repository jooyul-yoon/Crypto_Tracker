import Circle from "./Components/Circle";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  return (
    <Wrapper>
      <Circle bgColor="teal" borderColor="pink" />
      <Circle bgColor="tomato" text="Not default" />
    </Wrapper>
  );
}

export default App;
