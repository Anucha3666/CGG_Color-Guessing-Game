"use client";

import { ButtonRestart, LoseModal, WinModal } from "@/components/common";
import { initSettings } from "@/constants";
import { TGameData, THistory, TSettings } from "@/types";
import { gameUtils } from "@/utils";

import { cookieUtils } from "@/utils/cookie";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HomePage() {
  const time = 1000;

  const [gameDatasets, setGameDatasets] = useState<TGameData[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [settings, setSettings] = useState<TSettings>(initSettings);

  const isLose = gameDatasets?.find(
    ({ answer, correct }) => answer !== null && answer !== correct
  );
  const isWin =
    gameDatasets?.filter(({ answer, correct }) => answer === correct)
      ?.length === gameDatasets?.length;

  const isGameOver = isLose || isWin;
  const dataSet = isLose
    ? gameDatasets.filter(({ answer }) => answer !== null)?.length - 1
    : isWin
    ? gameDatasets?.length - 1
    : gameDatasets.findIndex(({ answer }) => answer === null) ??
      gameDatasets?.length;

  useEffect(() => {
    if (timer > 0 && !isGameOver) {
      const time = setTimeout(() => setTimer(timer - 1), 10);
      return () => clearTimeout(time);
    } else {
      if (timer <= 0 && gameDatasets?.length > 0) {
        setGameDatasets(
          gameDatasets
            ?.slice(0, dataSet)
            ?.concat({ ...gameDatasets[dataSet], answer: 10 })
            ?.concat(gameDatasets?.slice(dataSet + 1))
        );
      }

      cookieUtils.set(
        "HISTORY",
        ((cookieUtils?.get("HISTORY") ?? []) as THistory[])
          ?.filter((item) => (item?.data?.length ?? 0) !== 0)
          ?.concat([
            {
              number_of_grids: settings?.number_of_grids,
              level: settings?.level,
              data: gameDatasets,
            },
          ])
      );
    }
  }, [timer, isGameOver, dataSet, gameDatasets]);

  useEffect(() => {
    const handleClick = () => {
      const req = (cookieUtils?.get("SETTINGS") ?? {
        number_of_grids: 3,
        level: "normal",
      }) as TSettings;
      setSettings(req);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    const req = (cookieUtils?.get("SETTINGS") ?? {
      number_of_grids: 3,
      level: "normal",
    }) as TSettings;
    setSettings(req);
    setTimer(time);
    setGameDatasets(gameUtils?.generate({ settings: req }));
  }, []);

  return (
    <>
      <motion.div
        className='min-h-screen h-screen flex flex-col items-center justify-center overflow-hidden '
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}>
        <div className=' p-4 bg-[#FFFFFF40] backdrop-blur-md rounded-xl shadow-md z-50 flex flex-col justify-center items-center gap-2'>
          <p className='font-bold text-lg'>
            {`${dataSet + 1} / ${gameDatasets?.length}`}
          </p>
          {isGameOver && (
            <p className=' text-lg font-bold'>
              {isLose ? "You Lose" : isWin ? "You Win" : ""}
            </p>
          )}
          <div className='w-full bg-[#FFFFFF40] backdrop-blur-sm flex justify-center items-center rounded-full h-6 overflow-hidden relative'>
            <motion.div
              animate={{
                backgroundPosition: ["0% 0%", "100% 0%"],
              }}
              transition={{
                duration: 1,
              }}
              className='h-2.5 rounded-full flex justify-center items-center'
              style={{
                height: "100%",
                width: `${(timer / time) * 100}%`,
                background:
                  "linear-gradient(to left, #f4e04d, #34d399, #f87171)",
                backgroundSize: "300% 100%",
              }}
            />
            {timer !== 0 && (
              <p className=' text-white font-extrabold absolute z-40'>
                {(timer / 100)?.toFixed(0)} s
              </p>
            )}
          </div>
          <div
            className='w-[20rem] h-[20rem] md:w-[30rem] md:h-[30rem] bg-white rounded-lg grid gap-1 p-1'
            style={{
              gridTemplateColumns: `repeat(${settings?.number_of_grids}, 1fr)`,
            }}>
            {Array(settings?.number_of_grids * settings?.number_of_grids)
              ?.fill(0)
              ?.map((_, i) => (
                <div
                  key={i}
                  className='w-full h-full rounded-md cursor-pointer active:scale-95'
                  style={{
                    background: `${gameDatasets[dataSet]?.color}${
                      (settings?.level === "easy"
                        ? [
                            "AD",
                            "B0",
                            "B2",
                            "B4",
                            "B6",
                            "B8",
                            "BA",
                            "BB",
                            "BD",
                            "FF",
                          ]
                        : settings?.level === "normal"
                        ? [
                            "CD",
                            "D0",
                            "D2",
                            "D4",
                            "D6",
                            "D8",
                            "DA",
                            "DB",
                            "DD",
                            "FF",
                          ]
                        : [
                            "ED",
                            "F0",
                            "F2",
                            "F4",
                            "F6",
                            "F8",
                            "FA",
                            "FB",
                            "FD",
                            "FF",
                          ])[i === gameDatasets[dataSet]?.correct ? dataSet : 9]
                    }`,
                  }}
                  onClick={() => {
                    if (!isGameOver) {
                      setGameDatasets(
                        gameDatasets
                          ?.slice(0, dataSet)
                          ?.concat({
                            ...gameDatasets[dataSet],
                            answer: i,
                          })
                          ?.concat(gameDatasets?.slice(dataSet + 1))
                      );
                      if (i === gameDatasets[dataSet]?.correct) {
                        setTimer(time);
                      }
                    }
                  }}>
                  {/* {i === gameDatasets[dataSet]?.correct ? 0 : 1} */}
                </div>
              ))}
          </div>

          {isGameOver && (
            <ButtonRestart
              onClick={() => {
                setGameDatasets(gameUtils?.generate({ settings }));
                setTimer(time);
              }}
            />
          )}
        </div>
      </motion.div>

      {isWin && <WinModal />}
      {isLose && <LoseModal />}
    </>
  );
}
