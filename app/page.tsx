"use client";
import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Grid,
  Container,
  Paper,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { styled } from "@mui/system";

const IWAO_BLUE = "#336699";
const GAME_TITLE =
  "イワオブルーを探せ！";

// カスタムテーマを作成してプライマリカラーを#336699に設定
const theme = createTheme({
  palette: {
    primary: {
      main: IWAO_BLUE,
    },
  },
});

// カスタムボタンコンポーネントを作成
const ColorButton = ({
  color,
  onClick,
  isCorrect = false,
  showCorrect = false,
}) => (
  <Button
    onClick={() => onClick(color)}
    variant="contained"
    sx={{
      backgroundColor: color,
      width: "50px",
      height: "50px",
      minWidth: "50px",
      margin: "5px",
      border:
        showCorrect && isCorrect ? "3px solid #FF0000" : `1px solid ${IWAO_BLUE}`,
      borderRadius: "8px",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
      "&:hover": {
        backgroundColor: color,
      },
    }}
    aria-label={`色: ${color}`}
  />
);

// 吹き出しコンポーネントをスタイリング
const StyledPaper = styled(Paper)(({ theme }) => ({
  position: "relative",
  borderRadius: ".4em",
  padding: "10px",
  margin: "20px",
  maxWidth: "300px",
  border: `1px solid ${IWAO_BLUE}`,
}));

const Bubble = ({ children }) => (
  <StyledPaper elevation={3}>
    {children}
    <Box
      sx={{
        content: '""',
        position: "absolute",
        top: "50%",
        left: 0,
        transform: "translate(-100%, -50%)",
        width: 0,
        height: 0,
        border: "10px solid transparent",
        borderRightColor: "#ffffff",
      }}
    />
    <Box
      sx={{
        content: '""',
        position: "absolute",
        top: "50%",
        left: 0,
        transform: "translate(-100%, -50%)",
        width: 0,
        height: 0,
        border: "11px solid transparent",
        borderRightColor: IWAO_BLUE,
        zIndex: -1,
        marginLeft: "-2px",
      }}
    />
  </StyledPaper>
);

const generateRandomBlue = (level) => {
  const baseR = 51,
    baseG = 102,
    baseB = 153; // IWAO_BLUE components
  const maxDiff = Math.max(70 - level * 10, 10); // Decrease max difference as level increases

  const r = Math.max(
    0,
    Math.min(255, baseR + (Math.random() * 2 - 1) * maxDiff)
  );
  const g = Math.max(
    0,
    Math.min(255, baseG + (Math.random() * 2 - 1) * maxDiff)
  );
  const b = Math.max(
    0,
    Math.min(255, baseB + (Math.random() * 2 - 1) * maxDiff)
  );

  return `#${Math.round(r)
    .toString(16)
    .padStart(2, "0")}${Math.round(g)
      .toString(16)
      .padStart(2, "0")}${Math.round(b).toString(16).padStart(2, "0")}`;
};

const generateColors = (count, level) => {
  const colors = [IWAO_BLUE];
  while (colors.length < count) {
    const newColor = generateRandomBlue(level);
    if (!colors.includes(newColor)) {
      colors.push(newColor);
    }
  }
  return colors.sort(() => Math.random() - 0.5);
};

const Game = () => {
  const [gameState, setGameState] = useState("start");
  const [currentLevel, setCurrentLevel] = useState(1);
  const [colors, setColors] = useState([]);
  const [showCorrect, setShowCorrect] = useState(false);

  useEffect(() => {
    if (gameState === "playing") {
      setColors(generateColors(currentLevel + 1, currentLevel));
      setShowCorrect(false);
    }
  }, [gameState, currentLevel]);

  const handleColorClick = (color) => {
    if (color === IWAO_BLUE) {
      if (currentLevel >= 6) {
        setGameState("won");
      } else {
        setCurrentLevel((prevLevel) => prevLevel + 1);
      }
    } else {
      setShowCorrect(true);
      setGameState("lost");
    }
  };

  const resetGame = () => {
    setGameState("start");
    setCurrentLevel(1);
    setColors([]);
    setShowCorrect(false);
  };

  const renderStartScreen = () => (
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom>
        {GAME_TITLE}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Box sx={{ marginRight: "20px" }}>
          <img
            src="/iwao1.jpg"
            alt="キャラクター"
            style={{ borderRadius: "50%" }}
            height="200px"
            width="200px"
          />
        </Box>
        <Bubble>
          <Typography variant="body1">
            青って200色あんねん。下はイワオブルー（#336699）だよ。みわけられるよね。
          </Typography>
        </Bubble>
      </Box>
      <Box
        sx={{
          width: "100px",
          height: "100px",
          backgroundColor: IWAO_BLUE,
          margin: "20px auto",
        }}
      />
      <Button variant="contained" onClick={() => setGameState("playing")}>
        ゲームスタート
      </Button>
    </Box>
  );

  const renderPlayingScreen = () => (
    <Box textAlign="center">
      <Typography variant="h5" gutterBottom>
        レベル {currentLevel}
      </Typography>
      <Typography variant="body1" gutterBottom>
        イワオブルーはどれ？
      </Typography>
      <Grid container justifyContent="center">
        {colors.map((color, index) => (
          <ColorButton
            key={index}
            color={color}
            onClick={handleColorClick}
            isCorrect={color === IWAO_BLUE}
            showCorrect={showCorrect}
          />
        ))}
      </Grid>
    </Box>
  );

  const renderWonScreen = () => (
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom>
        おめでとうございます！
      </Typography>
      <Typography variant="body1" gutterBottom>
        あなたはイワオブルーマスターです！
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Box sx={{ marginRight: "20px" }}>
          <img
            src="/iwao-heart.jpg"
            alt="キャラクター"
            style={{ borderRadius: "50%" }}
            height="200px"
            width="200px"
          />
        </Box>
        <Bubble>
          <Typography variant="body1">
            なかなかですね。君にはハートを送ります。code for yokohamaの定例会においでよ。
          </Typography>
        </Bubble>
      </Box>
      <Button variant="contained" onClick={resetGame}>
        もう一度プレイ
      </Button>
    </Box>
  );

  const renderLostScreen = () => (
    <Box textAlign="center">
      <Typography variant="h4" gutterBottom>
        残念！
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Box sx={{ marginRight: "20px" }}>
          <img
            src="/iwao-kayui.png"
            alt="キャラクター"
            style={{ borderRadius: "50%" }}
            height="200px"
            width="200px"
          />
        </Box>
        <Bubble>
          <Typography variant="body1">
            惜しいけどちがうなー。正解のイワオブルー（#336699）は赤枠で囲まれた色だよ。もう一度やる？
          </Typography>
        </Bubble>
      </Box>
      <Grid container justifyContent="center">
        {colors.map((color, index) => (
          <ColorButton
            key={index}
            color={color}
            onClick={() => { }}
            isCorrect={color === IWAO_BLUE}
            showCorrect={true}
          />
        ))}
      </Grid>
      <Button variant="contained" onClick={resetGame} sx={{ marginTop: "20px" }}>
        もう一度プレイ
      </Button>
    </Box>
  );

  const renderGame = () => {
    switch (gameState) {
      case "start":
        return renderStartScreen();
      case "playing":
        return renderPlayingScreen();
      case "won":
        return renderWonScreen();
      case "lost":
        return renderLostScreen();
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ padding: "20px" }}>
        {renderGame()}
      </Container>
    </ThemeProvider>
  );
};

export default Game;