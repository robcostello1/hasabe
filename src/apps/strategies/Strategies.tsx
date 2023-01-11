import { FormContainer, TextFieldElement } from "react-hook-form-mui";

import { Button, Card, CardContent, Typography } from "@mui/material";

import Theme from "../../components/Theme";
import { useLocalStorage } from "react-use";
import { Refresh } from "@mui/icons-material";
import { useCallback, useState } from "react";

import "./Strategies.css";

const defaultStrategies = ["Include yourself"];

const Strategies = () => {
  const [strategies, setStrategies] = useLocalStorage(
    "strategies",
    defaultStrategies
  );

  const getRandom = useCallback(
    () => Math.floor(Math.random() * (strategies?.length || 0)),
    [strategies]
  );

  const [currentStrategyIndex, setCurrentStrategyIndex] = useState(getRandom());

  return (
    <Theme>
      <div className="Strategies">
        <Card style={{ padding: "8px 12px 0" }}>
          <CardContent>
            <Typography variant="h2">
              {strategies?.[currentStrategyIndex]}
            </Typography>

            <Refresh
              className={"Strategies__refresh"}
              onClick={() => setCurrentStrategyIndex(getRandom())}
            />
          </CardContent>
        </Card>

        <FormContainer
          defaultValues={{ newStrategy: "" }}
          onSuccess={({ newStrategy }) =>
            setStrategies([...(strategies || []), newStrategy])
          }
        >
          <TextFieldElement
            size="small"
            label="Add a strategy"
            name="newStrategy"
            style={{ marginRight: 12, width: "24vw" }}
          />

          <Button size="medium" type="submit" variant="outlined">
            Go
          </Button>
        </FormContainer>
      </div>
    </Theme>
  );
};

export default Strategies;
