import styled, { keyframes } from "styled-components";

const LoaderAnimation = keyframes`
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}
`;

const Loading = styled.div`
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

function Loader() {
  return (
    <div>
      <Loading />
    </div>
  );
}

export default Loader;
