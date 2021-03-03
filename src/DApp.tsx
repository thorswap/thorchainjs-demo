import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Col, Input, Row, Typography, Button, notification } from "antd";

import useInterval from "./hooks/useInterval";
import { sdk } from "./sdk";

import "./App.css";
import { Pool, Wallet, Swap, SupportedChain } from "multichain-sdk";

const DApp = () => {
  const [phrase, setPhrase] = useState("");
  const [inputAsset, setInputAsset] = useState("BNB.BNB");
  const [outputAsset, setOutputAsset] = useState("BTC.BTC");
  const [amount, setAmount] = useState(0);

  const [swapEntity, setSwapEntity] = useState<Swap>();

  const [pools, setPools] = useState<Pool[]>([]);
  const [wallet, setWallet] = useState<Wallet | null>();

  const isValidPhrase = useMemo(() => sdk.validatePhrase(phrase), [phrase]);

  // load wallet balance
  const loadWallet = useCallback(async () => {
    try {
      const walletBalance = await sdk.loadWallet();

      if (walletBalance) {
        setWallet(walletBalance);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // quote swap
  const quoteSwap = () => {
    try {
      const quote = sdk.quote(inputAsset, outputAsset, amount);
      setSwapEntity(quote);
    } catch (error) {
      console.log(error);
    }
  };

  const refreshSDK = async () => {
    await sdk.refresh();
    setPools(sdk.pools);
    quoteSwap();
  };

  useEffect(() => {
    const reset = async () => {
      await loadWallet();
      await refreshSDK();
    };
    // set phrase
    if (isValidPhrase) {
      sdk.setPhrase(phrase);
      reset();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phrase]);

  // refresh quote swap per min
  useInterval(() => {
    refreshSDK();

    notification.info({
      message: "Data Refreshed.",
      description:
        "Data is refreshed and up-to-date now (Refresh interval - per minute).",
    });
  }, 60 * 1000);

  useEffect(() => {
    quoteSwap();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputAsset, outputAsset, amount]);

  const handleSwap = async () => {
    if (swapEntity) {
      try {
        const txExplorer = await sdk.swap(swapEntity);

        notification.info({
          message: "Swap Success.",
          description: "Swap Transaction has been sent successfully.",
          btn: (
            <a href={txExplorer} target="_blank" rel="noopener noreferrer">
              <Button>View Tx</Button>
            </a>
          ),
        });
      } catch (error) {
        console.log(error);

        notification.error({
          message: "Swap error",
          description: error,
        });
      }
    }
  };

  // get available pools
  const poolsList = pools.reduce((res, pool) => `${res}, ${pool.asset}`, "");

  const renderWallet = () => {
    if (!wallet) return null;

    return Object.keys(wallet).map((chain) => {
      const { address, balance } = wallet[chain as SupportedChain];

      return (
        <div style={{ paddingBottom: "2px" }}>
          <Typography.Text>
            {chain}: {address}
          </Typography.Text>
          <div>
            {balance.map((assetAmount) => (
              <div>
                <Typography.Text type="secondary">
                  {assetAmount.asset.toString()}:{" "}
                  {assetAmount.amount.toFixed(3)}
                </Typography.Text>
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="DApp">
      <Row style={{ display: "flex", flexDirection: "column" }}>
        <Typography.Text strong>Instructions:</Typography.Text>
        <Typography.Text>1. Enter a valid phrase</Typography.Text>
        <Typography.Text>
          2. Enter input, output asset and amount
        </Typography.Text>
        <Typography.Text>3. Click Swap</Typography.Text>
      </Row>
      <br />
      <Row gutter={[16, 16]}>
        <Col>
          <Typography.Text strong>Phrase </Typography.Text>
          <Input
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="phrase"
            style={{ width: "500px " }}
          />
        </Col>
      </Row>
      <br />
      {isValidPhrase && (
        <>
          <Row>
            <Typography.Text strong>Available Pools: </Typography.Text>
            {poolsList}
          </Row>
          <Row style={{ display: "flex", flexDirection: "column" }}>
            <Typography.Text strong>Wallet Balance: </Typography.Text>
            {renderWallet()}
          </Row>
          <br />
          <Row gutter={[16, 16]}>
            <Col>
              <Typography.Text strong>Input Asset </Typography.Text>
              <Input
                value={inputAsset}
                onChange={(e) => setInputAsset(e.target.value)}
                placeholder="phrase"
              />
            </Col>
            <Col>
              <Typography.Text strong>Output Asset </Typography.Text>
              <Input
                value={outputAsset}
                onChange={(e) => setOutputAsset(e.target.value)}
                placeholder="phrase"
              />
            </Col>
            <Col>
              <Typography.Text strong>Amount </Typography.Text>
              <Input
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="phrase"
              />
            </Col>
          </Row>
          <br />
          <Row style={{ display: "flex", flexDirection: "column" }}>
            <Typography.Text>
              Output Amount: {swapEntity?.outputAmount.toFixed(8) ?? "N/A"}
            </Typography.Text>
            <Typography.Text>
              Slip: {swapEntity?.slip.toFixed(2) ?? "N/A"}
            </Typography.Text>
          </Row>
          <br />
          <Row>
            <Button type="primary" onClick={handleSwap}>
              Swap
            </Button>
          </Row>
        </>
      )}
    </div>
  );
};

export default DApp;
