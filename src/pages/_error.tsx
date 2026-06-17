import { NextPageContext } from "next";

interface Props {
  statusCode?: number;
}

function ErrorPage({ statusCode }: Props) {
  return <h1>{statusCode ? `Error ${statusCode}` : "An error occurred"}</h1>;
}

ErrorPage.noLayout = true;

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;

  return {
    statusCode,
  };
};

export default ErrorPage;
